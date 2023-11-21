import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import bcrypt from "bcrypt";
import { cors } from "hono/cors";
import { setCookie } from "hono/cookie";

import { db } from "./db";
import {
  users_table,
  organizations_table,
  organizations_users_table,
  transactions_table,
} from "./schema";
import { and, eq, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

const app = new Hono();

app.use("*", cors({ origin: "http://localhost:5173", credentials: true }));

const secret = "yegkfuhafna6483hjf";

app.use(
  "/auth/*",
  jwt({
    secret,
    cookie: "auth",
  })
);

app.get("/auth/protected", async (c) => {
  return c.text("You are authorized");
});

// Start the server using the serve function
serve({ fetch: app.fetch, port: 3000 });
console.log("Listening on port 3000");

app.get("/", async (c) => {
  return c.text("Hello Hono!");
});

// Sign-up route
app.post("/signup", async (c) => {
  // Extract user information from the request
  const { email, password, fullname } = await c.req.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user object
  const newUser = {
    id: nanoid(15),
    email: email,
    password: hashedPassword,
    fullname: fullname,
  };

  // Insert the new user into the database
  await db.insert(users_table).values(newUser);

  return c.json({ message: "User created successfully" });
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  try {
    // Retrieve the user by email using the eq function for the condition
    const users = await db
      .select()
      .from(users_table)
      .where(eq(users_table.email, email))
      .execute();
    const user = users[0]; // Get the first user from the result set

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await sign({ userId: user.id }, secret); // Create JWT token
      setCookie(c, "auth", token, { httpOnly: true });
      return c.json({ message: "Login successful", token: token });
    }
  } catch (error) {
    console.error("Error during user login:", error);
    return c.json({ error: "Error during login" }, 500);
  }
});

app.get("/auth/organizations", async (c) => {
  try {
    const { userId } = c.get("jwtPayload");

    const results = (
      await db
        .select({
          id: organizations_table.id,
          name: organizations_table.name,
          plan: organizations_table.plan,
          role: organizations_users_table.role,
          num_members: sql`COUNT(${organizations_users_table.user_id})`,
        })
        .from(organizations_table)
        .innerJoin(
          organizations_users_table,
          eq(organizations_table.id, organizations_users_table.organization_id)
        )
        .where(eq(organizations_users_table.user_id, userId))
        .all()
    ).filter((x) => x.num_members);
    console.log(results);
    return c.json(results);
  } catch (error) {
    console.error("Error fetching organization:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/auth/organizations/:id", async (c) => {
  try {
    const { userId } = c.get("jwtPayload");
    const { id } = c.req.param();

    const org = await db
      .select({
        id: organizations_table.id,
        name: organizations_table.name,
        plan: organizations_table.plan,
        role: organizations_users_table.role,
        num_members: sql`COUNT(${organizations_users_table.user_id})`,
      })
      .from(organizations_table)
      .innerJoin(
        organizations_users_table,
        eq(organizations_table.id, organizations_users_table.organization_id)
      )
      .where(
        and(
          eq(organizations_users_table.user_id, userId),
          eq(organizations_table.id, id)
        )
      )
      .get();

    if (!org) return c.json({ error: "ur an imposter" }, 500);

    const members = await db
      .select({
        id: users_table.id,
        name: users_table.fullname,
        email: users_table.email,
        role: organizations_users_table.role,
      })
      .from(organizations_users_table)
      .innerJoin(
        users_table,
        eq(organizations_users_table.user_id, users_table.id)
      )
      .where(eq(organizations_users_table.organization_id, org.id))
      .all();

    return c.json({
      organization: org,
      members,
      isAdmin: members.findIndex((x) => x.id === userId) !== -1,
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/auth/organizations/create", async (c) => {
  try {
    const organization_id = nanoid(15);
    const { userId } = c.get("jwtPayload");
    const { name } = await c.req.json();

    await db.batch([
      db
        .insert(organizations_table)
        .values({ id: organization_id, plan: "basic", name }),
      db
        .insert(organizations_users_table)
        .values({ user_id: userId, organization_id, role: "admin" }),
    ]);

    return c.text("organization succesfully created!!");
  } catch (error) {
    console.error("Error creatingt organization:", error);
  }
});

app.post("/auth/organizations/:id/upgrade", async (c) => {
  try {
    const { id } = c.req.param();
    const { userId } = c.get("jwtPayload");
    const { plan } = await c.req.json();

    const admin = await db
      .select()
      .from(organizations_users_table)
      .where(
        and(
          eq(organizations_users_table.organization_id, id),
          eq(organizations_users_table.user_id, userId)
        )
      )
      .get();

    //checking if user is admin
    if (!admin)
      return c.json({ error: "you arent part of this organization" }, 403);
    if (admin.role !== "admin")
      return c.json({ error: "youre not admin" }, 403);

    // Check for an existing transaction for this organization
    const existingTransactions = await db
      .select()
      .from(transactions_table)
      .where(eq(transactions_table.organization_id, id))
      .all();

    // Iterate over the transactions and delete each one
    for (const transaction of existingTransactions) {
      await db
        .delete(transactions_table)
        .where(eq(transactions_table.id, transaction.id))
        .execute();
    }

    const org = await db
      .select()
      .from(organizations_table)
      .where(eq(organizations_table.id, id))
      .get();

    if (!org) return;

    if (
      (plan === "standard" && org.plan === "basic") ||
      (plan === "plus" && (org.plan === "standard" || org.plan === "basic"))
    ) {
      // We can upgrade now
      await db.insert(transactions_table).values({
        id: nanoid(15),
        plan,
        time_stamp: new Date(),
        user_id: userId,
        amount: plan === "plus" ? 3999 : 4999,
        organization_id: id,
      });
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("upgrade failed:", error);
  }
});

app.get("/auth/cart", async (c) => {
  try {
    const { userId } = c.get("jwtPayload");

    // Retrieve transactions for the specific user
    const transactions = await db
      .select({
        plan: transactions_table.plan,
        amount: transactions_table.amount,
        user_id: transactions_table.user_id,
        name: organizations_table.name,
      })
      .from(transactions_table)
      .innerJoin(
        organizations_table,
        eq(transactions_table.organization_id, organizations_table.id)
      )
      .where(eq(transactions_table.user_id, userId))
      .all();

    return c.json(transactions);
  } catch (error) {
    console.error("Error retrieving cart data:", error);
    return c.json({ error: "An error occurred while retrieving cart data." });
  }
});

app.get("/auth/user", async (c) => {
  const { userId } = c.get("jwtPayload");

  const res = await db
    .select()
    .from(users_table)
    .where(eq(users_table.id, userId))
    .get();

  if (!res) return c.json({ error: "user not found" });

  return c.json(res);
});

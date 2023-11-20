const base = "http://localhost:3000";

console.log({ base });

export const API = {
  login: () => `${base}/login`,
  signup: () => `${base}/signup`,
  cart: () => `${base}/auth/cart`,
  organizations: (id = "") => `${base}/auth/organizations${id ? "/" + id : ""}`,
  upgrade: (id: string) => `${base}/auth/organizations/${id}/upgrade`,
  user: () => `${base}/auth/user`,
  create: () => `${base}/auth/organizations/create`,
};

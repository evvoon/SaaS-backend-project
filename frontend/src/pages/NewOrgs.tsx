import { FormEvent, useState } from "react";
import { API } from "../api";
import { Navigate } from "react-router-dom";

export function NewOrgs() {
  const [name, setName] = useState("");

  const [redirect, setRedirect] = useState(false);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const response = await fetch(API.create(), {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      alert("error creating organization");
    }
  }

  if (redirect) {
    return <Navigate to={"/organizations"} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create New Organization</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter organization name"
          required
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn btn-primary max-w-xs">
          Create Organization
        </button>
      </form>
    </div>
  );
}

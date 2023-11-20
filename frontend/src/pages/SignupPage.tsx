import { FormEvent, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  async function register(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const response = await fetch(API.signup(), {
      method: "POST",
      body: JSON.stringify({ fullname, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("Registration succesful");
      navigate("/login");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <form className="login flex flex-col gap-4 p-4" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="fullname"
        value={fullname}
        onChange={(ev) => setFullname(ev.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
}

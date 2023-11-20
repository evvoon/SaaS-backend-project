import { FormEvent, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { API } from "../api";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [redirect, setRedirect] = useState(false);

  const { setUserInfo } = useContext(UserContext);

  async function login(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const response = await fetch(API.login(), {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/organizations"} />;
  }
  return (
    <form className="login flex flex-col gap-4 p-4" onSubmit={login}>
      <h1>Login</h1>
      <div>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <button className="btn btn-primary">Login</button>
    </form>
  );
}

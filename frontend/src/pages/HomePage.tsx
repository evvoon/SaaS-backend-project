import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <h1>Welcome!</h1>
      <br />
      <Link to={`/signup`} className="btn btn-neutral flex flex-col gap-4 p-4">
        {" "}
        SignUp{" "}
      </Link>
      <br />
      <Link to={`/login`} className="btn btn-neutral flex flex-col gap-4 p-4">
        {" "}
        Login{" "}
      </Link>
    </>
  );
}

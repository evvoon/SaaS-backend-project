import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "./api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Header() {
  const [data, setData] = useState<{
    id: string;
    email: string;
    password: string;
    fullname: string;
  }>();

  useEffect(() => {
    Promise.all([fetch(API.user(), { credentials: "include" }), sleep(440)])
      .then(([r]) => r.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  return (
    <header className="text-white p-4 flex justify-between items-center">
      <div>
        <p>hello, {data?.fullname}</p>
      </div>

      <Link to="/auth/cart">
        <FontAwesomeIcon icon={faShoppingCart} style={{ color: "#ffffff" }} />
      </Link>
    </header>
  );
}

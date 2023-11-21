import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function UpgradePage() {
  const [data, setData] = useState<{
    organization: {
      id: string;
      name: string;
      plan: "basic" | "standard" | "plus";
      role: "admin" | "member";
      num_members: number;
    };
    members: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "member";
    }[];
    isAdmin: boolean;
  }>();
  const [isLoading, setIsLoading] = useState(false);

  // Upgrade stuff
  const [upgradeResult, setUpgradeResult] = useState<boolean>(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    console.log("hello1");

    Promise.all([
      fetch(API.organizations(id), { credentials: "include" }),
      sleep(440),
    ])
      .then(([r]) => r.json())
      .then((data) => {
        setIsLoading(false);
        setData(data);
        console.log("hello2");
      });
  }, [id]);

  useEffect(() => console.log(data), [data]);

  function addToCart(plan: "standard" | "plus") {
    if (!id) return;

    setUpgradeLoading(true);

    Promise.all([
      fetch(API.upgrade(id), {
        credentials: "include",
        method: "post",
        body: JSON.stringify({ plan }),
        headers: { "Content-Type": "application/json" },
      }),
      sleep(440),
    ])
      .then(([r]) => r.json())
      .then((data) => {
        setUpgradeLoading(false);
        setUpgradeResult(data);
        console.log("hello2");
      });
  }

  return (
    <>
      {isLoading && <span className="loading loading-ring loading-lg"></span>}
      {!isLoading && data && (
        <div className="overflow-x-auto p-4">
          {upgradeResult && (
            <div role="alert" className="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Added to cart</span>
            </div>
          )}
          <br />
          <h1>{data.organization.name}</h1>

          <p>Available Plans</p>
          <div className="flex flex-wrap gap-4">
            <div
              className={`card w-96 bg-base-100 shadow-xl m-2 ${
                data.organization.plan === "standard" ? "opacity-50" : ""
              }`}
            >
              <div className="card-body">
                <h2 className="card-title">Standard</h2>
                <p>INR 4999 Per Year, Per User, up to 5 users</p>
                <div className="card-actions justify-end">
                  <Link
                    to={`/cart`}
                    className={`btn btn-neutral ${
                      data.organization.plan === "standard"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={
                      data.organization.plan === "standard"
                        ? (e) => e.preventDefault()
                        : undefined
                    }
                  >
                    Choose Standard
                  </Link>
                </div>
              </div>
            </div>
            <div className="card w-96 bg-base-100 shadow-xl m-2">
              <div className="card-body">
                <h2 className="card-title">Premium</h2>
                <p>INR 3999 Per Year, Per User above 10 users</p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => addToCart("plus")}
                    className="btn btn-neutral"
                  >
                    Choose Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

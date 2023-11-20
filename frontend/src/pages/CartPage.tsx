import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function CartPage() {
  const [data, setData] = useState<
    {
      amount: number;
      plan: "plus" | "standard";
    }[]
  >();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetch(API.cart(), { credentials: "include" }), sleep(440)])
      .then(([r]) => r.json())
      .then((fetchedData) => {
        console.log(fetchedData);
        setData(fetchedData);
        setIsLoading(false);
      });
  }, []);
  console.log(data);

  if (isLoading)
    return <span className="loading loading-ring loading-lg"></span>;
  if (!data) return <p>No data available.</p>;

  return (
    <div>
      <h1>Cart</h1>
      <br />
      {data && data.length > 0 ? (
        <>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ plan, amount, name }, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{plan}</td>
                  <td className="px-4 py-2">{amount}</td>
                  <td className="px-4 py-2">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <button>purchase</button>
        </>
      ) : (
        "Nothing in cart"
      )}
    </div>
  );
}

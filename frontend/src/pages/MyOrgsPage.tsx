// for all organization
import { useEffect, useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function MyOrgsPage() {
  const [organizations, setOrganizations] = useState<
    {
      id: string;
      name: string;
      plan: "basic" | "standard" | "plus";
      role: "admin" | "member";
      num_members: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      fetch(API.organizations(), { credentials: "include" }),
      sleep(440),
    ])
      .then(([r]) => r.json())
      .then((data) => {
        setIsLoading(false);
        setOrganizations(data);
      });
  }, []);

  useEffect(() => console.log(organizations), [organizations]);

  return (
    <>
      <p>Your organizations</p>
      {isLoading && <span className="loading loading-ring loading-lg"></span>}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Plan</th>
                <th>Role</th>
                <th>members</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(({ id, name, plan, role, num_members }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{plan}</td>
                  <td>{role}</td>
                  <td>
                    {num_members} /{" "}
                    {plan === "basic" ? 1 : plan === "standard" ? 5 : 10}
                  </td>
                  <td>
                    <Link to={`/organizations/${id}`} className="btn btn-sm">
                      MANAGE
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <Link to="/organizations/create" className="btn btn-sm">
            Create New Organization
          </Link>
        </div>
      )}
    </>
  );
}

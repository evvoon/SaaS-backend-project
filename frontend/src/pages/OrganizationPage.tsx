// for specific organization
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function OrganizationPage() {
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

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      fetch(API.organizations(id), { credentials: "include" }),
      sleep(440),
    ])
      .then(([r]) => r.json())
      .then((data) => {
        setIsLoading(false);
        setData(data);
      });
  }, []);

  useEffect(() => console.log(data), [data]);

  return (
    <>
      {isLoading && <span className="loading loading-ring loading-lg"></span>}
      {!isLoading && (
        <div className="overflow-x-auto">
          {data && <div>{data.organization.name}</div>}
          {data?.isAdmin && data.organization.plan !== "plus" && (
            <Link to={`/organizations/${id}/upgrade`} className="btn btn-sm">
              Upgrade Plan
            </Link>
          )}
          {data?.members.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {data.members.map(({ id, email, name, role }) => (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            "No members yet"
          )}
        </div>
      )}
    </>
  );
}

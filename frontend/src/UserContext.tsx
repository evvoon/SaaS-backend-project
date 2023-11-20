import { createContext, useState } from "react";

type Context = { token: string };

export const UserContext = createContext<{
  userInfo: Context;
  setUserInfo: React.Dispatch<React.SetStateAction<Context>>;
}>({});

/** @type {React.FC} */
export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({} as Context);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

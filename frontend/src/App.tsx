import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import "./app.css";
import MyOrgsPage from "./pages/MyOrgsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { OrganizationPage } from "./pages/OrganizationPage";
import { UpgradePage } from "./pages/UpgradePage";
import { CartPage } from "./pages/CartPage";
import { HomePage } from "./pages/HomePage";
import { Header } from "./Header";
import { NewOrgs } from "./pages/NewOrgs";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <main>
        <HomePage />
      </main>
    ),
  },
  {
    path: "/login",
    element: (
      <main>
        <LoginPage />
      </main>
    ),
  },
  {
    path: "/signup",
    element: (
      <main>
        <SignupPage />
      </main>
    ),
  },
  {
    path: "/organizations",
    element: (
      <main>
        <Header />
        <MyOrgsPage />
      </main>
    ),
  },
  {
    path: "/organizations/:id",
    element: (
      <main>
        <Header />
        <OrganizationPage />
      </main>
    ),
  },
  {
    path: "/organizations/:id/upgrade",
    element: (
      <main>
        <Header />
        <UpgradePage />
      </main>
    ),
  },
  {
    path: "/organizations/cart",
    element: (
      <main>
        <NewOrgs />
      </main>
    ),
  },
  {
    path: "/auth/cart",
    element: (
      <main>
        <CartPage />
      </main>
    ),
  },
]);

export default function App() {
  return (
    <div>
      <header></header>
      <UserContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </UserContextProvider>
    </div>
  );
}

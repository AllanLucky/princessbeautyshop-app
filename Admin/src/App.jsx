import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Menu from "./components/Menu";
import Headers from "./components/Headers";

import Home from "./pages/Home";
import Users from "./pages/Users";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import Banners from "./pages/Banners";
import Settings from "./pages/Settings";
import Backups from "./pages/Backups";
import Charts from "./pages/Charts";
import Myaccounts from "./pages/Myaccounts";
import Logout from "./pages/Logout";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div>
        <Headers />
      </div>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100">
          <Menu />
        </div>

        {/* Main content */}
        <div className="flex-1 bg-white p-5 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile", element: <Myaccounts /> },
      { path: "/users", element: <Users /> },
      { path: "/products", element: <Products /> },
      { path: "/newproduct", element: <NewProduct /> },
      { path: "/product/:productId", element: <Product /> },
      { path: "/orders", element: <Orders /> },
      { path: "/banners", element: <Banners /> },
      { path: "/settings", element: <Settings /> },
      { path: "/backups", element: <Backups /> },
      { path: "/charts", element: <Charts /> },
      { path: "/all-logs", element: <Backups /> },
      { path: "/logout", element: <Logout /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Menu from "./components/Menu";
import Headers from "./components/Headers";

// Pages
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

// Layout for admin dashboard
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Headers />

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

// Routes definition
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/admin-dashboard", element: <Home /> }, // fixed route
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
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold text-red-500">404 Not Found</h1>
        <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      </div>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;


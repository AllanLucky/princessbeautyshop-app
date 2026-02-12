import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";

// Components
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
import Login from "./pages/Login";
import Alllogs from "./pages/Alllogs";
import AdminInvoices from "./pages/AdminInvoices";

// Custom ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";
import EditUser from "./pages/EditUser";
import ProductFeaturePage from "./pages/ProductFeaturePage";

// --- Admin Layout ---
const Layout = () => (
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

// --- Routes ---
const router = createBrowserRouter([
  // Public route
  {
    path: "/login",
    element: <Login />,
  },
  // Protected admin routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="/admin-dashboard" /> }, // Default redirect
      { path: "admin-dashboard", element: <Home /> },
      { path: "profile", element: <Myaccounts /> },
      { path: "users", element: <Users /> },
     { path: "user/:id", element: <EditUser /> },
      { path: "products", element: <Products /> },
      { path: "newproduct", element: <NewProduct /> },
      { path: "product/:productId", element: <Product /> },
      { path: "/admin/product/features/:id", element: <ProductFeaturePage /> },
      { path: "orders", element: <Orders /> },
      { path: "invoices", element: <AdminInvoices /> },
      { path: "banners", element: <Banners /> },
      { path: "settings", element: <Settings /> },
      { path: "backups", element: <Backups /> },
      { path: "charts", element: <Charts /> },
      { path: "all-logs", element: <Alllogs /> },
    ],
  },
  // 404 fallback
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

// --- App Component ---
const App = () => <RouterProvider router={router} />;

export default App;




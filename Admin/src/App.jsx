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
import EditUser from "./pages/EditUser";
import ProductFeaturePage from "./pages/ProductFeaturePage";

// Custom ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

// --- Admin Layout ---
const Layout = () => (
  <div className="flex flex-col h-screen overflow-hidden">
    {/* Header */}
    <Headers />

    {/* Body: Sidebar + Main content */}
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 h-full bg-gray-100 border-r border-gray-300">
        <Menu />
      </div>

      {/* Main content */}
      <div className="flex-1 h-full overflow-auto bg-gray-50 p-5">
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
      { path: "", element: <Navigate to="/admin-dashboard" /> },
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

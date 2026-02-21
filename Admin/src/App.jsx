import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Users from "./pages/Users";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import Product from "./pages/Product";
import ProductFeaturePage from "./pages/ProductFeaturePage";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";
import Inventory from "./pages/Inventory";
import Banners from "./pages/Banners";
import Settings from "./pages/Settings";
import Backups from "./pages/Backups";
import Charts from "./pages/Charts";
import Myaccounts from "./pages/Myaccounts";
import Login from "./pages/Login";
import Alllogs from "./pages/Alllogs";
import AdminInvoices from "./pages/AdminInvoices";
import EditUser from "./pages/EditUser";
import MyWishlist from "./pages/MyWishlist";

// New Admin Pages
import Vendors from "./pages/Vendors";
import CreateVendor from "./pages/CreateVendor";
import EditVendor from "./pages/EditVendor";
import CategoryList from "./pages/CategoryList";
import EditCategory from "./pages/EditCategory";
import CreateCategory from "./pages/CreateCategory";
import Coupons from "./pages/Coupons";
import CreateCoupon from "./pages/CreateCoupon";
import EditCoupon from "./pages/EditCoupon";
import ProductReviews from "./pages/ProductReviews";
import Payment from "./pages/Payment";
import PaymentDetails from "./pages/PaymentDetails";
import Returns from "./pages/Returns";
import ReturnDetailPage from "./pages/ReturnDetailPage";

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

      // Users
      { path: "users", element: <Users /> },
      { path: "user/:id", element: <EditUser /> },

      // Products
      { path: "products", element: <Products /> },
      { path: "newproduct", element: <NewProduct /> },
      { path: "product/:productId", element: <Product /> },
      { path: "admin/product/features/:id", element: <ProductFeaturePage /> },

      // Reviews & Wishlist (Admin)
      { path: "/reviews/:id", element: <ProductReviews /> },
      { path: "my-wishlist", element: <MyWishlist /> },

      // Orders & Inventory
      { path: "orders", element: <Orders /> },
      { path: "create-order", element: <CreateOrder /> },
      { path: "inventory", element: <Inventory /> },
      { path: "invoices", element: <AdminInvoices /> },

      // Marketing & Content
      { path: "banners", element: <Banners /> },
      { path: "vendors", element: <Vendors /> },
      { path: "create-vendor", element: <CreateVendor /> },
      { path: "vendor/:id", element: <EditVendor /> },
      { path: "categories", element: <CategoryList /> },
      { path: "new-category", element: <CreateCategory /> },
      { path: "category/:id", element: <EditCategory /> },

      // Coupons
      { path: "coupons", element: <Coupons /> },
      { path: "new-coupon", element: <CreateCoupon /> },
      { path: "coupon/:id", element: <EditCoupon /> },

       // Coupons
      { path: "payments", element: <Payment /> },
      { path: "payment/:id", element: <PaymentDetails /> },

      { path: "returns", element: < Returns /> },
      { path: "return/:id", element: <ReturnDetailPage /> },
     

      // Analytics & Logs
      { path: "charts", element: <Charts /> },
      { path: "all-logs", element: <Alllogs /> },

      // Settings
      { path: "settings", element: <Settings /> },
      { path: "backups", element: <Backups /> },
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

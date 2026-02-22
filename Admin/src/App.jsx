import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

/* Layout */
import Layout from "./components/Layout";

/* Auth */
import ProtectedRoute from "./components/ProtectedRoute";

/* Pages */
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
import ChartsPage from "./pages/Charts";
import Myaccounts from "./pages/Myaccounts";
import Login from "./pages/Login";
import AlllogsPage from "./pages/Alllogs";
import AdminInvoices from "./pages/AdminInvoices";
import EditUser from "./pages/EditUser";
import MyWishlist from "./pages/MyWishlist";

/* Vendors */
import Vendors from "./pages/Vendors";
import CreateVendor from "./pages/CreateVendor";
import EditVendor from "./pages/EditVendor";

/* Categories */
import CategoryList from "./pages/CategoryList";
import EditCategory from "./pages/EditCategory";
import CreateCategory from "./pages/CreateCategory";

/* Coupons */
import Coupons from "./pages/Coupons";
import CreateCoupon from "./pages/CreateCoupon";
import EditCoupon from "./pages/EditCoupon";

/* Reviews */
import ProductReviews from "./pages/ProductReviews";

/* Payment */
import Payment from "./pages/Payment";
import PaymentDetails from "./pages/PaymentDetails";

/* Returns */
import Returns from "./pages/Returns";
import ReturnDetailPage from "./pages/ReturnDetailPage";
import CreateReturn from "./pages/CreateReturn";

/* Blogs */
import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import BlogDetail from "./pages/BlogDetail";

/* Support & Notification */
import SupportTicketList from "./pages/SupportTicketList";
import SupportTicketDetail from "./pages/SupportTicketDetail";
import NotificationList from "./pages/NotificationList";
import NotificationCreate from "./pages/NotificationCreate";
import NotificationDetail from "./pages/NotificationDetail";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin-dashboard" /> },

      { path: "admin-dashboard", element: <Home /> },
      { path: "profile", element: <Myaccounts /> },

      /* Users */
      { path: "users", element: <Users /> },
      { path: "user/:id", element: <EditUser /> },

      /* Products */
      { path: "products", element: <Products /> },
      { path: "newproduct", element: <NewProduct /> },
      { path: "product/:productId", element: <Product /> },
      { path: "features/:id", element: <ProductFeaturePage /> },

      /* Reviews */
      { path: "reviews/:id", element: <ProductReviews /> },
      { path: "my-wishlist", element: <MyWishlist /> },

      /* Orders */
      { path: "orders", element: <Orders /> },
      { path: "create-order", element: <CreateOrder /> },
      { path: "inventory", element: <Inventory /> },
      { path: "invoices", element: <AdminInvoices /> },

      /* Marketing */
      { path: "banners", element: <Banners /> },
      { path: "vendors", element: <Vendors /> },
      { path: "create-vendor", element: <CreateVendor /> },
      { path: "vendor/:id", element: <EditVendor /> },

      /* Categories */
      { path: "categories", element: <CategoryList /> },
      { path: "new-category", element: <CreateCategory /> },
      { path: "category/:id", element: <EditCategory /> },

      /* Coupons */
      { path: "coupons", element: <Coupons /> },
      { path: "new-coupon", element: <CreateCoupon /> },
      { path: "coupon/:id", element: <EditCoupon /> },

      /* Payment */
      { path: "payments", element: <Payment /> },
      { path: "payment/:id", element: <PaymentDetails /> },

      /* Returns */
      { path: "returns", element: <Returns /> },
      { path: "create-return", element: <CreateReturn /> },
      { path: "return/:id", element: <ReturnDetailPage /> },

      /* Blogs */
      { path: "blogs", element: <Blogs /> },
      { path: "create-blog", element: <CreateBlog /> },
      { path: "blog/:id", element: <EditBlog /> },
      { path: "blog-detail/:id", element: <BlogDetail /> },

      /* Support Tickets */
      { path: "tickets", element: <SupportTicketList /> },
      { path: "tickets/:id", element: <SupportTicketDetail /> },

      /* Notifications */
      { path: "notifications", element: <NotificationList /> },
      { path: "notifications/create", element: <NotificationCreate /> },
      {path: "/notifications/:id",element: <NotificationDetail />},
  


      /* Analytics */
      { path: "charts", element: <ChartsPage /> },
      { path: "all-logs", element: <AlllogsPage /> },

      /* Settings */
      { path: "settings", element: <Settings /> },
      { path: "backups", element: <Backups /> },
    ],
  },

  {
    path: "*",
    element: (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold text-red-500">404 Not Found</h1>
        <p className="mt-2 text-gray-600">
          The page you are looking for does not exist.
        </p>
      </div>
    ),
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
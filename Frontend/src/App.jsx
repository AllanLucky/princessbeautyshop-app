import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyAccount from "./pages/MyAccount";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFoundPage from "./pages/NotFoundPage";

import Announcement from "./components/Announcement";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VerifyAccounty from "./pages/VerifyAccounty";

// ================= LAYOUT =================
const Layout = () => {
  return (
    <>
      <Announcement />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

// ================= AUTH GUARD =================
const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ================= PREVENT LOGIN IF LOGGED IN =================
const AuthRedirect = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ================= ROUTER =================
function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/cart", element: <Cart /> },

        // 🔐 AUTH PAGES (only if NOT logged in)
        {
          path: "/login",
          element: (
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          ),
        },
        {
          path: "/create-account",
          element: (
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          ),
        },

         {
          path: "/verify-account",
          element: (
            <AuthRedirect>
              <VerifyAccounty />
            </AuthRedirect>
          ),
        },

        {
          path: "/forgot-password",
          element: (
            <AuthRedirect>
              <ForgotPassword />
            </AuthRedirect>
          ),
        },
        {
          path: "/reset-password/:token",
          element: (
            <AuthRedirect>
              <ResetPassword />
            </AuthRedirect>
          ),
        },

        // 🔐 Checkout flow (PROTECTED)
        {
          path: "/checkout",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payment",
          element: (
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          ),
        },
        {
          path: "/success",
          element: (
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          ),
        },

        // 🔐 User Pages
        {
          path: "/customer-dashboard/profile",
          element: (
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          ),
        },
        {
          path: "/customer-dashboard/my-orders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },

        // 🛍️ Products
        { path: "/product/:productId", element: <ProductDetails /> },
        { path: "/products/:searchterm", element: <ProductList /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
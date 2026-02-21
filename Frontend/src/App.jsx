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
import VerifyAccounty from "./pages/VerifyAccounty";

import Announcement from "./components/Announcement";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ================= LAYOUT =================
const Layout = () => (
  <>
    <Announcement />
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// ================= AUTH GUARD =================
const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector(
    (state) => state?.user?.currentUser
  );

  if (!currentUser?._id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ================= AUTH REDIRECT =================
const AuthRedirect = ({ children }) => {
  const currentUser = useSelector(
    (state) => state?.user?.currentUser
  );

  if (currentUser?._id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,

      children: [
        { path: "/", element: <Home /> },
        { path: "/cart", element: <Cart /> },

        // AUTH
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

        // CHECKOUT FLOW
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

        // ⭐ Stripe success redirect route
        {
          path: "/myorders",
          element: (
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          ),
        },

        // DASHBOARD
        {
          path: "/customer-dashboard/profile",
          element: (
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          ),
        },

        {
          path: "/customer-dashboard/myorders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },

        // PRODUCTS
        { path: "/product/:productId", element: <ProductDetails /> },
        { path: "/products/:searchterm", element: <ProductList /> },

        // 404
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
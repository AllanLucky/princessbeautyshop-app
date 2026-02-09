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
import Success from "./pages/PaymentSuccess";
import MyAccount from "./pages/MyAccount";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFoundPage from "./pages/NotFoundPage";

import Announcement from "./components/Announcement";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PaymentSuccess from "./pages/PaymentSuccess";

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

// 🔐 Auth Guard
const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        { path: "/", element: <Home /> },

        { path: "/cart", element: <Cart /> },

        { path: "/login", element: <Login /> },
        { path: "/create-account", element: <Register /> },

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
          path: "/profile",
          element: (
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          ),
        },
        {
          path: "/myorders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },

        { path: "/product/:productId", element: <ProductDetails /> },
        { path: "/products/:searchterm", element: <ProductList /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

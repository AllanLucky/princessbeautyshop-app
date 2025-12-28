import { Outlet, RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import MyAccount from "./pages/MyAccount";
import Announcement from "./components/Announcement";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import NotFoundPage from "./pages/NotFoundPage";
import Orders from "./pages/Orders";
import { useSelector } from "react-redux";

const Layout = () => {
  return (
    <div>
      <Announcement />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

// ProtectedRoute redirects to Home if user is not logged in
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (!user.currentUser) {
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
        { 
          path: "/profile", 
          element: (
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          ) 
        },
        { 
          path: "/myorders", 
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ) 
        },
        { path: "/product/:productId", element: <Product /> },
        { path: "/products/:searchterm", element: <ProductList /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

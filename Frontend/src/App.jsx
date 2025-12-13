import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import MyAccount from "./pages/MyAccount"
import Announcement from "./components/Announcement"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Product from "./pages/Product"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProductList from "./pages/ProductList"
import Orders from "./pages/Order"

const Layout = () => {
  return (
    <div>
      <Announcement />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/cart",
          element: <Cart />
        },
        {
          path: "/login",
          element: < Login />
        },
        {
          path: "/create-account",
          element: < Register />
        },
        {
          path: "/profile",
          element: <MyAccount />
        },
        {
          path: "/product/:productId",
          element: < Product />
        },
        {
          path: "/products/:searchterm",
          element: < ProductList />
        },
        {
          path: "/myorder",
          element: <Orders />
        },
      ]
    }
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
export default App
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Menu from "./components/Menu"
import Home from "./pages/Home"
import Users from "./pages/Users"
import Products from "./pages/Products"
import Orders from "./pages/Orders"
import Banners from "./pages/Banners"
import Settings from "./pages/Settings"
import Backups from "./pages/Backups"
import Charts from "./pages/Charts"
import Myaccounts from "./pages/Myaccounts"
import Logout from "./pages/Logout"


const Layout = () => {
  return (
    <div className="flex">
      <div>
        <Menu/>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/profile",
        element: <Myaccounts />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/products",
        element: <Products />,
      },
       {
        path: "/orders",
        element: <Orders />,
      },
       {
        path: "/banners",
        element: <Banners />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
       {
        path: "/backups",
        element: <Backups />,
      },
      {
        path: "/charts",
        element: <Charts />,
      },
      {
        path: "/all-logs",
        element: <Backups />,
      },{
        path: "/logout",
        element: <Logout />,
      }
      
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App

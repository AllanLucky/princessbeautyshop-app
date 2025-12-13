import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Menu from "./components/Menu"
import Home from "./pages/Home"
import Users from "./pages/Users"
import Products from "./pages/Products"


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
        path: "/users",
        element: <Users />,
      },
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaBox,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userRedux";

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all 
     ${isActive ? "bg-pink-50 text-pink-600 shadow" : "text-gray-600 hover:bg-gray-100 hover:text-pink-500"}`;

  const menuItems = [
    { path: "/customer-dashboard", icon: <FaHome />, label: "Dashboard Home" },
    { path: "/customer-dashboard/profile", icon: <FaUsers />, label: "Profile" },
    { path: "/customer-dashboard/my-orders", icon: <FaClipboardList />, label: "Orders" },
    { path: "/customer-dashboard/products", icon: <FaBox />, label: "Products" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white border-r shadow flex flex-col transition-all duration-300 
          ${isOpen ? "w-64" : "w-16"}`}
      >
        {/* Header / Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          {isOpen && <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-pink-600 focus:outline-none"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FaBars />
          </button>
        </div>

        {/* User Info */}
        {isOpen && user && (
          <div className="flex flex-col items-start gap-1 px-4 py-3 border-b border-gray-200">
            <p className="text-gray-600 font-medium">{user.name}</p>
            <p className="text-gray-400 text-sm capitalize">{user.role || "customer"}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navStyle}>
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium w-full transition"
            aria-label="Logout"
          >
            <FaSignOutAlt />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content placeholder */}
      <div className="flex-1 bg-gray-50 p-4">{/* Your main content goes here */}</div>
    </div>
  );
};

export default Menu;


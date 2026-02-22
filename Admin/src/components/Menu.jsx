import {
  FaHome,
  FaBox,
  FaClipboardList,
  FaElementor,
  FaCog,
  FaHdd,
  FaChartBar,
  FaClipboard,
  FaSignOutAlt,
  FaUsers,
  FaTachometerAlt,
  FaPlusCircle,
  FaTag,
  FaHeart,
  FaEnvelope,
  FaCreditCard,
  FaTruck,
  FaPercent,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../redux/adminRedux";
import { useDispatch, useSelector } from "react-redux";

const Menu = ({ collapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const admin = useSelector((state) => state.admin.currentAdmin);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    dispatch(logout());
    navigate("/login");
  };

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all
    ${
      isActive
        ? "bg-pink-100 text-pink-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-pink-500"
    }`;

  const linkLabel = (label) => (!collapsed ? label : "");

  return (
    <div
      className={`h-screen bg-white border-r shadow-sm flex flex-col transition-all duration-300 overflow-hidden
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <FaTachometerAlt className="text-pink-500 text-2xl flex-shrink-0" />

        {!collapsed && (
          <div className="leading-tight">
            <h1 className="text-xl font-bold text-gray-800">
              Admin Panel
            </h1>

            {admin && (
              <p className="text-xs text-gray-500 truncate">
                {admin.name}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100">

        <NavLink to="/admin-dashboard" className={navStyle}>
          <FaHome /> {linkLabel("Dashboard")}
        </NavLink>

        <NavLink to="/profile" className={navStyle}>
          <FaUsers /> {linkLabel("Profile")}
        </NavLink>

        <hr className={`my-3 border-gray-200 ${collapsed ? "hidden" : ""}`} />

        <NavLink to="/users" className={navStyle}>
          <FaUsers /> {linkLabel("Customers")}
        </NavLink>

        <NavLink to="/vendors" className={navStyle}>
          <FaUsers /> {linkLabel("Vendors")}
        </NavLink>

        <NavLink to="/products" className={navStyle}>
          <FaBox /> {linkLabel("Products")}
        </NavLink>

        <NavLink to="/categories" className={navStyle}>
          <FaClipboardList /> {linkLabel("Categories")}
        </NavLink>

        <NavLink to="/inventory" className={navStyle}>
          <FaPlusCircle /> {linkLabel("Inventory")}
        </NavLink>

        <NavLink to="/coupons" className={navStyle}>
          <FaTag /> {linkLabel("Coupons")}
        </NavLink>

        <NavLink to="/my-wishlist" className={navStyle}>
          <FaHeart /> {linkLabel("Wishlist")}
        </NavLink>

        <NavLink to="/orders" className={navStyle}>
          <FaClipboardList /> {linkLabel("Orders")}
        </NavLink>

        <NavLink to="/returns" className={navStyle}>
          <FaUndo /> {linkLabel("Returns")}
        </NavLink>

        {/* Support Tickets */}
        <NavLink to="/tickets" className={navStyle}>
          <FaHeadset /> {linkLabel("Support Tickets")}
        </NavLink>

        <hr className={`my-3 border-gray-200 ${collapsed ? "hidden" : ""}`} />

        <NavLink to="/banners" className={navStyle}>
          <FaElementor /> {linkLabel("Banners")}
        </NavLink>

        <NavLink to="/notifications" className={navStyle}>
          <FaEnvelope /> {linkLabel("Notifications")}
        </NavLink>

        <NavLink to="/blogs" className={navStyle}>
          <FaClipboard /> {linkLabel("Blogs")}
        </NavLink>

        <hr className={`my-3 border-gray-200 ${collapsed ? "hidden" : ""}`} />

        <NavLink to="/charts" className={navStyle}>
          <FaChartBar /> {linkLabel("Analytics")}
        </NavLink>

        <NavLink to="/all-logs" className={navStyle}>
          <FaClipboard /> {linkLabel("Logs")}
        </NavLink>

        <hr className={`my-3 border-gray-200 ${collapsed ? "hidden" : ""}`} />

        <NavLink to="/settings" className={navStyle}>
          <FaCog /> {linkLabel("Settings")}
        </NavLink>

        <NavLink to="/backups" className={navStyle}>
          <FaHdd /> {linkLabel("Backups")}
        </NavLink>

        <NavLink to="/payments" className={navStyle}>
          <FaCreditCard /> {linkLabel("Payments")}
        </NavLink>

        <NavLink to="/shipping" className={navStyle}>
          <FaTruck /> {linkLabel("Shipping")}
        </NavLink>

        <NavLink to="/taxes" className={navStyle}>
          <FaPercent /> {linkLabel("Taxes")}
        </NavLink>

      </div>

      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition w-full font-medium"
        >
          <FaSignOutAlt /> {linkLabel("Logout")}
        </button>
      </div>
    </div>
  );
};

export default Menu;
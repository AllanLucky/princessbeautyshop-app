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
  FaStar,
  FaEnvelope,
  FaCreditCard,
  FaTruck,
  FaPercent,
  FaUndo,
  FaHeart,
  FaHeadset,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { logout } from "../redux/adminRedux";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
    `flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all
     ${
       isActive
         ? "bg-pink-100 text-pink-600 shadow-sm"
         : "text-gray-600 hover:bg-gray-100 hover:text-pink-500"
     }`;

  const linkLabel = (label) => (!collapsed ? label : ""); // Hide label when collapsed

  return (
    <div
      className={`h-screen bg-white border-r-2 border-gray-300 shadow-sm flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo and Admin Info */}
      <div className="flex items-center gap-3 px-4 py-4 flex-shrink-0">
        <FaTachometerAlt className="text-pink-500 text-2xl" />
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            {admin && <p className="text-gray-500 text-sm">{admin.name}</p>}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto px-2 space-y-2 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100">
          {/* Dashboard */}
          <NavLink to="/admin-dashboard" className={navStyle}>
            <FaHome /> {linkLabel("Dashboard")}
          </NavLink>

          {/* Profile */}
          <NavLink to="/profile" className={navStyle}>
            <FaUsers /> {linkLabel("Profile")}
          </NavLink>

          <hr className={`my-4 border-gray-200 ${collapsed ? "hidden" : ""}`} />

          {/* Users */}
          <NavLink to="/users" className={navStyle}>
            <FaUsers /> {linkLabel("Customers")}
          </NavLink>

          <NavLink to="/vendors" className={navStyle}>
            <FaUsers /> {linkLabel("Vendors")}
          </NavLink>

          {/* Products & Inventory */}
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

          {/* Reviews & Wishlist
          <NavLink to="/reviews/1" className={navStyle}>
            <FaStar /> {linkLabel("Reviews")}
          </NavLink> */}

          <NavLink to="/my-wishlist" className={navStyle}>
            <FaHeart /> {linkLabel("Wishlist Users")}
          </NavLink>

          {/* Orders & Returns */}
          <NavLink to="/orders" className={navStyle}>
            <FaClipboardList /> {linkLabel("Orders")}
          </NavLink>

          <NavLink to="/returns" className={navStyle}>
            <FaUndo /> {linkLabel("Returns")}
          </NavLink>

          {/* Support Tickets */}
          <NavLink to="/support" className={navStyle}>
            <FaHeadset /> {linkLabel("Support Tickets")}
          </NavLink>

          <hr className={`my-4 border-gray-200 ${collapsed ? "hidden" : ""}`} />

          {/* Marketing & Content */}
          <NavLink to="/banners" className={navStyle}>
            <FaElementor /> {linkLabel("Banners")}
          </NavLink>

          <NavLink to="/notifications" className={navStyle}>
            <FaEnvelope /> {linkLabel("Notifications")}
          </NavLink>

          <NavLink to="/blog" className={navStyle}>
            <FaClipboard /> {linkLabel("Blog")}
          </NavLink>

          <hr className={`my-4 border-gray-200 ${collapsed ? "hidden" : ""}`} />

          {/* Analytics */}
          <NavLink to="/charts" className={navStyle}>
            <FaChartBar /> {linkLabel("Analytics")}
          </NavLink>

          <NavLink to="/all-logs" className={navStyle}>
            <FaClipboard /> {linkLabel("Logs")}
          </NavLink>

          <hr className={`my-4 border-gray-200 ${collapsed ? "hidden" : ""}`} />

          {/* Settings & System */}
          <NavLink to="/settings" className={navStyle}>
            <FaCog /> {linkLabel("Settings")}
          </NavLink>

          <NavLink to="/roles" className={navStyle}>
            <FaUsers /> {linkLabel("Roles & Permissions")}
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

          <hr className={`my-4 border-gray-200 ${collapsed ? "hidden" : ""}`} />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition w-full`}
          >
            <FaSignOutAlt /> {linkLabel("Logout")}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Menu;

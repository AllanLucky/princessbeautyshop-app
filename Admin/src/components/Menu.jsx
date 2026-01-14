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
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { logout } from "../redux/adminRedux"; 
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const handleLogout = () => {
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

  return (
    <div className="h-screen w-[260px] bg-white border-r-2 border-gray-300 px-4 py-6 shadow-sm">
      
      {/* Logo and Admin Info */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <FaTachometerAlt className="text-pink-500 text-2xl" />
        <div>
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          {admin && (
            <p className="text-gray-500 text-sm">{admin.name}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink to="/admin-dashboard" className={navStyle}>
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/profile" className={navStyle}>
          <FaUsers /> Profile
        </NavLink>

        <hr className="my-4" />

        <NavLink to="/users" className={navStyle}>
          <FaUsers /> Users
        </NavLink>

        <NavLink to="/products" className={navStyle}>
          <FaBox /> Products
        </NavLink>

        <NavLink to="/orders" className={navStyle}>
          <FaClipboardList /> Orders
        </NavLink>

        <NavLink to="/invoices" className={navStyle}>
          <FaClipboardList /> Invoices
        </NavLink>

        <hr className="my-4" />

        <NavLink to="/banners" className={navStyle}>
          <FaElementor /> Banners
        </NavLink>

        <NavLink to="/settings" className={navStyle}>
          <FaCog /> Settings
        </NavLink>

        <NavLink to="/backups" className={navStyle}>
          <FaHdd /> Backups
        </NavLink>

        <hr className="my-4" />

        <NavLink to="/charts" className={navStyle}>
          <FaChartBar /> Charts
        </NavLink>

        <NavLink to="/all-logs" className={navStyle}>
          <FaClipboard /> All Logs
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mt-6 rounded-lg text-red-500 hover:bg-red-50 transition w-full"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  );
};

export default Menu;

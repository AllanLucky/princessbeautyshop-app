import {FaHome, FaUser, FaBox, FaClipboardList, FaElementor, FaCog,FaHdd,FaChartBar, FaClipboard,FaSignOutAlt, FaUsers } from "react-icons/fa";
import {Link} from "react-router-dom";
const Menu = () => {
  return (
    <div className="h-[120vh] w-[250px] bg-gray-50 p-[20px] shadow-lg">
      <ul className="flex flex-col items-start justify-start mt-[20px] pl-[20px]">
        <Link to="/admin-dashboard">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors duration-100">
          <FaHome className="mr-[15px] text-[#ef93db]" /> 
          Home
        </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300"/>
        
         <Link to="/users">
         <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors duration-100">
          <FaUsers className="mr-[15px] text-[#ef93db]" />
          Users
        </li>
        </Link>
        <Link to="/products">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors duration-100">
          <FaBox className="mr-[15px] text-[#ef93db]" />
          Products
        </li>
        </Link>
        <Link to="/orders">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaClipboardList className="mr-[15px] text-[#ef93db]" />
          Orders
        </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300"/>
        <Link to="/banners">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaElementor className="mr-[15px] text-[#ef93db]" />
          Banners
        </li>
        </Link>
        <Link to="/settings">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaCog className="mr-[15px] text-[#ef93db]" />
          Settings
        </li>
        </Link>
       <Link to="/backups">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaHdd className="mr-[15px] text-[#ef93db]" />
          Backups
        </li>
       </Link>
        <hr className="w-full my-[20px] border-gray-300"/>
        <Link to="/charts">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaChartBar className="mr-[15px] text-[#ef93db]" />
          Charts
        </li>
        </Link>
       <Link to="/all-logs">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaClipboard className="mr-[15px] text-[#ef93db]" />
          All logs
        </li>
       </Link>
        {/* <Link to="/logout">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaSignOutAlt className="mr-[15px] text-[#ef93db]" />
          Logout
        </li>
        </Link> */}
      </ul>
    </div>
  )
}

export default Menu

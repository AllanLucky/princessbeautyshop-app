import {FaHome, FaUser, FaBox, FaClipboardList, FaElementor, FaCog,FaHdd,FaChartBar, FaClipboard,FaSignOutAlt } from "react-icons/fa"
const Menu = () => {
  return (
    <div className="h-[120vh] w-[300px] bg-gray-200 p-[20px] shadow-lg">
      <ul className="flex flex-col items-start justify-start mt-[20px] pl-[20px]">
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors duration-100">
          <FaHome className="mr-[15px] text-[#ef93db]" />
          Home
        </li>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors duration-100">
          <FaUser className="mr-[15px] text-[#ef93db]" />
          Profile
        </li>
        <hr className="w-full my-[20px] border-gray-300"/>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors duration-100">
          <FaBox className="mr-[15px] text-[#ef93db]" />
          Products
        </li>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaClipboardList className="mr-[15px] text-[#ef93db]" />
          Orders
        </li>
        <hr className="w-full my-[20px] border-gray-300"/>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaElementor className="mr-[15px] text-[#ef93db]" />
          Banners
        </li>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaCog className="mr-[15px] text-[#ef93db]" />
          Settings
        </li>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaHdd className="mr-[15px] text-[#ef93db]" />
          Backups
        </li>
        <hr className="w-full my-[20px] border-gray-300"/>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaChartBar className="mr-[15px] text-[#ef93db]" />
          Charts
        </li>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaClipboard className="mr-[15px] text-[#ef93db]" />
          All logs
        </li>
        <li className="flex items-center text-[20px] cursor-ponter mt-[20px] transition-colors    duration-100">
          <FaSignOutAlt className="mr-[15px] text-[#ef93db]" />
          Logout
        </li>
      </ul>
    </div>
  )
}

export default Menu

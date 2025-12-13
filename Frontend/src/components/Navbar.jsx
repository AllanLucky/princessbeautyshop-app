import { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import Badge from '@mui/material/Badge';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between h-[90px] shadow-xl px-6 md:px-12 relative z-10">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/blisslogo1.png"
            alt="Bliss Store Logo"
            className="h-[70px] w-auto object-contain transition-transform duration-500 hover:scale-105"
          />
        </Link>

        {/* Search Desktop */}
        <div className="relative hidden md:flex flex-1 mx-6 max-w-[500px]">
          <input
            type="text"
            placeholder="Search products"
            className="p-[14px] pl-4 border border-pink-300 w-full outline-none rounded-lg pr-10 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 "
          />
          <FaSearch className="absolute right-4 top-[16px] text-gray-600 cursor-pointer" />
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4 relative z-20">

          {/* Mobile Search Icon */}
          <FaSearch
            className="text-[22px] text-pink-500 cursor-pointer md:hidden"
            onClick={() => setOpenSearch(!openSearch)}
          />

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <Badge badgeContent={2} color="secondary">
              <ShoppingBasketIcon className="text-pink-500 text-[26px]" />
            </Badge>
          </Link>

          {/* Login */}
          <Link to="/login">
            <div className="flex items-center gap-2 border border-pink-300 px-3 py-2 rounded-lg hover:bg-pink-100 duration-300">
              <FaUser className="text-[#e455c5]" />
              <span className="text-[#e455c5] hidden md:block font-semibold">
                Login
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {openSearch && (
        <div className="px-6 py-4 md:hidden z-10 relative">
          <input
            type="text"
            placeholder="Search Products"
            autoFocus
            className="p-[15px] border-2 border-pink-300 w-full outline-none rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
          />
        </div>
      )}
    </>
  );
};

export default Navbar;

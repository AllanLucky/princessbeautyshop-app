import { useState, useRef, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import Badge from "@mui/material/Badge";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/userRedux";

const Navbar = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* 🔴 REDIRECT ADMIN AWAY FROM FRONTEND */
  useEffect(() => {
    if (
      user?.currentUser &&
      (user.currentUser.isAdmin === true ||
        user.currentUser.role === "admin")
    ) {
      // redirect to admin dashboard (Vite admin on 5173)
      window.location.href = "http://localhost:5173";
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between h-[90px] shadow-xl px-6 md:px-12 relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/blisslogo1.png"
            alt="Bliss Store Logo"
            className="h-[70px] w-auto object-contain"
          />
        </Link>

        {/* Search Desktop */}
        <div className="relative hidden md:flex flex-1 mx-6 max-w-[500px]">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="p-[14px] border border-pink-300 w-full rounded-lg"
          />
          <Link to={`/products/${search}`}>
            <FaSearch className="absolute right-4 top-[16px]" />
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <FaSearch
            className="text-[22px] text-pink-500 md:hidden"
            onClick={() => setOpenSearch(!openSearch)}
          />

          <Link to="/cart">
            <Badge badgeContent={cart.quantity} color="secondary">
              <ShoppingBasketIcon className="text-pink-500 text-[26px]" />
            </Badge>
          </Link>

          {/* 👇 SHOW ONLY NORMAL USERS */}
          {!user.currentUser ? (
            <Link to="/login">
              <div className="flex items-center gap-2 border px-3 py-2 rounded-lg">
                <FaUser />
                <span className="hidden md:block">Login</span>
              </div>
            </Link>
          ) : (
            user.currentUser.role !== "admin" &&
            user.currentUser.isAdmin !== true && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-2 border px-3 py-2 rounded-lg"
                >
                  <FaUser />
                  <span className="hidden md:block">
                    {user.currentUser.name}
                  </span>
                </button>

                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg">
                    <Link to="/profile" className="block px-4 py-2">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {openSearch && (
        <div className="px-6 py-4 md:hidden">
          <input
            type="text"
            placeholder="Search Products"
            className="p-[15px] border w-full rounded-lg"
          />
        </div>
      )}
    </>
  );
};

export default Navbar;

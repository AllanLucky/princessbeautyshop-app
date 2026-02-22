import { useState, useEffect, useRef } from "react";
import { HiOutlineMenu, HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from "react-icons/hi";
import { Fragment } from "react";
import { Menu as HeadlessMenu, Popover, Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/adminRedux";
import classNames from "classnames";
import debounce from "lodash.debounce";
import { adminSearchIndex } from "../config/adminSearchIndex";

const Headers = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchRef = useRef();

  /*
  =====================================================
  LOGOUT
  =====================================================
  */

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  /*
  =====================================================
  GLOBAL SEARCH LOGIC (ENTERPRISE LEVEL)
  =====================================================
  */

  const performSearch = debounce((query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = adminSearchIndex.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, 250);

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  /*
  =====================================================
  NAVIGATION
  =====================================================
  */

  const handleNavigate = (path) => {
    navigate(path);
    setSearchQuery("");
    setResults([]);
  };

  /*
  =====================================================
  ESC KEY CLOSE SEARCH
  =====================================================
  */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setResults([]);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /*
  =====================================================
  AUTH LOGOUT
  =====================================================
  */

  const handleLogoutClick = () => handleLogout();

  /*
  =====================================================
  UI RENDER
  =====================================================
  */

  return (
    <header className="flex justify-between items-center bg-pink-500 h-16 px-4 md:px-6 border-b border-gray-200 shadow-md relative">

      {/* Left Side */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-white p-1 rounded hover:bg-pink-600 transition"
          onClick={toggleSidebar}
        >
          <HiOutlineMenu fontSize={24} />
        </button>

        <img
          src="/blisslogo1.png"
          alt="Logo"
          className="h-14 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/admin-dashboard")}
        />
      </div>

      {/* Center Search */}
      <div className="relative w-full max-w-md mx-4" ref={searchRef}>

        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dashboard..."
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 outline-none"
        />

        {/* Search Results Dropdown */}

        {results.length > 0 && (
          <div className="absolute w-full bg-white border rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto animate-fadeIn">

            {results.map((item, index) => (
              <div
                key={index}
                onClick={() => handleNavigate(item.path)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {item.name}
              </div>
            ))}

          </div>
        )}

      </div>

      {/* Right Side Icons */}

      <div className="flex items-center gap-3">

        <Popover className="relative">
          {({ open }) => (
            <Popover.Button
              className={classNames(
                "inline-flex items-center justify-center text-white p-2 rounded-full hover:bg-pink-600 transition",
                open && "bg-pink-600"
              )}
            >
              <HiOutlineChatAlt fontSize={22} />
            </Popover.Button>
          )}
        </Popover>

        <Popover className="relative">
          {({ open }) => (
            <Popover.Button
              className={classNames(
                "inline-flex items-center justify-center text-white p-2 rounded-full hover:bg-pink-600 transition",
                open && "bg-pink-600"
              )}
            >
              <HiOutlineBell fontSize={22} />
            </Popover.Button>
          )}
        </Popover>

        <HeadlessMenu as="div" className="relative inline-block text-left ml-3">

          <HeadlessMenu.Button className="inline-flex items-center rounded-full focus:outline-none">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-pink-500 font-bold text-sm shadow">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
          </HeadlessMenu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >

            <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md divide-y">

              <div className="px-1 py-1">

                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${active ? "bg-gray-100" : ""} w-full text-left px-2 py-2 text-sm`}
                    >
                      Profile
                    </button>
                  )}
                </HeadlessMenu.Item>

              </div>

              <div className="px-1 py-1">

                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogoutClick}
                      className={`${active ? "bg-gray-100" : ""} w-full text-left px-2 py-2 text-sm text-red-500`}
                    >
                      Logout
                    </button>
                  )}
                </HeadlessMenu.Item>

              </div>

            </HeadlessMenu.Items>

          </Transition>

        </HeadlessMenu>

      </div>

    </header>
  );
};

export default Headers;
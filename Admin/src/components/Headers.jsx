import { Menu, Popover, Transition } from "@headlessui/react";
import {
  HiOutlineBell,
  HiOutlineChatAlt,
  HiOutlineSearch,
  HiOutlineMenu,
} from "react-icons/hi";
import { Fragment, useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/adminRedux";

const Headers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Get admin info from Redux safely
  const admin = useSelector((state) => state.admin.currentAdmin);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login"); // redirect after logout
  };

  return (
    <div className="flex justify-between items-center bg-pink-400 h-16 px-4 md:px-6 border-b border-gray-200 shadow-sm">
      {/* Left: Mobile menu button + Logo */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-700 p-1 rounded-sm focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <HiOutlineMenu fontSize={24} />
        </button>

        <img
          src="/blisslogo1.png"
          alt="Princess Beauty Shop Logo"
          className="h-16 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/admin-dashboard")}
        />
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 flex justify-center max-w-full">
        <div className="relative w-full max-w-md">
          <HiOutlineSearch
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            fontSize={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-sm pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Right: Icons + user */}
      <div
        className={classNames(
          "items-center gap-2 ml-2 md:flex",
          mobileOpen
            ? "flex flex-col absolute top-16 right-0 bg-white p-4 w-48 shadow-md rounded-sm z-20 md:flex-row md:relative md:top-0 md:right-0 md:shadow-none md:p-0"
            : "hidden md:flex"
        )}
      >
        {/* Chat */}
        <Popover className="relative">
          {({ open }) => (
            <Popover.Button
              className={classNames(
                "inline-flex items-center text-gray-700 p-1.5 rounded-sm hover:bg-gray-100",
                open && "bg-gray-100"
              )}
            >
              <HiOutlineChatAlt fontSize={24} />
            </Popover.Button>
          )}
        </Popover>

        {/* Notifications */}
        <Popover className="relative">
          {({ open }) => (
            <Popover.Button
              className={classNames(
                "inline-flex items-center text-gray-700 p-1.5 rounded-sm hover:bg-gray-100",
                open && "bg-gray-100"
              )}
            >
              <HiOutlineBell fontSize={24} />
            </Popover.Button>
          )}
        </Popover>

        {/* User menu */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="ml-2 inline-flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
            <span className="sr-only">Open user menu</span>
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-400 font-semibold">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-sm shadow-sm bg-white ring-1 ring-opacity-5 p-1 focus:outline-none border-none">
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={() => navigate("/profile")}
                    className={`group flex w-full items-center px-2 py-2 text-sm text-gray-700 rounded-sm ${
                      active ? "bg-gray-100" : ""
                    } cursor-pointer`}
                  >
                    {admin?.name || "Profile"}
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={() => navigate("/profile")}
                    className={`group flex w-full items-center px-2 py-2 text-sm text-gray-700 rounded-sm ${
                      active ? "bg-gray-100" : ""
                    } cursor-pointer`}
                  >
                    Account
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={handleLogout}
                    className={`group flex w-full items-center px-2 py-2 text-sm text-red-500 rounded-sm ${
                      active ? "bg-gray-100" : ""
                    } cursor-pointer`}
                  >
                    Logout
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default Headers;


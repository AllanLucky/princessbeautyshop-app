import { HiOutlineMenu, HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from "react-icons/hi";
import { Fragment } from "react";
import { Menu as HeadlessMenu, Popover, Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/adminRedux";
import classNames from "classnames";

const Headers = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center bg-pink-500 h-16 px-4 md:px-6 border-b border-gray-200 shadow-md">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-white p-1 rounded focus:outline-none hover:bg-pink-600 transition"
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

      {/* Center: Search bar */}
      <div className="flex-1 flex justify-center max-w-full">
        <div className="relative w-full max-w-md">
          <HiOutlineSearch className="text-gray-300 absolute top-1/2 -translate-y-1/2 left-3" fontSize={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500"
          />
        </div>
      </div>

      {/* Right: Icons + User */}
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
          <HeadlessMenu.Button className="inline-flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-pink-500 font-bold text-sm shadow">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
          </HeadlessMenu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
              <div className="px-1 py-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } group flex w-full items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                    >
                      {admin?.name || "Profile"}
                    </button>
                  )}
                </HeadlessMenu.Item>
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } group flex w-full items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                    >
                      Account
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
              <div className="px-1 py-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } group flex w-full items-center px-2 py-2 text-sm text-red-500 rounded-md`}
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

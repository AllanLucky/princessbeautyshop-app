import { useState } from "react";
import { Outlet } from "react-router-dom";
import Headers from "./Headers";
import Menu from "./Menu";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header with toggle */}
      <Headers toggleSidebar={() => setCollapsed(!collapsed)} />

      {/* Body */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex-shrink-0 h-full bg-gray-100 border-r border-gray-300 transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <Menu collapsed={collapsed} />
        </div>

        {/* Main content */}
        <div className="flex-1 h-full overflow-auto bg-gray-50 p-5 transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

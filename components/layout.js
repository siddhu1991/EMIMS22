import React, { useState } from "react";
import Box from "@mui/material/Box";
import Sidebar from "../components/sidebar";

export default function Layout({ children }) {
  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const handleCollapsedChange = (checked) => {
    setCollapsed((checked) => !checked);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
  return (
    <div
      className={`app-wrapper ${toggled ? "toggled" : ""} ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
        <Box sx={{ width: '100%', height: '100%' }} className="main-content">
          <main>{children}</main>
        </Box>
      </Box>
    </div>
  );
}

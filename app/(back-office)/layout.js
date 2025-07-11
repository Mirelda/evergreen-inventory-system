"use client";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`transition-all duration-300 bg-slate-100 min-h-screen ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <Header />
        {children}
      </main>
    </div>
  );
}

export default Layout;

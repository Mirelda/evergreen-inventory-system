"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 flex flex-col">
        <Header setShowSidebar={setShowSidebar} />
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex-1 p-4">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useState } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobilde sidebar açıkken overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 flex flex-col min-h-screen">
        <Header setShowSidebar={setShowSidebar} />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

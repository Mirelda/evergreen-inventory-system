"use client";

import { ChevronDown, Menu, LogOut, User, Settings } from "lucide-react";
import SearchInput from "./SearchInput";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function Header({ setShowSidebar }) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleMenuClick = () => {
    setShowSidebar(true);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-100 h-12 flex items-center justify-between px-4 md:px-8 border-b border-slate-200">
      <div className="flex gap-2 md:gap-3">
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button
          onClick={handleMenuClick}
          className="md:hidden p-1 rounded-md hover:bg-gray-200"
        >
          <Menu size={20} />
        </button>

        {/* Search Input - Only visible on desktop */}
        <div className="hidden md:block">
          <SearchInput />
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-3" ref={userMenuRef}>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {session?.user?.name || "User"}
              </div>
              <div className="text-xs text-gray-500">
                {session?.user?.email || "user@example.com"}
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-900">
                  {session?.user?.name || "User"}
                </div>
                <div className="text-xs text-gray-500">
                  {session?.user?.email || "user@example.com"}
                </div>
              </div>
              
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings size={16} />
                Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

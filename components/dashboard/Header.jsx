import { Bell, ChevronDown, LayoutGrid, History, Plus, Search, Settings, Users, Menu } from "lucide-react";
import SearchInput from "./SearchInput";

// PR
import Image from "next/image";

function Header({ setShowSidebar }) {
  const handleMenuClick = () => {
    setShowSidebar(true);
  };

  return (
    // PR classname
    <div className="bg-gray-100 h-12 flex items-center justify-between px-4 md:px-8 border-b border-slate-200">
      <div className="flex gap-2 md:gap-3">
        {/* Hamburger Menu Button - Only visible on small screens */}
        <button 
          onClick={handleMenuClick}
          className="lg:hidden p-1 rounded-lg hover:bg-slate-200"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        {/* Recent Activities */}
        <button className="p-1 rounded-lg hover:bg-slate-200">
          <History className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        {/* Search */}
        <div className="hidden sm:block">
          <SearchInput />
        </div>
      </div>
      {/* PR classname */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Plus */}
        <div className="pr-2 border-r border-gray-300">
          <button className="p-1 rounded-lg bg-blue-600">
            <Plus className="text-slate-50 w-4 h-4" />
          </button>
        </div>
        <div className="hidden md:flex border-r border-gray-300 space-x-2">
          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Users className="text-slate-900 w-4 h-4" />
          </button>
          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Bell className="text-slate-900 w-4 h-4" />
          </button>
          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Settings className="text-slate-900 w-4 h-4" />
          </button>
        </div>
        {/*  */}
        {/* PR */}
        <div className="flex gap-2 md:gap-3">
          <button className="hidden lg:flex items-center text-sm">
            <span>Walmart</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button>
            <Image
              src="/user.jpg"
              alt="user image"
              width={96}
              height={96}
              className="rounded-full w-7 h-7 md:w-8 md:h-8 border border-slate-800"
            />
          </button>
          <button className="p-1 rounded-lg hover:bg-slate-200">
            <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
          </button>
        </div>
        {/* PR */}
        {/*  */}
      </div>
    </div>
  );
}

export default Header;

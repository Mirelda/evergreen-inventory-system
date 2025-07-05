import {
  HelpCircle,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import Link from "next/link";

function FixedHeader() {
  return (
    <div className="flex justify-between items-center bg-white-300 py-5 px-4">
      <button className="text-2xl cursor-pointer">All Items</button>
      <div className="flex gap-4">
        {/* New */}
        <Link
          href="#"
          className="p-1 px-3 text-white rounded-sm bg-blue-600 flex items-center space-x-2"
        >
          <Plus className=" w-4 h-4" />
          <span>New</span>
        </Link>
        {/* Layout */}
        <div className="flex rounded-md overflow-hidden">
          <button className="cursor-pointer bg-gray-300 p-2 border-r border-gray-400">
            <List className="w-4 h-4 " />
          </button>
          <button className="cursor-pointer bg-gray-200 p-2 rounded-md">
            <LayoutGrid className="w-4 h-4 " />
          </button>
        </div>
        {/* More */}
        <button className="cursor-pointer bg-gray-200 p-2 rounded-md">
          <MoreHorizontal className="w-4 h-4 " />
        </button>
        {/* Help */}
        <button className="cursor-pointer bg-orange-600 p-2 rounded-md text-white">
          <HelpCircle className="w-5 h-5 " />
        </button>
      </div>
    </div>
  );
}

export default FixedHeader;

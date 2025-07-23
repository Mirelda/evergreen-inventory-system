"use client";

import {
  Plus,
} from "lucide-react";
import Link from "next/link";

function FixedHeader({ newLink }) {
  return (
    <div className="flex justify-between items-center bg-white py-5 px-4">
      <Link href="/dashboard/inventory/items" className="text-2xl">
        All Items
      </Link>
      <div className="flex gap-4">
        {/* New */}
        <Link
          href={newLink}
          className="p-1 px-3 text-white rounded-sm bg-blue-600 flex items-center space-x-2"
        >
          <Plus className=" w-4 h-4" />
          <span>New</span>
        </Link>
      </div>
    </div>
  );
}

export default FixedHeader;

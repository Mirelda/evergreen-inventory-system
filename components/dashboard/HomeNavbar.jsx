"use client";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeNavbar() {
  const pathName = usePathname();
  
  const navLinks = [
    { title: "Dashboard", href: "/dashboard/home/overview" },
    { title: "Getting Started", href: "/dashboard/home/getting-started" },
    { title: "Recent Updates", href: "/dashboard/home/updates" },
    { title: "Announcements", href: "/dashboard/home/announcements" },
  ];
  
  return (
    <div className="h-20 p-5 bg-slate-50 border-b border-slate-300">
      <div className="flex space-x-3">
        <div className="flex w-12 h-12 rounded-lg bg-white items-center justify-center">
          <Building2 />
        </div>
      </div>
      <nav className="sticky mt-4 flex space-x-4">
        {navLinks.map((item, i) => {
          return (
            <Link
              key={i}
              href={item.href}
              className={`${
                pathName === item.href
                  ? "py-1 border-b-2 border-blue-600"
                  : "py-1"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default HomeNavbar;

import React from "react";
import ThemeLink from "./ThemeLink";
import mockup from "../public/mockup.png";
import { AiOutlineArrowDown } from "react-icons/ai";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export default function Hero() {
  const session = getServerSession(authOptions);
  return (
    <div className=" bg-gradient-to-b from-blue-900 flex flex-col py-8 md:py-32 px-4 md:px-16 text-slate-50 items-center gap-6">
      <div className="flex flex-col space-y-8 items-center max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mt-16 sm:mb-0">
          Inventory management software for growing businesses.
        </h2>
        <p className="text-base md:text-xl">
          Increase your sales and keep track of every unit with our powerful
          stock management, order fulfillment, and inventory control software.
        </p>

        <div className="py-4 flex space-x-4 items-center flex-wrap space-y-4 justify-center">
          {session.user ? (
            <ThemeLink
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-300 text-white  "
              title="View Dashboard"
              href="/dashboard/home/overview"
              icon={AiOutlineArrowDown}
            />
          ) : (
            <ThemeLink
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-300 text-white  "
              title="Access the Inventory System"
              href="/dashboard/home/overview"
              icon={AiOutlineArrowDown}
            />
          )}

          <ThemeLink
            className="bg-slate-50 hover:bg-slate-100 focus:ring-slate-300 text-slate-900"
            title="Explore Demo Account"
            href="/dashboard/home/overview"
            icon={AiOutlineArrowDown}
          />
        </div>
      </div>
      <div className="">
        <Image src={mockup} alt="Inventory App" />
      </div>
    </div>
  );
}

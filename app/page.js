import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Evergreen Inventory System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Modern inventory management solution
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { Box, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="/CrowntailLogo.png"
              alt="Crowntail Workshop Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Crowntail Inventory
            </h1>
          </div>
          <nav className="space-x-4">
            <Link href="/login" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                Sign In
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Modern Inventory Management, <br />
            <span className="text-blue-600">Simplified.</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Crowntail Inventory provides a powerful, yet easy-to-use platform to track your stock, manage sales, and make data-driven decisions. Stop guessing, start growing.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/dashboard" className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105">
                Get Started
            </Link>
            <a href="#features" className="px-8 py-3 text-lg font-semibold text-blue-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 shadow-lg transition-transform transform hover:scale-105">
                Learn More
            </a>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold">Why Crowntail Inventory?</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Everything you need to run your business efficiently.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Box size={32} className="text-blue-500" />}
              title="Centralized Stock"
              description="Keep track of all your products in one place. Never lose sight of your inventory levels."
            />
            <FeatureCard
              icon={<ShoppingCart size={32} className="text-green-500" />}
              title="Sales Tracking"
              description="Record every sale and automatically update your stock levels in real-time."
            />
            <FeatureCard
              icon={<Package size={32} className="text-yellow-500" />}
              title="Supplier Management"
              description="Manage your suppliers and purchase orders seamlessly to keep your stock flowing."
            />
            <FeatureCard
              icon={<TrendingUp size={32} className="text-red-500" />}
              title="Insightful Reports"
              description="Generate powerful reports to understand your sales trends and inventory performance."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Crowntail Workshop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

import Header from "@/components/dashboard/Header";

function Layout({ children }) {
  return (
    <div className="flex">
      <div className="w-56 min-h-screen bg-slate-900 text-slate-50">
        sidebar
      </div>
      <main className="w-full bg-slate-100 min-h-screen">
        <Header />
        {children}
      </main>
    </div>
  );
}

export default Layout;

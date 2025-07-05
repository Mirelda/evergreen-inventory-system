import HomeNavbar from "@/components/dashboard/HomeNavbar";

function Layout({ children }) {
  return (
    <div className="">
      <HomeNavbar />
      {children}
    </div>
  );
}

export default Layout;

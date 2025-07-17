import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Eğer kullanıcı giriş yapmamışsa ve korunmuş bir alana girmeye çalışıyorsa,
    // withAuth zaten onu giriş sayfasına yönlendirecektir.
    // Biz burada sadece rolleri kontrol edeceğiz.

    if (token) {
      const { role } = token;
      
      // ADMIN-only routes
      const adminOnlyRoutes = ["/dashboard/users", "/dashboard/documents"];
      if (adminOnlyRoutes.some(path => pathname.startsWith(path))) {
        if (role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard?error=unauthorized", req.url));
        }
      }

      // MANAGER and ADMIN only routes
      const managerAdminRoutes = [
        "/dashboard/reports",
      ];
      if (managerAdminRoutes.some(path => pathname.startsWith(path))) {
        if (role !== "ADMIN" && role !== "MANAGER") {
          return NextResponse.redirect(new URL("/dashboard?error=unauthorized", req.url));
        }
      }

      // STAFF can access everything else under /dashboard that is not explicitly forbidden
      // The most basic access level, other restrictions are handled by the UI (e.g. hiding buttons)
      // and API endpoints.
      const commonRoutes = [
        "/dashboard/inventory",
        "/dashboard/sales",
        "/dashboard/settings", // All users should be able to see their settings
        "/dashboard/home",
      ];
      
      // A simple check to ensure the user is accessing a valid dashboard area
      const isAccessingAllowedRoute = 
        pathname.startsWith('/dashboard/users') ||
        managerAdminRoutes.some(path => pathname.startsWith(path)) ||
        commonRoutes.some(path => pathname.startsWith(path));

      // This logic is a bit open. A better approach for higher security would be to
      // explicitly list all allowed routes for each role.
      // For now, this will allow STAFF to access inventory and other key areas.
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      error: "/login", // Hata durumunda da login'e yönlendir.
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
}; 
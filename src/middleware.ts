import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const rolePermissions = {
  // TODO : FIX ROOT PAGE IS UNAUTH TO THE CANDIDATES 
  // "/": ["recruiter", "candidat"],
  "/dashboard": ["recruiter"],
  "/jobs": ["recruiter"],
  "/api/jobs": ["recruiter"],
  "/public/jobs": ["candidat"], // candidate-only for apply route
};

const recruiterLoginPage = "/login";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const matched = Object.entries(rolePermissions).find(([prefix]) =>
      path.startsWith(prefix)
    );

    if (!matched) {
      return NextResponse.next(); // Public route
    }

    const [prefix, allowedRoles] = matched;

    // ✅ Not logged in
    if (!token) {
      if (allowedRoles.includes("candidat") && path.startsWith("/public/jobs")) {
        const segments = path.split("/");
        const jobId = segments[3];
        const candidateLoginUrl = new URL(`/public/jobs/${jobId}/login`, req.url);
        candidateLoginUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(candidateLoginUrl);
      }

      const loginUrl = new URL(recruiterLoginPage, req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ Logged in but wrong role
    if (!allowedRoles.includes(token.role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // ✅ All good
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/jobs/:path*",
    "/api/jobs/:path*",
    "/public/jobs/:jobId/apply",
  ],
};

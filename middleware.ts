// middleware.ts (in the root of your project)
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // Add custom logic here if needed
    return NextResponse.next();
  },
  {
    // Protect all routes that start with /dashboard or /admin
    callbacks: {
      authorized: ({ token }: any) => token != null,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
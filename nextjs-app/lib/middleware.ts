import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Handle language preference from cookie
    const locale = request.cookies.get("locale")?.value || "en";
    
  }
);

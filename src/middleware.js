import { NextResponse } from "next/server";
import { verifyToken } from "./utils/tokenConf";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();
  if (!token) {
    url.pathname = "/auth/login";
  }

  const { role } = verifyToken(token);
  if (!role.trim()) {
    url.pathname = "/auth/login";
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

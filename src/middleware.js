import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  const secret = new TextEncoder().encode(process.env.jwtSignature);
  const {
    payload: { role },
  } = await jwtVerify(token, secret);

  if (!role) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const isHavePermission = url.pathname.split("/")[2] == role;
  if (!isHavePermission) {
    return NextResponse.redirect(new URL(`/school/${role}/home`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/school/:path*"],
};

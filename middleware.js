import { NextResponse } from "next/server";
import {
  verifyToken,
  generateToken,
  generateRefreshToken,
} from "./utils/tokenConf";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let payload;

  try {
    if (token) {
      payload = verifyToken(token);
    } else if (refreshToken) {
      payload = verifyToken(refreshToken);
    }
  } catch (err) {
    return NextResponse.json(
      { error: "توکن نامعتبر است", success: false },
      { status: 401 }
    );
  }

  if (!payload) {
    return NextResponse.json(
      { error: "دسترسی نامعتبر", success: false },
      { status: 401 }
    );
  }

  if (!token && refreshToken) {
    const newToken = generateToken({
      nationalCode: payload.nationalCode,
      role: payload.role,
    });

    const newRefreshToken = generateRefreshToken({
      nationalCode: payload.nationalCode,
      role: payload.role,
    });

    const res = NextResponse.next();

    res.cookies.set("token", newToken, {
      maxAge: 60 * 60 * 24,
      path: "/",
      httpOnly: true,
    });

    res.cookies.set("token", newRefreshToken, {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      httpOnly: true,
    });

    return res;
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/api/manager/:path*",
    "/api/teacher/:path*",
    "/api/students/:path*",
    "/api/owner/:path*",
    "/api/classes/:path*",
    "/api/schools/:path*",
  ],
};

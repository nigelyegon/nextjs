import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const publicPaths = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
  ];
  if (publicPaths.some(path => pathname.startsWith(path))) return NextResponse.next();

  let accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Issue new access token
      accessToken = jwt.sign(
        { id: payload.id },
        process.env.JWT_SECRET,
        { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES) }
      );

      const res = NextResponse.next();
      res.cookies.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        path: "/",
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES),
      });
      return res;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set({
    name: "accessToken",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  res.cookies.set({
    name: "refreshToken",
    value: "",
    path: "/api/auth/refresh",
    httpOnly: true,
    maxAge: 0,
  });

  return res;
}

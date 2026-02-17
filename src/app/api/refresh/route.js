import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES) }
    );

    const res = NextResponse.json({ message: "Access token refreshed" });
    res.cookies.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      path: "/",
      maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES),
    });

    return res;
  } catch (err) {
    console.error("Refresh token error:", err);
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}

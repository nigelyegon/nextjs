import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function GET(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    const [rows] = await db.query("SELECT id, name, email FROM users WHERE id = ?", [payload.id]);
    if (!rows.length) return NextResponse.json({ user: null }, { status: 404 });

    return NextResponse.json({ user: rows[0] });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

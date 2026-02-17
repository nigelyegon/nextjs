// import { db } from "@/lib/db";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { name, email, password, remember } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     // Check if user already exists
//     const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
//     if (existing.length) {
//       return NextResponse.json({ error: "Email already registered" }, { status: 409 });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert user into DB
//     const [result] = await db.query(
//       "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//       [name, normalizedEmail, hashedPassword]
//     );

//     const userId = result.insertId;

//     // ✅ Generate JWTs
//     const accessToken = jwt.sign({ id: userId, email: normalizedEmail }, process.env.JWT_SECRET, {
//       expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES),
//     });

//     const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
//       expiresIn: remember
//         ? parseInt(process.env.REMEMBER_ME_EXPIRES)
//         : parseInt(process.env.REFRESH_TOKEN_EXPIRES),
//     });

//     // ✅ Set cookies
//     const res = NextResponse.json({ message: "Registered and logged in successfully" });

//     res.cookies.set({
//       name: "accessToken",
//       value: accessToken,
//       httpOnly: true,
//       path: "/",
//       maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES),
//     });

//     res.cookies.set({
//       name: "refreshToken",
//       value: refreshToken,
//       httpOnly: true,
//       path: "/api/auth/refresh",
//       maxAge: remember
//         ? parseInt(process.env.REMEMBER_ME_EXPIRES)
//         : parseInt(process.env.REFRESH_TOKEN_EXPIRES),
//     });

//     return res;
//   } catch (err) {
//     console.error("Register API error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, remember } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
    if (existing.length) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, normalizedEmail, hashedPassword]
    );

    const userId = result.insertId;

    const accessToken = jwt.sign({ id: userId, email: normalizedEmail }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES),
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: remember
        ? parseInt(process.env.REMEMBER_ME_EXPIRES)
        : parseInt(process.env.REFRESH_TOKEN_EXPIRES),
    });

    // ✅ Redirect directly to dashboard after registration
    const res = NextResponse.redirect(new URL("/dashboard", req.url));

    res.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      path: "/",
      maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES),
    });

    res.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      path: "/api/auth/refresh",
      maxAge: remember
        ? parseInt(process.env.REMEMBER_ME_EXPIRES)
        : parseInt(process.env.REFRESH_TOKEN_EXPIRES),
    });

    return res;
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

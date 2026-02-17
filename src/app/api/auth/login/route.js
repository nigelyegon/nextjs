// import { db } from "@/lib/db";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { email, password, remember } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password required" }, { status: 400 });
//     }

//     const normalizedEmail = email.trim().toLowerCase();
//     const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);

//     if (!rows.length) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

//     const user = rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

//     // ✅ Generate JWTs
//     const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES), // e.g., 900 = 15min
//     });

//     const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
//       expiresIn: remember
//         ? parseInt(process.env.REMEMBER_ME_EXPIRES) // e.g., 30 days
//         : parseInt(process.env.REFRESH_TOKEN_EXPIRES), // e.g., 7 days
//     });

//     // ✅ Set cookies
//     const res = NextResponse.json({ message: "Logged in successfully" });

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
//     console.error("Login API error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, remember } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
    if (!rows.length) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES),
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: remember
        ? parseInt(process.env.REMEMBER_ME_EXPIRES)
        : parseInt(process.env.REFRESH_TOKEN_EXPIRES),
    });

    // ✅ Use NextResponse.redirect to send user directly to dashboard
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
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

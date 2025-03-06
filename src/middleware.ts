import { NextResponse } from "next/server";
import { auth } from "./auth";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://el-qema.com",
        "https://www.el-qema.com",
        "http://localhost:3000",
      ]
    : ["http://localhost:3000"];

const AuthRoutes = ["/profile", "/student_courses", "/wallet"];

const signRoute = ["/sign-in", "/sign-up"];

export default auth(async (req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isAuthRotue = AuthRoutes.includes(req.nextUrl.pathname);
  const origin = req.headers.get("origin");

  if (origin && !allowedOrigins.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (req.auth?.user && signRoute.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl).toString());
  }

  if (req.auth?.user.role !== "ADMIN" && isAdminRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl).toString());
  }

  if (!req.auth?.user && isAuthRotue) {
    return NextResponse.redirect(new URL("/", req.nextUrl).toString());
  }

  return NextResponse.next();
});

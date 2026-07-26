import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const nextAuth = NextAuth(authConfig);

export default nextAuth.auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

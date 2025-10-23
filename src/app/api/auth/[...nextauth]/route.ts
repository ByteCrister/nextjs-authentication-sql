// src/app/api/auth/[...nextauth]/route.ts
import { nextauth } from "@/lib/nextauth";
import NextAuth from "next-auth";

const handler = NextAuth(nextauth);

export { handler as GET, handler as POST };

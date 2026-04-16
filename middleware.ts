import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/conversation",
  "/flashcards",
  "/pronunciation",
  "/progress",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const supabaseToken =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get("sb:token")?.value ||
    request.cookies.get("supabase-auth-token")?.value;

  if (!supabaseToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/conversation/:path*", "/flashcards/:path*", "/pronunciation/:path*", "/progress/:path*"],
};

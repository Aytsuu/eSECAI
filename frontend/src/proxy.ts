import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  
  // 1. Explicitly allow the callback page to finish its work
  if (pathname.startsWith('/authentication/callback')) {
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith("/authentication");
  const isPublicPath = pathname === '/' || isAuthPage || pathname.startsWith("/404");

  // 2. Add a check to prevent infinite loops if already on the login page
  if (pathname === '/authentication/login' && !token) {
    return NextResponse.next();
  }

  if (!isPublicPath && !token) {
    const loginUrl = new URL('/authentication/login', request.url);
    // Store the intended destination to redirect back after login
    loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth.config";

export default auth((req) => {
    // pathname
    const { pathname } = req.nextUrl;
    // isloogedin
    const isLoggedIn = !!req.auth;
    // public routes
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // root path
    const isRootPath = pathname === '/';

    const isProtectedRoute = pathname.startsWith('/dashboard');

    // If user is logged in and on protected route, we let them proceed (no redirect needed)
    // The loop was here because we were redirecting to /dashboard while already being on /dashboard or a sub-route


    // If user is not logged in and not on public route, redirect to login
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // If user is logged in and on root path, redirect to dashboard
    if (isLoggedIn && isRootPath) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user is not logged in and on root path, redirect to login
    if (!isLoggedIn && isRootPath) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
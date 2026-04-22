import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });
    const role = String(token?.role ?? '').toUpperCase()

    if (!token || role !== "ADMIN") {
        return NextResponse.redirect(new URL("/signin", request.url));
    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/admin-dashboard", "/admin-dashboard/:path*"],
};

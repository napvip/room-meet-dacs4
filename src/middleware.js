import { getToken } from "next-auth/jwt";

const { NextResponse } = require("next/server");




export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    //nếu ng dùng thử tơi /user-auth sau khi đã đăng nhập
    if (req.nextUrl.pathname === '/user-auth' && token) {
        //chuyển hướng ng dùng đến trang chính
        return NextResponse.redirect(new URL('/', req.url));
    }

    //nếu ng dùng thử truy cập trang chính mà chưa đăng nhập
    if (!token && req.nextUrl.pathname !== '/user-auth') {
        //chuyển hướng ng dùng đến trang đăng nhập
        return NextResponse.redirect(new URL('/user-auth', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/user-auth']
}
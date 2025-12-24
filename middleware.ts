import { NextResponse } from "next/server";

export async function middleware(request) {
    const { nextUrl, cookies } = request;
    const jwtParam = nextUrl.searchParams.get("jwt");

    if (jwtParam) {
        const url = new URL(nextUrl.pathname, request.url);
        const response = NextResponse.redirect(url);

        response.headers.append(
            "Set-Cookie",
            `token=${jwtParam}; Path=/; Max-Age=${
                60 * 60 * 24 * 365
            }; SameSite=Lax`
        );

        return response;
    }

    const token = cookies.get("token")?.value;

    if (token) {
        return NextResponse.next();
    }

    try {
        const apiUrl = new URL("/api/url", request.url);
        const res = await fetch(apiUrl, { cache: "no-store" });

        if (res.ok) {
            const data = await res.json();
            if (data?.verify_url) {
                return NextResponse.redirect(data.verify_url);
            }
        }
    } catch (error) {
        console.error(error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

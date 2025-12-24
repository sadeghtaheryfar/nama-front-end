export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
export const GET = async (req) => {
    const token = (await cookies()).get("token")?.value;
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("item_id");
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "6");
    const q = searchParams.get("q");

    try {
        const response = await axios.get(
            `${
                process.env.NEXT_PUBLIC_BASE_URL
            }/api/v1/request-plans?item_id=${itemId}${
                role ? `&role=${role}` : ""
            }${q ? `&q=${q}` : ""}&page=${page}&per_page=${per_page}`,
            {
                headers: {
                    Authorization: `bearer ${token}`,
                },
            }
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return NextResponse.json(
            {
                message: "مشکلی در ارسال درخواست وجود دارد.",
            },
            { status: 500 }
        );
    }
};

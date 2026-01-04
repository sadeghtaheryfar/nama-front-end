export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("item_id");

    try {
        let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/banners`;
        if (itemId) {
            apiUrl += `?item_id=${itemId}`;
        }

        const response = await axios.get(apiUrl, {
            headers: {
                Accept: "application/json",
            },
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching data:", error);

        if (error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
            });
        } else if (error.request) {
            return NextResponse.json(
                { message: "پاسخی از سرور دریافت نشد." },
                { status: 502 }
            );
        } else {
            return NextResponse.json(
                { message: "مشکلی در ارسال درخواست وجود دارد." },
                { status: 500 }
            );
        }
    }
};

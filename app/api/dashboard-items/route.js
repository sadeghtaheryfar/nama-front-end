export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export const GET = async (req) => {
    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("item_id");

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dashboard-items?per_page=50&item_id=${itemId}`,
            {
                headers: {
                    Accept: "application/json",
                    authorization: `bearer ${access}`,
                },
            }
        );

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

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

    try {
        const response = await axios.get(
            `${
                process.env.NEXT_PUBLIC_BASE_URL
            }/api/v1/forms?item_id=${itemId}${role ? `&role=${role}` : ""}`,
            {
                headers: {
                    Authorization: `bearer ${token}`,
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

export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const DELETE = async (req) => {
    const token = cookies().get("token")?.value;
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("item_id");
    const id = searchParams.get("id");
    const member = searchParams.get("member");

    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rings/${id}/${member}?item_id=${itemId}&role=mosque_head_coach`,
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

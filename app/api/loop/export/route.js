export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("item_id");
    const token = cookies().get("token")?.value;

    try {
        let apiUrl = `https://arman.armaniran.org/api/v1/rings/export?item_id=${itemId}&role=mosque_head_coach`;

        const response = await axios.get(apiUrl, {
            headers: {
                Accept: "application/json",
                Authorization: `bearer ${token}`,
            },
            responseType: "arraybuffer",
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

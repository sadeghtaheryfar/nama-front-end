import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const POST = async (req, res) => {
    const data = await req.json();
    const id = data.id;

    const token = (await cookies()).get("token")?.value;

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/requests/${id}/confirm`,
            {},
            {
                headers: {
                    Authorization: `bearer ${token}`,
                    Accept: "application/json",
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

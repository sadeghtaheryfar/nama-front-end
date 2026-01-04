export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
export const dynamic = "force-dynamic";

export const GET = async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_AUTH}/oauth/create?token=1234&callback=${process.env.NEXT_PUBLIC_CB_URL}`,
            {
                headers: {
                    "Content-Type": `application/json`,
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

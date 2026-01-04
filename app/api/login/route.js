import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export const POST = async (req, res) => {
    const data = await req.json();
    // const code = data.code;
    // const count = data.count;

    const access = cookies().get("access")?.value;

    // const body = {
    //   code,
    // };

    // if (count != null) {
    //   Object.assign(body, { count });
    // }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_DB}cart`,
            data,
            {
                headers: {
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

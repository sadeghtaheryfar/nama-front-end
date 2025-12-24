import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export const POST = async (req, res) => {
    const data = await req.json();
    const students = data.student;
    const amount = data.cost;
    const date = data.date;
    const body = data.des;
    const imam_letter = data.imamLetter;
    const area_interface_letter = data.connectionLetter;
    const request_plan_id = data.id;

    const token = (await cookies()).get("token")?.value;

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/requests`,
            {
                students,
                amount,
                date,
                body,
                imam_letter,
                area_interface_letter,
                request_plan_id,
                sheba: null,
            },
            {
                headers: {
                    Authorization: `bearer ${token}`,
                },
            }
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching:", error.response.data);
        return NextResponse.json(
            {
                message: "مشکلی در ارسال درخواست وجود دارد.",
            },
            { status: 500 }
        );
    }
};

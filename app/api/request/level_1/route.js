import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const POST = async (req, res) => {
  const data = await req.json();
  const id = data.id;

  const token = (await cookies()).get("token")?.value;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request-plans/${id}`,
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

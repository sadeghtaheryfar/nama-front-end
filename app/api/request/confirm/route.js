import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const POST = async (req, res) => {
  const data = await req.json();
  const id = data.id;

  const token = (await cookies()).get("token")?.value;
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const itemId = searchParams.get("itemId");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/requests/${id}/confirm${role ? `?role=${role}` : ''}${itemId ? `?item_id=${itemId}` : ''}`,
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
    console.error("Error fetching : ", error.response);
    return NextResponse.json(
      {
        message: "مشکلی در ارسال درخواست وجود دارد.",
      },
      { status: 500 }
    );
  }
};

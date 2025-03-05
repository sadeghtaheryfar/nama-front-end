import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req) => {
  const access = cookies().get("access")?.value;
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("item_id");

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dashboard-items?per_page=50&item_id=${itemId}`, {
      headers: {
        Accept: "application/json",
        authorization: `bearer ${access}`,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};
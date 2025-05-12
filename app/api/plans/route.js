export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req) => {
  const token = cookies().get("token")?.value;
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("item_id");

  try {
    let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request-plans?item_id=${itemId}&per_page=100`;
    if (itemId) {
      apiUrl += `?item_id=${itemId}`;
    }

    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
};

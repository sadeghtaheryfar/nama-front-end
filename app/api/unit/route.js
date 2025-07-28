export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const token = cookies().get("token")?.value;
  const itemId = searchParams.get("item_id");
  const role = searchParams.get("role");
  const page = searchParams.get("page") || 1;
  const perPage = searchParams.get("per_page") || 10;
  const q = searchParams.get("q") || "";

  try {
    let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/units?per_page=${perPage}&page=${page}&role=${role}&q=${q}`;
    if (itemId) {
      apiUrl += `&item_id=${itemId}`;
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

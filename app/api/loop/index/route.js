export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("item_id");
  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "10");
  const token = cookies().get("token")?.value;

  var type;
  if(itemId == 2)
  {
    type = 'mosque';
  }else if(itemId == 3)
  {
    type = 'school';
  }else{
    type = 'center';
  }

  try {
    let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rings?item_id=${itemId}&role=mosque_head_coach&per_page=${per_page}&page=${page}&type=${type}`;

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

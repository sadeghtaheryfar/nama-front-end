import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/banners`, {
      headers: {
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};
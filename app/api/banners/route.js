export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("item_id");

    try {
        let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/banners`;
        if (itemId) {
            apiUrl += `?item_id=${itemId}`;
        }

        const response = await axios.get(apiUrl, {
            headers: {
                Accept: "application/json",
            },
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return NextResponse.json(
            { error: "Failed to fetch banners" },
            { status: 500 }
        );
    }
};

export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req) => {
    const token = cookies().get("token")?.value;
    try {
        const { searchParams } = new URL(req.url);
        const sort = searchParams.get("sort") || "created_at";
        const direction = searchParams.get("direction") || "desc";
        const status = searchParams.get("status");
        const q = searchParams.get("q") || "";
        const item_id = searchParams.get("itemId");
        const role = searchParams.get("role");
        const page = parseInt(searchParams.get("page") || "1");
        const per_page = parseInt(searchParams.get("per_page") || "6");

        const params = { item_id, per_page, page, sort, direction, q };
        
        if (role) params.role = role;
        if (status) params.status = status;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reports`, {
            params,
            headers: {
                Accept: "application/json",
                Authorization: `bearer ${token}`,
            },
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
    }
};

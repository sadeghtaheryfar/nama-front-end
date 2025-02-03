import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req) => {
    const token = cookies().get("token")?.value;
    try {
        const { searchParams } = new URL(req.url);
        const per_page = searchParams.get("per_page") || 100;
        const sort = searchParams.get("sort") || "created_at";
        const direction = searchParams.get("direction") || "desc";
        const status = searchParams.get("status");
        const q = searchParams.get("q") || "";

        const params = { per_page, sort, direction, q };
        if (status) params.status = status;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/requests`, {
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

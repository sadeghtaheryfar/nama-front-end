// route.js
export const revalidate = 0;
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

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
        const sub_type = searchParams.get("sub_type");
        const school_coach_type = searchParams.get("school_coach_type");
        const page = parseInt(searchParams.get("page") || "1");
        const per_page = parseInt(searchParams.get("per_page") || "10");
        const plan_id = parseInt(searchParams.get("plan_id") || undefined);
        const unit_id = parseInt(searchParams.get("unit_id") || undefined);
        const invoice = 1;

        const version = searchParams.get("version");
        const single_request = searchParams.get("single_request");
        const normal_request = searchParams.get("normal_request");
        const from_date = searchParams.get("from_date");
        const to_date = searchParams.get("to_date");

        const params = { item_id, per_page, page, sort, direction, q, invoice };

        if (role) params.role = role;
        if (status) params.status = status;
        if (plan_id) params.plan_id = plan_id;
        if (unit_id) params.unit_id = unit_id;
        if (sub_type) params.sub_type = sub_type;
        if (school_coach_type) params.school_coach_type = school_coach_type;

        if (version) params.version = version;
        if (single_request) params.single_request = single_request;
        if (normal_request) params.normal_request = normal_request;
        if (from_date) params.from_date = from_date;
        if (to_date) params.to_date = to_date;

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/requests`,
            {
                params,
                headers: {
                    Accept: "application/json",
                    Authorization: `bearer ${token}`,
                },
            }
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching data:", error);

        if (error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
            });
        } else if (error.request) {
            return NextResponse.json(
                { message: "پاسخی از سرور دریافت نشد." },
                { status: 502 }
            );
        } else {
            return NextResponse.json(
                { message: "مشکلی در ارسال درخواست وجود دارد." },
                { status: 500 }
            );
        }
    }
};

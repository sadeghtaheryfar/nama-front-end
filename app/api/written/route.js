import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async () => {
    const token = cookies().get("token")?.value;
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `bearer ${token}`);

    const formdata = new FormData();
    formdata.append("title", "test");
    formdata.append("body", "test body");
    formdata.append("letter", fileInput.files[0], "postman-cloud:///1eedbe6c-f260-4340-ae8f-95d38d7bdbf8");
    formdata.append("sign", fileInput.files[0], "postman-cloud:///1eedbe6c-f260-4340-ae8f-95d38d7bdbf8");
    formdata.append("reference_to", "executive_vice_president_mosques");

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/written-request`, {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
    }
};
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req, res) => {
  const data = await req.json();
  // const code = data.code;
  // const count = data.count;

  const access = cookies().get("access")?.value;

  // const body = {
  //   code,
  // };

  // if (count != null) {
  //   Object.assign(body, { count });
  // }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DB}cart`, data, {
      headers: {
        authorization: `bearer ${access}`,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error.response.data) {
      return NextResponse.json(
        {
          data: error.response.data,
        },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json(
      {
        message: "مشکلی در ارسال درخواست وجود دارد.",
      },
      { status: 500 }
    );
  }
};

"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Sabt3 = () => {
  const params = useSearchParams();
  const id = params.get("id");
  return (
    <>
      <div className="flex justify-center items-center min-h-svh px-6 overflow-y-hidden">
        <div className="flex flex-col justify-center items-center gap-7 lg:gap-8 relative z-40">
          <Image
            className="w-14 lg:w-20"
            alt="#"
            width={0}
            height={0}
            src={"/Images/masajed/darkhast/sabt/sabt3-4/tiksabt.svg"}
          />
          <h3 className="text-2xl font-medium text-[#327F7F] lg:text-[42px]">
            درخواست شما ثبت گردید
          </h3>
          <p className="text-base text-center px-4 lg:text-[22px]">
            درخواست شما با موفقیت انجام شد
          </p>
          <span className="text-base lg:text-lg">کد پیگیری : {id}</span>
          <div className="flex gap-5">
            <Link href={"/masajed/kartabl-darkhast"}>
            <button className="text-base text-white w-40 h-12 px-7 flex justify-center items-center bg-[#39A894] rounded-[10px] lg:w-44">
              صفحه درخواست
            </button>
            </Link>
            <Link href={"/"}>
            <button className="text-base text-[#39A894] w-40 h-12 px-7 flex justify-center items-center border border-[#39A894] rounded-[10px] lg:w-44">
              خانه
            </button>
            </Link>

          </div>
        </div>
      </div>
      <Image
        className="w-full fixed bottom-0 bg-white z-20"
        alt="#"
        width={0}
        height={0}
        src={"/Images/masajed/darkhast/sabt/sabt3-4/footerOK.svg"}
      />
    </>
  );
};

export default Sabt3;

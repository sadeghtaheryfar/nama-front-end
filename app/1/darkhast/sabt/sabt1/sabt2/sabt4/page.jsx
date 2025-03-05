"use client";
import Image from "next/image";
import Link from "next/link";

const Sabt4 = () => {
  return (
   
    <div className="container mx-auto flex items-center justify-center h-lvh lg:pb-32">
      <div className="px-6 flex flex-col mt-[89px] sm:px-10 md:flex-row-reverse">
        <div className="flex flex-col min-w-36 max-w-36 sm:min-w-44 sm:max-w-44 lg:min-w-56 lg:max-w-56 2xl:min-w-96 2xl:max-w-96 self-end md:self-start">
          <Image
            className="w-[61px] sm:w-20 lg:w-28 lg:translate-x-10 2xl:w-40"
            alt="#"
            width={0}
            height={0}
            src={"/Images/masajed/darkhast/sabt/sabt3-4/lamp1.svg"}
          />
          <Image
            className="w-[78px] self-end sm:w-24 lg:w-36 2xl:w-[200px]"
            alt="#"
            width={0}
            height={0}
            src={"/Images/masajed/darkhast/sabt/sabt3-4/lamp2.svg"}
          />
        </div>
        <div>
          <div className="w-full flex items-center justify-center">
            <Image
              className="w-14 xl:w-20"
              alt="#"
              width={0}
              height={0}
              src={"/Images/masajed/darkhast/sabt/sabt3-4/error.svg"}
            />
          </div>
          <h2 className="text-[26px] text-[#D32F2F] text-center mt-8 lg:text-3xl 2xl:text-[42px]">
            درخواست ناموفق
          </h2>
          <p className="text-base text-center my-[26px] xl:text-lg 2xl:-text-[22px]">
            درخواست شما نا موفق بود، لطفا به صفحه درخواست ها بازگشته و مجددا
            تلاش کنید
          </p>
          <h5 className="text-base text-center mb-8 xl:text-lg">کد پیگیری : ۶۲۵۲۶۷۲۷</h5>
          <div className="flex items-center justify-center gap-5 mb-14 sm:mb-6">
            <button className="text-base font-medium text-white flex justify-center items-center bg-[#39A894] rounded-[10px] w-full h-12 sm:w-[177px]">
              صفحه درخواست
            </button>
            <button className="text-base font-medium text-[#39A894] flex justify-center items-center border border-[#39A894] rounded-[10px] w-full h-12 sm:w-[177px]">
              خانه
            </button>
          </div>
         
        </div>
        <Image
            className="w-36 sm:w-44 md:self-end lg:w-72 lg:translate-y-10 xl:w-80 xl:translate-y-28 2xl:w-96 xl:-translate-x-14"
            alt="#"
            width={0}
            height={0}
            src={"/Images/masajed/darkhast/sabt/sabt3-4/lamp3.svg"}
          />
      </div>
    </div>
  );
};

export default Sabt4;

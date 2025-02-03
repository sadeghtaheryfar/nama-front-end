'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HeaderProfile from "../../../../../components/header-profile/page";

const HeaderTaeed = () => {

  const [show, setShow] = useState(false)
  return (
    <header className="container mx-auto">
      <div className="grid grid-cols-3 items-center md:grid-cols-8 2xl:grid-cols-9 pt-10">
        <div className="flex items-end gap-3 leading-5 col-span-2 md:col-span-3 md:items-center lg:items-start 2xl:col-span-5 lg:translate-y-9 xl:translate-y-7 lg:gap-6 xl:gap-10">
          <Image
            className="w-10 md:w-16 lg:w-24 xl:w-32"
            alt="#"
            width={0}
            height={0}
            src={"/Images/masajed/mosque.svg"}
          />
          <span className="text-[#D5B260] text-lg font-semibold flex items-center gap-1 md:text-2xl lg:text-3xl lg:pt-3 xl:text-4xl">
            مساجد
            <span className="text-xs lg:text-base xl:text-xl 2xl:text-2xl">/ کارتابل درخواست ها  <span className="hidden 2xl:inline w-min-fit"> / مشاهده درخواست</span></span>
          </span>
        </div>
        <div className="flex gap-3 justify-self-end md:col-start-8 lg:gap-4 xl:gap-6 2xl:col-start-9">
          <Image
            className="w-10 lg:w-12 xl:w-16 bg-[#1A6140] rounded-full p-2 lg:p-3 xl:p-5"
            alt="#"
            width={0}
            height={0}
            src={"/Images/home/header/notification.svg"}
          />
          <Image
            className="w-10 lg:w-12 xl:w-16 bg-[#1A6140] rounded-full p-2 lg:p-3 xl:p-5"
            alt="#"
            width={0}
            height={0}
            src={"/Images/home/header/menu.svg"}
          />
        </div>
        <div className="bg-[#1A6140] flex items-center min-w-fit justify-evenly gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 2xl:col-start-6 2xl:col-span-3 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4">
          <HeaderProfile bgRole='#3A785B'  />
        </div>
      </div>
    </header>
  );
};

export default HeaderTaeed;

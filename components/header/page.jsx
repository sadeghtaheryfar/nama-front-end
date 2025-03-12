import Image from "next/image";
import { useEffect } from "react";
import HeaderProfile from "../header-profile/page";
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const goBack = (e) => {
    if(e) router.back(); else router.push('/');
  };

  return (
    <header>
      <div className="grid grid-cols-2 items-center md:grid-cols-8 pt-10">
        <Image
          className="w-40 lg:w-80 md:col-span-2"
          alt="#"
          width={0}
          height={0}
          src={"/Images/home/header/setad.svg"}
        />
        <div className="flex gap-3 justify-self-end md:col-start-8 lg:gap-4 xl:gap-6">
          <Image
            className="w-10 lg:w-12 xl:w-16 bg-[#1A4162] rounded-full p-2 lg:p-3 xl:p-5 cursor-pointer"
            alt="#"
            width={0}
            height={0}
            src={"/Images/home/header/notification.svg"}
            onClick={() => goBack()}
          />
          <Image
            className="w-10 lg:w-12 xl:w-16 bg-[#1A4162] rounded-full p-2 lg:p-3 xl:p-5 cursor-pointer"
            alt="#"
            width={0}
            height={0}
            src={"/Images/home/header/menu.svg"}
            onClick={() => goBack(true)}
          />
        </div>
        
        <div className={`bg-[#1A4162] flex items-center justify-evenly gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4`}>
          <HeaderProfile bgRole='#3A5C78'  />
        </div>
      </div>
    </header>
  );
};

export default Header;

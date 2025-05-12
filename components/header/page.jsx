import Image from "next/image";
import { useEffect } from "react";
import HeaderProfile from "../header-profile/page";
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const goBack = (e) => {
    if(e)
    {
      const newPath = pathname.split('/').slice(0, -1).join('/') || '/';
      router.push(newPath);
      // router.back();
    }else{
      router.push('/');
    }
  };

  return (
    <header>
      <div className="flex justify-between items-center  pt-10">
        <Image
          className="w-40 lg:w-80 md:col-span-2"
          alt="#"
          width={0}
          height={0}
          src={"/Images/home/header/setad.svg"}
        />
        
        <div className="flex justify-center items-center flex-row-reverse">
          <div className="flex justify-self-start md:col-start-8 lg:gap-4 xl:gap-6">
            <a href="https://armaniran.app/dashboard#">
              <img
                className="w-10 lg:w-12 xl:w-16 cursor-pointer"
                alt="#"
                width={0}
                height={0}
                src={"/assets/logo-arman.png"}
              />
            </a>
          </div>
          
          <div className={`bg-[#1A4162] hidden lg:flex items-center justify-between gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4`}>
            <HeaderProfile bgRole='#3A5C78' />
          </div>
        </div>
      </div>

      <div className={`bg-[#1A4162] lg:hidden flex items-center justify-between gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4`}>
        <HeaderProfile bgRole='#3A5C78' />
      </div>
    </header>
  );
};

export default Header;

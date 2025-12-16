"use client";
import Image from "next/image";
import tik from "./../../../../public/assets/tik.svg";
import close from "./../../../../public/assets/close.png";

import mosque from "./../../../../public/assets/mosque.png";
import man from "./../../../../public/assets/man.png";
import menu from "./../../../../public/assets/menu.svg";
import notif from "./../../../../public/assets/notif.svg";
import HeaderProfile from "./../../../../components/header-profile-admin/page";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import GardeshJariRole from "./../../../../components/masajed/kartabl-darkhast/jari/gardesh-jari/gardesh-jari-role";
import MainGozareshJariRole from "./../../../../components/masajed/kartabl-darkhast/jari/main-gardesh-jari-role/main-gozaresh-jari-role";

export default function Accept() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [item_id, setItem_id] = useState();
  const [itemId, setitemId] = useState();
  const [role, setRole] = useState();
  const roleParam = searchParams.get("role");
  const itemIdParam = searchParams.get("item_id");
  const [header, setHeader] = useState(null);
  const [loadingHeader, setLoadingHeader] = useState(true);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const itemIdParam = searchParams.get("item_id");
    setRole(roleParam);
    setItem_id(itemIdParam);
    setitemId(itemIdParam);

    if (!roleParam && !itemIdParam) return;

    const validRoles = [
      "mosque_head_coach",
      "mosque_cultural_officer",
      "area_interface",
      "executive_vice_president_mosques",
      "deputy_for_planning_and_programming"
    ];

    const validItemIds = ["1", "2", "3", "4","8","9","10","11","12","13","14","15"];

    if (!validRoles.includes(roleParam) || !validItemIds.includes(itemIdParam)) {
      router.push("/");
    }
  }, [router, searchParams]);
  

  useEffect(() => {
    if (!item_id) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${item_id}&role=mosque_head_coach`);
        if (response.data) {
          setHeader(response.data);
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingHeader(false);
      }
    };
    fetching();
  }, [item_id]);

  const [requestData, setRequsestData] = useState("");

  useEffect(() => {
    if (!item_id && !role) return;

    const fetching = async () => {
      try {
        const id = searchParams.get("id");
        const response = await axios.get(`/api/report/show?id=${id}&item_id=${item_id}&role=${role}`);
        
        if (response.data) {
          setRequsestData(response);
        }
      } catch (error) {
        console.log("خطا", error);
      } finally {
      }
    };
    fetching();
  }, [item_id,role]);

  const pathname = usePathname();
  const goBack = (e) => {
    const query = router.query;
    const searchParams = new URLSearchParams(window.location.search);
    const queryString = searchParams.toString();
    
    if(e) {
      const newPath = pathname.split('/').slice(0, -1).join('/') || '/';
      if (queryString) {
        router.push(`${newPath}?${queryString}`);
      } else {
        router.push(newPath);
      }
    } else {
      router.push('/');
    }
  };

  const lightenColor = (color, percent) => {
    const hex = color.startsWith('#') ? color.substring(1) : color;
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
    g = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
    b = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
    const newHex = 
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0');
    
    return `#${newHex}`;
  };
  
  
  return (
    <>
      <div className=" h-screen relative">
         <div className="bg-[#002a4fd5] vector-nama2 h-[15rem] lg:h-[20rem] bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854] relative overflow-hidden" style={{ backgroundColor :  (requestData?.data?.data?.request?.golden && '#878108') }}>
          <div className="absolute top-[9rem] lg:top-[11rem] w-full">
            <img className="w-full opacity-20" src="/assets/Vector.png" alt="" />
          </div>
          <div className="flex justify-between items-center px-6 py-2 md:px-12">
            <div className="flex items-center">
              <img
                src={header?.data?.logo || '/Images/masajed/mosque.svg'}
                className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
              />
              <div className="text-[#D5B260] text-[12px] md:text-[18px] font-bold md:text-3xl md:my-6 my-3 mx-4">
              {header?.data?.title} / کارتابل گزارش ها
              </div>
            </div>
            <div className="flex">
              <div className="rounded-full hidden bg-[#43637E] text-white md:flex items-center p-3" style={{ backgroundColor :  (requestData?.data?.data?.request?.golden && lightenColor('#878108',15)) }}>
                <HeaderProfile bgRole={requestData?.data?.data?.request?.golden ? lightenColor('#878108',30) : '#3A5C78'}  />
              </div>
              <div className="flex">
                <Image
                  className="cursor-pointer w-[36px] md:w-[69px] md:mx-4 mx-2 hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                  alt=""
                  src={menu}
                  onClick={() => goBack()}
                />
                <Image
                  className="cursor-pointer w-[36px] md:w-[69px] hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                  src={notif}
                  alt=""
                  onClick={() => goBack(true)}
                />
              </div>
            </div>
          </div>
          <div className="rounded-full bg-[#43637E] text-[10px] text-white flex md:hidden items-center mx-6 p-3" style={{ backgroundColor :  (requestData?.data?.data?.request?.golden && lightenColor('#878108',15)) }} >
              <HeaderProfile bgRole={requestData?.data?.data?.request?.golden ? lightenColor('#878108',30) : '#3A5C78'}  />
          </div>
        </div>

        <div className="vector-nama md:px-5 mt-[-2.8rem] lg:mt-[-4.5rem]">
          <div className=" p-6 scroll-kon ">
            <div className="bg-white drop-shadow-3xl rounded-[20px] mb-5 p-3 md:p-6 -mt-[80px] md:-mt-[110px] z-30">
              <GardeshJariRole data={requestData}/>
            </div>

            <MainGozareshJariRole data={requestData?.data} back_steps={requestData?.data?.back_steps}/>
          </div>
        </div>
      </div>
    </>
  );
}

'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderProfile from "../../../../components/header-profile/page";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from 'next/navigation';

const HeaderKartablDarkhast = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const [header, setHeader] = useState(null);
  const [loadingHeader, setLoadingHeader] = useState(true);

  useEffect(() => {
    if (!pathname) return;
    const pathSegments = pathname.split("/");
    const itemId = pathSegments[1];

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${itemId}&role=mosque_head_coach`);
        if (response.data) {
          setHeader(response.data);

          fetch("/Images/masajed/header-desktop-msj.svg")
            .then(response => response.text())
            .then(svgText => {
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
              
              const rectElements = svgDoc.querySelectorAll("rect");
              rectElements.forEach(rect => {
                rect.setAttribute("fill", response?.data?.data?.color);
              })
              
              const serializer = new XMLSerializer();
              const modifiedSvgText = serializer.serializeToString(svgDoc);
              
              const svgBlob = new Blob([modifiedSvgText], { type: "image/svg+xml" });
              const svgUrl = URL.createObjectURL(svgBlob);
              
              const headerElement = document.querySelector(".lg\\:bg-header-masjed-desktop");
              if (headerElement) {
                headerElement.style.backgroundImage = `url(${svgUrl})`;
              }
            })
            .catch(error => {
              console.error("خطا در بارگذاری یا پردازش SVG:", error);
            });
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingHeader(false);
      }
    };
    fetching();
  }, []);
  
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

  const [lighterColor, setLighterColor] = useState();
  const [solighterColor, setSoLighterColor] = useState();
  useEffect(() => {
    if(!header?.data?.color) return
    setLighterColor(lightenColor(header?.data?.color, 15));
    setSoLighterColor(lightenColor(header?.data?.color, 30));
  }, [header?.data?.color])

  const router = useRouter();

  const goBack = (e) => {
    if(e) router.back(); else router.push('/');
  };

  return (
    <header className="container mx-auto">
      <div className="grid grid-cols-3 items-center md:grid-cols-8 pt-10">
        <div className="flex items-end gap-3 leading-5 col-span-2 md:col-span-3 md:items-center lg:items-start xl:col-span-3 lg:translate-y-9 xl:translate-y-7 lg:gap-6 xl:gap-10 2xl:gap-12">
          <Image
            className="w-10 md:w-16 lg:w-24 xl:w-32"
            alt="#"
            width={0}
            height={0}
            src={header?.data?.logo || '/Images/masajed/mosque.svg'}
          />
          <span className="text-[#D5B260] text-lg font-semibold flex items-center gap-1 md:text-2xl lg:text-3xl lg:pt-3 xl:text-4xl">
            {header?.data?.title}
            <span className="text-xs lg:text-base xl:text-xl 2xl:text-2xl">/ کارتابل درخواست ها</span>
          </span>
        </div>
        <div className="flex gap-3 justify-self-end md:col-start-8 lg:gap-4 xl:gap-6">
          <Image
            onClick={() => goBack()}
            className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full"
            alt="#"
            width={0}
            height={0}
            src={"/Images/home/header/notification.svg"}
            style={{backgroundColor : lighterColor}}
          />
          <Image
            onClick={() => goBack(true)}
            className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full"
            alt="#"
            width={0}
            height={0}
            src={"/Images/home/header/menu.svg"}
            style={{backgroundColor : lighterColor}}
          />
        </div>
        <div style={{backgroundColor : lighterColor}} className="flex items-center min-w-fit justify-evenly gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 xl:col-start-4 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4">
          <HeaderProfile bgRole={solighterColor}  />
        </div>
      </div>
    </header>
  );
};

export default HeaderKartablDarkhast;

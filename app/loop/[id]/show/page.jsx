"use client";
import HeaderMasjed from "./../../../../components/header-profile-loop/page";
import DataLoop from "./../../../../components/loop/data-loop";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from 'next/navigation';

const Masajed = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const [header, setHeader] = useState(null);
  const [loadingHeader, setLoadingHeader] = useState(true);

  useEffect(() => {
    if (!pathname) return;
    const pathSegments = pathname.split("/");
    const itemId = 2;

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
  }, [header?.data?.color]);
  

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
    <>
      <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <header className="container mx-auto">
          <div className="grid grid-cols-3 items-center md:grid-cols-8 pt-10">
            <div className="flex items-end gap-3 leading-5 col-span-2 md:col-span-3 md:items-start md:translate-y-5 lg:translate-y-9 xl:translate-y-5 lg:gap-6 xl:gap-10 2xl:gap-12">
              <img
                className="w-10 md:w-16 lg:w-24 xl:w-32"
                alt="#"
                width={0}
                height={0}
                src={header?.data?.logo || '/Images/masajed/mosque.svg'}
              />
              <span className="text-[#D5B260] text-lg font-semibold flex items-center gap-1 md:text-2xl lg:text-3xl lg:pt-3 xl:text-4xl">
                افزودن حلقه
                <span className="text-xs md:text-sm lg:text-base xl:text-xl 2xl:text-2xl"> / مشاهده حلقه   </span>
              </span>
            </div>
            <div className="flex gap-3 justify-self-end md:col-start-8 lg:gap-4 xl:gap-6">
              <img
                onClick={() => goBack()}
                className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                alt="#"
                width={0}
                height={0}
                src={"/Images/home/header/notification.svg"}
              />
              <img
                onClick={() => goBack(true)}
                className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                alt="#"
                width={0}
                height={0}
                src={"/Images/home/header/menu.svg"}
              />
            </div>
            <div className="flex items-center justify-evenly gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4 relative z-[12]">
              <HeaderMasjed  />
            </div>
          </div>
        </header>

        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
          <div className="flex justify-between items-start lg:items-center flex-col lg:flex-row border-b border-[#DFDFDF] pb-[1rem]">
            <h3 className="text-[20px] font-semibold text-right">مدرسه: حلقه شماره ۴</h3>

            <div className="flex justify-center items-center gap-2">
              <Link href={'/loop/1/show'} className="py-[0.5rem] px-[0.75rem] text-[#0068B2] font-semibold lg:px-[1rem] rounded-[0.5rem] shadow-lg flex justify-center items-center gap-2 text-[10px] lg:text-[14px]">
                <span className="hidden lg:block">ویرایش حلقه</span>

                <span className="lg:hidden">ویرایش</span>

                <svg className="w-[18px] lg:w-[24px] h-[18px] lg:h-[24px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#0068B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.0399 3.01999L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.95999C22.3399 6.59999 22.9799 5.01999 20.9799 3.01999C18.9799 1.01999 17.3999 1.65999 16.0399 3.01999Z" stroke="#0068B2" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.9102 4.14999C15.5802 6.53999 17.4502 8.40999 19.8502 9.08999" stroke="#0068B2" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Link>

              <Link href={'/loop/1/show'} className="py-[0.5rem] text-[#FE7B7A] font-semibold px-[0.75rem] lg:px-[1rem] rounded-[0.5rem] shadow-lg flex justify-center items-center gap-2 text-[10px] lg:text-[14px]">
                <span className="hidden lg:block">حذف حلقه</span>

                <span className="lg:hidden">حذف</span>

                <svg className="w-[18px] lg:w-[24px] h-[18px] lg:h-[24px]" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.625 6.72749C19.8788 6.35624 16.11 6.16499 12.3525 6.16499C10.125 6.16499 7.8975 6.27749 5.67 6.50249L3.375 6.72749" stroke="#FE7B7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.5625 5.59125L9.81 4.1175C9.99 3.04875 10.125 2.25 12.0262 2.25H14.9738C16.875 2.25 17.0212 3.09375 17.19 4.12875L17.4375 5.59125" stroke="#FE7B7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21.2064 10.2825L20.4752 21.6112C20.3514 23.3775 20.2502 24.75 17.1114 24.75H9.88895C6.7502 24.75 6.64895 23.3775 6.5252 21.6112L5.79395 10.2825" stroke="#FE7B7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.6211 18.5625H15.3673" stroke="#FE7B7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.6875 14.0625H16.3125" stroke="#FE7B7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Link>

              <Link href={'/loop/1/show'} className="py-[0.5rem] text-[#0068B2] font-semibold px-[0.75rem] lg:px-[1rem] rounded-[0.5rem] shadow-lg flex justify-center items-center gap-2 text-[10px] lg:text-[14px]">
                <span className="hidden lg:block">خروجی اکسل حلقه </span>

                <span className="lg:hidden">اکسل</span>

                <svg className="w-[18px] lg:w-[24px] h-[18px] lg:h-[24px]" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.6563 16.864C19.0722 16.5388 19.5299 16.285 20.0432 16.1615C20.2778 16.1048 20.3537 16.0153 20.3537 15.7683C20.3469 13.1463 20.348 10.5243 20.3594 7.90116C20.3639 6.92329 20.0908 6.06326 19.3883 5.36187C17.9209 3.89563 16.4547 2.42713 14.9862 0.963152C14.3256 0.304818 13.5267 -0.00225376 12.5908 1.24497e-05C9.43849 0.0090773 6.28619 -0.00225404 3.13502 0.00681081C1.44896 0.0113432 0.0167117 1.45039 0.00424749 3.13531C-0.00255115 3.99421 0.00198252 4.85311 0.00198252 5.712C0.00198252 11.1011 -0.00594839 16.489 0.00991509 21.878C0.0133144 23.0179 0.569668 23.8904 1.51355 24.5159C2.43816 25.1289 3.47835 24.9861 4.52081 24.9839C4.35538 24.4547 4.30892 23.9448 4.47889 23.4349C4.53214 23.2751 4.44489 23.2627 4.32365 23.2638C3.98372 23.2672 3.64379 23.2683 3.30385 23.2638C2.90613 23.2593 2.54241 23.1584 2.2342 22.8876C1.81835 22.5228 1.74357 22.0491 1.7447 21.529C1.75376 19.3591 1.74923 17.1881 1.74923 15.0182C1.74923 11.1113 1.7583 7.2043 1.7413 3.29735C1.7379 2.49965 2.33845 1.73933 3.2472 1.745C5.95532 1.76086 8.66457 1.75293 11.3727 1.74613C11.5744 1.74613 11.6254 1.80845 11.6231 2.00334C11.6129 2.91889 11.6129 3.83444 11.6197 4.74999C11.6231 5.23836 11.5665 5.73353 11.7024 6.21057C12.1727 7.8547 13.3092 8.7136 15.0224 8.72493C16.0887 8.73173 17.1549 8.7306 18.2212 8.7272C18.6574 8.72606 18.5894 8.71813 18.5906 9.08639C18.594 11.5781 18.5917 14.0687 18.5951 16.5604C18.5963 16.6533 18.5521 16.7632 18.6563 16.864ZM18.0093 6.97428C16.9725 6.97768 15.9357 6.97655 14.8989 6.97541C13.9981 6.97428 13.3749 6.34994 13.3726 5.44685C13.3704 4.29675 13.3726 3.14665 13.3726 1.97842C13.5528 1.99655 13.6661 2.10533 13.7749 2.21297C15.2366 3.67015 16.6949 5.12959 18.1543 6.58903C18.2529 6.68761 18.3322 6.80091 18.3844 6.94029C18.2495 7.00034 18.1271 6.97428 18.0093 6.97428Z" fill="#0068B2"/>
                <path d="M22.8819 20.3948C22.3403 20.2939 21.7896 20.3551 21.2435 20.3438C20.7506 20.3336 20.3619 20.0832 20.3653 19.7636C20.3698 19.4532 20.7302 19.2095 21.2242 19.1948C21.5641 19.1857 21.9041 19.1914 22.244 19.1914C22.8479 19.1914 23.4519 19.1982 24.0558 19.1891C24.636 19.1801 25.0008 18.8175 24.9895 18.2815C24.9793 17.783 24.6043 17.451 24.0468 17.4498C23.5652 17.4487 23.0836 17.4498 22.465 17.4498C21.9539 17.4849 21.3013 17.3898 20.6542 17.5031C19.6843 17.673 18.8356 18.4481 18.6611 19.3251C18.405 20.618 19.3387 21.8463 20.7177 22.0468C21.2922 22.1307 21.8667 22.0774 22.4412 22.099C22.8547 22.1148 23.2275 22.3675 23.2423 22.6417C23.2593 22.9567 22.9488 23.2105 22.4785 23.2434C21.7715 23.2921 21.0633 23.2615 20.3562 23.2604C20.0356 23.2604 19.7138 23.2445 19.3954 23.2717C18.9421 23.3091 18.5875 23.7182 18.5999 24.1499C18.6124 24.5997 18.9954 24.9906 19.4622 24.9952C20.4718 25.0042 21.4814 24.9986 22.4921 24.994C22.8649 24.9929 23.2207 24.9 23.5607 24.7527C24.8286 24.2054 25.3612 22.8207 24.7334 21.6616C24.3357 20.9285 23.6808 20.5443 22.8819 20.3948Z" fill="#0068B2"/>
                <path d="M12.0266 18.8492C12.1807 18.6611 12.2396 18.4311 12.1954 18.1841C12.132 17.8272 11.9314 17.5813 11.579 17.4838C11.2051 17.3796 10.8878 17.4884 10.6453 17.7898C10.1536 18.3994 9.66065 19.0067 9.18475 19.6288C9.03858 19.8203 8.9706 19.7852 8.84256 19.6209C8.36779 19.0101 7.88508 18.4062 7.39785 17.8068C7.06131 17.3921 6.54008 17.3286 6.14236 17.6391C5.75371 17.9428 5.70612 18.4719 6.04038 18.8957C6.59561 19.5982 7.14743 20.3053 7.72191 20.9931C7.88168 21.1846 7.85562 21.2899 7.71285 21.4633C7.14969 22.1477 6.59901 22.8423 6.05172 23.5392C5.70952 23.9743 5.74804 24.4898 6.1299 24.7969C6.53782 25.1244 7.06358 25.0496 7.42391 24.6054C7.89868 24.0196 8.37572 23.4338 8.83462 22.8355C8.98646 22.6384 9.06351 22.6667 9.20175 22.8434C9.66972 23.4474 10.1536 24.0389 10.6295 24.6371C10.8108 24.8649 11.0385 24.9941 11.3331 24.9929C11.7728 24.9941 12.1048 24.7131 12.1909 24.2848C12.2657 23.9165 12.0787 23.6525 11.868 23.3907C11.3309 22.7222 10.7972 22.0491 10.2589 21.3817C10.166 21.2662 10.1241 21.1721 10.2431 21.0429C10.8799 20.3449 11.4306 19.579 12.0266 18.8492Z" fill="#0068B2"/>
                <path d="M17.1064 23.2547C16.3426 23.2502 15.5789 23.2525 14.8164 23.2672C14.669 23.2706 14.6011 23.2094 14.5705 23.0961C14.5421 22.9884 14.5399 22.8729 14.5399 22.7607C14.5376 21.3273 14.5387 19.8939 14.5387 18.4605C14.5387 18.1909 14.498 17.9359 14.3065 17.7274C14.0696 17.4691 13.707 17.3796 13.375 17.4974C13.0057 17.6288 12.7915 17.9223 12.7892 18.3393C12.7836 19.1314 12.787 19.9234 12.7881 20.7154C12.7881 21.461 12.7802 22.2055 12.7904 22.951C12.8051 24.0977 13.6719 24.9748 14.8141 24.9929C15.5869 25.0054 16.3608 24.9952 17.1347 24.9974C17.3194 24.9974 17.4893 24.9521 17.6412 24.8479C17.9505 24.636 18.0944 24.2541 17.9981 23.9051C17.8882 23.5119 17.5539 23.257 17.1064 23.2547Z" fill="#0068B2"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-start flex-col lg:flex-row gap-[2rem] mt-[1rem]">
            <div className="w-[6rem] min-w-[6rem] h-[6rem] overflow-hidden rounded-[0.5rem] mx-auto lg:mx-0">
              <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
            </div>

            <div className="w-full flex flex-wrap gap-[2rem]">
              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">مشخصات مربی حلقه:</p>

                <p>علی عسگری</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">کد ملی:</p>

                <p>۰۰۲۱۲۳۴۵۶۷</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">تاریخ تولد:</p>

                <p>۱۳۷۰/۰۴/۱۲</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">کد پستی:</p>

                <p>۱۹۷۶۶۵۴۳۶۵۷</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">آدرس:</p>

                <p>تهران، جماران، خیابان دهم، خیابان یاس، بن بست مریم، پلاک ۱۱۲، زنگ ۵، طبقه ۱۲</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">شماره تماس:</p>

                <p>۰۹۱۲۳۴۵۶۷۸۹</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">میزان تحصیلات:</p>

                <p>لیسانس</p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-[2rem] mt-[2rem]">
              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">رشته تحصیلی:</p>

                <p>معماری</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">شغل:</p>

                <p>معمار</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">شماره شبا به نام مربی:</p>

                <p>IR100034000212386347167</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">حوزه مهارتی:</p>

                <p>آموزشی، مهارت افزایی، هنری</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">حوزه عملکردی حلقه:</p>

                <p>آموزشی، پرورشی</p>
              </div>

              <div className="text-[14px] flex flex-col gap-2 font-semibold">
                <p className="text-[#3B3B3B]">توضیحات تکمیلی (دستاوردها، گواهی های اخذ شده و ...):</p>

                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.</p>
              </div>
            </div>
        </div>

        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 container mx-auto md:p-9 xl:px-12">
          <div className="flex justify-center items-start gap-[2rem] mt-[1rem] flex-col lg:flex-row">
            <div className="w-[6rem] min-w-[6rem] h-[6rem] overflow-hidden rounded-[0.5rem] mx-auto lg:mx-0">
              <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
            </div>

            <div className="w-full flex flex-wrap gap-[2rem]">
              <div className="text-[18px] text-[#0068B2] font-semibold">
                <p>شماره ۱</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">مشخصات عضو حلقه:</p>

                <p>علی عسگری</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">کد ملی:</p>

                <p>۰۰۲۱۲۳۴۵۶۷</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">تاریخ تولد:</p>

                <p>۱۳۷۰/۰۴/۱۲</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">کد پستی:</p>

                <p>۱۹۷۶۶۵۴۳۶۵۷</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">آدرس:</p>

                <p>تهران، جماران، خیابان دهم، خیابان یاس، بن بست مریم، پلاک ۱۱۲، زنگ ۵، طبقه ۱۲</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">شماره تماس:</p>

                <p>۰۹۱۲۳۴۵۶۷۸۹</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">نام پدر:</p>

                <p>رضا</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 container mx-auto md:p-9 xl:px-12">
          <div className="flex justify-center items-start gap-[2rem] mt-[1rem] flex-col lg:flex-row">
            <div className="w-[6rem] min-w-[6rem] h-[6rem] overflow-hidden rounded-[0.5rem] mx-auto lg:mx-0">
              <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
            </div>

            <div className="w-full flex flex-wrap gap-[2rem]">
              <div className="text-[18px] text-[#0068B2] font-semibold">
                <p>شماره ۱</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">مشخصات عضو حلقه:</p>

                <p>علی عسگری</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">کد ملی:</p>

                <p>۰۰۲۱۲۳۴۵۶۷</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">تاریخ تولد:</p>

                <p>۱۳۷۰/۰۴/۱۲</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">کد پستی:</p>

                <p>۱۹۷۶۶۵۴۳۶۵۷</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">آدرس:</p>

                <p>تهران، جماران، خیابان دهم، خیابان یاس، بن بست مریم، پلاک ۱۱۲، زنگ ۵، طبقه ۱۲</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">شماره تماس:</p>

                <p>۰۹۱۲۳۴۵۶۷۸۹</p>
              </div>

              <div className="text-[14px] flex gap-2 font-semibold">
                <p className="text-[#3B3B3B]">نام پدر:</p>

                <p>رضا</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Masajed;

"use client";

import Image from "next/image";
import ButtonMoshahede from "../button-moshahede/button-moshahede";
import Link from "next/link";
import HeaderMasjed from "../header-masjed/header-masjed";
import axios from "axios";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { usePathname } from "next/navigation";

const MainMasajed = () => {
  const [banners, setBanners] = useState(null);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await axios.get(`/api/banners?item_id=${itemId}`);
        if (response.data) {
          setBanners(response.data);
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingBanners(false);
      }
    };
    fetching();
  }, []);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [permition, setpPermition] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/profile?item_id=${itemId}`);
        if (response.data) {
          setProfile(response.data);
        }
        const hasHeadCoachRole = response.data?.data?.roles?.some(
          role => role.role_en === "mosque_head_coach"
        );

        if (!hasHeadCoachRole) {
          if (pathname !== "/2" || pathname !== "/3" || pathname !== "/4") {
            setpPermition(false);
          }
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetching();
  }, []);

  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/info?item_id=${itemId}&role=mosque_head_coach`);
        if (response.data) {
          setInfo(response.data);
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingInfo(false);
      }
    };
    fetching();
  }, []);

  return (
    <>
      <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <HeaderMasjed />
        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
          <Swiper
            navigation={true}
            pagination={{
              clickable: true,
              enabled: false,
            }}
            loop={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="swiper-masajed relative"
            breakpoints={{
              1024: {
                pagination: {
                  enabled: true,
                },
              },
            }}
          >
            {banners &&
              banners?.data?.map((banner) => (
                <SwiperSlide
                  key={banner?.id}
                  className="!flex !items-center rounded-xl !overflow-hidden"
                >
                  <img
                      className="w-full rounded-xl aspect-[16/5] object-cover hidden lg:block"
                      src={banner?.image}
                      alt={banner?.title}
                    />
                    
                    <img
                      className="w-full rounded-xl aspect-[16/14] object-cover block lg:hidden"
                      src={banner?.mobile_image}
                      alt={banner?.title}
                    />
                </SwiperSlide>
              ))}

            {loadingBanners && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-10">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </Swiper>

          {permition ? (
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:mt-9 lg:mt-11 xl:mt-12 gap-6 md:gap-7 lg:gap-9 2xl:gap-12">
              {/* کارت درخواست‌های فعال */}
              <div className="flex flex-col justify-end gap-5 border rounded-xl p-6 group hover:border-[#39A894] transition-all duration-200">
                <div className="flex justify-between">
                  <Image
                    className="w-16 pb-4"
                    alt="#"
                    width={0}
                    height={0}
                    src={"/Images/masajed/cart/tik.svg"}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#25C7AA] rounded-sm"></div>
                      <span className="text-base">{info?.plans}</span>
                      <span className="text-xs text-[#808393]">درخواست های فعال</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-base font-bold group-hover:text-[#39A894] mt-auto">درخواست های فعال</h2>
                <p className="text-xs font-medium text-slate-400 leading-6">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
                  گرافیک است.
                </p>
                <Link href={`/${itemId}/darkhast`}>
                  <ButtonMoshahede />
                </Link>
              </div>

              {/* کارت کارتابل درخواست‌ها */}
              <div className="flex flex-col gap-5 border rounded-xl p-6 group hover:border-[#39A894] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <Image
                    className="w-16"
                    alt="#"
                    width={0}
                    height={0}
                    src={"/Images/masajed/cart/Bill.svg"}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#25C7AA] rounded-sm"></div>
                      <span className="text-base">{info?.requests?.done ?? "0"}</span>
                      <span className="text-xs text-[#808393]">تایید شده</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#D32F2F] rounded-sm"></div>
                      <span className="text-base">{info?.requests?.rejected ?? "0"}</span>
                      <span className="text-xs text-[#808393]"> رد شده</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#258CC7] rounded-sm"></div>
                      <span className="text-base">{info?.requests?.in_progress ?? "0"}</span>
                      <span className="text-xs text-[#808393]"> جاری</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#FFD140] rounded-sm"></div>
                      <span className="text-base">{info?.requests?.action_needed ?? "0"}</span>
                      <span className="text-xs text-[#808393]">نیازمند اصلاح</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-base font-bold group-hover:text-[#39A894] mt-auto">کارتابل درخواست ها</h2>
                <p className="text-xs font-medium text-slate-400 leading-6">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
                  گرافیک است.
                </p>
                <Link href={`/${itemId}/kartabl-darkhast`}>
                  <ButtonMoshahede />
                </Link>
              </div>

              {/* کارت کارتابل گزارش‌ها */}
              <div className="flex flex-col gap-5 border rounded-xl p-6 group hover:border-[#39A894] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <Image
                    className="w-16"
                    alt="#"
                    width={0}
                    height={0}
                    src={"/Images/masajed/cart/Growth.svg"}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#25C7AA] rounded-sm"></div>
                      <span className="text-base">{info?.reports?.done ?? "0"}</span>
                      <span className="text-xs text-[#808393]">تایید شده</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#D32F2F] rounded-sm"></div>
                      <span className="text-base">{info?.reports?.rejected ?? "0"}</span>
                      <span className="text-xs text-[#808393]"> رد شده</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#e22afc] rounded-sm"></div>
                      <span className="text-base">{info?.reports?.pending ?? "0"}</span>
                      <span className="text-xs text-[#808393]">باز</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#258CC7] rounded-sm"></div>
                      <span className="text-base">{info?.reports?.in_progress ?? "0"}</span>
                      <span className="text-xs text-[#808393]">جاری</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-[#FFD140] rounded-sm"></div>
                      <span className="text-base">{info?.reports?.action_needed ?? "0"}</span>
                      <span className="text-xs text-[#808393]">نیازمند اصلاح</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-base font-bold group-hover:text-[#39A894] mt-auto">کارتابل گزارش ها</h2>
                <p className="text-xs font-medium text-slate-400 leading-6">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
                  گرافیک است.
                </p>
                <Link href={`/${itemId}/kartabl-gozaresh`}>
                  <ButtonMoshahede />
                </Link>
              </div>

              {/* کارت درخواست‌های مکتوب */}
              <div className="flex flex-col justify-end gap-5 border rounded-xl p-6 group hover:border-[#39A894] transition-all duration-200 lg:col-span-1">
                <Image
                  className="w-16 pb-4"
                  alt="#"
                  width={0}
                  height={0}
                  src={"/Images/masajed/cart/Sign.svg"}
                />
                <h2 className="text-base font-bold group-hover:text-[#39A894] mt-auto">درخواست های مکتوب</h2>
                <p className="text-xs font-medium text-slate-400 leading-6">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
                  گرافیک است.
                </p>
                <Link href={`/${itemId}/maktob`}>
                  <ButtonMoshahede />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-[24px] font-semibold text-center mt-8">
              <p>شما دسترسی به این قسمت را ندارید .</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainMasajed;

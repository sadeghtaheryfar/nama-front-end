"use client";
import Image from "next/image";
import ax from "./../../public/assets/Bill.png";
import axmasjed from "./../../public/assets/Mask.png";
import Financial from "./../../public/assets/Financial.png";
import HeaderProfile from "./../../components/header-profile-admin/page";
import Link from "next/link";
import menu from "./../../public/assets/menu.svg";
import notif from "./../../public/assets/notif.svg";
import man from "./../../public/assets/man.png";
import mosque from "./../../public/assets/mosque.png";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Role() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [item_id, setItem_id] = useState();
  const [role, setRole] = useState();
  const roleParam = searchParams.get("role");
  const itemIdParam = searchParams.get("item_id");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const itemIdParam = searchParams.get("item_id");
    setRole(roleParam);
    setItem_id(itemIdParam);

    if (!roleParam && !itemIdParam) return;

    const validRoles = [
      "mosque_head_coach",
      "mosque_cultural_officer",
      "area_interface",
      "executive_vice_president_mosques",
      "deputy_for_planning_and_programming"
    ];

    const validItemIds = ["1", "2", "3", "4"];

    if (!validRoles.includes(roleParam) || !validItemIds.includes(itemIdParam)) {
      router.push("/");
    }
  }, [router, searchParams]);


  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const [header, setHeader] = useState(null);
  const [loadingHeader, setLoadingHeader] = useState(true);

  const [banners, setBanners] = useState(null);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    if (!item_id) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/banners?item_id=${item_id}`);
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
  }, [item_id]);

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

  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    if (!item_id) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/info?item_id=${item_id}&role=${role}`);
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
  }, [item_id]);

  const goBack = (e) => {
    const newPath = pathname.split('/').slice(0, -1).join('/') || '/';
    router.push(newPath);
  };

  return (
    <>
      <div className=" h-screen relative">
        <div className="bg-[#1b4264d5] vector-nama2 h-1/3 bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854]">
          <div className="flex justify-between items-center px-6 py-2 md:px-12">
            <div className="flex items-center">
              <img
                src={header?.data?.logo || '/Images/masajed/mosque.svg'}
                className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
                alt="مسجد"
              />
              <div className="text-[#D5B260] font-bold md:text-3xl md:my-6 my-3 mx-4"> 
                {header?.data?.title}
              </div>
            </div>
            <div className="flex">
              <div className="rounded-full hidden bg-[#43637E] text-white md:flex items-center p-3">
                <HeaderProfile bgRole='#3A5C78'  />
              </div>
              <div className="flex">
                <Image
                  className="cursor-pointer w-[24px] md:w-[69px] md:mx-4 mx-2"
                  width={0}
                  height={0}
                  alt=""
                  src={menu}
                  onClick={() => goBack()}
                />
                <Image
                  className="cursor-pointer w-[24px] md:w-[69px]"
                  width={0}
                  height={0}
                  src={notif}
                  alt=""
                  onClick={() => goBack(true)}
                />
              </div>
            </div>
          </div>
          <div className="rounded-full bg-[#43637E] text-[10px] text-white flex md:hidden items-center mx-6 p-3">
            <HeaderProfile bgRole='#3A5C78'  />
          </div>
        </div>

        <div className="h-full vector-nama md:px-5">
          <div className="bg-white absolute top-[150px] md:top-[160px] inset-x-6 md:inset-x-11 rounded-[12px] p-3 md:p-6 scroll-kon">
            <Swiper
              navigation={true}
              pagination={{
                clickable: true,
                enabled: false,
              }}
              loop={true}
              modules={[Navigation, Pagination, Mousewheel, Keyboard]}
              className="swiper-masajed relative min-h-[20rem]"
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
                    className="max-h-[20rem] !flex !items-center rounded-xl !overflow-hidden"
                  >
                    <img
                      className="w-full rounded-xl aspect-[16/10] object-cover"
                      src={banner?.image}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[2rem] gap-y-3 mt-[2rem]">
              <div className="border border-[#ccc] bg-white py-4 px-3 md:px-5 rounded-[12px] group hover:border-[#345894] transition-all duration-200">
                <div className="flex text-[10px] md:text-[13px]">
                  <div className="flex flex-col w-1/3 md:w-1/2">
                    <Image className="w-[50px]" src={ax} alt="" />
                    <h3 className="text-[18px] mt-[0.5rem] group-hover:text-[#345894] font-[500] transition-all duration-200">کارتابل درخواست ها</h3>
                  </div>
                  <div className="w-2/3 md:w-1/2 grid grid-cols-2 gap-2 md:gap-4 ">
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#77B7DC] text-white inline-block">
                        {info?.requests?.in_progress}
                      </span>
                      وارد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-red-600 text-white inline-block">
                        {info?.requests?.rejected}
                      </span>
                      رد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#25C7AA] text-white inline-block">
                        {info?.requests?.done}
                      </span>
                      تایید و ارسال
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#FFD140] text-white inline-block">
                        {info?.requests?.action_needed}
                      </span>
                      ارجاع جهت اصلاح
                    </div>
                  </div>
                </div>
                <p className="my-4">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                  استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و
                  مجله در ستون و سطرآنچنان که لازم است.
                </p>
                <Link
                  href={`/role/kartabl?role=${roleParam}&item_id=${item_id}`}
                  className="border border-[#345894] text-[#345894] group-hover:bg-[#345894] group-hover:text-white transition-all duration-200 w-full inline-block text-center rounded-[12px] py-1 md:py-2"
                >
                  مشاهده بیشتر
                </Link>
                {/* <button className="bg-[#345894] text-white w-full rounded-sm py-1 ">
          </button> */}
              </div>

              <div className="border border-[#ccc] bg-white py-4 px-3 md:px-5 rounded-[12px] group hover:border-[#345894] transition-all duration-200">
                <div className="flex text-[10px] md:text-[13px]">
                  <div className="flex flex-col w-1/3 md:w-1/2">
                    <Image className="w-[50px]" src={ax} alt="" />
                    <h3 className="text-[18px] mt-[0.5rem] group-hover:text-[#345894] font-[500] transition-all duration-200">کارتابل گزارش ها</h3>
                  </div>
                  <div className="w-2/3 md:w-1/2 grid grid-cols-2 gap-2 md:gap-4 ">
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#77B7DC] text-white inline-block">
                        {info?.reports?.in_progress}
                      </span>
                      وارد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-red-600 text-white inline-block">
                        {info?.reports?.rejected}
                      </span>
                      رد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#25C7AA] text-white inline-block">
                        {info?.reports?.done}
                      </span>
                      تایید و ارسال
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#FFD140] text-white inline-block">
                        {info?.reports?.action_needed}
                      </span>
                      ارجاع جهت اصلاح
                    </div>
                  </div>
                </div>
                <p className="my-4">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                  استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و
                  مجله در ستون و سطرآنچنان که لازم است.
                </p>
                <Link
                  href={`/role/kartabl-gozaresh?role=${roleParam}&item_id=${item_id}`}
                  className="border border-[#345894] text-[#345894] group-hover:bg-[#345894] group-hover:text-white transition-all duration-200 w-full inline-block text-center rounded-[12px] py-1 md:py-2"
                >
                  مشاهده بیشتر
                </Link>
                {/* <button className="bg-[#345894] text-white w-full rounded-sm py-1 ">
          </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
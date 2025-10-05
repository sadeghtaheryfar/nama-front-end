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

    const validItemIds = ["1", "2", "3", "4","8"];

    if (!validRoles.includes(roleParam) || !validItemIds.includes(itemIdParam)) {
      router.push("/");
    }
  }, [router, searchParams]);

  console.log('>>>>>>>>>>>', role)


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
  }, [item_id,role]);

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
      <div className="h-[150vh] lg:h-screen relative">
        <div className="bg-[#1b4264d5] vector-nama2 h-[15rem] lg:h-[20rem] bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854] relative overflow-hidden">
          <div className="absolute top-[9rem] lg:top-[11rem] w-full">
            <img className="w-full opacity-20" src="/assets/Vector.png" alt="" />
          </div>
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
                  className="cursor-pointer w-[36px] md:w-[69px] md:mx-4 mx-2 hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                  width={0}
                  height={0}
                  alt=""
                  src={menu}
                  onClick={() => goBack()}
                />
                <Image
                  className="cursor-pointer w-[36px] md:w-[69px] hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
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
          <div className="bg-white absolute top-[150px] md:top-[160px] inset-x-6 md:inset-x-11 rounded-[28px] p-3 md:p-6 scroll-kon">
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
                    className="max-h-[20rem] !flex !items-center rounded-xl !overflow-hidden"
                  >
                    <img
                      className="w-full rounded-xl aspect-[16/5] object-cover hidden lg:flex"
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

            <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 md:mt-9 gap-6 md:gap-7">
              {/* کارت درخواست‌های فعال */}
              <div className="flex flex-col justify-end gap-5 border rounded-xl p-6 group hover:border-[#345894] transition-all duration-200">
                <div className="flex justify-between">
                  <Image
                    className="min-w-16 w-16 pb-4 ml-[1rem]"
                    alt="#"
                    width={0}
                    height={0}
                    src={ax}
                  />
                  <div>
                    <div className="grid grid-cols-2 gap-1 lg:gap-2 lg:gap-y-4">
                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#77B7DC] rounded-[0.5rem]">
                          <p>{info?.requests?.in_progress}</p>
                        </div>

                        <p className="text-[#77B7DC]">وارد شده</p>
                      </div>

                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#D32F2F] rounded-[0.5rem]">
                          <p>{info?.requests?.rejected}</p>
                        </div>

                        <p className="text-[#D32F2F]">رد شده</p>
                      </div>

                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#25C7AA] rounded-[0.5rem]">
                          <p>{info?.requests?.done_temp}</p>
                        </div>

                        <p className="text-[#25C7AA]">تایید شده</p>
                      </div>

                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#FFC200] rounded-[0.5rem]">
                          <p>{info?.requests?.action_needed}</p>
                        </div>

                        <p className="text-[#FFC200]">ارجاع جهت اصلاح</p>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-base font-extrabold group-hover:text-[#345894]">کارتابل درخواست ها</h2>
                <p className="text-xs font-medium text-slate-400 leading-6">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
                  گرافیک است.
                </p>
                <Link href={`/role/kartabl?role=${roleParam}&item_id=${item_id}`} className="mt-auto">
                  <button className="w-full h-12 text-[#345894] text-base font-medium rounded-[10px] border border-[#345894] group-hover:bg-[#345894] group-hover:text-white hover:scale-[1.03] active:scale-[1] transition-[0.9s]">مشاهده بیشتر</button>
                </Link>
              </div>

              {/* کارت درخواست‌های فعال */}
              <div className="flex flex-col justify-end gap-5 border rounded-xl p-6 group hover:border-[#345894] transition-all duration-200">
                <div className="flex justify-between">
                  <Image
                    className="min-w-16 w-16 pb-4 ml-[1rem]"
                    alt="#"
                    width={0}
                    height={0}
                    src={ax}
                  />
                  <div>
                    <div className="grid grid-cols-2 gap-2 gap-y-4">
                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#77B7DC] rounded-[0.5rem]">
                          <p>{info?.reports?.in_progress}</p>
                        </div>

                        <p className="text-[#77B7DC]">وارد شده</p>
                      </div>

                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#D32F2F] rounded-[0.5rem]">
                          <p>{info?.reports?.rejected}</p>
                        </div>

                        <p className="text-[#D32F2F]">رد شده</p>
                      </div>

                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#25C7AA] rounded-[0.5rem]">
                          <p>{info?.reports?.done_temp}</p>
                        </div>

                        <p className="text-[#25C7AA]">تایید شده</p>
                      </div>

                      <div className="flex justify-start items-center gap-[0.5rem] text-[10px] lg:text-[20px] font-semibold">
                        <div className="text-white w-[1.5rem] min-w-[1.5rem] h-[1.5rem] lg:w-[2.5rem] lg:min-w-[2.rem] lg:h-[2.5rem] flex justify-center items-center bg-[#FFC200] rounded-[0.5rem]">
                          <p>{info?.reports?.action_needed}</p>
                        </div>

                        <p className="text-[#FFC200]">ارجاع جهت اصلاح</p>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-base font-bold group-hover:text-[#345894]">کارتابل گزارش ها</h2>
                <p className="text-xs font-medium text-slate-400 leading-6">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
                  گرافیک است.
                </p>
                <Link href={`/role/kartabl-gozaresh?role=${roleParam}&item_id=${item_id}`} className="mt-auto">
                  <button className="w-full h-12 text-[#345894] text-base font-medium rounded-[10px] border border-[#345894] group-hover:bg-[#345894] group-hover:text-white hover:scale-[1.03] active:scale-[1] transition-[0.9s]">مشاهده بیشتر</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

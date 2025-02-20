"use client";
import Image from "next/image";
import ax from "./../../public/assets/Bill.png";
import axmasjed from "./../../public/assets/Mask.png";
import Financial from "./../../public/assets/Financial.png";
import Link from "next/link";
import menu from "./../../public/assets/menu.svg";
import notif from "./../../public/assets/notif.svg";
import man from "./../../public/assets/man.png";
import mosque from "./../../public/assets/mosque.png";
import Swiper from "swiper";
import { Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

export default function Role() {
  return (
    <>
      <div className=" h-screen relative">
        <div className="bg-[#002a4fd5] vector-nama2 h-1/3 bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854] ">
          <div className="flex justify-between items-center px-6 py-2 md:px-12">
            <div className="flex items-center">
              <Image
                src={mosque}
                className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
                alt="مسجد"
              />
              <div className="text-[#D5B260] font-bold md:text-3xl md:my-6 my-3 mx-4">
                مساجد
              </div>
            </div>
            <div className="flex">
              <div className="rounded-full hidden bg-[#43637E] text-white md:flex items-center p-3">
                <Image className="cursor-pointer w-[69px]" src={man} alt="user" />
                <div className="px-3 border-e-2">
                  <div>سلام علی کریمی</div>
                  <div>به سامانه نما خوش آمدید</div>
                </div>
                <div className="ps-3">
                  <div>نقش</div>
                  <div>معاونت طرح و برنامه</div>
                </div>
              </div>
              <div className="flex">
                <Image
                  className="cursor-pointer w-[24px] md:w-[69px] md:mx-4 mx-2"
                  src={menu}
                />
                <Image
                  className="cursor-pointer w-[24px] md:w-[69px]"
                  src={notif}
                />
              </div>
            </div>
          </div>
          <div className="rounded-full bg-[#43637E] text-[10px] text-white flex md:hidden items-center mx-6 p-3">
            <Image className="cursor-pointer w-[50px] md:w-[69px]" src={man} alt="user" />
            <div className="px-3 border-e-2">
              <div>سلام علی کریمی</div>
              <div>به سامانه نما خوش آمدید</div>
            </div>
            <div className="ps-3">
              <div>نقش</div>
              <div>معاونت طرح و برنامه</div>
            </div>
          </div>
        </div>

        <div className="h-full vector-nama md:px-5">
          <div className="bg-white absolute top-[150px] md:top-[160px] inset-x-6 md:inset-x-11 rounded p-3 md:p-6 scroll-kon">
            <Image className="w-full" src={axmasjed} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-6">
              <div className="border border-[#ccc] bg-white py-4 px-3 md:px-5 rounded">
                <div className="flex text-[10px] md:text-[13px]">
                  <div className="flex flex-col w-1/3 md:w-1/2">
                    <Image className="w-[50px]" src={ax} />
                    <h3>کارتابل درخواست ها</h3>
                  </div>
                  <div className="w-2/3 md:w-1/2 grid grid-cols-2 gap-2 md:gap-4 ">
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#77B7DC] text-white inline-block">
                        1
                      </span>
                      وارد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-red-600 text-white inline-block">
                        3
                      </span>
                      رد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#25C7AA] text-white inline-block">
                        2
                      </span>
                      تایید شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#FFD140] text-white inline-block">
                        5
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
                  href="/role/kartabl"
                  className="bg-[#345894] text-white w-full inline-block text-center rounded-sm py-1 md:py-2"
                >
                  مشاهده بیشتر
                </Link>
                {/* <button className="bg-[#345894] text-white w-full rounded-sm py-1 ">
          </button> */}
              </div>

              <div className="border border-[#ccc] bg-white py-4 px-3 md:px-5 rounded">
                <div className="flex text-[10px] md:text-[13px]">
                  <div className="flex flex-col w-1/3 md:w-1/2">
                    <Image className="w-[50px]" src={ax} />
                    <h3>کارتابل گزارش ها</h3>
                  </div>
                  <div className="w-2/3 md:w-1/2 grid grid-cols-2 gap-2 md:gap-4 ">
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#77B7DC] text-white inline-block">
                        1
                      </span>
                      وارد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-red-600 text-white inline-block">
                        3
                      </span>
                      رد شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#25C7AA] text-white inline-block">
                        2
                      </span>
                      تایید شده
                    </div>
                    <div className="flex items-center">
                      <span className="rounded-md md:px-3 px-2 md:me-2 me-1 py-1 bg-[#FFD140] text-white inline-block">
                        5
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
                  href="/role/kartabl"
                  className="bg-[#345894] text-white w-full inline-block text-center rounded-sm py-1 md:py-2"
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
"use client";
import Image from "next/image";
import tik from "./../../../../public/assets/tik.svg";

import mosque from "./../../../../public/assets/mosque.png";
import man from "./../../../../public/assets/man.png";
import menu from "./../../../../public/assets/menu.svg";
import notif from "./../../../../public/assets/notif.svg";
import { useState } from "react";
import close from "./../../../../public/assets/close.png";
import { usePathname, useRouter } from 'next/navigation';

export default function Enter() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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
      <div className=" h-screen relative">
        <div className="bg-[#002a4fd5] vector-nama2 h-1/3 bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854] ">
          <div className="flex justify-between items-center px-6 py-2 md:px-12">
            <div className="flex items-center">
              <Image
                src={mosque}
                className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
              />
              <div className="text-[#D5B260] text-[12px] md:text-[18px] font-bold md:text-3xl md:my-6 my-3 mx-4">
                مساجد / کارتابل درخواست ها
              </div>
            </div>
            <div className="flex">
              <div className="rounded-full hidden bg-[#43637E] text-white md:flex items-center p-3">
                <Image className="cursor-pointer w-[69px]" src={man} />
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
                  className="cursor-pointer w-[36px] md:w-[69px] md:mx-4 mx-2 hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                  src={menu}
                  onClick={() => goBack()}
                />
                <Image
                  className="cursor-pointer w-[36px] md:w-[69px] hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                  src={notif}
                  onClick={() => goBack(true)}
                />
              </div>
            </div>
          </div>
          <div className="rounded-full bg-[#43637E] text-[10px] text-white flex md:hidden items-center mx-6 p-3">
            <Image className="cursor-pointer w-[50px] md:w-[69px]" src={man} />
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

        <div className="vector-nama md:px-5">
          <div className=" p-6 scroll-kon">
            <div className="bg-white shadow-md rounded mb-5 p-3 md:p-6 -mt-[70px] md:-mt-[100px] z-30">
              <div className="hidden md:grid md:grid-cols-5 gap-4 border-t-2 border-[#25C7AA] border-dashed mt-6 ">
                <div className="-mt-6">
                  <span className="inline-block bg-[#25C7AA] rounded mb-4 p-2">
                    <Image className="inline-block" src={tik} />
                  </span>
                  <h3 className="text-[#25C7AA]">تایید سر مربی مسجد</h3>
                  <p className="text-[#696969]">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                    با استفاده از طراحان گرافیک است .
                  </p>
                </div>
                <div className="-mt-6">
                  <span className="inline-block bg-[#25C7AA] rounded mb-4 p-2">
                    <Image className="inline-block" src={tik} />
                  </span>
                  <h3 className="text-[#25C7AA]">تایید سر مربی مسجد</h3>
                  <p className="text-[#696969]">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                    با استفاده از طراحان گرافیک است .
                  </p>
                </div>
                <div className="-mt-6">
                  <span className="inline-block bg-[#25C7AA] rounded mb-4 p-2">
                    <Image className="inline-block" src={tik} />
                  </span>
                  <h3 className="text-[#25C7AA]">تایید سر مربی مسجد</h3>
                  <p className="text-[#696969]">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                    با استفاده از طراحان گرافیک است .
                  </p>
                </div>
                <div className="-mt-6">
                  <span className="inline-block bg-[#25C7AA] rounded mb-4 p-2">
                    <Image className="inline-block" src={tik} />
                  </span>
                  <h3 className="text-[#25C7AA]">تایید سر مربی مسجد</h3>
                  <p className="text-[#696969]">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                    با استفاده از طراحان گرافیک است .
                  </p>
                </div>
                <div className="-mt-6">
                  <span className="inline-block bg-[#bebebe] rounded mb-4 p-2">
                    <Image className="inline-block" src={tik} />
                  </span>
                  <h3 className="text-[#bebebe]">
                    در انتظار تایید معاونت طرح و برنامه
                  </h3>
                  <p className="text-[#696969]">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                    با استفاده از طراحان گرافیک است .
                  </p>
                </div>
              </div>

              <div className="grid md:hidden">
                <div className="border-r-2 relative border-dashed border-[#25C7AA] ps-5 pb-5">
                  <h3 className="text-[#25C7AA] font-bold">تایید سر مربی مسجد</h3>
                  <p className="text-[12px] md:text-[16px]">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است 
                  </p>

                  <span className="flex items-center justify-center absolute top-0 -right-2 bg-[#25C7AA] rounded mb-4 p-1 w-[20px] h-[20px]">
                    <Image className="inline-block w-[16px] h-[13px]" src={tik} />
                  </span>

                </div>
                <div className="border-r-2 relative border-dashed border-[#25C7AA] ps-5 pb-5">
                  <h3 className="text-[#25C7AA] font-bold">تایید مسئول فرهنگی مسجد</h3>
                  <p className="text-[12px] md:text-[16px]">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است 
                  </p>

                  <span className="flex items-center justify-center absolute top-0 -right-2 bg-[#25C7AA] rounded mb-4 p-1 w-[20px] h-[20px]">
                    <Image className="inline-block w-[16px] h-[13px]" src={tik} />
                  </span>

                </div>
                <div className="border-r-2 relative border-dashed border-[#25C7AA] ps-5 pb-5">
                  <h3 className="text-[#25C7AA] font-bold">تایید  رابط منطقه</h3>
                  <p className="text-[12px] md:text-[16px]">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است 
                  </p>

                  <span className="flex items-center justify-center absolute top-0 -right-2 bg-[#25C7AA] rounded mb-4 p-1 w-[20px] h-[20px]">
                    <Image className="inline-block w-[16px] h-[13px]" src={tik} />
                  </span>

                </div>
                <div className="border-r-2 relative border-dashed border-[#25C7AA] ps-5 pb-5">
                  <h3 className="text-[#25C7AA] font-bold">تایید معاونت اجرایی مساجد</h3>
                  <p className="text-[12px] md:text-[16px]">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است 
                  </p>

                  <span className="flex items-center justify-center absolute top-0 -right-2 bg-[#25C7AA] rounded mb-4 p-1 w-[20px] h-[20px]">
                    <Image className="inline-block w-[16px] h-[13px]" src={tik} />
                  </span>

                </div>
                <div className="border-r-2 relative border-dashed border-[#25C7AA] ps-5 pb-5">
                  <h3 className="text-[#c0c0c0] font-bold">در انتظار تایید  معاونت طرح و برنامه</h3>
                  <p className="text-[12px] md:text-[16px]">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است 
                  </p>

                  <span className="flex items-center justify-center absolute top-0 -right-2 bg-[#bebebe] rounded mb-4 p-1 w-[20px] h-[20px]">

                    <Image className="inline-block w-[16px] h-[13px]" src={tik} />
                  </span>

                </div>
              </div>

            </div>

            <div className="bg-white shadow-md rounded  mb-5 p-3 md:p-6">
              <div className="flex justify-between">
                <div className="font-bold text-[12px] md:text-[16px]">
                  نام درخواست مربوطه در اینجا قرار میگیرد ( شماره ۲۰۳ - شناسه
                  یکتا: ۲۲۷۷۲۳۴ )
                </div>
                <div className="bg-blue-100 text-[12px] md:text-[16px] rounded px-4 py-1">وارد شده</div>
              </div>
              <hr className="my-6" />
              <div className="flex flex-col md:flex-row  justify-around">
                <div className="flex justify-between text-[12px] md:text-[15px] my-2">
                  تعداد دانش آموزان نوجوان:{" "}
                  <span className="font-bold">220</span>
                </div>
                <div className="flex justify-between text-[12px] md:text-[15px] my-2">
                  تاریخ برگزاری: <span className="font-bold">1401.02.13</span>
                </div>
                <div className="flex justify-between text-[12px] md:text-[15px] my-2">
                  هزینه پیشنهادی معاونت مساجد:{" "}
                  <span className="font-bold text-left">4500000 ریال</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 my-6">
                <div>توضیحات تکمیلی:</div>
                <div className="md:col-span-4 text-justify">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                  استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و
                  مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی
                  تکنولوژی مورد نیاز و کاربردهای متنوع حال و آینده شناخت فراوان
                  جامعه و متخصصان را تا با نرم افزارها شناخت بیشتری را برای
                  طراحان رایانه ای علی الخصوص طراحان خلاقلی قرار گیردلورم ایپسوم
                  متن ساختگی با تولید چاپگرها و متون بلکه روزنامه و مجله در ستون
                  و سطرآنچنان که لازم است لورم ایپسوم متن ساختگی با چاپ و با
                  استفاده از طراحان گرافیک است.برای طراحان رایانه ای علی الخصوص
                  طراحان خلاقلی قرار گیردلورم ایپسوم متن ساختگی با تولید چاپگرها
                  و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است
                  لورم ایپسوم متن ساختگی با چاپ و با استفاده از طراحان گرافیک
                  است.
                </div>
              </div>
              <div className="flex flex-col md:flex-row  items-center">
                <div className="my-3 md:my-0">فایل پیوست نامه امام جماعت:</div>
                <button  className="border w-full md:w-1/5 py-1 px-3 mx-4 rounded-md border-[#345894]">
                  برای مشاهده فایل کلیک کنید
                </button>
              </div>
              <hr className="my-6" />
              <div>هزینه پرداختی توسط آرمان</div>
              <div className="my-4">
                <input
                  type="text"
                  className="rounded border px-4 py-2 w-full md:w-1/3 border-[#ccc]"
                  placeholder="دراینجا تایپ کنید"
                />
              </div>

              <div>ارسال نظر معاونت طرح و برنامه</div>
              <div className="my-4">
                <textarea
                  name=""
                  id=""
                  className="rounded border px-4 py-2 w-full border-[#ccc]"
                  placeholder="دراینجا تایپ کنید"
                ></textarea>
              </div>

              <div className="flex flex-col md:flex-row justify-center">
                <button
                  onClick={() => setShow(true)}
                  className="bg-[#F3BF19] rounded md:w-[170px] py-2 w-full"
                >
                  ارجاع جهت اصلاح
                </button>
                <button className="bg-[#00B997] rounded md:w-[170px] py-2 md:mx-4 my-2 md:my-0 w-full">
                  تایید درخواست
                </button>
                <button className="bg-[#D32F2F] rounded md:w-[170px] py-2 w-full">
                  رد کلی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* show modal  */}
      {show && (
        <div className="bg-transparent flex justify-center items-center backdrop-blur-lg w-full h-screen fixed top-0 right-0 left-0 bottom-0 m-auto">
          <div className="w-full mx-4 shadow-md p-5 md:w-1/4 bg-white rounded relative">
            <Image
              className="absolute cursor-pointer top-4 left-4 shadow-md rounded"
              onClick={() => setShow(false)}
              src={close}
            />
            <h2 className="mt-7 text-center font-bold"> ارجاع این درخواست به بخش مربوطه</h2>

              
              <select
                id="countries"
                class="bg-gray-50 border my-7 border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option selected>لطفا بخش مربوطاه را انتخاب کنید </option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>

            <button className="w-full text-white rounded py-1 bg-[#F3BF19]">
              ارجاع جهت اصلاح
            </button>
          </div>
        </div>
      )}
    </>
  );
}

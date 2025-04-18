"use client"
import Image from "next/image";
import tik from "./../../../../public/assets/tik.svg";
import close from "./../../../../public/assets/close.png";

import mosque from "./../../../../public/assets/mosque.png";
import man from "./../../../../public/assets/man.png";
import menu from "./../../../../public/assets/menu.svg";
import notif from "./../../../../public/assets/notif.svg";
import { useRouter } from 'next/navigation';

export default function Reject() {
  
  const router = useRouter();
  const goBack = (e) => {
    if(e) router.back(); else router.push('/');
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
                  className="cursor-pointer w-[24px] md:w-[69px] md:mx-4 mx-2"
                  src={menu}
                  onClick={() => goBack()}
                />
                <Image
                  className="cursor-pointer w-[24px] md:w-[69px]"
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
          <div className="p-6 scroll-kon">
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
                  <span className="inline-block bg-[#ff1a1a] rounded mb-4 p-2">
                    <Image className="inline-block" src={close} />
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
                  <h3 className="text-[#ff1c1c] font-bold"> رد شده  معاونت طرح و برنامه</h3>
                  <p className="text-[12px] md:text-[16px]">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است 
                  </p>

                  <span className="flex items-center justify-center absolute top-0 -right-2 bg-[#ff1c1c] rounded mb-4 p-1 w-[20px] h-[20px]">
                    <Image className="inline-block w-[16px] h-[13px]" src={close} />
                  </span>

                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded mb-5 p-3 md:p-6">
              <div className="flex justify-between">
                <div className="font-bold text-[12px] md:text-[16px]">
                  نام درخواست مربوطه در اینجا قرار میگیرد ( شماره ۲۰۳ - شناسه
                  یکتا: ۲۲۷۷۲۳۴ )
                </div>
                <div className="bg-red-100 rounded px-4 py-1 text-[12px] md:text-[16px]">رد شده</div>
              </div>
              <hr className="my-6" />
              <div className="flex flex-col md:flex-row justify-around">
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
              <div className="flex flex-col md:flex-row items-center">
                <div>فایل پیوست نامه امام جماعت:</div>
                <button className="border w-full md:w-1/5 py-1 px-3 mx-4 rounded-md border-[#345894]">
                  برای مشاهده فایل کلیک کنید
                </button>
              </div>
              <hr className="my-6" />
              <div className="flex mb-5">
                <div>هزینه پرداختی توسط آرمان</div>
                <div className="font-bold mx-6 text-left">وارد نشده است</div>
              </div>

              <div className="text-[#3B3B3B]">
                نظر معاونت طرح و برنامه برای رد این درخواست:
              </div>
              <div className="my-4 font-bold">
                <p className="text-justify">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                  استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و
                  مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی
                  تکنولوژی مورد نیاز و کاربردهای متنوع حال و آینده شناخت فراوان
                  جامعه و متخصصان را تا با نرم افزارها شناخت بیشتری را در ستون و
                  سطرآنچنان که لازم است لورم ایپسوم متن ساختگی با چاپ و با
                  استفاده از طراحان گرافیک است.
                </p>
                {/* <textarea name="" id="" className="rounded border px-4 py-2 w-full border-[#ccc]" placeholder="دراینجا تایپ کنید" ></textarea> */}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
  }
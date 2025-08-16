"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice  } from "../../../../../components/utils/formatPrice";
import { toPersianDate  } from "../../../../../components/utils/toPersianDate";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const MainGardeshMoshahede5 = ({ id,data }) => {
  const [placeText, setPlaceText] = useState("");
  const translateNama = (role) => {
      if (role === "approval_mosque_head_coach") {
          return `سرمربی ${placeText}`;
      } else if (role === "approval_mosque_cultural_officer") {
          return `مسئول فرهنگی ${placeText}`;
      } else if (role === "approval_area_interface") {
          return "رابط منطقه";
      } else if (role === "approval_executive_vice_president_mosques") {
          return `معاونت اجرایی ${placeText}`;
      } else if (role === "approval_deputy_for_planning_and_programming") {
          return "معاونت طرح و برنامه";
      } else {
          return "نامشخص";
      }
  };
  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl">
          گزارش شماره ({data?.data?.report?.id})
          {data?.data?.request_plan?.single_step && (
            <>
              <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mr-2 rounded-lg flex items-center justify-center">
                <p>تک مرحله ای</p>
              </div>

              <div className="text-[#c75825] bg-[#c758253e] text-[12px] py-1 px-4 mr-2 rounded-lg flex items-center justify-center">
                <p>تسویه شده در درخواست</p>
              </div>
            </>
          )}
        </h2>

        <div className="text-sm font-semibold text-[#FFC200] bg-[#FEF4D9] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:h-12">
          {data?.data?.report?.message
            ? `نیازمند اصلاح توسط ${translateNama(data?.data?.report?.step)}`
            : "نیازمند اصلاح"}
        </div>
      </div>

      <hr className="h-2 mt-4 mb-4" />
      <div className="grid lg:grid-cols-2 mb-8">
        <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
          <h3 className="text-base lg:text-lg text-[#3B3B3B]">
            هزینه پیشنهادی معاونت اجرایی:
          </h3>
          {data?.data?.single_step ? (
            <span onClick={(e) => copyText(data?.data?.report?.offer_amount ?? 0)} className="cursor-pointer text-base lg:text-lg font-medium">
              {formatPrice(data?.data?.report?.offer_amount ?? 0)}
            </span>
          ) : (
            <span onClick={(e) => copyText(data?.data?.report?.offer_amount ?? 0)} className="cursor-pointer text-base lg:text-lg font-medium">
              {data?.data?.report?.offer_amount != null ? formatPrice(data?.data?.report?.offer_amount) : 'وارد نشده'}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
          <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
            هزینه پرداختی توسط آرمان:
          </h3>
          {data?.data?.single_step ? (
            <span className="text-base lg:text-lg font-medium">{formatPrice(data?.data?.report?.final_amount ?? 0)}</span>
          ) : (
              <span className="text-base lg:text-lg font-medium">{data?.data?.report?.final_amount ? formatPrice(data?.data?.report?.final_amount) : 'وارد نشده'}</span>
          )}
        </div>
      </div>

      <div className="w-full bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
            <label htmlFor="options" className="block text-base lg:text-lg text-[#3B3B3B] mb-2 ">
              تعداد دانش آموزان نوجوان{" "}
            </label>
            <div className="relative">
              <input
                type="number"
                id="student"
                value={data?.data?.report?.students}
                disabled
                name="student"
                placeholder="به عنوان مثال 25 عدد..."
                className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              />

              {/* <Image
                className="w-8 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/arrowDown.svg"}
              /> */}
              {/* <select
                id="options"
                name="options"
                className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              >
                <option value="">لطفا انتخاب کنید </option>
                <option value="option1">گزینه ۱</option>
                <option value="option2">گزینه ۲</option>
                <option value="option3">گزینه ۳</option>
              </select> */}
            </div>
          </div>

          {/* اضافه کردن فیلد هزینه کلی عملیات */}
          <div className="mb-4">
            <label htmlFor="hesab" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              هزینه کلی عملیات
            </label>
            <input
              type="number"
              id="cost"
              value={data?.data?.report?.amount}
              disabled
              name="cost"
              placeholder="از 1،000 تا 10،000،000،000،000"
              className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
            />
            {data?.data?.report?.amount && (
              <>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">مبلغ به عدد: </span>
                  {formatPrice(data?.data?.report?.amount)} ریال
                </div>
              </>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="calendar" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              تاریخ برگزاری{" "}
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="student"
                value={toPersianDate(data?.data?.report?.date)}
                disabled
                name="student"
                placeholder="به عنوان مثال 25 عدد..."
                className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 mt-3">
          <label htmlFor="textarea" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            توضیحات تکمیلی{" "}
          </label>
          <textarea
            className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700 md:h-24"
            id="des"
            name="des"
            disabled
            value={data?.data?.report?.body}
            rows="10"
            cols="15"
            placeholder="در اینجا تایپ کنید …"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-2 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">تصاویر</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {data?.data?.report?.images?.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <a href={image?.original} target="_blank" rel="noopener noreferrer"> {/* ADDED: Anchor tag for new page link */}
                    <img src={image?.original} alt={`تصویر ${index + 1}`} className="w-full h-full object-cover rounded-lg" /> {/* MODIFIED: Added alt text */}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">آپلود فایل ویدئویی حداقل ۳۰ ثانیه (اختیاری)</h3>
            {/* Display other existing videos from data prop */}
            {(data?.data?.report?.video?.original || (data?.data?.report?.other_videos && data?.data?.report?.other_videos?.length > 0 )) && (
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2"> {/* Added grid for multiple videos */}
                {/* Display existing primary video from data prop */}
                {data?.data?.report?.video?.original && (
                  <div className="w-full">
                    <video controls className="w-full rounded-lg">
                      <source src={data.data.report.video.original} type={data.data.report.video.mime_type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {data?.data?.report?.other_videos.map((videoItem, index) => (
                  <div key={videoItem.id || index} className="relative w-full aspect-video">
                    <video controls className="w-full h-full object-cover rounded-lg">
                      <source src={videoItem.original} type={videoItem.mime_type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">پیوست های بیشتر</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {data?.data?.report?.images2?.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <a href={image?.original} target="_blank" rel="noopener noreferrer"> {/* ADDED: Anchor tag for new page link */}
                    <img src={image?.original} alt={`تصویر ${index + 1}`} className="w-full h-full object-cover rounded-lg" /> {/* MODIFIED: Added alt text */}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="flex items-start mb-7 mt-7">
          <input
            id="checked-checkbox"
            type="checkbox"
            value={checkbox}
            onChange={(event) => setCheckBox(event.target.checked)}
            className="min-w-5 h-5 appearance-none checked:bg-[#D5B260] border border-gray-300 rounded  checked:ring-offset-2 checked:ring-1 ring-gray-300"
          />
          <label
            htmlFor="checked-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
          >
            تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در صورت عدم تطبیق مسئولیت آن
            را می پذیرم.{" "}
          </label>
          <span className="text-red-500 px-2">{statusCheckBox}</span>
        </div> */}
      </div>
    </div>
  );
};

export default MainGardeshMoshahede5;

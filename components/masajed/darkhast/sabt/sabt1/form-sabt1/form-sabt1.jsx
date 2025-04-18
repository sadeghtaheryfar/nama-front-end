import { dateIR } from "../../../../../utils/dateIR";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FormSabt1 = ({ data }) => {
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");

  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }
  

  return (
    <div>
      <form className="w-full bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
            <label htmlFor="options" className="block text-base lg:text-lg text-[#3B3B3B] mb-2  ">
              تعداد دانش آموزان نوجوان{<div className="py-2">{data?.student || 0}</div>}
            </label>
            <div className="relative">
              {/* <Image
                className="w-8 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/arrowDown.svg"}
              /> */}
              <span></span>
              {/* <select
                id="options"
                name="options"
                className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              >
                <option value="">۲۲۰</option>
                <option value="option1">220</option>
                <option value="option2">220</option>
                <option value="option3">220</option>
              </select> */}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="hesab" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              هزینه کلی عملیات{" "}
            </label>
            {<div className="py-2">{data.cost ? formatNumber(data.cost) + " ریال" : "0 ریال"}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="calendar" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              تاریخ برگزاری{" "}
            </label>
            <div className="relative">
              <div className="py-3">{data?.time ? data?.time : "تاریخ مشخص نیست"}</div>

              {/* <Image
                className="w-9 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/calendar.svg"}
              />
              <input
                type="text"
                id="calendar"
                name="calendar"
                defaultValue={"۱۴۰۳/۰۹/۱۲"}
                className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-600"
              /> */}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="textarea" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            توضیحات تکمیلی{" "}
          </label>
          <textarea
            className="block w-full p-5 border border-[#DFDFDF] text-sm rounded-lg text-gray-400 leading-7 sm:h-40 lg:h-32 xl:h-28"
            id="textarea"
            name="textarea"
            disabled
            rows="10"
            cols="15"
            defaultValue={data.des || "توضیحی وارد نشده است"}
            placeholder="در اینجا تایپ کنید …"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
              آپلود فایل پیوست نامه امام جماعت
            </h3>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-3 border border-[#39A894] rounded-lg px-5 py-0.5 bg-[#39A894]/10">
                <a target="_blank" href={data?.imamLetter}>
                  <span className="text-sm text-[#39A894] leading-7">برای مشاهده کلیک کنید</span>
                </a>
                <Image
                  className="w-4"
                  alt="#"
                  width={0}
                  height={0}
                  src={"/Images/masajed/darkhast/sabt/sabt1/Vector.svg"}
                />
              </div>

              {/* <div className="flex items-center justify-between pt-5 pb-6">
                <span className="text-sm text-[#959595] leading-7 bg-[#959595]/15 p-4 py-1 rounded-lg">
                  آپلود مجدد{" "}
                </span>
              </div> */}
              {/* <input id="file-upload" type="file" className="hidden" /> */}
            </label>
          </div>

          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">آپلود فایل نامه رابط منطقه</h3>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-3 border border-[#39A894] rounded-lg px-5 py-0.5 bg-[#39A894]/10">
                <a target="_blank" href={data?.area_interface_letter?.original}>
                  <span className="text-sm text-[#39A894] leading-7">برای مشاهده کلیک کنید</span>
                </a>
                <Image
                  className="w-4"
                  alt="#"
                  width={0}
                  height={0}
                  src={"/Images/masajed/darkhast/sabt/sabt1/Vector.svg"}
                />
              </div>

              {/* <div className="flex items-center justify-between pt-5 pb-6">
                <span className="text-sm text-[#959595] leading-7 bg-[#959595]/15 p-4 py-1 rounded-lg">
                  آپلود مجدد{" "}
                </span>
              </div> */}
              {/* <input id="file-upload" type="file" className="hidden" /> */}
            </label>
          </div>
        </div>

        <div className="flex items-start mb-7 mt-7">
          <input
            id="checked-checkbox"
            type="checkbox"
            value={checkbox}
            onChange={(event) => setCheckBox(event.target.checked)}
            defaultChecked
            className="min-w-5 h-5 appearance-none checked:bg-[#D5B260] border border-gray-300 rounded  checked:ring-offset-2 checked:ring-1 ring-gray-300"
          />
          <label
            htmlFor="checked-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
          >
            تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در صورت عدم تطبیق مسئولیت
            آن را می پذیرم.{" "}
          </label>
        </div>
          <button
            type="submit"
            className="w-full h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white md:max-w-[214px]"
          >
            تایید و ثبت اطلاعات
          </button>
      </form>
    </div>
  );
};

export default FormSabt1;

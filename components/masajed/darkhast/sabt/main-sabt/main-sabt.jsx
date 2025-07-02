"use client";
import FormSabt from "../form-sabt/form-sabt";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";

function numberToPersianWords(num) {
  const ones = [
    "",
    "یک",
    "دو",
    "سه",
    "چهار",
    "پنج",
    "شش",
    "هفت",
    "هشت",
    "نه",
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const tens = [
    "",
    "",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];
  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];
  const units = ["", "هزار", "میلیون", "میلیارد"];

  if (num === 0) return "صفر";

  const splitByThousand = [];
  while (num > 0) {
    splitByThousand.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  function threeDigitToWords(n) {
    let result = [];
    if (n >= 100) {
      result.push(hundreds[Math.floor(n / 100)]);
      n %= 100;
    }
    if (n >= 20) {
      result.push(tens[Math.floor(n / 10)]);
      n %= 10;
    }
    if (n > 0) {
      result.push(ones[n]);
    }
    return result.join(" و ");
  }

  return splitByThousand
    .map((group, index) => {
      if (group === 0) return null;
      const words = threeDigitToWords(group);
      const unit = units[index];
      return words + (unit ? " " + unit : "");
    })
    .filter(Boolean)
    .reverse()
    .join(" و ");
}

const MainSabt = () => {
  const [requestData, setRequsestData] = useState("");
  const params = useSearchParams();

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }

  useEffect(() => {
    const fetching = async () => {
      try {
        const id = params.get("id");
        const request = await axios.post(
          `/api/request/level_1?item_id=${itemId}&role=mosque_head_coach`,
          { id }
        );
        if (request.data) {
          setRequsestData(request.data.data);
        }
      } catch (error) {
        console.log(error);
      }
      // try {
      //   const active = await axios.get("/api/active");
      //   if (active.data) {
      //     setActiveCarts(active.data.data);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    };
    fetching();
  }, []);

  return (
    <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <h2 className="text-base font-bold md:text-lg xl:text-2xl">
        {requestData.title || "بدون نام"}
        <span>({requestData.id || 0})</span>
      </h2>
      <div className="flex flex-col items-start bg-[#D5B260]/10 rounded-lg p-3 my-6 md:p-5 lg:p-6 md:my-8 xl:my-10 xl:flex-row xl:gap-6 2xl:gap-10">
        <h2 className="text-base font-semibold text-[#D5B260] md:text-lg xl:text-xl xl:min-w-fit">
          نکات قابل توجه این درخواست
        </h2>
        <div className="flex flex-col lg:flex-row xl:gap-6 2xl:gap-10">
          <ul className="flex flex-col gap-0.5 pt-3 lg:pt-0">
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              سقف تعداد نفرات مورد حمایت:{" "}
              {requestData.max_number_people_supported || 0}
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              سرانه حمایتی هر نفر به مبلغ حداکثر{" "}
              {numberToPersianWords(requestData.support_for_each_person_amount)}{" "}
              ریال می باشد
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              {requestData.expires_at === null
                ? "فاقد محدودیت زمانی"
                : `محدود مهلت زمانی انتخاب این درخواست تا تاریخ ${requestData.expires_at} میباشد.`}
            </li>
          </ul>
          <ul className="flex flex-col gap-0.5">
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              تعداد دفعات مجاز شما برای این درخواست{" "}
              {requestData.max_allocated_request || 0} عدد میباشد و پس از ثبت{" "}
              {numberToPersianWords(requestData.max_allocated_request || 0)}{" "}
              درخواست، دسترسی به این بخش برای شما مقدور نیست.{" "}
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              {requestData.previous_requests >
                requestData.max_allocated_request && (
                <span className="font-bold">در خواستی باقی نمانده.</span>
              )}
              {requestData.previous_requests <=
                requestData.max_allocated_request && (
                <span>
                  درخواست
                  <span className="text-[#D5B260] font-bold">
                    {Number(requestData.previous_requests) + 1} از{" "}
                    {requestData.max_allocated_request}
                  </span>
                  (تنها{" "}
                  {requestData.max_allocated_request -
                    requestData.previous_requests}{" "}
                  درخواست باقی مانده است)
                </span>
              )}
            </li>
            {requestData?.single_step && (
              <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
                <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
                این درخواست یک مرحله ای می باشد و کل بودجه یکجا آزاد می شود
              </li>
            )}
          </ul>
        </div>
      </div>
      <hr className="hidden md:block h-2 mb-10" />
      <FormSabt id={params.get("id")} data={requestData} />
    </div>
  );
};

export default MainSabt;

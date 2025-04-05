import { toPersianDate  } from "../../../../../components/utils/toPersianDate";
import { formatPrice  } from "../../../../../components/utils/formatPrice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const MainGardeshJari = ({data}) => {
  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }

  const pathname = usePathname();
  const [typeField, setTypeField] = useState(null);

  useEffect(() => {
    if (!pathname) return;
    const pathSegments = pathname.split("/");
    const itemId = pathSegments[1];

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${itemId}&role=mosque_head_coach`);
        if (response.data) {
          if(response?.data?.data?.title == "مساجد")
          {
            setTypeField('امام جماعت')
          }else if(response?.data?.data?.title == "مدارس")
          {
            setTypeField('مدیر')
          }
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      }
    };
    fetching();
  }, []);
  
  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <h2 className="text-base font-bold md:text-lg xl:text-2xl">
        {data?.data?.request_plan?.title || "بدون نام"}
        <span>({data?.data?.request_plan?.id || 0})</span>
      </h2>
      <div className="flex flex-col items-start bg-[#D5B260]/10 rounded-lg p-3 my-6 md:p-5 lg:p-6 md:my-8 xl:my-10 xl:flex-row xl:gap-6 2xl:gap-10">
        <h2 className="text-base font-semibold text-[#D5B260] md:text-lg xl:text-xl xl:min-w-fit">
          نکات قابل توجه این درخواست
        </h2>
        <div className="flex flex-col lg:flex-row xl:gap-6 2xl:gap-10">
          <ul className="flex flex-col gap-0.5 pt-3 lg:pt-0">
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              سقف تعداد نفرات مورد حمایت: {data?.data?.request_plan?.max_number_people_supported || 0}
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              سرانه حمایتی هر نفر به مبلغ {formatNumber(
                data?.data?.request_plan?.support_for_each_person_amount
              )}{" "}
              میلیون تومان میباشد.
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              {data?.data?.request_plan?.expires_at === null
                ? "ندارد"
                : `محدود مهلت زمانی انتخاب این درخواست تا تاریخ ${data?.data?.request_plan?.expires_at} میباشد.`}
            </li>
          </ul>
          <ul className="flex flex-col gap-0.5">
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              تعداد دفعات مجاز شما برای این درخواست {data?.data?.request_plan?.max_allocated_request || 0} عدد
              میباشد و پس از ثبت سومین درخواست، دسترسی به این بخش برای شما مقدور نیست.{" "}
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              {data?.data?.request_plan?.previous_requests > data?.data?.request_plan?.max_allocated_request && (
                <span className="font-bold">در خواستی باقی نمانده.</span>
              )}
              {data?.data?.request_plan?.previous_requests <= data?.data?.request_plan?.max_allocated_request && (
                <span>
                  درخواست
                  <span className="text-[#D5B260] font-bold">
                    {data?.data?.request_plan?.previous_requests} از {data?.data?.request_plan?.max_allocated_request}
                  </span>
                  (تنها {data?.data?.request_plan?.max_allocated_request - data?.data?.request_plan?.previous_requests} درخواست
                  باقی مانده است)
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
      <hr className="hidden md:block h-2 mb-10" />
      <div className="flex flex-col justify-center gap-6 lg:gap-8 2xl:gap-10">
        <div className="flex flex-col gap-6 md:gap-x-8 md:flex-row flex-wrap lg:gap-x-11 xl:gap-x-24 2xl:gap-x-32">
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              تعداد دانش آموزان نوجوان:
            </h3>
            <span className="text-base lg:text-lg font-medium">{data?.data?.students}</span>
          </div>
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              هزینه کلی عملیات:
            </h3>
            <span className="text-base lg:text-lg font-medium">
              {formatPrice(data?.data?.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              تاریخ برگزاری:
            </h3>
            <span className="text-base lg:text-lg font-medium">{toPersianDate(data?.data?.date)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-6 xl:gap-8 2xl:gap-10">
          <h3 className="text-base lg:text-base text-[#3B3B3B] min-w-fit">
            توضیحات تکمیلی:
          </h3>
          <p className="text-base font-medium leading-7">
            {data?.data?.body}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-4 xl:gap-x-20 2xl:grid-cols-[auto,auto,1fr]  2xl:gap-x-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:justify-normal xl:gap-12 2xl:gap-6">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              فایل پیوست نامه {typeField}:
            </h3>
            <a href={data?.data?.imam_letter?.original}>
              <button className="w-full h-12 px-4 min-w-fit md:w-60 text-base font-medium text-[#39A894] border border-[#39A894] rounded-[10px] hover:text-white hover:bg-[#39A894]">
                برای مشاهده فایل کلیک کنید
              </button>
            </a>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:justify-normal xl:gap-12 2xl:gap-6 lg:justify-self-end">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              فایل نامه رابط منطقه:
            </h3>
            <a href={data?.data?.area_interface_letter?.original}>
              <button className="w-full h-12 px-4 md:w-60 text-base font-medium text-[#39A894] border border-[#39A894] rounded-[10px] hover:text-white hover:bg-[#39A894]">
                برای مشاهده فایل کلیک کنید
              </button>
            </a>
          </div>
          {(data?.data?.final_amount || data?.data?.offer_amount) && (
            <div className="flex items-center w-full justify-between h-[73px] border rounded-[10px] pl-5 pr-6 md:gap-5 xl:px-7 lg:h-[86px] xl:gap-8 xl:max-w-md 2xl:gap-10">
              <span className="text-base lg:text-lg">
                هزینه پرداختی توسط آرمان:{" "}
              </span>
              <span className="text-base lg:text-2xl font-bold text-[#39A894]">
                  {data?.data?.final_amount ? formatNumber(data?.data?.final_amount) : formatNumber(data?.data?.offer_amount)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainGardeshJari;

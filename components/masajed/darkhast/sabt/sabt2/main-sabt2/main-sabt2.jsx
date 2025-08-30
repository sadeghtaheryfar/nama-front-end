"use client";
import { useEffect, useState, Suspense } from "react";
import Modal from "../modal/modal";
import Link from "next/link";
import Gardesh from "../../../../kartabl-darkhast/taeed/gardesh/gardesh";
import { toPersianDate  } from "../../../../../../components/utils/toPersianDate";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import HeaderSabt2 from "../../../../../../components/masajed/darkhast/sabt/sabt2/header-sabt2/header-sabt2";
import HeaderGolden2 from "../../../../../../components/masajed/darkhast/sabt/sabt2/header-sabt2/header-golden2";
// import HeaderTaeed from "@/components/masajed/kartabl-darkhast/taeed/header-taeed/header-taeed";
function formatToCurrency(amount) {
  const number = Number(amount);
  if (isNaN(number)) {
    return "مقدار وارد شده معتبر نیست";
  }
  const formattedNumber = number.toLocaleString("fa-IR");
  return `${formattedNumber} ریال`;
}

function numberToPersianWords(num) {
  const ones = [
    "", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه",
    "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده",
    "هفده", "هجده", "نوزده"
  ];
  const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
  const hundreds = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
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

const MainSabt2 = () => {
  const params = useSearchParams();

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

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

  const id = params.get("id");

  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }

  function formatPrice(num) {
    return Math.floor(num).toLocaleString("fa-IR") + " ریال";
  }

  const [requestData, setRequsestData] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    const fetching = async () => {
      try {
        const id = params.get("darkhast");
        const request = await axios.post(`/api/request/level_1?item_id=${itemId}&role=mosque_head_coach`, { id });
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

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const storedForm = localStorage.getItem("submittedForm");
    if (storedForm) {
      setFormData(JSON.parse(storedForm));
    }
    // localStorage.removeItem("submittedForm");
  }, []);
  

  // useEffect(() => {
  //   const fetching = async () => {
  //     try {
  //       const id = params.get("id");
  //       const request = await axios.post("/api/request/final", { id });
  //       console.log(request);

  //       if (request.data) {
  //         setRequsestData(request.data.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     // try {
  //     //   const active = await axios.get("/api/active");
  //     //   if (active.data) {
  //     //     setActiveCarts(active.data.data);
  //     //   }
  //     // } catch (error) {
  //     //   console.log(error);
  //     // }
  //   };
  //   fetching();
  // }, []);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    setLoading(true);
    try {
      const id = params.get("id");
      const request = await axios.post(`/api/request/confirm?item_id=${itemId}&role=mosque_head_coach`, { id });
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
      router.push(`/${itemId}/darkhast/sabt/sabt1/sabt2/sabt3?id=${id}`);
    }
  }

  return (
    <Suspense>
      {requestData?.golden ? (
        <HeaderGolden2 />
      ) : (
        <HeaderSabt2 />
      )}

      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-11 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
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
                  سقف تعداد نفرات مورد حمایت: {requestData.max_number_people_supported || 0}
                </li>
                <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
                  <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                  سرانه حمایتی هر نفر به مبلغ حداکثر {numberToPersianWords(requestData.support_for_each_person_amount)} ریال می باشد
                </li>
                <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
                  <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                  {requestData.expires_at === null
                    ? "ندارد"
                    : `محدود مهلت زمانی انتخاب این درخواست تا تاریخ ${requestData.expires_at} میباشد.`}
                </li>
              </ul>
              <ul className="flex flex-col gap-0.5">
                <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
                  <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                  تعداد دفعات مجاز شما برای این درخواست {requestData.max_allocated_request || 0} عدد
                  میباشد و پس از ثبت {numberToPersianWords(requestData.max_allocated_request)} درخواست، دسترسی به این بخش برای شما مقدور نیست.{" "}
                </li>
                <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
                  <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                  {requestData.previous_requests > requestData.max_allocated_request && (
                    <span className="font-bold">در خواستی باقی نمانده.</span>
                  )}
                  {requestData.previous_requests <= requestData.max_allocated_request && (
                    <span>
                      درخواست
                      <span className="text-[#D5B260] font-bold">
                        {Number(requestData.previous_requests) + 1} از {requestData.max_allocated_request}
                      </span>
                      (تنها {requestData.max_allocated_request - requestData.previous_requests} درخواست
                      باقی مانده است)
                    </span>
                  )}
                </li>
                {requestData?.staff && (
                  <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
                  <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                    این اکشن پلن ستادی می باشد .
                  </li>
                )}
              </ul>
            </div>
          </div>
          <hr className="hidden md:block h-2 mb-10" />
          <div className="flex flex-col justify-center gap-6 lg:gap-8 2xl:gap-10">
            <div className="flex flex-col gap-6 md:gap-x-8 md:flex-row flex-wrap lg:gap-x-11 xl:gap-x-24 2xl:gap-x-32">
              {requestData?.type !== "university" ? (
                <>
                    <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                        <h3 className="text-base lg:text-lg text-[#3B3B3B]">تعداد دانش آموزان نوجوان:</h3>
                        <span className="text-base lg:text-lg font-medium">{formData?.data?.students}</span>
                    </div>
                    <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                        <h3 className="text-base lg:text-lg text-[#3B3B3B]">هزینه کلی عملیات:</h3>
                        <span className="text-base lg:text-lg font-medium flex justify-center items-center gap-4">
                            {formatPrice(formData?.data?.amount)} 
                            {requestData?.staff && (
                              <>
                                {(requestData?.designated_by_council) ? (
                                  <small className="text-xs text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm mt-2">
                                    هزینه توسط شورا تعیین میگردد .
                                  </small>
                                ) : (
                                  <small className="text-xs text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm mt-2">
                                    مبلغ ثابت : {formatToCurrency(Number(requestData?.staff_amount))}
                                  </small>
                                )}
                              </>
                            )}
                        </span>
                    </div>
                </>
              ) : (
                <>
                    <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                        <h3 className="text-base lg:text-lg text-[#3B3B3B]">عنوان برنامه:</h3>
                        <span className="text-base lg:text-lg font-medium">{formData?.data?.title}</span>
                    </div>
                    <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                        <h3 className="text-base lg:text-lg text-[#3B3B3B]">محل برگزاری:</h3>
                        <span className="text-base lg:text-lg font-medium">{formData?.data?.location}</span>
                    </div>
                    <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                        <span className="text-base lg:text-lg font-medium flex justify-center items-center gap-4">
                          {requestData?.staff && (
                            <>
                              {(requestData?.designated_by_council) ? (
                                <p className="flex items-center gap-2 mt-2">
                                  هزینه توسط شورا تعیین میگردد .
                                </p>
                              ) : (
                                <p className="flex items-center gap-2 mt-2">
                                  مبلغ ثابت : {formatToCurrency(Number(requestData?.staff_amount))}
                                </p>
                              )}
                            </>
                          )}
                        </span>
                    </div>
                </>
              )}

              <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                <h3 className="text-base lg:text-lg text-[#3B3B3B]">تاریخ برگزاری:</h3>
                <span className="text-base lg:text-lg font-medium">{toPersianDate(formData?.data?.date)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-6 xl:gap-8 2xl:gap-10">
              <h3 className="text-base lg:text-base text-[#3B3B3B] min-w-fit">توضیحات تکمیلی:</h3>
              <p className="text-base font-medium leading-7">
                {formData?.data?.body}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-4 xl:gap-x-20 2xl:grid-cols-[auto,auto,1fr]  2xl:gap-x-12">
              {/* Display Imam Letter and other_imam_letter */}
              {(formData?.data?.imam_letter || (formData?.data?.other_imam_letter && formData.data.other_imam_letter.length > 0)) && (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
                  <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                    فایل پیوست نامه {typeField}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData?.data?.imam_letter?.original && (
                      <a href={formData.data.imam_letter.original} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={formData.data.imam_letter.original} alt="نامه امام جماعت" className="w-full h-full object-cover" />
                      </a>
                    )}
                    {formData?.data?.other_imam_letter?.map((file, index) => (
                      <a key={index} href={file.original} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={file.original} alt={`نامه امام جماعت ${index + 2}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display Area Interface Letter and other_area_interface_letter */}
              {(formData?.data?.area_interface_letter || (formData?.data?.other_area_interface_letter && formData.data.other_area_interface_letter.length > 0)) && (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6 lg:justify-self-end">
                  <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                    فایل نامه رابط منطقه:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData?.data?.area_interface_letter?.original && (
                      <a href={formData.data.area_interface_letter.original} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={formData.data.area_interface_letter.original} alt="نامه رابط منطقه" className="w-full h-full object-cover" />
                      </a>
                    )}
                    {formData?.data?.other_area_interface_letter?.map((file, index) => (
                      <a key={index} href={file.original} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={file.original} alt={`نامه رابط منطقه ${index + 2}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {formData?.data?.members && formData.data.members.length > 0 && (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
                  <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                    مربیان حلقه:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.data.members.map((member, index) => (
                      <span
                        key={index} // It's better to use member.id if available and unique, otherwise index is fine.
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded flex items-center gap-1"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(formData?.data?.images || (formData?.data?.images && formData.data.images.length > 0)) && (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
                  <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                    پیوست های بیشتر:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData?.data?.images?.map((file, index) => (
                      <a key={index} href={file.original} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={file.original} alt={`نامه امام جماعت ${index + 2}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center w-full justify-between h-[73px] border rounded-[10px] pl-5 pr-6 md:gap-5 xl:px-7 lg:h-[86px] xl:gap-8 xl:max-w-md 2xl:gap-10">
                <span className="text-base lg:text-lg">هزینه پرداختی توسط آرمان: </span>
                <span className="text-base lg:text-2xl font-bold text-[#39A894]">{formatPrice(formData?.data?.total_amount)}</span>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button 
                onClick={() => confirm()}
                className="flex justify-center items-center w-full h-12 text-base md:max-w-[214px] font-medium text-white bg-[#39A894] rounded-[10px]"
              >
                {loading ? 'صبر کنید ...' : 'تایید نهایی'}
              </button>
            </div>
          </div>
        </div>
    </Suspense>
  );
};

export default MainSabt2;

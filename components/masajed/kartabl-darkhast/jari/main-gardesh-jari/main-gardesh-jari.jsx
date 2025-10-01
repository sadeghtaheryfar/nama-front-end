import { toPersianDate  } from "../../../../../components/utils/toPersianDate";
import { formatPrice  } from "../../../../../components/utils/formatPrice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

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

const MainGardeshJari = ({data}) => {
  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }

  const toPersianText = (num) => {
    if (num === 0) return 'صفر';
    if (!num) return '';
    
    const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const dahgan = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const dahyek = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const sadgan = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const basex = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];
    
    let result = '';
    let base = 0;
    
    num = Math.floor(num);
    
    while (num > 0) {
      const text3 = convertLessThan1000(num % 1000);
      if (text3 !== '') {
        result = text3 + (base > 0 ? ' ' + basex[base] + ' ' : '') + result;
      }
      
      num = Math.floor(num / 1000);
      base++;
    }
    
    return result.trim() + ' ریال';
    
    function convertLessThan1000(num) {
      const n1 = num % 10;
      const n2 = Math.floor((num % 100) / 10);
      const n3 = Math.floor(num / 100);
      
      let result = '';
      
      if (n3 > 0) {
        result += sadgan[n3] + ' ';
      }
      
      if (n2 === 1) {
        result += dahyek[n1] + ' ';
      } else if (n2 > 1) {
        result += dahgan[n2] + ' ';
        if (n1 > 0) {
          result += 'و ' + yekan[n1] + ' ';
        }
      } else if (n1 > 0) {
        result += yekan[n1] + ' ';
      }
      
      return result.trim();
    }
  }

  const pathname = usePathname();
  const [typeField, setTypeField] = useState(null);
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  useEffect(() => {
    if (!pathname) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${itemId}&role=mosque_head_coach`);
        if (response.data) {
          if(response?.data?.data?.title == "مسجد")
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
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between items-center">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl flex justify-center items-center gap-[0.5rem]">
          {data?.data?.request_plan?.title || "بدون نام"}
          <span>({data?.data?.request_plan?.id || 0} {data?.data?.unit?.code ? `- ${data?.data?.unit?.code}` : ''})</span>
          {data?.data?.request_plan?.single_step && (
            <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mr-2 rounded-lg flex items-center justify-center">
              <p>تک مرحله ای</p>
            </div>
          )}
          {data?.data?.request_plan?.staff && (
            <div className="text-[#b7c725] bg-[#f4ffac] text-[12px] py-1 px-4 mr-2 rounded-lg flex items-center justify-center">
              <p>ستادی</p>
            </div>
          )}
        </h2>

        {data?.data?.status == 'action_needed' && (
          <div className="bg-[#FEF8E8] rounded-lg pb-5 pt-2 px-3.5 flex flex-col gap-2 lg:items-center lg:flex-row xl:p-4 lg:min-w-[25rem]">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-3">
                <img
                  width={0}
                  height={0}
                  className="w-7 xl:w-9"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/eslah/eslah.svg"}
                />
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-[#FABE00] xl:text-[18px]">
                    نیازمند اصلاح{" "}
                  </h3>
                  <p className="hidden 2xl:block text-base leading-9">
                    
                  </p>
                </div>
              </div>
              <p className="text-xs leading-5 xl:text-base 2xl:hidden">
                {data?.data?.message}
              </p>
            </div>
            {data?.data?.step == 'approval_mosque_head_coach' && (
              <Link href={`/${itemId}/kartabl-darkhast/eslah2?id=${data?.data?.id}`} className="w-full flex items-center justify-center self-center md:max-w-56 text-[#FFC200] text-xs font-semibold h-10 rounded-[10px] border border-[#FFC200] px-4 lg:text-white lg:bg-[#FFC200] xl:h-12 xl:text-base">
                برای اصلاح کلیک کنید
              </Link>
            )}
          </div>
        )}
      </div>

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
            {!data?.data?.single_step && (
              <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
                <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                سرانه حمایتی هر نفر به مبلغ حداکثر {numberToPersianWords(data?.data?.request_plan?.support_for_each_person_amount)} ریال می باشد
              </li>
            )}
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              {data?.data?.request_plan?.expires_at === null
                ? "محدودیت زمانی ندارد"
                : `محدود مهلت زمانی انتخاب این درخواست تا تاریخ ${data?.data?.request_plan?.expires_at} میباشد.`}
            </li>
          </ul>
          <ul className="flex flex-col gap-0.5">
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              تعداد دفعات مجاز شما برای این درخواست {data?.data?.request_plan?.max_allocated_request || 0} عدد
              میباشد و پس از ثبت {numberToPersianWords(data?.data?.request_plan?.max_allocated_request || 0)} درخواست، دسترسی به این بخش برای شما مقدور نیست.{" "}
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
            {data?.data?.request_plan?.staff && (
              <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                این اکشن پلن ستادی می باشد .
              </li>
            )}
            {data?.data?.request_plan?.single_step && (
              <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
                این درخواست یک مرحله ای می باشد و کل بودجه یکجا آزاد می شود
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mb-[1rem] grid grid-cols-1 lg:grid-cols-3 gap-4">
        <p>{(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' } {data?.data?.item?.title}</p>
        <p>
          <p>وابسته به واحد حقوقی  : {data?.data?.unit?.title}</p>
          {data?.data?.unit?.parent?.title && (
            <small>واحد محوری : {data?.data?.unit?.parent?.title}</small>
          )}
        </p>
        <p>{(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' } : {data?.data?.user?.name}</p>
        <p>کد ملی {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' } : {data?.data?.user?.national_id}</p>
        <p>شهر : {data?.data?.unit?.city?.title ? data?.data?.unit?.city?.title : '------'}</p>
        <p>شماره تماس {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' } : {data?.data?.user?.phone}</p>
        <p>منطقه : {data?.data?.unit?.region?.title ? data?.data?.unit?.region?.title : '------'}</p>
        <p>محله : {data?.data?.unit?.neighborhood?.title ? data?.data?.unit?.neighborhood?.title : '------'}</p>
      </div>

      <hr className="hidden md:block h-2 mb-10" />
      <div className="flex flex-col justify-center gap-6 lg:gap-8 2xl:gap-10">
        <div className="flex flex-col gap-6 md:gap-x-8 md:flex-row flex-wrap lg:gap-x-11 xl:gap-x-24 2xl:gap-x-32">
          {data?.data?.request_plan?.type !== "university" ? (
            <>
              <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                <h3 className="text-base lg:text-lg text-[#3B3B3B]">
                  تعداد دانش آموزان نوجوان:
                </h3>
                <span className="text-base lg:text-lg font-medium">
                  {data?.data?.students}
                </span>
              </div>
              <div className="flex items-start justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                <h3 className="text-base lg:text-lg text-[#3B3B3B]">
                  هزینه کلی عملیات:
                </h3>
                <span className="text-base lg:text-lg font-medium">
                  {formatPrice(data?.data?.amount)} ({toPersianText(data?.data?.amount)})
                  {data?.data?.request_plan?.staff && (
                    <small className="text-xs text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm">
                      {data?.data?.request_plan?.designated_by_council ? (
                        "هزینه توسط شورا تعیین میگردد ."
                      ) : (
                        `مبلغ ثابت : ${formatPrice(Number(data?.data?.request_plan?.staff_amount))}`
                      )}
                    </small>
                  )}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                <h3 className="text-base lg:text-lg text-[#3B3B3B]">
                  عنوان برنامه:
                </h3>
                <span className="text-base lg:text-lg font-medium">
                  {data?.data?.title}
                </span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                <h3 className="text-base lg:text-lg text-[#3B3B3B]">
                  محل برگزاری:
                </h3>
                <span className="text-base lg:text-lg font-medium">
                  {data?.data?.location}
                </span>
              </div>
              {data?.data?.request_plan?.staff && (
                <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
                  <h3 className="text-base lg:text-lg text-[#3B3B3B]">
                  </h3>
                  <p className="flex items-center gap-2">
                    {data?.data?.request_plan?.designated_by_council ? (
                      "هزینه توسط شورا تعیین میگردد ."
                    ) : (
                      `مبلغ ثابت : ${formatPrice(Number(data?.data?.request_plan?.staff_amount))}`
                    )}
                  </p>
                </div>
              )}
            </>
          )}


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

        {data?.data?.members && data?.data.members.length > 0 && (
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              مربیان حلقه:
            </h3>
            <div className="flex flex-wrap gap-2">
              {data?.data.members.map((member, index) => (
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

        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-4 xl:gap-x-20 2xl:grid-cols-[auto,auto,1fr] 2xl:gap-x-12">
          {(data?.data?.imam_letter?.original || (data?.data?.other_imam_letter && data.data.other_imam_letter.length > 0)) && (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
                    <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                        فایل پیوست نامه {typeField}:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.data.imam_letter?.original && (
                            ((file) => {
                                const isPdf = file.original.toLowerCase().endsWith('.pdf');
                                return (
                                    <a href={file.original}  rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
                                        {isPdf ? (
                                            <>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10"/>
                                                <path d="M8 2H17C19 2 20 3 20 5V6.38" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>

                                                <p className="text-xs text-gray-700 mt-2 transition-opacity duration-200">
                                                    کلیک کنید
                                                </p>
                                            </>
                                        ) : (
                                            <img src={file.original} alt="نامه امام جماعت" className="w-full h-full object-cover" />
                                        )}
                                    </a>
                                );
                            })(data.data.imam_letter)
                        )}
                        {data.data.other_imam_letter?.map((file, index) => {
                            const isPdf = file.original.toLowerCase().endsWith('.pdf');
                            return (
                                <a key={index} href={file.original}  rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
                                    {isPdf ? (
                                        <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10"/>
                                            <path d="M8 2H17C19 2 20 3 20 5V6.38" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>

                                            <p className="text-xs text-gray-700 mt-2 transition-opacity duration-200">
                                                کلیک کنید
                                            </p>
                                        </>
                                    ) : (
                                        <img src={file.original} alt={`نامه امام جماعت ${index + 2}`} className="w-full h-full object-cover" />
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {(data?.data?.area_interface_letter?.original || (data?.data?.other_area_interface_letter && data.data.other_area_interface_letter.length > 0)) && (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6 lg:justify-self-end">
                    <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                        فایل نامه رابط منطقه:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.data.area_interface_letter?.original && (
                            ((file) => {
                                const isPdf = file.original.toLowerCase().endsWith('.pdf');
                                return (
                                    <a href={file.original}  rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
                                        {isPdf ? (
                                            <>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10"/>
                                                <path d="M8 2H17C19 2 20 3 20 5V6.38" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>

                                                <p className="text-xs text-gray-700 mt-2 transition-opacity duration-200">
                                                    کلیک کنید
                                                </p>
                                            </>
                                        ) : (
                                            <img src={file.original} alt="نامه رابط منطقه" className="w-full h-full object-cover" />
                                        )}
                                    </a>
                                );
                            })(data.data.area_interface_letter)
                        )}
                        {data.data.other_area_interface_letter?.map((file, index) => {
                            const isPdf = file.original.toLowerCase().endsWith('.pdf');
                            return (
                                <a key={index} href={file.original}  rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
                                    {isPdf ? (
                                        <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10"/>
                                            <path d="M8 2H17C19 2 20 3 20 5V6.38" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>

                                            <p className="text-xs text-gray-700 mt-2 transition-opacity duration-200">
                                                کلیک کنید
                                            </p>
                                        </>
                                    ) : (
                                        <img src={file.original} alt={`نامه رابط منطقه ${index + 2}`} className="w-full h-full object-cover" />
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {(data?.data?.images?.original || (data?.data?.images && data.data.images.length > 0)) && (
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
                  <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                      پیوست های بیشتر :
                  </h3>
                  <div className="flex flex-wrap gap-2">
                      {data.data.images?.map((file, index) => {
                          const isPdf = file.original.toLowerCase().endsWith('.pdf');
                          return (
                              <a
                                  key={index}
                                  href={file.original}
                                  
                                  rel="noopener noreferrer"
                                  className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group" // اضافه کردن relative و group برای استایل هاور
                              >
                                  {isPdf ? (
                                      <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10"/>
                                            <path d="M8 2H17C19 2 20 3 20 5V6.38" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>

                                            <p className="text-xs text-gray-700 mt-2 transition-opacity duration-200">
                                                کلیک کنید
                                            </p>
                                        </>
                                  ) : (
                                      <img src={file.original} alt={`پیوست ${index + 1}`} className="w-full h-full object-cover" />
                                  )}
                              </a>
                          );
                      })}
                  </div>
              </div>
            )}
            
            {(data?.data?.total_amount != null)&& (
              <div className="flex items-center w-full justify-between h-[73px] border rounded-[10px] pl-5 pr-6 md:gap-5 xl:px-7 lg:h-[86px] xl:gap-8 xl:max-w-md 2xl:gap-10">
                  <span className="text-base lg:text-lg">
                      هزینه پرداختی توسط آرمان:{" "}
                  </span>
                  <span className="text-base lg:text-2xl font-bold text-[#39A894]">
                    {formatPrice(data.data.total_amount)}
                  </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MainGardeshJari;

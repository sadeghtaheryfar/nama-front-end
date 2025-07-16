"use client";
import { toPersianDate  } from "../../../../../components/utils/toPersianDate";
import { formatPrice  } from "../../../../../components/utils/formatPrice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Modal from "./modal";
import toast from "react-hot-toast";

const MainGardeshJariRole = ({data,back_steps}) => {
  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }
  
  // Function to convert numbers to Persian words
  function convertToWords(amount) {
    if (!amount) return "";
    
    // A simple mapping function for demonstration
    // In a real app, you might want to use a more comprehensive library
    const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];
    
    // Simple implementation for demonstration
    if (amount < 1000000) {
      return Math.floor(amount / 1000) + " هزار";
    } else if (amount < 1000000000) {
      return Math.floor(amount / 1000000) + " میلیون";
    } else {
      return Math.floor(amount / 1000000000) + " میلیارد";
    }
  }
  
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [amountInWords, setAmountInWords] = useState("");
  const [des, setDes] = useState("");
  const [desError, setDesError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [statusSend, setStatusSend] = useState("");
  const [role, setRole] = useState(searchParams.get("role"));
  const [itemId, setItemId] = useState(searchParams.get("item_id"));
  const [id, setId] = useState(searchParams.get("id"));
  const router = useRouter();
  const [fileUploaded, setFileUploaded] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  useEffect(() => {
    setRole(searchParams.get("role"));
    setItemId(searchParams.get("item_id"));
    setId(searchParams.get("id"));
  }, [searchParams]);

  // Update amountInWords when amount changes
  useEffect(() => {
    if (amount && !isNaN(amount)) {
      setAmountInWords(convertToWords(Number(amount)));
    } else {
      setAmountInWords("");
    }
  }, [amount]);

  const convertToPersianWords = (num) => {
    if (!num) return "";
    
    const yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
    const dahgan = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
    const dah_ta_bist = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
    const sadgan = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
    const scale = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];
    
    if (num === 0) return "صفر";
    
    let result = "";
    let scaleIndex = 0;
    
    // Convert to string and process in groups of 3 digits
    const numStr = num.toString();
    const groups = [];
    for (let i = numStr.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      groups.unshift(numStr.substring(start, i));
    }
    
    for (let i = 0; i < groups.length; i++) {
      const groupIndex = groups.length - 1 - i;
      const group = parseInt(groups[i]);
      
      if (group === 0) continue;
      
      let groupStr = "";
      const hundreds = Math.floor(group / 100);
      const tens = Math.floor((group % 100) / 10);
      const ones = group % 10;
      
      if (hundreds > 0) {
        groupStr += sadgan[hundreds] + " ";
      }
      
      if (tens === 1) {
        groupStr += dah_ta_bist[ones] + " ";
      } else {
        if (tens > 0) {
          groupStr += dahgan[tens] + " ";
        }
        if (ones > 0) {
          groupStr += yekan[ones] + " ";
        }
      }
      
      if (groupStr) {
        result += groupStr + scale[groupIndex] + " ";
      }
    }
    
    return result.trim() + " ریال";
  };

  const validateAmount = (value) => {
    if (!value && (data?.data?.need_offer_amount || data?.data?.need_final_amount)) {
      setAmountError("لطفا مبلغ را وارد کنید");
      return false;
    }
    if (value && isNaN(value)) {
      setAmountError("لطفا یک عدد معتبر وارد کنید");
      return false;
    }
    setAmountError("");
    return true;
  };

  const validateDescription = (value) => {
    if (!value) {
      setDesError("لطفا توضیحات را وارد کنید");
      return false;
    }
    setDesError("");
    return true;
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const handleDesChange = (event) => {
    const value = event.target.value;
    setDes(value);
    validateDescription(value);
  };

  const hnadleForm = async (e) => {
    setMessage({ text: "", type: "" });

    // Validate fields
    const isAmountValid = validateAmount(amount);
    const isDesValid = validateDescription(des);

    if (!isDesValid) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else if ((data?.data?.need_offer_amount || data?.data?.need_final_amount) && !isAmountValid) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else if (e == 'action_needed' && !selectedReason) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else {
      setStatusSend("");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("action", e);
    formDataToSend.append("comment", des);
    if(data?.data?.need_final_amount)
    {
      formDataToSend.append("final_amount", amount);
    }
    if(data?.data?.need_offer_amount)
    {
      formDataToSend.append("offer_amount", amount);
    }
    if(e == 'action_needed')
    {
      formDataToSend.append("to", selectedReason);
    }
    setLoading(true);

    try {
      const submitForm = await axios.post(
        `https://arman.armaniran.org/api/v1/requests/${id}/admin-submit?item_id=${itemId}&role=${role}`,
        formDataToSend,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("token")}`,
            Accept: "application/json",
          },
        }
      );

      if (submitForm) {
        toast.success("عملیات با موفقیت انجام شد . به زودی به صفحه اصلی منتقل می شوید",{
          duration: 3000,
        });
        setTimeout(() => {
          router.push(`/role/kartabl?role=${role}&item_id=${itemId}`);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      if(error?.response?.data?.error)
      {
        setStatusSend(error?.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const translateRole = (role) => {
    if (role === "mosque_head_coach") {
        return "سرمربی مسجد";
    } else if (role === "mosque_cultural_officer") {
        return " مسئول فرهنگی مسجد";
    } else if (role === "area_interface") {
        return "رابط منطقه";
    } else if (role === "executive_vice_president_mosques") {
        return "معاونت اجرایی مساجد";
    } else if (role === "deputy_for_planning_and_programming") {
        return "معاونت طرح و برنامه";
    } else {
        return "نامشخص";
    }
  };

  function formatToCurrency(amount) {
    const number = Number(amount);
    
    if (isNaN(number)) {
      return "مقدار وارد شده معتبر نیست";
    }
    
    const formattedNumber = number.toLocaleString("fa-IR");
    
    return `${formattedNumber} ریال`;
  }

  const copyText = (e) => {
    navigator.clipboard.writeText(e);
    toast.success('قیمت با موفقیت کپی شد .')
  }

  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-[2rem] md:p-9 xl:px-12 xl:py-[53px] w-full">
      <div className="flex justify-between items-center pb-[2rem]">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl flex justify-center items-center gap-[0.5rem]">
          {data?.data?.request_plan?.title || "بدون نام"}
          <span>({data?.data?.request_plan?.id || 0})</span>
          {data?.data?.single_step && (
            <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mr-2 rounded-lg flex items-center justify-center">
              <p>تک مرحله ای</p>
            </div>
          )}
        </h2>

        {/* {data?.data?.status == 'rejected' ? (
          <div className="text-sm font-semibold text-[#D32F2F] bg-[#F8E0E0] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            رد شده 
          </div>
        ): data?.data?.status == 'in_progress' ? (
          <div className="text-sm font-semibold text-[#3C98CE] bg-[#D9EFFE] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            جاری
          </div>
        ): data?.data?.status == 'done' ? (
          <div className="text-sm font-semibold text-[#25C7AA] bg-[#D9EFFE] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            تاید و ارسال
          </div>
        ) : data?.data?.status == 'action_needed' ? (
          <div className="text-sm font-semibold text-[#FFC200] bg-[#FEF4D9] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            نیازمند اصلاح
          </div>
        ) : (
          <div className="text-sm font-semibold text-[#25C7AA] bg-[#DEF7F2] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            تایید شده
          </div>
        )} */}
      </div>

      <div className="mb-[1rem] grid grid-cols-1 lg:grid-cols-3 gap-4">
        <p>شناسه یکتا واحد : {data?.data?.item?.id}</p>
        <p>{data?.data?.item?.title}</p>
        <p>
          <p>واحد حقوقی : {data?.data?.unit?.title}</p>
          {data?.data?.unit?.parent?.title && (
            <small>واحد محوری : {data?.data?.unit?.parent?.title}</small>
          )}
        </p>
        <p>سرمربی : {data?.data?.user?.name}</p>
        <p>منطقه : {data?.data?.unit?.region?.title}</p>
        <p>محله : {data?.data?.unit?.neighborhood?.title}</p>
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
            <span className="text-base lg:text-lg font-medium cursor-pointer" onClick={(e) => copyText(data?.data?.amount)}>
              {formatPrice(data?.data?.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              هزینه پیشنهادی آرمان:
            </h3>
            <span onClick={(e) => copyText((data?.data?.final_amount ? data?.data?.final_amount : data?.data?.total_amount))} className="text-base lg:text-lg font-medium cursor-pointer">{(data?.data?.final_amount) ? formatPrice(data?.data?.final_amount) : formatPrice(data?.data?.total_amount)}</span>
          </div>
          {data?.data?.offer_amount !== null && data?.data?.offer_amount !== undefined && data?.data?.offer_amount !== 0 && (
            <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
              <h3 className="text-base lg:text-lg text-[#3B3B3B]">
                هزینه پیشنهادی معاونت مساجد:
              </h3>
              <span onClick={(e) => copyText(data?.data?.offer_amount)} className="cursor-pointer text-base lg:text-lg font-medium">
                {(data?.data?.offer_amount || data?.data?.offer_amount === 0) ? formatPrice(data?.data?.offer_amount) : 'وارد نشده است'}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-6 xl:gap-8 2xl:gap-10">
          <h3 className="text-base lg:text-base text-[#3B3B3B] min-w-fit">
            توضیحات تکمیلی:
          </h3>
          <p className="text-base font-medium leading-7">
            {data?.data?.body}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-4 xl:gap-x-20 2xl:grid-cols-[auto,auto,1fr] 2xl:gap-x-12">
          {(data?.data?.imam_letter?.original || (data?.data?.other_imam_letter && data.data.other_imam_letter.length > 0)) && (
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
                    <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                        فایل پیوست نامه امام جماعت:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.data.imam_letter?.original && (
                            ((file) => {
                                const isPdf = file.original.toLowerCase().endsWith('.pdf');
                                return (
                                    <a href={file.original} target="_blank" rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
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
                                <a key={index} href={file.original} target="_blank" rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
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
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-start lg:justify-normal xl:gap-12 2xl:gap-6">
                    <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                        فایل نامه رابط منطقه:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.data.area_interface_letter?.original && (
                            ((file) => {
                                const isPdf = file.original.toLowerCase().endsWith('.pdf');
                                return (
                                    <a href={file.original} target="_blank" rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
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
                                <a key={index} href={file.original} target="_blank" rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
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
                                <a key={index} href={file.original} target="_blank" rel="noopener noreferrer" className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center flex-col relative group">
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
        </div>
      </div>

      {(((data?.data?.status == "in_progress" || data?.data?.status == "action_needed") && data?.data?.role?.[0] == role) || data?.data?.status != "in_progress") && (
        <hr className="hidden md:block h-2 my-10" />
      )}

      {data?.data?.total_amount && (
        <div class="flex items-center p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
          <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <div>
            <p>حداکثر مبلغ قابل پرداخت در مرحله درخواست : {formatPrice(Number(data.data.total_amount * 0.5))} / {convertToPersianWords(Number(data.data.total_amount * 0.5))}</p>
          </div>
        </div>
      )}
      
      {((data?.data?.status == "in_progress" || data?.data?.status == "action_needed") && data?.data?.role?.[0] == role) && (
        <div className="w-full bg-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
            {(data?.data?.need_offer_amount) ? (
              <div className="mb-4">
                <label htmlFor="amount" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
                  هزینه پیشنهادی توسط آرمان <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    name="amount"
                    placeholder="در اینجا تایپ کنید …"
                    className={`block w-full p-4 border rounded-lg text-gray-700 ${
                      amountError ? "border-red-500 bg-red-50" : amount ? "border-green-500 bg-green-50" : "border-[#DFDFDF]"
                    }`}
                  />
                  {amountError && (
                    <p className="mt-1 text-xs text-red-500">{amountError}</p>
                  )}
                </div>
                {amount && !isNaN(amount) && (
                  <>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">مبلغ به حروف: </span>
                      {convertToPersianWords(Number(amount))}
                    </div>
                  
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">مبلغ به عدد: </span>
                      {formatToCurrency(Number(amount))}
                    </div>
                  </>
                )}
              </div>
            ) : (data?.data?.need_final_amount) ? (
              <div className="mb-4">
                <label htmlFor="amount" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
                  هزینه پرداختی توسط آرمان <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    name="amount"
                    placeholder="در اینجا تایپ کنید …"
                    className={`block w-full p-4 border rounded-lg text-gray-700 ${
                      amountError ? "border-red-500 bg-red-50" : amount ? "border-green-500 bg-green-50" : "border-[#DFDFDF]"
                    }`}
                  />
                  {amountError && (
                    <p className="mt-1 text-xs text-red-500">{amountError}</p>
                  )}
                </div>
                {amount && !isNaN(amount) && (
                  <>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">مبلغ به حروف: </span>
                      {convertToPersianWords(Number(amount))}
                    </div>
                  
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">مبلغ به عدد: </span>
                      {formatToCurrency(Number(amount))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="mb-4 mt-3">
            <label htmlFor="textarea" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              توضیحات تکمیلی {translateRole(role)} <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
            </label>
            <textarea
              type="text"
              className={`block w-full p-4 border rounded-lg text-gray-700 md:h-24 ${
                desError ? "border-red-500 bg-red-50" : des ? "border-green-500 bg-green-50" : "border-[#DFDFDF]"
              }`}
              id="des"
              name="des"
              value={des}
              onChange={handleDesChange}
              rows="10"
              cols="15"
              autoComplete="on"
              placeholder="در اینجا تایپ کنید …"
            />
            {desError && (
              <p className="mt-1 text-xs text-red-500">{desError}</p>
            )}
          </div>
          
          <div className="flex justify-center w-full flex-col items-center">
            <div className="flex justify-center items-center flex-row flex-wrap gap-[1rem]">
              {back_steps && (
                <button
                  onClick={() => setShowModal(true)}
                  className={`px-[2rem] h-12 text-base font-medium rounded-[10px] ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#F3BF19] text-white hover:border hover:border-[#F3BF19] hover:text-[#F3BF19] hover:bg-white"
                  }`}
                  disabled={loading}
                >
                  {loading ? 'صبر کنید ...' : 'ارجاع جهت اصلاح'}
                </button>
              )}

              <button
                onClick={() => hnadleForm('accept')}
                className={`px-[2rem] h-12 text-base font-medium rounded-[10px] ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#39A894] text-white hover:border hover:border-[#39A894] hover:text-[#39A894] hover:bg-white"
                }`}
                disabled={loading}
              >
                {loading ? 'صبر کنید ...' : 'تایید درخواست'}
              </button>

              <button
                onClick={() => hnadleForm('reject')}
                className={`px-[2rem] h-12 text-base font-medium rounded-[10px] ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#D32F2F] text-white hover:border hover:border-[#D32F2F] hover:text-[#D32F2F] hover:bg-white"
                }`}
                disabled={loading}
              >
                {loading ? 'صبر کنید ...' : 'رد کلی'}
              </button>
            </div>

            <div className="text-center mt-[0.5rem] text-red-600 flex justify-center items-center gap[0.5rem]">
              <p className="font-semibold"> مهم : </p>

              <small>در صورت رد کلی یکی از فرصت های اکشن پلین کاربر می سوزد .</small>
            </div>
            
            {message.text && (
              <p
                className={`mt-4 text-center text-sm p-2 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </p>
            )}
            <span className="p-2 text-red-600">{statusSend}</span>
          </div>
        </div>
      )}

      {(data?.data?.status != "in_progress") && (
        <div>
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              هزینه پرداختی توسط آرمان:
            </h3>
            <span className="text-base lg:text-lg font-medium">{(data?.data?.final_amount) ? formatPrice(data?.data?.final_amount) : 'وارد نشده است'}</span>
          </div>

          <div className="mt-[1rem]">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              نظر {data?.data?.last_updated_by}:
            </h3>
            <span className="text-base lg:text-lg font-medium">{data?.data?.message}</span>
          </div>
        </div>
      )}

      <Modal showModal={showModal} setShowModal={setShowModal} hnadleForm={hnadleForm} selectedReason={selectedReason} setSelectedReason={setSelectedReason} backSteps={back_steps}  />
    </div>
  );
};

export default MainGardeshJariRole;
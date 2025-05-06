"use client";
import { toPersianDate } from "../../../../../components/utils/toPersianDate";
import { formatPrice } from "../../../../../components/utils/formatPrice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Modal from "./modal";

const MainGozareshJariRole = ({data, back_steps}) => {
  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }
  
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState("");
  const [des, setDes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [statusSend, setStatusSend] = useState("");
  const [role, setRole] = useState(searchParams.get("role"));
  const [itemId, setItemId] = useState(searchParams.get("item_id"));
  const [id, setId] = useState(searchParams.get("id"));
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  
  // Form validation states
  const [errors, setErrors] = useState({
    amount: "",
    des: "",
    selectedReason: ""
  });
  const [touched, setTouched] = useState({
    amount: false,
    des: false,
    selectedReason: false
  });

  useEffect(() => {
    setRole(searchParams.get("role"));
    setItemId(searchParams.get("item_id"));
    setId(searchParams.get("id"));
  }, [searchParams]);

  // Validate form fields
  const validateField = (field, value) => {
    let errorMessage = "";
    
    if (field === "amount") {
      if ((data?.data?.need_offer_amount || data?.data?.need_final_amount) && !value) {
        errorMessage = "مبلغ را وارد کنید";
      } else if (value && isNaN(value) || value < 0) {
        errorMessage = "لطفا یک مقدار عددی معتبر وارد کنید";
      }
    } else if (field === "des") {
      if (!value) {
        errorMessage = "توضیحات را وارد کنید";
      }
    } else if (field === "selectedReason") {
      if (!value && selectedReason === "action_needed") {
        errorMessage = "دلیل ارجاع را انتخاب کنید";
      }
    }
    
    return errorMessage;
  };

  // Handle field blur for validation
  const handleBlur = (field) => {
    const value = field === "amount" ? amount : field === "des" ? des : selectedReason;
    const error = validateField(field, value);
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Handle field change
  const handleChange = (field, value) => {
    if (field === "amount") {
      setAmount(value);
    } else if (field === "des") {
      setDes(value);
    } else if (field === "selectedReason") {
      setSelectedReason(value);
    }
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const hnadleForm = async (e) => {
    setMessage({ text: "", type: "" });
    
    // Set all fields as touched to trigger validation
    setTouched({
      amount: true,
      des: true,
      selectedReason: e === 'action_needed'
    });
    
    // Validate all fields
    const amountError = validateField("amount", amount);
    const desError = validateField("des", des);
    const reasonError = e === 'action_needed' ? validateField("selectedReason", selectedReason) : "";
    
    setErrors({
      amount: amountError,
      des: desError,
      selectedReason: reasonError
    });
    
    // Check if there are any errors
    if (desError || amountError || (e === 'action_needed' && reasonError)) {
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
        `https://arman.armaniran.org/api/v1/reports/${id}/admin-submit?item_id=${itemId}&role=${role}`,
        formDataToSend,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("token")}`,
            Accept: "application/json",
          },
        }
      );

      if (submitForm) {
        router.push(`/role/kartabl-gozaresh?role=${role}&item_id=${itemId}`);
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
  
  // Convert number to Persian text
  const convertToPersianText = (num) => {
    if (!num) return "";
    
    const persianUnits = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const persianTeens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const persianTens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const persianHundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const persianBig = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];
    
    if (num === 0) return 'صفر';
    
    let result = '';
    let groups = [];
    let n = parseInt(num);
    
    while (n > 0) {
      groups.push(n % 1000);
      n = Math.floor(n / 1000);
    }
    
    for (let i = groups.length - 1; i >= 0; i--) {
      let group = groups[i];
      let groupText = '';
      
      let hundreds = Math.floor(group / 100);
      let tens = Math.floor((group % 100) / 10);
      let units = group % 10;
      
      if (hundreds > 0) {
        groupText += persianHundreds[hundreds] + ' ';
      }
      
      if (tens === 1) {
        groupText += persianTeens[units] + ' ';
      } else {
        if (tens > 1) {
          groupText += persianTens[tens] + ' ';
        }
        if (units > 0) {
          groupText += persianUnits[units] + ' ';
        }
      }
      
      if (group > 0) {
        groupText += persianBig[i] + ' ';
      }
      
      result += groupText;
    }
    
    return result.trim() + ' ریال';
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
  
  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-[2rem] md:p-9 xl:px-12 xl:py-[53px] w-full">
      <div className="flex justify-between items-center pb-[2rem]">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl">
          {data?.data?.request?.request_plan?.title || "بدون نام"}
          <span>({data?.data?.request?.request_plan?.id || 0})</span>
        </h2>

        {data?.data?.status == 'rejected' ? (
          <div className="text-sm font-semibold text-[#D32F2F] bg-[#F8E0E0] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            رد شده 
          </div>
        ): data?.data?.status == 'in_progress' ? (
          <div className="text-sm font-semibold text-[#3C98CE] bg-[#D9EFFE] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            جاری
          </div>
        ) : data?.data?.status == 'action_needed' ? (
          <div className="text-sm font-semibold text-[#FFC200] bg-[#FEF4D9] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            نیازمند اصلاح
          </div>
        ) : (
          <div className="text-sm font-semibold text-[#25C7AA] bg-[#DEF7F2] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
            تایید شده
          </div>
        )}
      </div>

      <div className="mb-[1rem] grid grid-cols-1 lg:grid-cols-3 gap-4">
        <p>{data?.data?.request?.item?.title}</p>
        <p>واحد حقوقی : {data?.data?.request?.unit?.title}</p>
        <p>سرمربی : {data?.data?.request?.user?.name}</p>
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
            تاریخ برگزاری:
            </h3>
            <span className="text-base lg:text-lg font-medium">
              {toPersianDate(data?.data?.date)}
            </span>
          </div>
          {(data?.data?.request?.offer_amount) && (
            <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
              <h3 className="text-base lg:text-lg text-[#3B3B3B]">
                هزینه پیشنهادی معاونت مساجد:
              </h3>
              <span className="text-base lg:text-lg font-medium">{(data?.data?.request?.offer_amount) ? formatPrice(data?.data?.request?.offer_amount) : 'وارد نشده است'}</span>
            </div>
          )}
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              هزینه پیشنهادی آرمان:
            </h3>
            <span className="text-base lg:text-lg font-medium">{(data?.data?.request?.final_amount) ? formatPrice(data?.data?.request?.final_amount) : formatPrice(data?.data?.total_amount)}</span>
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
          <div className="flex flex-col gap-4 2xl:gap-6">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              فایل پیوست تصویری:
            </h3>
            
            <div className="flex flex-wrap w-full gap-[1rem]">
              {data?.data?.images?.map((item) => (
                <a href={item?.original} key={item?.id}>
                  <button className="px-[2rem] h-12 px-4 md:w-60 text-base font-medium text-[#345894] border border-[#345894] rounded-[10px] hover:text-white hover:bg-[#345894]">
                    برای مشاهده فایل کلیک کنید
                  </button>
                </a>
              ))}
            </div>
          </div>

          {(data?.data?.video?.original) && (
            <div className="flex flex-col gap-4 2xl:gap-6">
              <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
                فایل پیوست ویدئو:
              </h3>
              
              <div className="flex flex-wrap w-full gap-[1rem]">
                <a href={data?.data?.video?.original}>
                  <button className="px-[2rem] h-12 px-4 md:w-60 text-base font-medium text-[#345894] border border-[#345894] rounded-[10px] hover:text-white hover:bg-[#345894]">
                    برای مشاهده فایل کلیک کنید
                  </button>
                  </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {((data?.data?.status == "in_progress" && data?.data?.role?.[0] == role) || data?.data?.status != "in_progress") && (
        <hr className="hidden md:block h-2 my-10" />
      )}

      {(data?.data?.status == "in_progress" && data?.data?.role?.[0] == role) && (
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
                    onChange={(event) => handleChange("amount", event.target.value)}
                    onBlur={() => handleBlur("amount")}
                    name="amount"
                    placeholder="در اینجا تایپ کنید …"
                    className={`block w-full p-4 border rounded-lg text-gray-700 ${
                      errors.amount ? 'border-red-500 bg-red-50' : touched.amount && !errors.amount ? 'border-green-500 bg-green-50' : 'border-[#DFDFDF]'
                    }`}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                {amount && <small className="block mt-1 text-gray-600">{convertToPersianText(amount)}</small>}
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
                    onChange={(event) => handleChange("amount", event.target.value)}
                    onBlur={() => handleBlur("amount")}
                    name="amount"
                    placeholder="در اینجا تایپ کنید …"
                    className={`block w-full p-4 border rounded-lg text-gray-700 ${
                      errors.amount ? 'border-red-500 bg-red-50' : touched.amount && !errors.amount ? 'border-green-500 bg-green-50' : 'border-[#DFDFDF]'
                    }`}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                {amount && <small className="block mt-1 text-gray-600">{convertToPersianText(amount)}</small>}
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
              className={`block w-full p-4 border rounded-lg text-gray-700 md:h-24 ${
                errors.des ? 'border-red-500 bg-red-50' : touched.des && !errors.des ? 'border-green-500 bg-green-50' : 'border-[#DFDFDF]'
              }`}
              id="des"
              name="des"
              value={des}
              onChange={(event) => handleChange("des", event.target.value)}
              onBlur={() => handleBlur("des")}
              rows="10"
              cols="15"
              placeholder="در اینجا تایپ کنید …"
            />
            {errors.des && <p className="text-red-500 text-sm mt-1">{errors.des}</p>}
          </div>
          
          <div className="flex justify-center w-full flex-col items-center">
            <div className="flex justify-center items-center flex-row flex-wrap gap-[1rem]">
              <button
                onClick={() => setShowModal(true)}
                className="px-[2rem] h-12 text-white bg-[#F3BF19] text-base font-medium rounded-[10px] hover:border border-[#F3BF19] hover:text-[#F3BF19] hover:bg-white md:max-w-[214px]"
              >
                {loading ? 'صبر کنید ...' : 'ارجاع جهت اصلاح'}
              </button>

              <button
                onClick={() => hnadleForm('accept')}
                className="px-[2rem] h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white md:max-w-[214px]"
              >
                {loading ? 'صبر کنید ...' : 'تایید درخواست'}
              </button>

              <button
                onClick={() => hnadleForm('reject')}
                className="px-[2rem] h-12 text-white bg-[#D32F2F] text-base font-medium rounded-[10px] hover:border border-[#D32F2F] hover:text-[#D32F2F] hover:bg-white md:max-w-[214px]"
              >
                {loading ? 'صبر کنید ...' : 'رد کلی'}
              </button>
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

      <Modal showModal={showModal} setShowModal={setShowModal} hnadleForm={hnadleForm} selectedReason={selectedReason} setSelectedReason={setSelectedReason} backSteps={back_steps} />
    </div>
  );
};

export default MainGozareshJariRole;

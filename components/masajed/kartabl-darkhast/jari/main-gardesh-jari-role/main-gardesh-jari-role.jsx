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

const MainGardeshJariRole = ({data}) => {
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

  useEffect(() => {
    setRole(searchParams.get("role"));
    setItemId(searchParams.get("item_id"));
    setId(searchParams.get("id"));
  }, [searchParams]);

  const hnadleForm = async (e) => {
    setMessage({ text: "", type: "" });

    if (!des) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    }else if((data?.data?.need_offer_amount || data?.data?.need_final_amount) && !amount){
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    }else if(e == 'action_needed' && !selectedReason){
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    }else {
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/requests/${id}/admin-submit?item_id=${itemId}&role=${role}`,
        formDataToSend,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("token")}`,
            Accept: "application/json",
          },
        }
      );

      if (submitForm) {
        router.push(`/role/kartabl?role=${role}&item_id=${itemId}`);
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
  
  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-[2rem] md:p-9 xl:px-12 xl:py-[53px] w-full">
      <div className="flex justify-between items-center pb-[2rem]">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl">
          {data?.data?.request_plan?.title || "بدون نام"}
          <span>({data?.data?.request_plan?.id || 0})</span>
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
              هزینه پیشنهادی معاونت مساجد:
            </h3>
            <span className="text-base lg:text-lg font-medium">{(data?.data?.offer_amount) ? formatPrice(data?.data?.offer_amount) : 'وارد نشده است'}</span>
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
              فایل پیوست نامه امام جماعت:
            </h3>
            <a href={data?.data?.imam_letter?.original}>
              <button className="w-full h-12 px-4 min-w-fit md:w-60 text-base font-medium text-[#345894] border border-[#345894] rounded-[10px] hover:text-white hover:bg-[#345894]">
                برای مشاهده فایل کلیک کنید
              </button>
            </a>
          </div>
        </div>
      </div>
      <hr className="hidden md:block h-2 my-10" />


      {(data?.data?.status == "in_progress") && (
        <div className="w-full bg-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
            {(data?.data?.need_offer_amount) ? (
              <div className="mb-4">
                <label htmlFor="amount" className="block text-base lg:text-lg text-[#3B3B3B] mb-2 ">
                  هزینه پیشنهادی توسط آرمان{" "}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    name="amount"
                    placeholder="در اینجا تایپ کنید …"
                    className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
                  />
                </div>
                <small>{formatPrice(amount)}</small>
              </div>
            ) : (data?.data?.need_final_amount) ? (
              <div className="mb-4">
                <label htmlFor="amount" className="block text-base lg:text-lg text-[#3B3B3B] mb-2 ">
                  هزینه پرداختی توسط آرمان{" "}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    name="amount"
                    placeholder="در اینجا تایپ کنید …"
                    className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
                  />
                </div>
                <small>{formatPrice(amount)}</small>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="mb-4 mt-3">
            <label htmlFor="textarea" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              نظر{" "}
            </label>
            <textarea
              className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700 md:h-24"
              id="des"
              name="des"
              value={des}
              onChange={(event) => setDes(event.target.value)}
              rows="10"
              cols="15"
              placeholder="در اینجا تایپ کنید …"
            />
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

      <Modal showModal={showModal} setShowModal={setShowModal} hnadleForm={hnadleForm} selectedReason={selectedReason} setSelectedReason={setSelectedReason} />
    </div>
  );
};

export default MainGardeshJariRole;

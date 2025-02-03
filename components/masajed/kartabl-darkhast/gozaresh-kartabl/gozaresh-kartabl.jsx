'use client';
import axios from "axios";
import { useEffect, useState } from "react";

const GozareshKartabl = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetching = async () => {
        try {
            const response = await axios.get("/api/profile");
            if (response.data) {
                setProfile(response.data);
            }
        } catch (error) {
            console.log("خطا در دریافت بنرها:", error);
        }
    };
    fetching();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-5 lg:flex-row lg:justify-between">
      <h2 className="text-base font-bold text-center lg:text-lg xl:text-[22px]">
        گزارش گردش کار درخواست ها
      </h2>
      <div className="flex flex-wrap justify-between gap-6 2xl:gap-10">
        <div className="flex items-center justify-start gap-3 h-8 w-32 rounded-full bg-[#25C7AA]/5 border border-[#25C7AA] lg:w-36 xl:w-44 xl:h-12 2xl:w-48">
          <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#25C7AA4D]/30 rounded-full xl:outline-[14px] bg-[#25C7AA] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
            {profile?.requests?.done ? profile?.requests?.done : '0'}
          </span>
          <span className="text-sm font-semibold text-[#25C7AA] xl:text-lg 2xl:text-[22px]">
            تایید شده
          </span>
        </div>
        <div className="flex items-center justify-start gap-6 h-8 w-32 rounded-full bg-[#77B7DC]/5 border border-[#77B7DC] lg:w-36 xl:w-44 xl:h-12 2xl:w-48">
          <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#77B7DC]/30 rounded-full xl:outline-[14px] bg-[#77B7DC] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
            {profile?.requests?.in_progress ? profile?.requests?.in_progress : '0'}
          </span>
          <span className="text-sm font-semibold text-[#77B7DC] xl:text-lg 2xl:text-[22px]">جاری</span>
        </div>
        <div className="flex items-center justify-start gap-5 h-8 w-32 rounded-full bg-[#D32F2F]/5 border border-[#D32F2F] lg:w-36 xl:w-44 xl:h-12 2xl:w-48">
          <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#D32F2F]/30 rounded-full xl:outline-[14px] bg-[#D32F2F] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
            {profile?.requests?.rejected ? profile?.requests?.rejected : '0'}
          </span>
          <span className="text-sm font-semibold text-[#D32F2F] xl:text-lg 2xl:text-[22px]">رد شده</span>
        </div>
        <div className="flex items-center justify-start gap-3 h-8 w-32 rounded-full bg-[#FFD140]/5 border border-[#FFD140] lg:w-36 xl:w-44 xl:h-12 2xl:w-48">
          <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#FFD140]/30 rounded-full xl:outline-[14px] bg-[#FFD140] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
            {profile?.requests?.action_needed ? profile?.requests?.action_needed : '0'}
          </span>
          <span className="text-sm font-semibold min-w-fit text-[#FFD140] xl:text-lg 2xl:text-[22px]">
            نیازمند اصلاح
          </span>
        </div>
      </div>
    </div>
  );
};

export default GozareshKartabl;

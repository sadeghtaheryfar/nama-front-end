"use client";
import Schools from "./schools";
import Masjed from "./masjed";
import Womens from "./womens";
import Alert from "./alert";

const DataLoop = () => {
    return (
        <section className="mt-[2rem]">
            <div>
                <h1 className="text-[20px] font-semibold">ایجاد حلقه</h1>

                <div className="w-full lg:w-max flex justify-between lg:justify-start gap-2 lg:gap-4 mt-[1rem]">
                    <button className="px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] bg-[#0068B2] text-white rounded-[0.5rem] shadow-lg cursor-pointer text-[12px] lg:text-[14px]">همه</button>
                    <button className="px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px]">مدرسه</button>
                    <button className="px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px]">مسجد</button>
                    <button className="px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px]">مرکز تعالی بانوان</button>
                </div>
            </div>

            <Schools />

            <Masjed />

            <Womens />

            <Alert />
        </section>
    );
};

export default DataLoop;
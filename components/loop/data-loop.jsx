"use client";
import Schools from "./schools";
import Masjed from "./masjed";
import Womens from "./womens";
import University from "./university";
import Alert from "./alert";
import { useState } from "react";

const DataLoop = () => {
    const [type, setType] = useState('all');

    return (
        <section className="mt-[2rem]">
            <div>
                <h1 className="text-[20px] font-semibold">ایجاد حلقه</h1>

                <div className="w-full lg:w-max flex justify-start gap-2 lg:gap-4 mt-[1rem]">
                    <button className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${type == 'all' ? 'bg-[#0068B2] text-white' : ''}`} onClick={(e) => setType('all')}>همه</button>
                    <button className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${type == 'school' ? 'bg-[#0068B2] text-white' : ''}`} onClick={(e) => setType('school')}>مدرسه</button>
                    <button className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${type == 'mosque' ? 'bg-[#39A894] text-white' : ''}`} onClick={(e) => setType('mosque')}>مسجد</button>
                    <button className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${type == 'center' ? 'bg-[#EB82DA] text-white' : ''}`} onClick={(e) => setType('center')}>مرکز تعالی بانوان</button>
                    <button className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${type == 'university' ? 'bg-[#c33232] text-white' : ''}`} onClick={(e) => setType('university')}>دانشگاه</button>
                </div>
            </div>

            {type == 'all' ? (
                <>
                    <Schools />

                    <Masjed />

                    <Womens />

                    <University />
                </>
            ) : type == 'school' ? (
                <Schools />
            ) : type == 'mosque' ? ( 
                <Masjed />
            ) : type == 'university' ? ( 
                <University />
            ) : (
                <Womens />
            )}

            <Alert />
        </section>
    );
};

export default DataLoop;
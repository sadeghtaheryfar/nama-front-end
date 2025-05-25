"use client";

import Link from "next/link";

const alert = () => {
    return (
        <section className="my-[4rem] w-full flex flex-col lg:flex-row justify-start items-center gap-[2rem] bg-[#EDF4FA] p-[1rem] rounded-[1rem]">
            <diV className="w-full">
                <p className="text-[18px] font-semibold">دسترسی محدود</p>

                <p className="text-justify">در حال حاضر شما تنها به بخش حلقه‌های مدرسه دسترسی دارید و امکان مشاهده یا ویرایش اطلاعات مربوط به بخش‌های مسجد و مرکز تعالی بانوان برای شما فعال نیست. در صورتی که نیاز به دسترسی به این بخش‌ها دارید یا فکر می‌کنید این محدودیت به اشتباه اعمال شده است، لطفاً با ادمین سامانه تماس بگیرید تا مشکل بررسی و در صورت لزوم رفع گردد.</p>
            </diV>

            <div className="w-full lg:w-[19rem] lg:min-w-[19rem] relative flex justify-center items-center">
                <img className="lg:absolute w-[90%] mb-[-5rem] lg:!mb-[0px]" src="/Images/Oil lamp-bro.png" alt="" />
            </div>
        </section>
    );
};

export default alert;
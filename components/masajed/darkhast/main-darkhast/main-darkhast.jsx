import Image from "next/image";
import CartsDarkhast from "../carts-darkhast/carts-darkhast";
import HeaderDarkhast from "../header-darkhast/header-darkhast";

const MainDarkhast = () => {
  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderDarkhast />
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
        {/* <p className="text-xs text-[#808393] leading-7 text-center pb-8 lg:hidden">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک
          است چاپگرها و متون بلکه روزنامه و تکنولوژی مورد نیاز و کاربردهای متنوع حال و آینده شناخت
          فراوان ساختگی با تولید چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است
          لورم ایپسوم متن ساختگی با چاپ و با استفاده از طراحان گرافیک است.
        </p> */}
        <p className="hidden lg:block text-lg text-[#808393] leading-8 text-center">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک
          است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی
          تکنولوژی مورد نیاز و کاربردهای متنوع حال و آینده شناخت فراوان جامعه و متخصصان را تا با نرم
          افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقلی قرار گیردلورم
          ایپسوم متن ساختگی با تولید چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم
          است لورم ایپسوم متن ساختگی با چاپ و با استفاده از طراحان گرافیک است.
        </p>
        <CartsDarkhast />
      </div>
    </div>
  );
};

export default MainDarkhast;

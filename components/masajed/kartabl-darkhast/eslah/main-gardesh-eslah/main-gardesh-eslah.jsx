import Link from "next/link";

const MainGardesheslah = () => {
  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl">
        نام درخواست  مربوطه در اینجا قرار میگیرد ( شماره ۲۰۱ )
        </h2>
        <div className="text-sm font-semibold text-[#FFC200] bg-[#FEF4D9] w-20 h-10 flex items-center justify-center rounded-lg min-w-fit px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
          نیازمند اصلاح{" "}
        </div>
      </div>
      <div className="flex flex-col items-start bg-[#D5B260]/10 rounded-lg p-3 my-6 md:p-5 lg:p-6 md:my-8 xl:my-10 xl:flex-row xl:gap-6 2xl:gap-10">
        <h2 className="text-base font-semibold text-[#D5B260] md:text-lg xl:text-xl xl:min-w-fit">
          نکات قابل توجه این درخواست
        </h2>
        <div className="flex flex-col lg:flex-row xl:gap-6 2xl:gap-10">
          <ul className="flex flex-col gap-0.5 pt-3 lg:pt-0">
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              سقف تعداد نفرات مورد حمایت: ۲۰
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              سرانه حمایتی هر نفر به مبلغ ۳ میلیون ریال{" "}
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              محدود مهلت زمانی انتخاب این درخواست تا تاریخ ۱۴۰۳/۱۰/۱۲{" "}
            </li>
          </ul>
          <ul className="flex flex-col gap-0.5">
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              تعداد دفعات مجاز شما برای این درخواست ۳ عدد میباشد و پس از ثبت
              سومین درخواست، دسترسی به این بخش برای شما مقدور نیست.{" "}
            </li>
            <li className="text-sm flex items-start gap-2 leading-6 lg:text-base">
              <div className="w-1.5 h-1.5 bg-[#D5B260] rounded-full p-0.5 my-2"></div>
              <span>
                درخواست
                <span className="text-[#D5B260] font-bold">۲ از ۳</span>
                (تنها ۱ درخواست باقی مانده است)
              </span>
            </li>
          </ul>
        </div>
      </div>
      <hr className="hidden md:block h-2 mb-10" />
      <div className="flex flex-col justify-center gap-6 lg:gap-8 2xl:gap-10">
        <div className="flex flex-col gap-6 md:gap-x-8 md:flex-row flex-wrap lg:gap-x-11 xl:gap-x-24 2xl:gap-x-32">
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              تعداد دانش آموزان نوجوان:
            </h3>
            <span className="text-base lg:text-lg font-medium">۲۲۰</span>
          </div>
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              هزینه کلی عملیات:
            </h3>
            <span className="text-base lg:text-lg font-medium">
              ۲۵ میلیون ریال
            </span>
          </div>
          <div className="flex items-center justify-between md:justify-start md:gap-5 lg:gap-8 2xl:gap-14">
            <h3 className="text-base lg:text-lg text-[#3B3B3B]">
              تاریخ برگزاری:
            </h3>
            <span className="text-base lg:text-lg font-medium">۱۴۰۳/۰۹/۱۲</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-6 xl:gap-8 2xl:gap-10">
          <h3 className="text-base lg:text-base text-[#3B3B3B] min-w-fit">
            توضیحات تکمیلی:
          </h3>
          <p className="text-base font-medium leading-7 xl:hidden">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی روزنامه و
            مجله در ستون و سطرآنچنان که لازم است لورم ایپسوم متن ساختگی با چاپ و
            با استفاده از طراحان گرافیک است
          </p>
          <p className="hidden text-lg leading-10 font-medium xl:block">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و
            کاربردهای متنوع حال و آینده شناخت فراوان جامعه و متخصصان را تا با
            نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان
            خلاقلی قرار گیردلورم ایپسوم متن ساختگی با تولید چاپگرها و متون بلکه
            روزنامه و مجله در ستون و سطرآنچنان که لازم است لورم ایپسوم متن
            ساختگی با چاپ و با استفاده از طراحان گرافیک است.برای طراحان رایانه
            ای علی الخصوص طراحان خلاقلی قرار گیردلورم ایپسوم متن ساختگی با تولید
            چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است
            لورم ایپسوم متن ساختگی با چاپ و با استفاده از طراحان گرافیک است.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-4 xl:gap-x-20 2xl:grid-cols-[auto,auto,1fr]  2xl:gap-x-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:justify-normal xl:gap-12 2xl:gap-6">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              فایل پیوست نامه امام جماعت:
            </h3>
            <Link href={"/masajed/darkhast/sabt/sabt1/sabt2/sabt3"}>
              <button className="w-full h-12 px-4 min-w-fit md:w-60 text-base font-medium text-[#39A894] border border-[#39A894] rounded-[10px] hover:text-white hover:bg-[#39A894]">
                برای مشاهده فایل کلیک کنید
              </button>
            </Link>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:justify-normal xl:gap-12 2xl:gap-6 lg:justify-self-end">
            <h3 className="text-base min-w-fit lg:text-lg text-[#3B3B3B]">
              فایل نامه رابط منطقه:
            </h3>
            <Link href={"/masajed/darkhast/sabt/sabt1/sabt2/sabt4"}>
              <button className="w-full h-12 px-4 md:w-60 text-base font-medium text-[#39A894] border border-[#39A894] rounded-[10px] hover:text-white hover:bg-[#39A894]">
                برای مشاهده فایل کلیک کنید
              </button>
            </Link>
          </div>
          <div className="flex items-center w-full justify-between h-[73px] border rounded-[10px] pl-5 pr-6 md:gap-5 xl:px-7 lg:h-[86px] xl:gap-8 xl:max-w-md 2xl:gap-10">
            <span className="text-base lg:text-lg">
              هزینه پرداختی توسط آرمان:{" "}
            </span>
            <span className="text-base lg:text-2xl font-bold text-[#39A894]">
              ۳.۵۰۰.۰۰۰
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainGardesheslah;

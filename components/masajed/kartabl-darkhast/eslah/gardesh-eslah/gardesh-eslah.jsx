import Image from "next/image";
import Link from "next/link";

const GardeshEslah = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-6 xl:gap-9">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between items-center">
        <h2 className="text-base font-bold text-center lg:text-lg md:text-right xl:text-xl 2xl:text-[22px]">
          گردش کار درخواست شماره ۲۰۳
        </h2>
        <div className="bg-[#FEF8E8] rounded-lg pb-5 pt-2 px-3.5 flex flex-col gap-2 lg:items-center lg:flex-row xl:p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Image
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
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                  استفاده از طراحان گرافیک است.
                </p>
              </div>
            </div>
            <p className="text-xs leading-5 xl:text-base 2xl:hidden">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </p>
          </div>
          <Link className="w-full flex items-center justify-center self-center md:max-w-56 text-[#FFC200] text-xs font-semibold h-10 rounded-[10px] border border-[#FFC200] px-4 lg:text-white lg:bg-[#FFC200] xl:h-12 xl:text-base" href={"/masajed/kartabl-darkhast/eslah2"}>
            برای اصلاح کلیک کنید
          </Link>
        </div>
      </div>
      <div className="flex items-center flex-col justify-center font-[sans-serif] w-max lg:hidden">
        <div className="flex items-center flex-col relative">
          <div className="flex items-center justify-center ">
            <Image
              width={0}
              height={0}
              className="w-8"
              alt="#"
              src={"/Images/masajed/kartabl-darkhast/eslah/tik.svg"}
            />
          </div>

          <div className="w-0.5 h-[18px] border-r border-dashed border-[#25C7AA]"></div>
          <div className="absolute top-1 right-full mr-4 w-max">
            <span className="text-sm text-[#25C7AA]">تایید سر مربی مسجد</span>
          </div>
        </div>
        <div className="flex items-center flex-col relative">
          <div className="flex items-center justify-center ">
            <Image
              width={0}
              height={0}
              className="w-8"
              alt="#"
              src={"/Images/masajed/kartabl-darkhast/eslah/tik.svg"}
            />
          </div>

          <div className="w-0.5 h-[18px] border-r border-dashed border-[#FFC200]"></div>
          <div className="absolute top-1 right-full mr-4 w-max">
            <span className="text-sm text-[#25C7AA]">
              تایید مسئول فرهنگی مسجد
            </span>
          </div>
        </div>
        <div className="flex items-center flex-col relative">
          <div className="flex items-center justify-center ">
            <Image
              width={0}
              height={0}
              className="w-8"
              alt="#"
              src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
            />
          </div>

          <div className="w-0.5 h-[18px] border-r border-dashed border-[#DFDFDF]"></div>
          <div className="absolute top-1 right-full mr-4 w-max">
            <span className="text-sm text-[#FFC200]">
              تایید رابط منطقه
            </span>
          </div>
        </div>
        <div className="flex items-center flex-col relative">
          <div className="flex items-center justify-center ">
            <Image
              width={0}
              height={0}
              className="w-8"
              alt="#"
              src={"/Images/masajed/kartabl-darkhast/eslah/tik1.svg"}
            />
          </div>

          <div className="w-0.5 h-[18px] border-r border-dashed border-[#DFDFDF]"></div>
          <div className="absolute top-1 right-full mr-4 w-max">
            <span className="text-sm text-[#959595]">
              تایید معاونت اجرایی مساجد
            </span>
          </div>
        </div>
        <div className="flex items-center flex-col relative">
          <div className="flex items-center justify-center ">
            <Image
              width={0}
              height={0}
              className="w-8"
              alt="#"
              src={"/Images/masajed/kartabl-darkhast/eslah/tik1.svg"}
            />
          </div>
          <div className="absolute top-1 right-full mr-4 w-max">
            <span className="text-sm text-[#959595]">
              تایید معاونت طرح و برنامه
            </span>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-end justify-between">
        <div className="w-full flex flex-col items-start">
          <div className="flex items-center w-full mr-10 2xl:mr-12">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/eslah/tik.svg"}
              />
            </div>
            <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
          </div>
          <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">
            تایید سر مربی مسجد
          </span>
        </div>
        <div className="w-full flex flex-col items-start">
          <div className="flex items-center w-full mr-7 2xl:mr-9">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/eslah/tik.svg"}
              />
            </div>
            <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
          </div>
          <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-40px]">
            تایید مسئول فرهنگی مسجد
          </span>
        </div>
        <div className="w-full flex flex-col items-start">
          <div className="flex items-center w-full mr-7 2xl:mr-9">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
              />
            </div>
            <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
          </div>
          <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px] min-w-fit 2xl:mr-[-10px]">
            تایید رابط منطقه{" "}
          </span>
        </div>
        <div className="w-full flex flex-col items-start">
          <div className="flex items-center w-full mr-7 2xl:mr-9">
            <div className="flex items-center justify-center">
              <Image
                width={0}
                height={0}
                className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/eslah/tik1.svg"}
              />
            </div>
            <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
          </div>
          <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-48px]">
            تایید معاونت اجرایی مساجد
          </span>
        </div>

        <div className="w-full flex flex-col max-w-fit">
          <div className="flex items-center justify-center ml-14 2xl:ml-16">
            <Image
              width={0}
              height={0}
              className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
              alt="#"
              src={"/Images/masajed/kartabl-darkhast/eslah/tik1.svg"}
            />
          </div>
          <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px]">
            تایید معاونت طرح و برنامه
          </span>
        </div>
      </div>
    </div>
  );
};

export default GardeshEslah;

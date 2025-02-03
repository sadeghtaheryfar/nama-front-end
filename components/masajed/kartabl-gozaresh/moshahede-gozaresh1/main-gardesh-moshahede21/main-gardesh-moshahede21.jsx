import Image from "next/image";
import Link from "next/link";

const MainGardeshMoshahede21 = () => {
  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl">
          نام گزارش مربوطه در اینجا قرار میگیرد ( شماره ۲۰۱ )
        </h2>
        <div className="text-sm font-semibold text-[#258CC7] bg-[#D9EFFE] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:w-28 lg:h-12 xl:w-40 xl:h-14 2xl:w-48">
          جاری
        </div>
      </div>

      <hr className="h-2 mt-4 mb-7 md:mb-10" />
      <form className="w-full bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
            <label
              htmlFor="options"
              className="block text-base lg:text-lg text-[#3B3B3B] mb-2 "
            >
              تعداد دانش آموزان نوجوان{" "}
            </label>
            <div className="relative">
              <Image
                className="w-8 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/arrowDown.svg"}
              />
              <select
                id="options"
                name="options"
                className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              >
                <option value="">۲۲۰</option>
                <option value="option1">گزینه ۱</option>
                <option value="option2">گزینه ۲</option>
                <option value="option3">گزینه ۳</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="calendar"
              className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
            >
              تاریخ برگزاری{" "}
            </label>
            <div className="relative">
              <Image
                className="w-9 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/calendar.svg"}
              />
              <input
                type="text"
                id="calendar"
                name="calendar"
                defaultValue={"۱۴۰۳/۰۹/۱۲"}
                className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="textarea"
            className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
          >
            توضیحات تکمیلی{" "}
          </label>
          <textarea
            className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700 md:h-24"
            id="textarea"
            name="textarea"
            rows="9"
            cols="15"
            defaultValue={
              "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی روزنامه و مجله در ستون و سطرآنچنان که لازم است لورم ایپسوم متن ساختگی با چاپ و با استفاده از طراحان گرافیک است"
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
           <div>
           <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
              آپلود فایل تصویری حداقل ۳ عدد
            </h3>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
            >
              <div className="flex items-center justify-between pt-5 pb-6">
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
              </div>
              <Image
                className="w-7"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/Group.svg"}
              />
              <input id="file-upload" type="file" className="hidden" />
            </label>
           </div>
           <div className="flex flex-wrap mt-5 gap-4">
            <div className="flex items-center justify-center gap-2 min-w-fit max-w-fit border border-[#39A894] rounded-lg h-8 px-3 md:px-4 bg-[#F5FBFA]">
              <span className="text-sm text-[#39A894]">Arman.jpg</span>
              <span className="text-sm text-[#959595]">حذف</span>
            </div>
            <div className="flex items-center justify-center gap-2 min-w-fit max-w-fit border border-[#39A894] rounded-lg h-8 px-3 md:px-4 bg-[#F5FBFA]">
              <span className="text-sm text-[#39A894]">Arman2.jpg</span>
              <span className="text-sm text-[#959595]">حذف</span>
            </div>
            <div className="flex items-center justify-center gap-2 min-w-fit max-w-fit border border-[#39A894] rounded-lg h-8 px-3 md:px-4 bg-[#F5FBFA]">
              <span className="text-sm text-[#39A894]">Arman354.jpg</span>
              <span className="text-sm text-[#959595]">حذف</span>
            </div>
            <div className="flex items-center justify-center gap-2 min-w-fit max-w-fit border border-[#39A894] rounded-lg h-8 px-3 md:px-4 bg-[#F5FBFA]">
              <span className="text-sm text-[#39A894]">Arman4.jpg</span>
              <span className="text-sm text-[#959595]">حذف</span>
            </div>
            <div className="flex items-center justify-center gap-2 min-w-fit max-w-fit border border-[#39A894] rounded-lg h-8 px-3 md:px-4 bg-[#F5FBFA]">
              <span className="text-sm text-[#39A894]">Arman3.jpg</span>
              <span className="text-sm text-[#959595]">حذف</span>
            </div>
           </div>
          </div>

          <div className="mb-4">
           <div>
           <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
              آپلود فایل تصویری حداقل ۳ عدد
            </h3>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
            >
              <div className="flex items-center justify-between pt-5 pb-6">
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
              </div>
              <Image
                className="w-7"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/Group.svg"}
              />
              <input id="file-upload" type="file" className="hidden" />
            </label>
           </div>
           <div className="flex flex-wrap mt-5 gap-4">
            <div className="flex items-center justify-center gap-2 min-w-fit max-w-fit border border-[#39A894] rounded-lg h-8 px-4 bg-[#F5FBFA]">
              <span className="text-sm text-[#39A894]">Arman345.mp4</span>
              <span className="text-sm text-[#959595]">حذف</span>
            </div>
           </div>
          </div>
        </div>

        <div className="flex items-start mb-7 mt-7">
          <input
            id="checked-checkbox"
            type="checkbox"
            value=""
            defaultChecked
            className="min-w-5 h-5 appearance-none checked:bg-[#D5B260] border border-gray-300 rounded  checked:ring-offset-2 checked:ring-1 ring-gray-300"
          />
          <label
            htmlFor="checked-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
          >
            تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در
            صورت عدم تطبیق مسئولیت آن را می پذیرم.{" "}
          </label>
        </div>
        <Link
        className="flex justify-center"
          href={
            "/masajed/kartabl-gozaresh/moshahede-gozaresh/moshahede-gozaresh1/moshahede-gozaresh2"
          }
        >
            <button
              type="submit"
              className="w-full h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] md:max-w-[214px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white"
            >
              تایید و ثبت اطلاعات{" "}
            </button>
        </Link>
      </form>
    </div>
  );
};

export default MainGardeshMoshahede21;

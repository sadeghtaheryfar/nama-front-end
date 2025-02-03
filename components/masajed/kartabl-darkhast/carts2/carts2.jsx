import Link from "next/link";

const Carts2 = () => {
  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:hidden">
      <div className="flex flex-col border rounded-lg px-5 py-4 gap-2">
        <h2 className="text-sm text-[#202020] pb-3">
          نام درخواست مربوطه در اینجا قرار میگیرد
        </h2>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">شماره </span>
          <span className="text-sm text-[#202020]">۲۰۱</span>
        </div>
        <div className="flex items-center justify-between pl-0.5 pr-2">
          <span className="text-xs text-[#959595]">وضعیت </span>
          <span className="flex items-center justify-center text-xs text-[#FFC200] bg-[#FEF4D9] rounded-lg w-[85px] h-7">
            نیازمند اصلاح
          </span>
        </div>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">تاریخ ایجاد </span>
          <span className="text-sm text-[#202020]">۱۴۰۳.۰۴.۱۴</span>
        </div>
        <Link href="/masajed/kartabl-darkhast/eslah">
        <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
          مشاهده درخواست
        </button>
        </Link>
      </div>
      <div className="flex flex-col border rounded-lg px-5 py-4 gap-2">
        <h2 className="text-sm text-[#202020] pb-3">
          نام درخواست مربوطه در اینجا قرار میگیرد
        </h2>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">شماره </span>
          <span className="text-sm text-[#202020]">۲۰۱</span>
        </div>
        <div className="flex items-center justify-between pl-0.5 pr-2">
          <span className="text-xs text-[#959595]">وضعیت </span>
          <span className="flex items-center justify-center text-xs text-[#25C7AA] bg-[#25C7AA]/15 rounded-lg w-[85px] h-7">
            تایید شده
          </span>
        </div>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">تاریخ ایجاد </span>
          <span className="text-sm text-[#202020]">۱۴۰۳.۰۴.۱۴</span>
        </div>
        <Link href="/masajed/kartabl-darkhast/taeed">
          <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
            مشاهده درخواست
          </button>
        </Link>
      </div>
      <div className="flex flex-col border rounded-lg px-5 py-4 gap-2">
        <h2 className="text-sm text-[#202020] pb-3">
          نام درخواست مربوطه در اینجا قرار میگیرد
        </h2>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">شماره </span>
          <span className="text-sm text-[#202020]">۲۰۱</span>
        </div>
        <div className="flex items-center justify-between pl-0.5 pr-2">
          <span className="text-xs text-[#959595]">وضعیت </span>
          <span className="flex items-center justify-center text-xs text-[#258CC7] bg-[#D9EFFE] rounded-lg w-[85px] h-7">
            جاری
          </span>
        </div>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">تاریخ ایجاد </span>
          <span className="text-sm text-[#202020]">۱۴۰۳.۰۴.۱۴</span>
        </div>
        <Link href="/masajed/kartabl-darkhast/jari">
        <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
          مشاهده درخواست
        </button>
        </Link>
      </div>
      <div className="flex flex-col border rounded-lg px-5 py-4 gap-2">
        <h2 className="text-sm text-[#202020] pb-3">
          نام درخواست مربوطه در اینجا قرار میگیرد
        </h2>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">شماره </span>
          <span className="text-sm text-[#202020]">۲۰۱</span>
        </div>
        <div className="flex items-center justify-between pl-0.5 pr-2">
          <span className="text-xs text-[#959595]">وضعیت </span>
          <span className="flex items-center justify-center text-xs text-[#D32F2F] bg-[#D32F2F]/15 rounded-lg w-[85px] h-7">
            رد شده{" "}
          </span>
        </div>
        <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
          <span className="text-xs text-[#959595]">تاریخ ایجاد </span>
          <span className="text-sm text-[#202020]">۱۴۰۳.۰۴.۱۴</span>
        </div>
        <Link href="/masajed/kartabl-darkhast/rad">
        <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
          مشاهده درخواست
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Carts2;

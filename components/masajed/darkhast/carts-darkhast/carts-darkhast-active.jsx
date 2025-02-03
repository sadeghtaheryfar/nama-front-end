import Image from "next/image";
import Link from "next/link";
import ButtonSabt from "../button-sabt/button-sabt";
const CartsDarkhastActive = ({ item }) => {
  function formatNumber(num) {
    if (num < 1000000) {
      return Math.floor(num / 1000) + " هزار";
    } else {
      return Math.floor(num / 1000000) + " میلیون";
    }
  }

  return (
    <div className="flex flex-col justify-end gap-4 border rounded-xl p-4 group hover:border-[#39A894] transition-all duration-200">
      <div className="grid grid-cols-4 items-center gap-4 lg:grid-cols-5 lg:gap-5">
        <img
          className="w-full max-w-28 lg:hidden"
          src={item.image}
          style={{ objectFit: "cover", height: "auto" }}
        />
        <img
          style={{ objectFit: "cover", height: "100%" }}
          className="hidden lg:block w-full col-span-2 min-w-[167px] max-w-[167px] row-span-2"
          alt="#"
          src={item.image}
        />
        <div className="flex flex-col gap-2 col-span-3 lg:mr-2">
          <h2 className="text-base font-bold group-hover:text-[#39A894] lg:text-lg">
            {item.title}
          </h2>
          <span className="text-xs font-medium lg:text-base">شماره: {item.id || 0} </span>
        </div>

        <ul className="flex flex-col justify-center gap-1.5 col-span-4 lg:col-span-3 lg:mr-2">
          <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
            <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
            سقف تعداد نفرات مورد حمایت: {item.max_number_people_supported}
          </li>
          <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
            <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
            سرانه حمایتی هر نفر به مبلغ {formatNumber(item.support_for_each_person_amount)} میلیون
            تومان میباشد.
          </li>
          <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
            <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
            {item.expires_at === null
              ? "ندارد"
              : `محدود مهلت زمانی انتخاب این درخواست تا تاریخ ${item.expires_at} میباشد.`}
          </li>
        </ul>
      </div>
      <Link href={`/masajed/darkhast/sabt?id=${item.id}`}>
        <ButtonSabt />
      </Link>
    </div>
  );
};

export default CartsDarkhastActive;

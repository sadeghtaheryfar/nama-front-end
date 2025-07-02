import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ButtonSabt from "../button-sabt/button-sabt";
import { usePathname } from "next/navigation";
import RequirementsPopup from "./requirements-popup";

function numberToPersianWords(num) {
  const ones = [
    "", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه",
    "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده",
    "هفده", "هجده", "نوزده"
  ];
  const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
  const hundreds = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
  const units = ["", "هزار", "میلیون", "میلیارد"];

  if (num === 0) return "صفر";

  const splitByThousand = [];
  while (num > 0) {
    splitByThousand.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  function threeDigitToWords(n) {
    let result = [];
    if (n >= 100) {
      result.push(hundreds[Math.floor(n / 100)]);
      n %= 100;
    }
    if (n >= 20) {
      result.push(tens[Math.floor(n / 10)]);
      n %= 10;
    }
    if (n > 0) {
      result.push(ones[n]);
    }
    return result.join(" و ");
  }

  return splitByThousand
    .map((group, index) => {
      if (group === 0) return null;
      const words = threeDigitToWords(group);
      const unit = units[index];
      return words + (unit ? " " + unit : "");
    })
    .filter(Boolean)
    .reverse()
    .join(" و ");
}

const CartsDarkhastActive = ({ item }) => {
  // State to manage the visibility of the requirements popup
  const [showRequirementsPopup, setShowRequirementsPopup] = useState(false);

  function formatNumber(num) {
    return Math.floor(num / 1000000);
  }

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1]; // Assumes the first segment after root is itemId

  const remainingRequests = Number(item.max_allocated_request - item.previous_requests);
  const isRequestsAvailable = remainingRequests >= 1;

  const handleOpenPopup = () => {
    setShowRequirementsPopup(true);
  };

  const handleClosePopup = () => {
    setShowRequirementsPopup(false);
  };

  return (
    <div className="flex flex-col justify-end gap-4 border rounded-xl p-4 group hover:border-[#39A894] transition-all duration-200">
      <div className="grid grid-cols-4 items-center gap-4 lg:grid-cols-5 lg:gap-5">
        <img
          className="w-full max-w-28 lg:hidden rounded-[0.5rem]"
          src={item.image}
          style={{ objectFit: "cover", height: "auto" }}
          alt={item.title}
        />
        <img
          style={{ objectFit: "cover", height: "100%" }}
          className="hidden lg:block w-full col-span-2 min-w-[167px] max-w-[167px] row-span-2 rounded-[0.5rem]"
          alt={item.title}
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
              سرانه حمایتی هر نفر به مبلغ حداکثر {numberToPersianWords(item.support_for_each_person_amount)} ریال می باشد
          </li>
          <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
            <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
            {item.expires_at === null
              ? "فاقد محدودیت زمانی"
              : `محدود مهلت زمانی انتخاب این درخواست تا تاریخ ${item.expires_at} میباشد.`}
          </li>
          <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
            <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
            {remainingRequests === 0 ? (
              <span className="font-bold">در خواستی باقی نمانده.</span>
            ) : (
              <span>
                درخواست
                <span className="text-[#D5B260] font-bold">
                  {item.previous_requests} از {item.max_allocated_request}
                </span>
                (تنها {remainingRequests} درخواست
                باقی مانده است)
              </span>
            )}
          </li>
          {item?.single_step && (
            <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
              <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
              این درخواست یک مرحله ای می باشد و کل بودجه یکجا آزاد می شود
            </li>
          )}
        </ul>
      </div>
        {/* Conditional rendering for the action button */}
        {!isRequestsAvailable ? (
          <button className="w-full h-12 text-red-600 text-base font-medium rounded-[10px] border border-red-600" disabled>
            غیر فعال
          </button>
        ) : item.active ? (
          <Link href={`/${itemId}/darkhast/sabt?id=${item.id}`}>
            <ButtonSabt />
          </Link>
        ) : (
          <button
            onClick={handleOpenPopup}
            className="w-full h-12 text-blue-600 text-base font-medium rounded-[10px] border border-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            نیاز به تکمیل پیش نیاز
          </button>
        )}

      {/* Render the RequirementsPopup if showRequirementsPopup is true */}
      {showRequirementsPopup && (
        <RequirementsPopup
          requirements={item.requirements}
          onClose={handleClosePopup}
          itemId={itemId}
        />
      )}
    </div>
  );
};

export default CartsDarkhastActive;
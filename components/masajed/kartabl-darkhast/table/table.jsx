import Link from "next/link";

const Table = () => {
  return (
    <div className="hidden xl:block">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-7 py-5 text-lg text-right">
              نام درخواست ها
            </th>
            <th className="border border-gray-300 px-7 py-5 text-lg">شماره </th>
            <th className="border border-gray-300 px-7 py-5 text-lg">
              تاریخ ایجاد
            </th>
            <th className="border border-gray-300 px-7 py-5 text-lg">وضعیت</th>
            <th className="border border-gray-300 px-7 py-5 text-lg"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۲
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۴.۲۵
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm py-1 text-[#FFC200] bg-[#FEF4D9] rounded-lg">
                نیازمند اصلاح
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
            <Link href="/masajed/kartabl-darkhast/eslah">مشاهده درخواست</Link>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۳
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۵.۱۵
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm  py-1 text-[#25C7AA] bg-[#25C7AA]/15 rounded-lg">
                تایید شده
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
              <Link href="/masajed/kartabl-darkhast/taeed">مشاهده درخواست</Link>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۴
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۵.۲۵
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm  py-1 text-[#D32F2F] bg-[#D32F2F]/15 rounded-lg">
                رد شده{" "}
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
            <Link href="/masajed/kartabl-darkhast/rad">مشاهده درخواست</Link>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۵
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۶.۲۵
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm  py-1 text-[#258CC7] bg-[#D9EFFE] rounded-lg">
                جاری
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
            <Link href="/masajed/kartabl-darkhast/jari">مشاهده درخواست</Link>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۶
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۶.۲۹
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm  py-1 text-[#258CC7] bg-[#D9EFFE] rounded-lg">
                جاری
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
            <Link href="/masajed/kartabl-darkhast/jari">مشاهده درخواست</Link>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۷
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۷.۰۱
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm  py-1 text-[#D32F2F] bg-[#D32F2F]/15 rounded-lg">
                رد شده{" "}
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
            <Link href="/masajed/kartabl-darkhast/rad">مشاهده درخواست</Link>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۸
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۸.۱۳
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm  py-1 text-[#25C7AA] bg-[#25C7AA]/15 rounded-lg">
                تایید شده
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
            <Link href="/masajed/kartabl-darkhast/taeed">مشاهده درخواست</Link>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-7 py-5 text-base">
              نام درخواست مربوطه در اینجا قرار میگیرد
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۲۰۹
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base text-center">
              ۱۴۰۳.۰۸.۱۵
            </td>
            <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
              <div className="w-[169px] h-7 text-sm  py-1 text-[#25C7AA] bg-[#25C7AA]/15 rounded-lg">
                تایید شده
              </div>
            </td>
            <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
            <Link href="/masajed/kartabl-darkhast/taeed">مشاهده درخواست</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;

import Image from "next/image";
import filter from "./../../..//public/assets/filter.svg";
import sort from "./../../..//public/assets/sort.svg";
import Link from "next/link";


import mosque from "./../../../public/assets/mosque.png";
import man from "./../../../public/assets/man.png";
import menu from "./../../../public/assets/menu.svg";
import notif from "./../../../public/assets/notif.svg";

export default function Kartabl() {
  return (
    <>
      <div className=" h-screen relative">
        <div className="bg-[#002a4fd5] vector-nama2 h-1/3 bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854] ">
          <div className="flex justify-between items-center px-6 py-2 md:px-12">
            <div className="flex items-center">
              <Image
                src={mosque}
                className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
              />
              <div className="text-[#D5B260] text-[12px] md:text-[18px] font-bold md:text-3xl md:my-6 my-3 mx-4">
                مساجد / کارتابل درخواست ها
              </div>
            </div>
            <div className="flex">
              <div className="rounded-full hidden bg-[#43637E] text-white md:flex items-center p-3">
                <Image className="cursor-pointer w-[69px]" src={man} />
                <div className="px-3 border-e-2">
                  <div>سلام علی کریمی</div>
                  <div>به سامانه نما خوش آمدید</div>
                </div>
                <div className="ps-3">
                  <div>نقش</div>
                  <div>معاونت طرح و برنامه</div>
                </div>
              </div>
              <div className="flex">
                <Image
                  className="cursor-pointer w-[24px] md:w-[69px] md:mx-4 mx-2"
                  src={menu}
                />
                <Image
                  className="cursor-pointer w-[24px] md:w-[69px]"
                  src={notif}
                />
              </div>
            </div>
          </div>
          <div className="rounded-full bg-[#43637E] text-[10px] text-white flex md:hidden items-center mx-6 p-3">
            <Image className="cursor-pointer w-[50px] md:w-[69px]" src={man} />
            <div className="px-3 border-e-2">
              <div>سلام علی کریمی</div>
              <div>به سامانه نما خوش آمدید</div>
            </div>
            <div className="ps-3">
              <div>نقش</div>
              <div>معاونت طرح و برنامه</div>
            </div>
          </div>
        </div>

        <div className="h-full vector-nama md:px-5">
          <div className="bg-white absolute top-[150px] md:top-[160px] inset-x-6 md:inset-x-11 rounded p-3 md:p-6 scroll-kon">
            <div className="grid grid-cols-1 md:grid-cols-4 text-[12px] md:text-[15px] gap-8 my-7">
              <div className="border-2 px-3 border-[#25C7AA] rounded-full py-1 md:py-2 px-4 text-center relative">
                <div className="flex items-center justify-center bg-[#25c7aa59] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#25C7AA] rounded-full flex items-center justify-center text-white font-bold">1</div>
                </div>
                برای مشاهده تایید شده کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#77B7DC] rounded-full py-1 md:py-2 px-4 text-center relative">
                <div className="flex items-center justify-center bg-[#77b7dc80] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#77B7DC] rounded-full flex items-center justify-center text-white font-bold">2</div>
                </div>
                برای مشاهده تایید شده کلیک کنید
              </div>
              <div className="border-2 px-3 border-red-600 rounded-full py-1 md:py-2 px-4 text-center relative">
                <div className="flex items-center justify-center bg-[#dc262680] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className= "  md:h-[40px] w-[20px] md:w-[40px] bg-red-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                </div>
                برای مشاهده تایید شده کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#FFD140] rounded-full py-1 md:py-2 px-4 text-center relative">
                <div className="flex items-center justify-center bg-[#ffd14080] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className= "  md:h-[40px] w-[20px] md:w-[40px] bg-[#FFD140] rounded-full flex items-center justify-center text-white font-bold">4</div>
                </div>
                برای مشاهده تایید شده کلیک کنید
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="font-bold mb-5 md:mb-0">همه درخواست ها</div>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <input
                  className="border-2 bg-slate-300 px-4 py-2 rounded-full w-full md:w-1/3"
                  placeholder="جستجو..."
                />
                <div className="flex">
                  <button className="flex text-[12px] md:text-[16px] md:mx-3 rounded-full items-center w-full my-2 border-2 px-2 py-1 md:px-4 md:py-2 cursor-pointer">
                    <Image src={filter} />
                    فیلتر درخواست ها
                  </button>
                  <button className="flex text-[12px] md:text-[16px] rounded-full items-center w-full border-2 px-2 py-1 md:px-4 md:py-2 cursor-pointer">
                    <Image src={sort} />
                    مرتب سازی براساس
                  </button>

                </div>
              </div>
            </div>

            <table className="mt-6 rounded hidden md:table  w-full">
              <tr className="rounded ">
                <th className="rounded-ss">نام درخواست</th>
                <th>شماره</th>
                <th>شناسه یکتا</th>
                <th>تاریخ ایجاد</th>
                <th>وضعیت</th>
                <th>-</th>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#FEF4D9] inline-block w-full text-center rounded">
                    ارجاع جهت اصلاح
                  </span>
                </td>
                <td>
                  <Link className="text-sky-500 w-full text-center  inline-block" href="/kartabl/edit">مشاهده درخواست</Link>
                </td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#d9fee2] inline-block w-full text-center rounded ">
                    تایید شده{" "}
                  </span>
                </td>
                <td>
                  <Link className="text-sky-500 w-full text-center  inline-block" href="/kartabl/accept">مشاهده درخواست</Link>
                </td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#d9effe] inline-block w-full text-center rounded">
                    وارد شده{" "}
                  </span>
                </td>
                <td>
                  <Link className="text-sky-500 w-full text-center  inline-block" href="/kartabl/varedshode">مشاهده درخواست</Link>
                </td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#fed9d9] inline-block w-full text-center rounded">
                    رد شده
                  </span>
                </td>
                <td>
                  <Link className="text-sky-500 w-full text-center inline-block" href="/kartabl/reject">مشاهده درخواست</Link>
                </td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#FEF4D9] inline-block w-full text-center rounded">
                    ارجاع جهت اصلاح
                  </span>
                </td>
                <td className="text-center">مشاهده درخواست</td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#FEF4D9] inline-block w-full text-center rounded">
                    ارجاع جهت اصلاح
                  </span>
                </td>
                <td className="text-center">مشاهده درخواست</td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#FEF4D9] inline-block w-full text-center rounded">
                    ارجاع جهت اصلاح
                  </span>
                </td>
                <td className="text-center">مشاهده درخواست</td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#FEF4D9] inline-block w-full text-center rounded">
                    ارجاع جهت اصلاح
                  </span>
                </td>
                <td className="text-center">مشاهده درخواست</td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#FEF4D9] inline-block w-full text-center rounded">
                    ارجاع جهت اصلاح
                  </span>
                </td>
                <td className="text-center">مشاهده درخواست</td>
              </tr>
              <tr>
                <td>نام درخواست مربوطه در اینجا قرار میگیرد</td>
                <td>201</td>
                <td>2253769</td>
                <td>1401.08.02</td>
                <td>
                  <span className="bg-[#FEF4D9] inline-block w-full text-center rounded">
                    ارجاع جهت اصلاح
                  </span>
                </td>
                <td className="text-center">مشاهده درخواست</td>
              </tr>
            </table>


            <div className="grid grid-cols-1 mt-6 gap-3 md:hidden">

              <div className="border border-[#ddd] p-4 my-1 rounded-md">
                <div className="text-center">نام درخواست  مربوطه در اینجا قرار میگیرد</div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>شماره</div>
                  <div>201</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>وضعیت</div>
                  <div className="bg-green-100">تایید شده</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>تاریخ ایچاد</div>
                  <div>1401.09.10</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>شناسه یکتا</div>
                  <div>123343 </div>
                </div>
                <Link href="/kartabl/accept" className="w-full rounded text-center inline-block border py-2 text-[#345894] border-[#345894]">مشاهده درخواست </Link>
              </div>

              <div className="border border-[#ddd] p-4 my-1 rounded-md">
                <div className="text-center">نام درخواست  مربوطه در اینجا قرار میگیرد</div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>شماره</div>
                  <div>201</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>وضعیت</div>
                  <div className="bg-red-100">رد شده</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>تاریخ ایچاد</div>
                  <div>1401.09.10</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>شناسه یکتا</div>
                  <div>123343 </div>
                </div>
                <Link href="/kartabl/reject" className="w-full rounded text-center inline-block border py-2 text-[#345894] border-[#345894]">مشاهده درخواست </Link>
              </div>

              <div className="border border-[#ddd] p-4 my-1 rounded-md">
                <div className="text-center">نام درخواست  مربوطه در اینجا قرار میگیرد</div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>شماره</div>
                  <div>201</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>وضعیت</div>
                  <div className="bg-blue-100">وارد شده</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>تاریخ ایچاد</div>
                  <div>1401.09.10</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>شناسه یکتا</div>
                  <div>123343 </div>
                </div>
                <Link href="/kartabl/varedshode" className="w-full rounded text-center inline-block border py-2 text-[#345894] border-[#345894]">مشاهده درخواست </Link>
              </div>

              <div className="border border-[#ddd] p-4 my-1 rounded-md">
                <div className="text-center">نام درخواست  مربوطه در اینجا قرار میگیرد</div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>شماره</div>
                  <div>201</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>وضعیت</div>
                  <div className="bg-yellow-100">ارجاع جهت اصلاح</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#e5e5e5] rounded">
                  <div>تاریخ ایچاد</div>
                  <div>1401.09.10</div>
                </div>
                <div className="flex px-3 py-1 justify-between bg-[#fff] rounded">
                  <div>شناسه یکتا</div>
                  <div>123343 </div>
                </div>
                <Link href="/kartabl/edit" className="w-full rounded text-center inline-block border py-2 text-[#345894] border-[#345894]">مشاهده درخواست </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      
    </>
  );
  }
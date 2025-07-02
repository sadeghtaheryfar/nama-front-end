"use client";
import Image from "next/image";
import Link from "next/link";
import ButtonSabt from "../button-sabt/button-sabt";
import CartsDarkhastFuture from "./carts-darkhast-future";

import { useEffect, useState } from "react";
import axios from "axios";
import CartsDarkhastActive from "./carts-darkhast-active";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useDebounce from "../../../utils/useDebounce"; // مسیر را بر اساس مکان فایل useDebounce.js تنظیم کنید

const CartsDarkhast = () => {
  const [futureCarts, setFutureCarts] = useState([]);
  const [futureCartsLoading, setFutureCartsLoading] = useState(false);
  const [activeCartsLoading, setActiveCartsLoading] = useState(false);
  const [activeCarts, setActiveCarts] = useState([]);
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const searchParams = useSearchParams();
  const router = useRouter();

  // State برای عبارت جستجو و مقدار دی‌بونس شده آن
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms دیلی برای دی‌بونس

  // State برای شماره صفحه جاری
  const [currentPage, setCurrentPage] = useState(1); // مقدار اولیه 1
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // useEffect برای همگام‌سازی searchTerm و currentPage با URL هنگام بارگذاری یا تغییر URL
  // این useEffect باید قبل از هر useEffect دیگری که به searchParams وابسته است اجرا شود
  // تا stateهای داخلی با URL همگام باشند.
  useEffect(() => {
    const qFromUrl = searchParams.get("q");
    // اگر qFromUrl برابر null یا undefined باشد، آن را به یک رشته خالی تبدیل کنید
    // وگرنه، مقدار آن را به searchTerm تنظیم کنید.
    setSearchTerm(qFromUrl || "");

    const pageFromUrl = Number(searchParams.get("page")) || 1;
    setCurrentPage(pageFromUrl);
  }, [searchParams]); // این useEffect فقط به searchParams وابسته است.

  // useEffect برای واکشی futureCarts (بدون تغییر)
  useEffect(() => {
    const fetchFutureCarts = async () => {
      setFutureCartsLoading(true);
      try {
        const carts = await axios.get(
          `/api/future?item_id=${itemId}&role=mosque_head_coach`
        );
        if (carts.data) {
          setFutureCarts(carts.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFutureCartsLoading(false);
      }
    };

    fetchFutureCarts();
  }, [itemId]);

  // Main useEffect برای واکشی activeCarts و به‌روزرسانی URL
  // این useEffect باید به تغییرات currentPage و debouncedSearchTerm واکنش نشان دهد.
  // همچنین باید مقادیر صحیح page و q را از searchParams برای URL بسازد و router.push کند.
  useEffect(() => {
    const fetchActiveCarts = async () => {
      setActiveCartsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("item_id", itemId);
        queryParams.append("role", "mosque_head_coach");

        // از currentPage برای API call استفاده کنید
        queryParams.append("page", currentPage.toString());
        queryParams.append("per_page", itemsPerPage.toString());

        if (debouncedSearchTerm) {
          queryParams.append("q", debouncedSearchTerm);
        }

        const active = await axios.get(`/api/active?${queryParams.toString()}`);
        if (active.data) {
          setActiveCarts(active.data.data);
          if (active.data.meta && active.data.meta.total) {
            setTotalPages(Math.ceil(active.data.meta.total / itemsPerPage));
          } else {
            setTotalPages(active.data.data.length > 0 ? Math.ceil(active.data.data.length / itemsPerPage) : 1);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setActiveCartsLoading(false);
      }
    };

    fetchActiveCarts();

    // به‌روزرسانی URL
    // این بخش تضمین می‌کند که URL همواره با currentPage و debouncedSearchTerm فعلی همگام باشد.
    const current = new URLSearchParams();
    current.set("page", currentPage.toString());
    if (debouncedSearchTerm) {
      current.set("q", debouncedSearchTerm);
    } else {
      current.delete("q"); // اگر عبارت جستجو خالی است، q را از URL حذف کنید
    }

    const newQueryString = current.toString();
    const currentQueryString = searchParams.toString();

    // فقط در صورتی که query string واقعاً تغییر کرده باشد router.push را فراخوانی کنید.
    // این از حلقه بی‌نهایت و افزودن ورودی‌های غیرضروری به تاریخچه مرورگر جلوگیری می‌کند.
    if (newQueryString !== currentQueryString) {
      router.push(`${pathname}?${newQueryString}`, undefined, { shallow: true });
    }

  }, [currentPage, itemId, debouncedSearchTerm, searchParams, pathname, router]); // وابستگی‌ها

  // مدیریت تغییر عبارت جستجو
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // وقتی کاربر چیزی را جستجو می‌کند، صفحه را به 1 بازنشانی کنید.
    // این باعث می‌شود useEffect اصلی مجدداً اجرا شود با currentPage=1 و عبارت جستجوی جدید.
    setCurrentPage(1);
  };

  // مدیریت تغییر صفحه
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // useEffect اصلی مسئول به‌روزرسانی URL بر اساس currentPage جدید خواهد بود.
    document.getElementById("future-carts-section").scrollIntoView({ behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    buttons.push(
      <button
        key="prev"
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#39A894] hover:bg-gray-100"
        }`}
      >
        قبلی
      </button>
    );

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-[#39A894] text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#39A894] hover:bg-gray-100"
        }`}
      >
        بعدی
      </button>
    );

    return buttons;
  };

  return (
    <>
      <div className="mt-7">
        {/* فیلد جستجو */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="جستجو در درخواست‌ها..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full max-w-md p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39A894] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 md:mt-9 lg:mt-11 xl:mt-12 gap-6 md:gap-7 lg:gap-9 2xl:gap-x-10">
          {activeCartsLoading && (
            <section className='flex justify-center items-center flex-col w-full h-[20rem]'>
              <div className='w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden'>
                  <div className='absolute top-0 left-0 h-full w-full animate-slide'></div>
                  <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer'></div>
              </div>
            </section>
          )}

          {activeCarts &&
            !activeCartsLoading &&
            activeCarts.length >= 1 &&
            activeCarts.map((item, index) => {
              return <CartsDarkhastActive key={index} item={item} />;
            })}

          {!activeCartsLoading && activeCarts.length === 0 && (debouncedSearchTerm ?
            <div className="col-span-full text-center py-8 text-gray-500">
              نتیجه‌ای برای جستجوی شما یافت نشد.
            </div>
            :
            <div className="col-span-full text-center py-8 text-gray-500">
              درخواستی برای نمایش وجود ندارد
            </div>
          )}
        </div>
      </div>


      {/* Pagination */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 mb-4 gap-2 text-sm">
            {renderPaginationButtons()}
          </div>
        )}
      <div id="future-carts-section" className="mt-8">
        <hr className="h-2 mb-5 xl:mt-12" />
        <h2 className="text-lg font-semibold md:my-4 lg:my-7 xl:my-9">درخواست های آینده</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7 lg:gap-9 2xl:gap-10">
          {futureCartsLoading && (
            <section className='flex justify-center items-center flex-col w-full h-[8rem]'>
              <div className='w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden'>
                  <div className='absolute top-0 left-0 h-full w-full animate-slide'></div>
                  <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer'></div>
              </div>
            </section>
          )}

          {futureCarts &&
            futureCarts.length >= 1 &&
            futureCarts.map((item, index) => {
              return (
                <CartsDarkhastFuture
                  key={index}
                  image={item.image}
                  title={item.title}
                  id={item.id}
                  body={item.body}
                />
              );
            })}

          {!futureCartsLoading && futureCarts.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              درخواستی برای نمایش وجود ندارد
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartsDarkhast;
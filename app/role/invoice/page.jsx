// app/role/kartabl/page.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import HeaderProfile from "./../../../components/header-profile-admin/page";
import { formatPrice } from "../../../components/utils/formatPrice";
import menu from "./../../../public/assets/menu.svg";
import notif from "./../../../public/assets/notif.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// Import Redux hooks and actions from the NEW kartablSlice
import { useDispatch, useSelector } from 'react-redux';
import {
  setKartablFilters,
  setKartablCurrentPage,
  setKartablTotalPages,
  setKartablHeaderData,
  setKartablGlobalParams,
  resetKartablFilters,
  setKartablData, // Action to store the fetched table data
} from './../../../redux/features/dashboards/kartablSlice'; // Adjust path if necessary based on your project structure

import useDebounce from './../../../components/utils/useDebounce';

export default function KartablPage() { // Renamed to KartablPage to avoid conflict if original page.jsx is different
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const dispatch = useDispatch();
  // Select state directly from the 'kartabl' slice
  const {
    item_id,
    role,
    search,
    sort,
    direction,
    status,
    version,
    request_type,
    from_date,
    to_date,
    currentPage,
    totalPages,
    requests, // Data for the table
    total_request_amount,
    total_report_amount,
    request_and_report_total_amount,
    versions: availableVersions, // Available versions for the filter dropdown from API response
    headerData, // Header data specific to this Kartabl page
  } = useSelector(state => state.kartabl); // Select the entire kartabl slice state

  const [loadingHeader, setLoadingHeader] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const [localSearchInput, setLocalSearchInput] = useState(search);
  const debouncedSearchTerm = useDebounce(localSearchInput, 500);

  useEffect(() => {
    setLocalSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearchTerm !== search) {
        dispatch(setKartablFilters({ search: debouncedSearchTerm }));
        dispatch(setKartablCurrentPage(1));
    }
  }, [debouncedSearchTerm, dispatch, search]);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const itemIdParam = searchParams.get("item_id");

    dispatch(setKartablGlobalParams({ item_id: itemIdParam, role: roleParam }));

    if (!roleParam || !itemIdParam) {
      router.push("/");
      return;
    }

    const validRoles = [
      "mosque_head_coach",
      "mosque_cultural_officer",
      "area_interface",
      "executive_vice_president_mosques",
      "deputy_for_planning_and_programming"
    ];

    const validItemIds = ["1", "2", "3", "4","8","9","10","11","12","13","14","15"];

    if (!validRoles.includes(roleParam) || !validItemIds.includes(itemIdParam)) {
      router.push("/");
    }
  }, [router, searchParams, dispatch]);

  useEffect(() => {
    if (!item_id) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${item_id}&role=mosque_head_coach`);
        if (response.data) {
          dispatch(setKartablHeaderData(response.data));
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingHeader(false);
      }
    };
    fetching();
  }, [item_id, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutsideFilter = filterRef.current && !filterRef.current.contains(event.target);
      const isClickInsideDatePicker = event.target.closest('.rmdp-container ') || // Main date picker container
                                      event.target.closest('.rmdp-calendar') || // The calendar grid itself
                                      event.target.closest('.rmdp-header') || // Calendar header (month/year nav)
                                      event.target.closest('.rmdp-week-day') || // Weekday headers
                                      event.target.closest('.rmdp-day') || // Individual day cells
                                      event.target.closest('.rmdp-month-picker') || // Month selection
                                      event.target.closest('.rmdp-year-picker') || // Year selection
                                      event.target.closest('.rmdp-button') || // Buttons within the calendar (e.g., arrows)
                                      event.target.closest('.rmdp-ul');

      if (isFilterOpen && isClickOutsideFilter && !isClickInsideDatePicker) {
        setIsFilterOpen(false);
      }
      if (isSortOpen && sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isFilterOpen, isSortOpen]); // isFilterOpen and isSortOpen are dependencies

  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (item_id) params.set("item_id", item_id);
    if (role) params.set("role", role);

    // Include all filters from Redux state in URL for persistence on refresh/direct link
    if (search) params.set("search", search);
    if (sort !== "created_at") params.set("sort", sort); // Only add if not default
    if (direction !== "desc") params.set("direction", direction); // Only add if not default
    if (status) params.set("status", status);
    if (version) params.set("version", version);
    if (request_type === "single") params.set("single_request", "1");
    if (request_type === "normal") params.set("normal_request", "1");
    if (from_date) params.set("from_date", from_date);
    if (to_date) params.set("to_date", to_date);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false, shallow: true });
  };

  const handleFilterChange = (newFilterState) => {
    dispatch(setKartablFilters(newFilterState));
    dispatch(setKartablCurrentPage(1));
  };

  const handleResetFilters = () => {
    dispatch(resetKartablFilters());
    setLocalSearchInput(''); // Reset local search input
    setIsFilterOpen(false);
  };

  useEffect(() => {
    if (!item_id || !role) return;

    setLoading(true);
    const fetchRequests = async () => {
      try {
        const params = {
          q: search,
          sort,
          direction,
          status,
          per_page: itemsPerPage,
          page: currentPage,
          itemId: item_id,
          role,
          version,
          single_request: request_type === "single" ? 1 : undefined,
          normal_request: request_type === "normal" ? 1 : undefined,
          from_date,
          to_date,
        };

        const response = await axios.get(`/api/invoice`, { params });

        // Dispatch the fetched data to the kartabl slice
        dispatch(setKartablData(response.data));

        if (response.data.meta && response.data.meta.total) {
          dispatch(setKartablTotalPages(Math.ceil(response.data.meta.total / itemsPerPage)));
        } else {
          dispatch(setKartablTotalPages(Math.ceil(response.data.data.length / itemsPerPage) || 1));
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [currentPage, item_id, role, search, sort, direction, status, version, request_type, from_date, to_date, itemsPerPage, dispatch]);

  const goBack = (e) => {
    const params = new URLSearchParams();
    if (item_id) params.set("item_id", item_id);
    if (role) params.set("role", role);
    const queryString = params.toString();

    if(e) {
      const newPath = pathname.split('/').slice(0, -1).join('/') || '/';
      if (queryString) {
        router.push(`${newPath}?${queryString}`);
      } else {
        router.push(newPath);
      }
    } else {
      router.push('/');
    }
  };

  const handlePageChange = (page) => {
    dispatch(setKartablCurrentPage(page));
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

  const stepTitles = {
    'approval_mosque_head_coach': 'در انتظار تایید سر مربی مسجد',
    'approval_mosque_cultural_officer': 'در انتظار تایید مسئول فرهنگی مسجد',
    'approval_area_interface': 'در انتظار تایید رابط منطقه',
    'approval_executive_vice_president_mosques': 'در انتظار تایید معاونت اجرایی مسجد',
    'approval_deputy_for_planning_and_programming': 'در انتظار تایید معاونت طرح و برنامه',
    'finish': 'به اتمام رسیده',
  };


  return (
    <>
      <div className=" h-screen relative">
        <div className="bg-[#002a4fd5] vector-nama2 h-[15rem] lg:h-[20rem] bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854]  relative overflow-hidden">
          <div className="absolute top-[9rem] lg:top-[11rem] w-full">
            <img className="w-full opacity-20" src="/assets/Vector.png" alt="" />
          </div>
          <div className="flex justify-between items-center px-6 py-2 md:px-12">
            <div className="flex items-center">
              <img
                src={headerData?.data?.logo || '/Images/masajed/mosque.svg'} // Use headerData from kartabl slice
                className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
              />
              <div className="text-[#D5B260] text-[12px] md:text-[18px] font-bold md:text-3xl md:my-6 my-3 mx-4">
              {headerData?.data?.title} / صورت حساب ها
              </div>
            </div>
            <div className="flex">
              <div className="rounded-full hidden bg-[#43637E] text-white md:flex items-center p-3">
                <HeaderProfile bgRole='#3A5C78'  />
              </div>
              <div className="flex">
                <Image
                  className="cursor-pointer w-[36px] md:w-[69px] md:mx-4 mx-2 hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                  alt=""
                  src={menu}
                  onClick={() => goBack()}
                />
                <Image

                  className="cursor-pointer w-[36px] md:w-[69px] hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                  alt=""
                  src={notif}
                  onClick={() => goBack(true)}
                />
              </div>
            </div>
          </div>
          <div className="rounded-full bg-[#43637E] text-[10px] text-white flex md:hidden items-center mx-6 p-3">
            <HeaderProfile bgRole='#3A5C78'  />
          </div>
        </div>

        <div className="h-full vector-nama md:px-5">
          <div className="bg-white absolute top-[150px] md:top-[160px] inset-x-6 md:inset-x-11 rounded p-3 md:p-6 scroll-kon">
            <div className="grid grid-cols-1 md:grid-cols-3 text-[12px] md:text-[15px] gap-8 my-7 px-[2rem] lg:px-0">
                <p>جمع کل : {formatPrice(request_and_report_total_amount)}</p>

                <p>جمع کل درخواست ها : {formatPrice(total_request_amount)}</p>

                <p>جمع کل گزارش ها : {formatPrice(total_report_amount)}</p>
            </div>

            <div className="flex flex-col gap-4 lg:gap-16 xl:gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
                <h2 className="text-base font-bold text-center min-w-fit lg:text-lg xl:text-[22px]">
                  صورت حساب ها
                </h2>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="bg-[#F6F6F6] rounded-full flex items-center gap-2 px-3 flex-auto xl:px-6 h-[60px] lg:min-w-80 xl:w-[480px] 2xl:w-[560px] xl:max-w-lg">
                    <Image
                      width={0}
                      height={0}
                      className="w-6"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/Search.svg"}
                    />
                      <input
                        placeholder="جستجو کنید ..."
                        className="w-full bg-transparent h-full focus:outline-none"
                        onChange={(e) => setLocalSearchInput(e.target.value)}
                        value={localSearchInput}
                      />
                  </div>
                  <div className="flex items-center gap-4">
                    <div ref={filterRef} className="relative inline-block mr-4">
                      <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center justify-center gap-2 h-12 px-3 border rounded-full min-w-fit xl:px-4 xl:h-[60px]">
                        <Image
                          width={0}
                          height={0}
                          className="w-5 lg:w-6"
                          alt="#"
                          src={"/Images/masajed/kartabl-darkhast/filter.svg"}
                        />
                        <span className="text-xs text-[#202020] min-w-fit lg:text-lg">
                          فیلتر
                        </span>
                      </button>

                      {isFilterOpen && (
                        <div className="absolute z-10 mt-2 w-72 bg-white border rounded-[8px] shadow">
                          {/* Arman Version Filter */}
                          <div className="p-2 border-b">
                            <div className="font-bold mb-2">ورژن آرمان</div>
                            <div className="px-2">
                              <select
                                className="w-full p-2 border rounded"
                                value={version || ""}
                                onChange={(e) => handleFilterChange({ version: e.target.value || null })}
                              >
                                <option value="">همه</option>
                                {availableVersions && Object.values(availableVersions).map((v, index) => (
                                  <option key={index} value={v}>{v}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Request Type Filter */}
                          <div className="p-2 border-b">
                            <div className="font-bold mb-2">نوع درخواست</div>
                            <div className="px-2">
                              <select
                                className="w-full p-2 border rounded"
                                value={request_type || ""}
                                onChange={(e) => handleFilterChange({ request_type: e.target.value || null })}
                              >
                                <option value="">همه</option>
                                <option value="single">تک مرحله ای</option>
                                <option value="normal">دو مرحله ای</option>
                              </select>
                            </div>
                          </div>

                          {/* Date Range Filter - From Date */}
                          <div className="p-2 border-b">
                            <div className="font-bold mb-2">از تاریخ</div>
                            <div className="px-2">
                              <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                value={from_date}
                                onChange={(date) => {
                                  // Only update the filter if a date object is actually provided (i.e., not just on initial focus/click)
                                  if (date) {
                                    handleFilterChange({ from_date: date.format("YYYY-MM-DD") });
                                  }
                                  // Do NOT close the filter modal here; rely on handleClickOutside
                                }}
                                calendarPosition="bottom-right"
                                inputClass="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          {/* Date Range Filter - To Date */}
                          <div className="p-2 border-b">
                            <div className="font-bold mb-2">تا تاریخ</div>
                            <div className="px-2">
                              <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                value={to_date}
                                onChange={(date) => {
                                  // Only update the filter if a date object is actually provided
                                  if (date) {
                                    handleFilterChange({ to_date: date.format("YYYY-MM-DD") });
                                  }
                                  // Do NOT close the filter modal here; rely on handleClickOutside
                                }}
                                calendarPosition="bottom-right"
                                inputClass="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="p-2 border-t flex flex-col gap-2">
                            <button
                              className="w-full p-2 bg-[#39A894] text-white rounded"
                              onClick={() => setIsFilterOpen(false)}
                            >
                              بستن
                            </button>
                            <button
                              className="w-full p-2 bg-white text-red-500 border border-red-500 rounded"
                              onClick={handleResetFilters}
                            >
                              حذف فیلترها
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div ref={sortRef} className="relative inline-block">
                      <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center justify-center gap-2 h-12 px-3 border rounded-full min-w-fit xl:px-4 xl:h-[60px]">
                        <Image
                          width={0}
                          height={0}
                          className="w-5 lg:w-6"
                          alt="#"
                          src={"/Images/masajed/kartabl-darkhast/sort.svg"}
                        />
                        <span className="text-xs text-[#202020] min-w-fit lg:text-lg">
                        {direction
                              ? (direction === "desc" ? "جدید ترین"
                                : direction === "asc" ? "قدیمی ترین"
                                : "وضعیت نامشخص")
                              : "مرتب سازی بر اساس"}
                        </span>
                      </button>

                      {isSortOpen && (
                        <div className="absolute mt-2 w-full bg-white border rounded shadow">
                          <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ direction: 'desc' }); setIsSortOpen(false); }}>جدید ترین</div>
                          <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ direction: 'asc' }); setIsSortOpen(false); }}>قدیمی ترین</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="relative inset-0 bg-white/70 backdrop-blur-sm flex lg:hidden justify-center items-center z-10 w-full h-64">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:hidden" id="future-carts-section">
                {(requests && !loading) && requests.map((request) => (
                  <div key={request?.id} className="flex flex-col border rounded-lg px-5 py-4 gap-2">
                    <h2 className="text-sm text-[#202020] pb-3">{request?.request_plan?.title || "بدون عنوان"}{request?.request_plan?.single_step && (
                      <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mt-2 rounded-lg flex items-center justify-center">
                        <p>تک مرحله ای</p>
                      </div>
                    )}</h2>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">نسخه آرمان</span>
                      <span className="text-sm text-[#202020]">{request?.request_plan?.version ?? "-"}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">شماره</span>
                      <span className="text-sm text-[#202020]">{request?.id} {request?.unit?.code ? `- ${request?.unit?.code}` : ''}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">سر مربی</span>
                      <span className="text-sm text-[#202020]">{request?.user?.name}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">مرحله</span>
                      <span className="text-sm text-[#202020]">{stepTitles[request?.step]}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">واحد حقوقی</span>
                      <span className="text-sm text-[#202020]">{request?.unit?.title}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">تاریخ ایجاد</span>
                      <span className="text-sm text-[#202020]">
                        {new Date(request.created_at).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">مبلغ مرحله درخواست</span>
                      <span className="text-sm text-[#202020]">{request?.final_amount ? formatPrice(request?.final_amount) : "-"}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">مبلغ مرحله گزارش</span>
                      <span className="text-sm text-[#202020]">{request?.report?.final_amount ? formatPrice(request?.report?.final_amount) : "-"}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">مجموع مبلغ درخواست و گزارش</span>
                      <span className="text-sm text-[#202020]">{formatPrice((request?.report?.final_amount || 0) + (request?.final_amount || 0))}</span>
                    </div>

                    <Link href={`/role/kartabl/darkhast?id=` + request?.id + `&role=${role}&item_id=${item_id}`}>
                      <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
                        مشاهده درخواست
                      </button>
                    </Link>

                    <Link
                      href={`/role/kartabl-gozaresh/darkhast?id=` + request?.report?.id + `&role=${role}&item_id=${item_id}`}
                    >
                      <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
                        مشاهده گزارش
                      </button>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="hidden xl:block">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-7 py-5 text-lg text-right">نام اکشن پلن</th>
                      <th className="border border-gray-300 px-7 py-5 text-lg">نسخه آرمان</th>
                      <th className="border border-gray-300 px-7 py-5 text-lg">مبلغ مرحله درخواست</th>
                      <th className="border border-gray-300 px-7 py-5 text-lg">مبلغ مرحله گزارش</th>
                      <th className="border border-gray-300 px-7 py-5 text-lg">مجموع مبلغ درخواست و گزارش</th>
                      <th className="border border-gray-300 px-7 py-5 text-lg"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={7} className="flex justify-center items-center">
                          <div className="relative inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-10 w-full h-64">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {(requests && !loading) && requests.map((request) => (
                      <tr key={request?.id} className="border">
                        <td className="border border-gray-300 px-7 py-5 text-base">
                          {request?.request_plan?.title || "بدون عنوان"}
                          {request?.request_plan?.single_step && (
                            <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mt-2 rounded-lg flex items-center justify-center">
                              <p>تک مرحله ای</p>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {request?.request_plan?.version ?? "-"}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {request?.final_amount ? formatPrice(request?.final_amount) : "-"}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {request?.report?.final_amount ? formatPrice(request?.report?.final_amount) : "-"}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {formatPrice((request?.report?.final_amount || 0) + (request?.final_amount || 0))}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center">
                          <Link className="hover:text-[#D5B260] hover:decoration-[#D5B260]" href={`/role/kartabl/darkhast?id=` + request?.id + `&role=${role}&item_id=${item_id}`}>
                          مشاهده درخواست</Link>
                          <br />
                          {request?.report?.status != "pending" && (
                            <Link className="hover:text-[#D5B260] hover:decoration-[#D5B260]" 
                              href={`/role/kartabl-gozaresh/darkhast?id=` + request?.report?.id + `&role=${role}&item_id=${item_id}`}
                            >مشاهده گزارش</Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mb-4 gap-2 text-sm">
                  {renderPaginationButtons()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
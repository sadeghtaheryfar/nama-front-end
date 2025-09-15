'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from './../../../utils/useDebounce';
import { formatPrice } from "../../../../components/utils/formatPrice";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
};

const Darkhastha = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearchInput, setLocalSearchInput] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(localSearchInput, 500);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "created_at",
    direction: searchParams.get("direction") || "",
    status: searchParams.get("status") || null,
    version: searchParams.get("version") || null,
    request_type: searchParams.get("single_request") === "1" ? "single" : (searchParams.get("normal_request") === "1" ? "normal" : null),
    from_date: searchParams.get("from_date") || null,
    to_date: searchParams.get("to_date") || null,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      setFilters(prevFilters => ({ ...prevFilters, search: debouncedSearchTerm }));
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

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

      if (isClickOutsideFilter && !isClickInsideDatePicker) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const updateURL = (newFilters, newPage) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.direction) params.set("direction", newFilters.direction);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.version) params.set("version", newFilters.version);
    if (newFilters.request_type === "single") params.set("single_request", "1");
    if (newFilters.request_type === "normal") params.set("normal_request", "1");
    if (newFilters.from_date) params.set("from_date", newFilters.from_date);
    if (newFilters.to_date) params.set("to_date", newFilters.to_date);
    if (newPage > 1) params.set("page", newPage.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      let newFilters = { ...prev, [key]: value };

      if (key === "request_type") {
        if (value === "single") {
          newFilters.normal_request = false;
        } else if (value === "normal") {
          newFilters.single_request = false;
        } else {
          newFilters.single_request = false;
          newFilters.normal_request = false;
        }
      }
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const cleared = {
      search: "",
      sort: "created_at",
      direction: "",
      status: null,
      version: null,
      request_type: null,
      from_date: null,
      to_date: null,
    };
    setFilters(cleared);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { search, sort, direction, status, version, request_type, from_date, to_date } = filters;
        const response = await axios.get(`/api/invoice?item_id=${itemId}&role=mosque_head_coach`, {
          params: {
            q: search,
            sort,
            direction,
            status,
            version,
            single_request: request_type === "single" ? 1 : undefined,
            normal_request: request_type === "normal" ? 1 : undefined,
            from_date,
            to_date,
            per_page: itemsPerPage,
            page: currentPage,
            itemId
          },
        });

        setRequests(response.data);
        if (response.data.meta && response.data.meta.total) {
          setTotalPages(Math.ceil(response.data.meta.total / itemsPerPage));
        } else {
          setTotalPages(Math.ceil(response.data.data.length / itemsPerPage) || 1);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    updateURL(filters, currentPage);
  }, [currentPage, itemId, filters]);

  useEffect(() => {
    setRequests([]);
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(filters, page);
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
      <div className="flex flex-col justify-center items-start gap-5">
        <h2 className="text-base font-bold text-center lg:text-lg xl:text-[22px]">
          صورت حساب ها
        </h2>
        <div className="grid lg:grid-cols-3 gap-6 2xl:gap-10 w-full">
          <p>جمع کل : {formatPrice(requests?.request_and_report_total_amount)}</p>

          <p>جمع کل درخواست ها : {formatPrice(requests?.total_request_amount)}</p>

          <p>جمع کل گزارش ها : {formatPrice(requests?.total_report_amount)}</p>
        </div>
      </div>
      <hr className="h-2 my-6" />
      <div className="flex flex-col gap-4 lg:gap-16 xl:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center w-full">
            <div className="bg-[#F6F6F6] rounded-full flex items-center gap-2 px-3 flex-auto xl:px-6 h-[60px] w-full">
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
                value={localSearchInput}
                onChange={(e) => setLocalSearchInput(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 whitespace-nowrap w-max">
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
                    فیلتر درخواست‌ها
                  </span>
                </button>

                {isFilterOpen && (
                  <div className="absolute mt-2 w-72 bg-white border rounded-[8px] shadow-lg p-4 z-20">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">ورژن آرمان</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.version || ""}
                        onChange={(e) => handleFilterChange("version", e.target.value || null)}
                      >
                        <option value="">همه</option>
                        {requests?.versions && Object.values(requests.versions).map((version, index) => (
                          <option key={index} value={version}>{version}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">نوع درخواست</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.request_type || ""}
                        onChange={(e) => handleFilterChange("request_type", e.target.value || null)}
                      >
                        <option value="">همه</option>
                        <option value="single">تک مرحله ای</option>
                        <option value="normal">دو مرحله ای</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">از تاریخ</label>
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={filters.from_date}
                        onChange={(date) => handleFilterChange("from_date", date ? date.format("YYYY-MM-DD") : null)}
                        calendarPosition="bottom-right"
                        inputClass="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">تا تاریخ</label>
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={filters.to_date}
                        onChange={(date) => handleFilterChange("to_date", date ? date.format("YYYY-MM-DD") : null)}
                        calendarPosition="bottom-right"
                        inputClass="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="px-4 py-2 bg-[#39A894] text-white rounded-md hover:bg-[#2e8f7a]"
                      >
                        بستن
                      </button>
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
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
                    {filters.direction
                      ? (filters.direction === "desc" ? "جدید ترین"
                        : filters.direction === "asc" ? "قدیمی ترین"
                          : "وضعیت نامشخص")
                      : "مرتب سازی بر اساس"}
                  </span>
                </button>

                {isSortOpen && (
                  <div className="absolute mt-2 w-full bg-white border rounded shadow">
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange("direction", 'desc'); setIsSortOpen(false); }}>جدید ترین</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange("direction", 'asc'); setIsSortOpen(false); }}>قدیمی ترین</div>
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
          {(requests?.data && !loading) && requests?.data?.map((request) => (
            <div key={request.id} className="flex flex-col border rounded-lg px-5 py-4 gap-2">
              <h2 className="text-sm text-[#202020] pb-3">{request?.request_plan?.title || "بدون عنوان"} {request?.single_step && (
                <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mt-2 rounded-lg flex items-center justify-center">
                  <p>تک مرحله ای</p>
                </div>
              )}</h2>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">نسخه آرمان</span>
                <span className="text-sm text-[#202020]">{request?.request_plan?.version ?? "-"}</span>
              </div>

              <div className="flex items-center justify-between pl-0.5 pr-2">
                <span className="text-xs text-[#959595]">وضعیت</span>
                <span className={`flex items-center justify-center text-xs rounded-lg w-[85px] h-7
                  ${request.status === "in_progress" ? "text-[#258CC7] bg-[#D9EFFE]" :
                    request.status === "done" ? "text-[#39A894] bg-[#DFF7F2]" :
                      request.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" :
                        "text-[#D9534F] bg-[#FDECEA]"}`}>
                  {request.status === "rejected" ? "رد شده" :
                    request.status === "in_progress" ? "جاری" :
                      request.status === "action_needed" ? "نیازمند اصلاح" :
                        request.status === "done" ? "تایید شده" : "نامشخص"}
                </span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">مبلغ مرحله درخواست	</span>
                <span className="text-sm text-[#202020]">{request?.final_amount ? formatPrice(request?.final_amount) : "-"}</span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">مبلغ مرحله گزارش	</span>
                <span className="text-sm text-[#202020]">{request?.report?.final_amount ? formatPrice(request?.report?.final_amount) : "-"}</span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">مجموع مبلغ درخواست و گزارش</span>
                <span className="text-sm text-[#202020]">{formatPrice(request?.report?.final_amount + request?.final_amount) ?? "-"}</span>
              </div>

              <Link href={`/${itemId}/kartabl-darkhast/darkhast?id=` + request.id}>
                <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
                  مشاهده
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
                <th className="border border-gray-300 px-7 py-5 text-lg">وضعیت</th>
                <th className="border border-gray-300 px-7 py-5 text-lg"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="flex justify-center items-center">
                    <div className="relative inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-10 w-full h-64">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              )}

              {(requests?.data && !loading) && requests?.data?.map((request) => (
                <tr key={request.id}>
                  <td className="border border-gray-300 px-7 py-5 text-base">
                    {request?.request_plan?.title || "بدون عنوان"}
                    {request?.single_step && (
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
                    {formatPrice(request?.report?.final_amount + request?.final_amount) ?? "-"}
                  </td>
                  <td className="border border-b-0 border-gray-300 px-7 py-5 text-center flex justify-center items-center">
                    <div className={`w-[169px] h-7 text-sm py-1 rounded-lg flex items-center justify-center
                      ${request.status === "in_progress" ? "text-[#258CC7] bg-[#D9EFFE]" :
                        request.status === "done" ? "text-[#39A894] bg-[#DFF7F2]" :
                          request.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" :
                            "text-[#D9534F] bg-[#FDECEA]"}`}>
                      {request.status === "rejected" ? "رد شده" :
                        request.status === "in_progress" ? "جاری" :
                          request.status === "action_needed" ? "نیازمند اصلاح" :
                            request.status === "done" ? "تایید شده" : "نامشخص"}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
                    <Link href={`/${itemId}/kartabl-darkhast/darkhast?id=` + request.id}>مشاهده</Link>
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
    </>
  );
};

export default Darkhastha;
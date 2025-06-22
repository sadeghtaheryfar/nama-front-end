'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from './../../../utils/useDebounce';

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
  
  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "created_at",
    direction: searchParams.get("direction") || "",
    status: searchParams.get("status") || null,
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
      if (filterRef.current && !filterRef.current.contains(event.target)) {
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

  // Get current page from URL or default to 1
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Update URL with current filters and pagination
  const updateURL = (newFilters, newPage) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.direction) params.set("direction", newFilters.direction);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newPage > 1) params.set("page", newPage.toString());
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Update filters and URL when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { search, sort, direction, status } = filters;
        const response = await axios.get(`/api/darkhast?item_id=${itemId}&role=mosque_head_coach`, {
          params: {
            q: search,
            sort,
            direction,
            status,
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
    'approval_executive_vice_president_mosques': 'در انتظار تایید معاونت اجرایی مساجد',
    'approval_deputy_for_planning_and_programming': 'در انتظار تایید معاونت طرح و برنامه',
    'finish': 'به اتمام رسیده',
  };

  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-16 xl:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
          <h2 className="text-base font-bold text-center min-w-fit lg:text-lg xl:text-[22px]">
            همه درخواست ها
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
                  value={localSearchInput}
                  onChange={(e) => setLocalSearchInput(e.target.value)} 
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
                    {filters.status 
                      ? (filters.status === "rejected" ? "رد شده" 
                        : filters.status === "in_progress" ? "جاری" 
                        : filters.status === "action_needed" ? "نیازمند اصلاح" 
                        : filters.status === "done" ? "تایید شده" 
                        : "وضعیت نامشخص") 
                      : "فیلتر درخواست‌ها"}
                  </span>
                </button>

                {isFilterOpen && (
                  <div className="absolute mt-2 w-full bg-white border rounded-[8px] shadow">
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: '' }); setIsFilterOpen(false); }}>همه</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'rejected' }); setIsFilterOpen(false); }}>رد شده</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'in_progress' }); setIsFilterOpen(false); }}>جاری</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'action_needed' }); setIsFilterOpen(false); }}>نیازمند اصلاح</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'done' }); setIsFilterOpen(false); }}>تایید شده</div>
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
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, direction: 'desc' }); setIsSortOpen(false); }}>جدید ترین</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, direction: 'asc' }); setIsSortOpen(false); }}>قدیمی ترین</div>
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
              <h2 className="text-sm text-[#202020] pb-3">{request?.request_plan?.title || "بدون عنوان"}</h2>
              
              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">شماره</span>
                <span className="text-sm text-[#202020]">{request.id} {request?.unit?.code ? `- ${request?.unit?.code}` : ''}</span>
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
                  {new Date(request.created_at).toLocaleDateString("fa-IR",options)}
                </span>
              </div>

              <Link href={`/${itemId}/kartabl-darkhast/darkhast?id=` + request.id}>
                <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-[10px] w-full h-12 flex justify-center items-center mb-2">
                  مشاهده درخواست
                </button>
              </Link>
            </div>
          ))}
        </div>

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
                <th className="border border-gray-300 px-7 py-5 text-lg">سر مربی</th>
                <th className="border border-gray-300 px-7 py-5 text-lg">واحد حقوقی</th>
                <th className="border border-gray-300 px-7 py-5 text-lg">مرحله</th>
                <th className="border border-gray-300 px-7 py-5 text-lg">وضعیت</th>
                <th className="border border-gray-300 px-7 py-5 text-lg"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="flex justify-center items-center">
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
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request.id} {request?.unit?.code ? `- ${request?.unit?.code}` : ''}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {new Date(request.created_at).toLocaleDateString("fa-IR",options)}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request?.user?.name}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request?.unit?.title}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center !text-[12px]">
                    {stepTitles[request?.step]}
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
                    <Link href={`/${itemId}/kartabl-darkhast/darkhast?id=` + request.id}>مشاهده درخواست</Link>
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
'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CartsGozaresh from "../carts-gozaresh/carts-gozaresh";
import TableGozaresh from "../table-gozaresh/table-gozaresh";
import { toPersianDate  } from "../../../../components/utils/toPersianDate";
import { usePathname, useSearchParams,useRouter } from "next/navigation";
import useDebounce from './../../../utils/useDebounce';

const DarkhasthaGozaresh = () => {
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

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const updateURL = (newFilters, newPage) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.direction) params.set("direction", newFilters.direction);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newPage > 1) params.set("page", newPage.toString());
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { search, sort, direction, status } = filters;
        const response = await axios.get(`/api/darkhast-reports?item_id=${itemId}&role=mosque_head_coach`, {
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
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const stepTitles = itemId == 8
  ? {
    'approval_mosque_head_coach': 'در انتظار تایید مسئول تشکل',
    'approval_mosque_cultural_officer': 'در انتظار تایید رابط دانشگاه',
    'approval_area_interface': 'در انتظار تایید ناظر',
    'approval_executive_vice_president_mosques': 'در انتظار تایید معاونت دانشجویی',
    'approval_deputy_for_planning_and_programming': 'در انتظار تایید معاونت طرح و برنامه',
    'finish': 'به اتمام رسیده',
  }
  : {
    'approval_mosque_head_coach': 'در انتظار تایید سر مربی مسجد',
    'approval_mosque_cultural_officer': 'در انتظار تایید مسئول فرهنگی مسجد',
    'approval_area_interface': 'در انتظار تایید رابط منطقه',
    'approval_executive_vice_president_mosques': 'در انتظار تایید معاونت اجرایی مسجد',
    'approval_deputy_for_planning_and_programming': 'در انتظار تایید معاونت طرح و برنامه',
    'finish': 'به اتمام رسیده',
  };

  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/info?item_id=${itemId}&role=mosque_head_coach`);
        if (response.data) {
          setInfo(response.data);
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingInfo(false);
      }
    };
    fetching();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5 lg:flex-row lg:justify-between">
        <h2 className="text-base font-bold text-center lg:text-lg xl:text-[22px] text-nowrap">
          گزارش گردش کار گزارش ها{" "}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-[2rem]">
          <div onClick={() => { handleFilterChange({ ...filters, status: 'pending' }); setIsFilterOpen(false); }} className="cursor-pointer flex items-center justify-start gap-3 h-8 rounded-full bg-[#25C7AA]/5 border border-[#e22afc] xl:w-44 xl:h-12">
            <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#e22afc]/30 rounded-full xl:outline-[14px] bg-[#e22afc] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
              {info?.reports?.pending ? info?.reports?.pending : '0'}
            </span>
            <span className="text-sm font-semibold text-[#e22afc] xl:text-lg 2xl:text-[22px]">
              باز
            </span>
          </div>
          <div onClick={() => { handleFilterChange({ ...filters, status: 'done' }); setIsFilterOpen(false); }} className="cursor-pointer flex items-center justify-start gap-3 h-8 rounded-full bg-[#25C7AA]/5 border border-[#25C7AA] xl:w-44 xl:h-12">
            <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#25C7AA4D]/30 rounded-full xl:outline-[14px] bg-[#25C7AA] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
              {info?.reports?.done ? info?.reports?.done : '0'}
            </span>
            <span className="text-sm font-semibold text-[#25C7AA] xl:text-lg 2xl:text-[22px]">
              تایید شده
            </span>
          </div>
          <div onClick={() => { handleFilterChange({ ...filters, status: 'in_progress' }); setIsFilterOpen(false); }} className="cursor-pointer flex items-center justify-start gap-6 h-8 rounded-full bg-[#77B7DC]/5 border border-[#77B7DC] xl:w-44 xl:h-12">
            <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#77B7DC]/30 rounded-full xl:outline-[14px] bg-[#77B7DC] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
              {info?.reports?.in_progress ? info?.reports?.in_progress : '0'}
            </span>
            <span className="text-sm font-semibold text-[#77B7DC] xl:text-lg 2xl:text-[22px]">جاری</span>
          </div>
          <div onClick={() => { handleFilterChange({ ...filters, status: 'rejected' }); setIsFilterOpen(false); }} className="cursor-pointer flex items-center justify-start gap-5 h-8 rounded-full bg-[#D32F2F]/5 border border-[#D32F2F] xl:w-44 xl:h-12">
            <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#D32F2F]/30 rounded-full xl:outline-[14px] bg-[#D32F2F] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
              {info?.reports?.rejected ? info?.reports?.rejected : '0'}
            </span>
            <span className="text-sm font-semibold text-[#D32F2F] xl:text-lg 2xl:text-[22px]">رد شده</span>
          </div>
          <div onClick={() => { handleFilterChange({ ...filters, status: 'action_needed' }); setIsFilterOpen(false); }} className="cursor-pointer flex items-center justify-start gap-3 h-8 rounded-full bg-[#FFD140]/5 border border-[#FFD140] xl:w-44 xl:h-12">
            <span className="text-lg font-semibold text-white flex items-center justify-center outline outline-8 outline-[#FFD140]/30 rounded-full xl:outline-[14px] bg-[#FFD140] w-8 h-8 pt-1.5 xl:h-12 xl:w-12 xl:text-[28px]">
              {info?.reports?.action_needed ? info?.reports?.action_needed : '0'}
            </span>
            <span className="text-sm font-semibold min-w-fit text-[#FFD140] xl:text-lg 2xl:text-[22px]">
              نیازمند اصلاح
            </span>
          </div>
        </div>
      </div>

      <hr className="h-2 my-6" />

      <div className="flex flex-col gap-4 lg:gap-16 xl:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
          <h2 className="text-base font-bold text-center min-w-fit lg:text-lg xl:text-[22px]">
            همه گزارش ها
          </h2>
          <div>
            <Link className="flex hover:scale-[1.03] active:scale-[1] transition-[0.9s] bg-sky-400 text-white whitespace-nowrap px-[1rem] py-[0.5rem] rounded-full" href={`/${itemId}/invoice`}>صورت حساب</Link>
          </div>
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
                        : filters.status === "pending" ? "باز" 
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
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'pending' }); setIsFilterOpen(false); }}>باز</div>
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
              <h2 className="text-sm text-[#202020] pb-3">{request?.request?.request_plan?.title || "بدون عنوان"} {request?.request?.request_plan?.single_step && (
                <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mt-2 rounded-lg flex items-center justify-center">
                  <p>تک مرحله ای</p>
                </div>
              )}</h2>
              
              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">شماره</span>
                <span className="text-sm text-[#202020]">{request.id}</span>
              </div>

              <div className="flex items-center justify-between pl-0.5 pr-2">
                <span className="text-xs text-[#959595]">وضعیت</span>
                <span className={`flex items-center justify-center text-xs rounded-lg w-[85px] h-7 
                  ${request.status === "in_progress" ? "text-[#258CC7] bg-[#D9EFFE]" : 
                    request.status === "done" ? "text-[#39A894] bg-[#DFF7F2]" : 
                    request.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" : 
                    request.status === "pending" ? "text-[#e22afc] bg-[#e94fff54]" : 
                    "text-[#D9534F] bg-[#FDECEA]"}`}>
                  {request.status === "rejected" ? "رد شده" : 
                    request.status === "in_progress" ? "جاری" : 
                    request.status === "action_needed" ? "نیازمند اصلاح" : 
                    request.status === "pending" ? "باز" : 
                    request.status === "done" ? "تایید شده" : "نامشخص"}
                </span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">سر مربی</span>
                <span className="text-sm text-[#202020]">{request?.request?.user?.name}</span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">واحد حقوقی</span>
                <span className="text-sm text-[#202020]">{request?.request?.unit?.title}</span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">مرحله</span>
                <span className="text-sm text-[#202020]">{stepTitles[request?.step]}</span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">تاریخ ایجاد</span>
                <span className="text-sm text-[#202020]">
                  {request?.created_at ? toPersianDate(request?.created_at) : '-'}
                </span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">تاریخ بروزرسانی</span>
                <span className="text-sm text-[#202020]">
                  {request?.created_at ? toPersianDate(request?.updated_at) : '-'}
                </span>
              </div>

              <Link href={`/${itemId}/kartabl-darkhast/darkhast?id=` + request?.request?.id}>
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
                <th className="border border-gray-300 px-7 py-5 text-lg text-right">
                  نام گزارش ها
                </th>
                <th className="border border-gray-300 px-7 py-5 text-lg">شماره </th>
                <th className="border border-gray-300 px-7 py-5 text-lg">
                  تاریخ ایجاد
                </th>
                <th className="border border-gray-300 px-7 py-5 text-lg">
                  تاریخ بروزرسانی
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
                <tr key={request.id} className="border border-gray-300">
                  <td className="border border-gray-300 px-7 py-5 text-base">
                    {request?.request?.request_plan?.title || "بدون عنوان"}

                    {request?.request?.request_plan?.single_step && (
                      <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mt-2 rounded-lg flex items-center justify-center">
                        <p>تک مرحله ای</p>
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request.id}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request?.created_at ? toPersianDate(request?.created_at) : '-'}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request?.updated_at ? toPersianDate(request?.updated_at) : '-'}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request?.request?.user?.name}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request?.request?.unit?.title}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center !text-[12px]">
                    {stepTitles[request?.step]}
                  </td>
                  <td className="border-x border-y-0 border-gray-300 px-7 py-5 text-center flex flex-col justify-center items-center">
                    <div className={`w-[169px] h-7 text-sm py-1 rounded-lg flex items-center justify-center 
                      ${request.status === "in_progress" ? "text-[#258CC7] bg-[#D9EFFE]" : 
                        request.status === "done" ? "text-[#39A894] bg-[#DFF7F2]" : 
                        request.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" : 
                        request.status === "pending" ? "text-[#e22afc] bg-[#e94fff54]" : 
                        "text-[#D9534F] bg-[#FDECEA]"}`}>
                      {request.status === "rejected" ? "رد شده" : 
                        request.status === "in_progress" ? "جاری" : 
                        request.status === "action_needed" ? "نیازمند اصلاح" : 
                        request.status === "pending" ? "باز" : 
                        request.status === "done" ? "تایید شده" : "نامشخص"}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
                    <Link href={`/${itemId}/kartabl-darkhast/darkhast?id=` + request?.request?.id}>مشاهده گزارش</Link>
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

export default DarkhasthaGozaresh;

// app/role/kartabl-gozaresh/page.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import HeaderProfile from "./../../../components/header-profile-admin/page";
import menu from "./../../../public/assets/menu.svg";
import notif from "./../../../public/assets/notif.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

// وارد کردن Redux hooks و actions
import { useDispatch, useSelector } from 'react-redux';
import {
  setReportDashboardFilters,
  setReportDashboardCurrentPage,
  setReportDashboardTotalPages,
  setHeaderData,
  setGlobalDashboardParams,
  resetReportDashboardFilters,
} from './../../../redux/features/dashboards/dashboardSlice'; // مسیر را بررسی کنید

import useDebounce from './../../../components/utils/useDebounce';


export default function KartablGozaresh() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // استفاده از Redux hooks
  const dispatch = useDispatch();
  // خواندن تمام فیلترها و وضعیت صفحه از Redux برای داشبورد گزارش‌ها
  const {
    item_id,
    role,
    search: reduxSearch,
    sort,
    direction,
    status,
    plan_id,
    unit_id,
    currentPage,
    totalPages,
  } = useSelector(state => state.dashboards.reportDashboard); // *** استفاده از reportDashboard ***

  const header = useSelector(state => state.dashboards.headerData);
  const [loadingHeader, setLoadingHeader] = useState(true);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const [planSearch, setPlanSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  const [localSearchInput, setLocalSearchInput] = useState(reduxSearch);
  const debouncedSearchTerm = useDebounce(localSearchInput, 500);

  useEffect(() => {
    setLocalSearchInput(reduxSearch);
  }, [reduxSearch]);

  useEffect(() => {
    if (debouncedSearchTerm !== reduxSearch) {
        dispatch(setReportDashboardFilters({ search: debouncedSearchTerm }));
        dispatch(setReportDashboardCurrentPage(1));
    }
  }, [debouncedSearchTerm, dispatch, reduxSearch]);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const itemIdParam = searchParams.get("item_id");
    
    // فقط item_id و role را به Redux ارسال می کنیم
    dispatch(setGlobalDashboardParams({ item_id: itemIdParam, role: roleParam }));

    // اگر پارامترهای ضروری وجود ندارند، به صفحه اصلی هدایت کنید
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

    const validItemIds = ["1", "2", "3", "4"];

    if (!validRoles.includes(roleParam) || !validItemIds.includes(itemIdParam)) {
      router.push("/");
    }
  }, [router, searchParams, dispatch]);


  // useEffect برای واکشی اطلاعات هدر (که اکنون در Redux ذخیره می‌شود)
  useEffect(() => {
    if (!item_id) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${item_id}&role=mosque_head_coach`);
        if (response.data) {
          dispatch(setHeaderData(response.data));
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingHeader(false);
      }
    };
    fetching();
  }, [item_id, dispatch]);


  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    if (!item_id || !role) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/info?item_id=${item_id}&role=${role}`);
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
  }, [item_id, role]);


  // منطق بستن دراپ‌دان‌ها
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


  const [reports, setReports] = useState([]); // تغییر نام از requests به reports
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  // تابع به روز رسانی URL: فقط item_id و role را در URL نگه می‌دارد
  // این تابع هیچ وابستگی به فیلترها یا صفحه ندارد.
  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (item_id) params.set("item_id", item_id);
    if (role) params.set("role", role);
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false, shallow: true });
  };

  // useEffect برای همگام‌سازی URL با item_id و role از Redux
  // این useEffect فقط زمانی که item_id یا role در Redux تغییر کنند، URL را به روز می‌کند.
  useEffect(() => {
    updateURLParams();
  }, [item_id, role, pathname, router]);


  const [units, setUnits] = useState([]);
  useEffect(() => {
    if(!item_id) return;
    const fetchUnits = async () => { // تغییر نام تابع
      try {
        const response = await axios.get(
          `/api/unit?item_id=${item_id}&role=${role}`
        );
        if (response.data) {
          setUnits(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnits();
  }, [item_id, role]);
  
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    if(!item_id) return;
    const fetchPlans = async () => { // تغییر نام تابع
      try {
        const response = await axios.get(
          `/api/plans?item_id=${item_id}`
        );
        if (response.data) {
          setPlans(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlans();
  }, [item_id]);

  // تابع برای تغییر فیلترها (ارسال به Redux)
  const handleFilterChange = (newFilterState) => {
    dispatch(setReportDashboardFilters(newFilterState)); // *** استفاده از setReportDashboardFilters ***
    dispatch(setReportDashboardCurrentPage(1)); // با تغییر فیلتر، صفحه را به 1 برگردانید
  };

  // تابع برای ریست کردن فیلترها
  const handleResetFilters = () => {
    dispatch(resetReportDashboardFilters());
    dispatch(setReportDashboardCurrentPage(1));
    setLocalSearchInput('');
    setPlanSearch('');
    setUnitSearch('');
    setIsFilterOpen(false);
  };

  // useEffect برای واکشی گزارش‌ها
  useEffect(() => {
    if (!item_id || !role) return;

    setLoading(true);
    try {
      // فیلترها را مستقیماً از Redux می‌خوانیم
      const params = {
        q: reduxSearch,
        sort,
        direction,
        status,
        plan_id,
        unit_id,
        per_page: itemsPerPage,
        page: currentPage,
        itemId: item_id,
        role
      };
      
      const fetchReports = async () => { // تغییر نام تابع
        const response = await axios.get(`/api/darkhast-reports`, { params }); // *** API مربوط به گزارش‌ها ***
        
        setReports(response.data); // تغییر نام از setRequests به setReports
        if (response.data.meta && response.data.meta.total) {
          dispatch(setReportDashboardTotalPages(Math.ceil(response.data.meta.total / itemsPerPage))); // *** استفاده از setReportDashboardTotalPages ***
        } else {
          // اگر meta.total وجود نداشت، از طول آرایه data استفاده کنید
          dispatch(setReportDashboardTotalPages(Math.ceil(response.data.data.length / itemsPerPage) || 1)); // *** استفاده از setReportDashboardTotalPages ***
        }
      };
      fetchReports();

    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, item_id, role, reduxSearch, sort, direction, status, plan_id, unit_id, itemsPerPage, dispatch]);


  const goBack = () => {
    const params = new URLSearchParams();
    if (item_id) params.set("item_id", item_id);
    if (role) params.set("role", role);
    const queryString = params.toString();
    
    const newPath = pathname.split('/').slice(0, -1).join('/') || '/';
    if (queryString) {
        router.push(`${newPath}?${queryString}`);
    } else {
        router.push(newPath);
    }
  };

  const handlePageChange = (page) => {
    dispatch(setReportDashboardCurrentPage(page)); // *** استفاده از setReportDashboardCurrentPage ***
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
      <div className=" h-screen relative">
        <div className="bg-[#002a4fd5] vector-nama2 h-[15rem] lg:h-[20rem] bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854]  relative overflow-hidden">
          <div className="absolute top-[9rem] lg:top-[11rem] w-full">
            <img className="w-full opacity-20" src="/assets/Vector.png" alt="" />
          </div>
          <div className="flex justify-between items-center px-6 py-2 md:px-12">
            <div className="flex items-center">
              <img
                src={header?.data?.logo || '/Images/masajed/mosque.svg'}
                className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
              />
              <div className="text-[#D5B260] text-[12px] md:text-[18px] font-bold md:text-3xl md:my-6 my-3 mx-4">
              {header?.data?.title} / کارتابل گزارش ها
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
            <div className="grid grid-cols-1 md:grid-cols-4 text-[12px] md:text-[15px] gap-8 my-7 px-[2rem] lg:px-0">
              <div className="border-2 px-3 border-[#25C7AA] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ status: 'in_progress' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#25c7aa59] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#25C7AA] rounded-full flex items-center justify-center text-white font-bold">{info?.reports?.in_progress}</div>
                </div>
                برای مشاهده جاری کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#77B7DC] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ status: 'done_temp' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#77b7dc80] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#77B7DC] rounded-full flex items-center justify-center text-white font-bold">{info?.reports?.done_temp}</div>
                </div>
                برای مشاهده تایید و ارسال کلیک کنید
              </div>
              <div className="border-2 px-3 border-red-600 rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ status: 'rejected' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#dc262680] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className= "  md:h-[40px] w-[20px] md:w-[40px] bg-red-600 rounded-full flex items-center justify-center text-white font-bold">{info?.reports?.rejected}</div>
                </div>
                برای مشاهده رد شده کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#FFD140] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ status: 'action_needed' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#ffd14080] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className= "  md:h-[40px] w-[20px] md:w-[40px] bg-[#FFD140] rounded-full flex items-center justify-center text-white font-bold">{info?.reports?.action_needed}</div>
                </div>
                برای مشاهده نیازمند اصلاح کلیک کنید
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:gap-16 xl:gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
                <h2 className="text-base font-bold text-center min-w-fit lg:text-lg xl:text-[22px]">
                  همه گزارش ها
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
                          <div className="p-2 border-b">
                            <div className="font-bold mb-2">وضعیت</div>
                            <div className="px-2">
                              <select 
                                className="w-full p-2 border rounded"
                                value={status || ''}
                                onChange={(e) => handleFilterChange({ status: e.target.value })}
                              >
                                <option value="">همه</option>
                                <option value="rejected">رد شده</option>
                                <option value="in_progress">جاری</option>
                                <option value="action_needed">نیازمند اصلاح</option>
                                <option value="done_temp">تایید و ارسال</option>
                                <option value="done">تایید شده</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="p-2 border-b">
                            <div className="font-bold mb-2">اکشن پلن ها</div>
                            <div className="px-2 mb-2">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="جستجوی اکشن پلن..."
                                  className="w-full p-2 border rounded mb-2"
                                  value={planSearch}
                                  onChange={(e) => setPlanSearch(e.target.value)}
                                />
                                <select
                                  className="w-full p-2 border rounded"
                                  value={plan_id || ''}
                                  onChange={(e) => handleFilterChange({ plan_id: e.target.value })}
                                  size={planSearch ? Math.min(5, plans.filter(plan => 
                                    plan.title.toLowerCase().includes(planSearch.toLowerCase())
                                  ).length + 1) : 1}
                                >
                                  <option value="">همه</option>
                                  {plans
                                    .filter(plan => plan.title.toLowerCase().includes(planSearch.toLowerCase()))
                                    .map(plan => (
                                      <option key={plan.id} value={plan.id}>
                                        {plan.title}
                                      </option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-2 border-b">
                            <div className="font-bold mb-2">واحد های سازمانی</div>
                            <div className="px-2 mb-2">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="جستجوی واحد سازمانی..."
                                  className="w-full p-2 border rounded mb-2"
                                  value={unitSearch}
                                  onChange={(e) => setUnitSearch(e.target.value)}
                                />
                                <select
                                  className="w-full p-2 border rounded"
                                  value={unit_id || ''}
                                  onChange={(e) => handleFilterChange({ unit_id: e.target.value })}
                                  size={unitSearch ? Math.min(5, units.filter(unit => 
                                    unit.title.toLowerCase().includes(unitSearch.toLowerCase())
                                  ).length + 1) : 1}
                                >
                                  <option value="">همه</option>
                                  {units
                                    .filter(unit => unit.title.toLowerCase().includes(unitSearch.toLowerCase()))
                                    .map(unit => (
                                      <option key={unit.id} value={unit.id}>
                                        {unit.title}
                                      </option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-2 border-t flex flex-col gap-2">
                            <button 
                              className="w-full p-2 bg-[#39A894] text-white rounded"
                              onClick={() => setIsFilterOpen(false)}
                            >
                              اعمال فیلتر
                            </button>
                            <button 
                              className="w-full p-2 bg-white text-red-500 border border-red-500 rounded"
                              onClick={handleResetFilters}
                            >
                              حذف فیلتر
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
                {(reports?.data && !loading) && reports?.data?.map((report) => (
                  <div key={report.id} className="flex flex-col border rounded-lg px-5 py-4 gap-2">
                    <h2 className="text-sm text-[#202020] pb-3">{report?.request?.request_plan?.title || "بدون عنوان"}</h2>
                    
                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">شماره</span>
                      <span className="text-sm text-[#202020]">{report.id}</span>
                    </div>

                    <div className="flex items-center justify-between pl-0.5 pr-2">
                      <span className="text-xs text-[#959595]">وضعیت</span>
                      <span className={`flex items-center justify-center text-xs rounded-lg w-[85px] h-7 
                        ${report.status === "in_progress" ? "text-[#258CC7] bg-[#D9EFFE]" : 
                          report.status === "done" ? "text-[#39A894] bg-[#DFF7F2]" : 
                          !report.status ? "text-[#959595] bg-[#F6F6F6]" : 
                          report.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" : 
                          "text-[#D9534F] bg-[#FDECEA]"}`}>
                        {report.status === "rejected" ? "رد شده" : 
                          report.status === "in_progress" ? "جاری" : 
                          !report.status ? "هنوز ارجاع نشده" : 
                          report.status === "action_needed" ? "نیازمند اصلاح" : 
                          (report.status === "done" && report.step === 'finish') ? "تایید شده" : "تایید و ارسال"}
                      </span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">سر مربی</span>
                      <span className="text-sm text-[#202020]">{report?.request.user?.name}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">مرحله</span>
                      <span className="text-sm text-[#202020]">{stepTitles[report?.step]}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">واحد حقوقی</span>
                      <span className="text-sm text-[#202020]">{report?.request.unit?.title}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">تاریخ ایجاد</span>
                      <span className="text-sm text-[#202020]">
                        {new Date(report.created_at).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    {/* لینک برای مشاهده جزئیات گزارش */}
                    <Link
                      href={`/role/kartabl-gozaresh/darkhast?id=` + report.id + `&role=${role}&item_id=${item_id}`}
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
                      <th className="border border-gray-300 px-7 py-5 text-lg text-right">
                        نام گزارش ها
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

                    {(reports?.data && !loading) && reports?.data?.map((report) => (
                      <tr key={report.id} className="border">
                        <td className="border border-gray-300 px-7 py-5 text-base">
                          {report?.request?.request_plan?.title || "بدون عنوان"}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {report.id}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {new Date(report.created_at).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {report?.request?.user?.name}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {report?.request.unit?.title}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center !text-[12px]">
                          {stepTitles[report?.step]}
                        </td>
                        <td className="border-x border-y-0 border-gray-300 px-7 py-5 text-center flex justify-center items-center">
                            <div className={`w-[169px] h-7 text-sm py-1 rounded-lg flex items-center justify-center 
                              ${report.status === "in_progress" ? "text-[#258CC7] bg-[#D9EFFE]" : 
                                !report.status ? "text-[#959595] bg-[#F6F6F6]" : 
                                report.status === "done" ? "text-[#39A894] bg-[#DFF7F2]" : 
                                report.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" : 
                                "text-[#D9534F] bg-[#FDECEA]"}`}>
                              {report.status === "rejected" ? "رد شده" : 
                                report.status === "in_progress" ? "جاری" : 
                                !report.status ? "هنوز ارجاع نشده" : 
                                report.status === "action_needed" ? "نیازمند اصلاح" : 
                                (report.status === "done" && report.step === 'finish') ? "تایید شده" : "تایید و ارسال"}
                            </div>
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
                          {report.status != "pending" && (
                            <Link 
                              href={`/role/kartabl-gozaresh/darkhast?id=` + report.id + `&role=${role}&item_id=${item_id}`}
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
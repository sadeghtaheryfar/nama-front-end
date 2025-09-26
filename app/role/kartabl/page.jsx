// app/role/kartabl/page.jsx
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
  setRequestDashboardFilters,
  setRequestDashboardCurrentPage,
  setRequestDashboardTotalPages,
  setHeaderData,
  setGlobalDashboardParams,
  resetRequestDashboardFilters,
  setUnitFilterSearch, // اضافه شده
  setUnitFilterCurrentPage, // اضافه شده
  setUnitFilterTotalPages, // اضافه شده
} from './../../../redux/features/dashboards/dashboardSlice';

import useDebounce from './../../../components/utils/useDebounce';

export default function Kartabl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // استفاده از Redux hooks
  const dispatch = useDispatch();
  const {
    item_id,
    role,
    search: reduxSearch,
    sort,
    direction,
    status,
    plan_id,
    unit_id,
    currentPage, // currentPage برای درخواست‌های اصلی داشبورد
    totalPages, // totalPages برای درخواست‌های اصلی داشبورد
    school_coach_type,
    sub_type,
  } = useSelector(state => state.dashboards.requestDashboard);

  // State های جدید برای فیلتر واحد سازمانی از Redux (اضافه شده)
  const {
    search: unitFilterSearch, // نامگذاری متفاوت برای جلوگیری از تداخل
    currentPage: unitFilterCurrentPage, // currentPage برای فیلتر واحدها
    totalPages: unitFilterTotalPages,  // totalPages برای فیلتر واحدها
  } = useSelector(state => state.dashboards.unitFilter);


  const header = useSelector(state => state.dashboards.headerData);
  const [loadingHeader, setLoadingHeader] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const [planSearch, setPlanSearch] = useState("");

  const [localSearchInput, setLocalSearchInput] = useState(reduxSearch);
  const debouncedSearchTerm = useDebounce(localSearchInput, 500);

  // State محلی برای ورودی جستجوی واحد و Debounce (اضافه شده)
  const [localUnitSearchInput, setLocalUnitSearchInput] = useState(unitFilterSearch);
  const debouncedUnitSearchTerm = useDebounce(localUnitSearchInput, 500);

  const [schoolCoachTypes, setSchoolCoachTypes] = useState({});
  const [subTypesData, setSubTypesData] = useState({});

  useEffect(() => {
    setLocalSearchInput(reduxSearch);
  }, [reduxSearch]);

  useEffect(() => {
    if (debouncedSearchTerm !== reduxSearch) {
        dispatch(setRequestDashboardFilters({ search: debouncedSearchTerm }));
        dispatch(setRequestDashboardCurrentPage(1));
    }
  }, [debouncedSearchTerm, dispatch, reduxSearch]);

  // Effect برای Debounce جستجوی فیلتر واحد (اضافه شده)
  useEffect(() => {
    if (debouncedUnitSearchTerm !== unitFilterSearch) {
        dispatch(setUnitFilterSearch(debouncedUnitSearchTerm));
        dispatch(setUnitFilterCurrentPage(1)); // با تغییر جستجو، صفحه واحد را به 1 ریست کنید
    }
  }, [debouncedUnitSearchTerm, dispatch, unitFilterSearch]);

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

    const validItemIds = ["1", "2", "3", "4","8"];

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


  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  const unitsPerPage = 10; // اضافه شده: تعداد آیتم‌ها در هر صفحه برای واحدها

  // تابع به روز رسانی URL: فقط item_id و role را در URL نگه می‌دارد
  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (item_id) params.set("item_id", item_id);
    if (role) params.set("role", role);

    router.push(`${pathname}?${params.toString()}`, { scroll: false, shallow: true });
  };

  // useEffect برای همگام‌سازی URL با item_id و role از Redux
  useEffect(() => {
    updateURLParams();
  }, [item_id, role, pathname, router]);


  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false); // اضافه شده: وضعیت لودینگ برای واحدها

  useEffect(() => {
    if(!item_id || !role) return; // اطمینان از وجود item_id و role

    const fetchUnits = async () => { // تغییر نام تابع
      setLoadingUnits(true); // شروع لودینگ
      try {
        const response = await axios.get( // تغییر یافته
          `/api/unit?item_id=${item_id}&role=${role}&page=${unitFilterCurrentPage}&per_page=${unitsPerPage}&q=${unitFilterSearch}`
        );
        if (response.data && response.data.data) { // فرض بر این است که پاسخ شامل data و meta است
          setUnits(response.data.data);
          if (response.data.meta && response.data.meta.total) { // فرض بر این است که API اطلاعات meta را برمی‌گرداند
            dispatch(setUnitFilterTotalPages(Math.ceil(response.data.meta.total / unitsPerPage))); // تنظیم totalPages برای واحدها
          } else {
             // Fallback اگر meta وجود نداشت، بر اساس طول داده‌های دریافت شده (کمتر دقیق برای داده‌های جزئی)
            dispatch(setUnitFilterTotalPages(Math.ceil(response.data.data.length / unitsPerPage) || 1));
          }
        }
      } catch (error) {
        console.log("Error fetching units:", error);
      } finally {
        setLoadingUnits(false); // پایان لودینگ
      }
    };
    fetchUnits();
  }, [item_id, role, unitFilterCurrentPage, unitFilterSearch, dispatch, unitsPerPage]); // اضافه شدن dependencies جدید


  const [plans, setPlans] = useState([]);
  useEffect(() => {
    if(!item_id) return;
    const fetchFutureCarts = async () => {
      try {
        const carts = await axios.get(
          `/api/plans?item_id=${item_id}`
        );
        if (carts.data) {
          setPlans(carts.data.data);
        }
      } catch (error) {
          console.log(error);
      }
    };
    fetchFutureCarts();
  }, [item_id]);

  // تابع برای تغییر فیلترها (به جای setFilters محلی)
  const handleFilterChange = (newFilterState) => {
    dispatch(setRequestDashboardFilters(newFilterState)); // فیلترها را به Redux ارسال کنید
    dispatch(setRequestDashboardCurrentPage(1)); // با تغییر فیلتر، صفحه را به 1 برگردانید
  };

  // تابع برای ریست کردن فیلترها
  const handleResetFilters = () => {
    dispatch(resetRequestDashboardFilters());
    dispatch(setRequestDashboardCurrentPage(1));
    setLocalSearchInput('');
    setPlanSearch('');
    // ریست کردن state های فیلتر واحد (اضافه شده)
    dispatch(setUnitFilterSearch(''));
    dispatch(setUnitFilterCurrentPage(1));
    setLocalUnitSearchInput(''); // ریست کردن فیلد ورودی محلی
    setIsFilterOpen(false);
  };

  // useEffect برای واکشی درخواست‌ها
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
        page: currentPage, // currentPage برای درخواست‌های اصلی
        itemId: item_id,
        role,
        school_coach_type,
        sub_type,
      };

      const fetchRequests = async () => {
        const response = await axios.get(`/api/darkhast`, { params });

        setRequests(response.data);
        if (response.data.school_coach_type) {
          setSchoolCoachTypes(response.data.school_coach_type);
        }
        if (response.data.sub_types) {
          setSubTypesData(response.data.sub_types);
        }
        if (response.data.meta && response.data.meta.total) {
          dispatch(setRequestDashboardTotalPages(Math.ceil(response.data.meta.total / itemsPerPage))); // totalPages برای درخواست‌های اصلی
        } else {
          dispatch(setRequestDashboardTotalPages(Math.ceil(response.data.data.length / itemsPerPage) || 1));
        }
      };
      fetchRequests();

    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, item_id, role, reduxSearch, sort, direction, status, plan_id, unit_id, itemsPerPage, dispatch, school_coach_type, sub_type]);


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

  // تابع برای تغییر صفحه (به جای setCurrentPage محلی) برای درخواست‌های اصلی
  const handlePageChange = (page) => {
    dispatch(setRequestDashboardCurrentPage(page)); // صفحه را به Redux ارسال کنید
    document.getElementById("future-carts-section").scrollIntoView({ behavior: "smooth" });
  };

  // تابع برای تغییر صفحه واحدها (اضافه شده)
  const handleUnitPageChange = (page) => {
    dispatch(setUnitFilterCurrentPage(page)); // صفحه را به Redux برای واحدها ارسال کنید
  };

  // رندر دکمه‌های Pagination برای درخواست‌های اصلی
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

  // رندر دکمه‌های Pagination برای واحدها (اضافه شده)
  const renderUnitPaginationButtons = () => {
    const buttons = [];
    buttons.push(
      <button
        key="unit-prev"
        onClick={() => unitFilterCurrentPage > 1 && handleUnitPageChange(unitFilterCurrentPage - 1)}
        disabled={unitFilterCurrentPage === 1}
        className={`px-2 py-1 rounded-md ${
          unitFilterCurrentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#39A894] hover:bg-gray-100"
        }`}
      >
        قبلی
      </button>
    );

    const startPage = Math.max(1, unitFilterCurrentPage - 1);
    const endPage = Math.min(unitFilterTotalPages, unitFilterCurrentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={`unit-page-${i}`}
          onClick={() => handleUnitPageChange(i)}
          className={`px-2 py-1 rounded-md ${
            unitFilterCurrentPage === i
              ? "bg-[#39A894] text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="unit-next"
        onClick={() => unitFilterCurrentPage < unitFilterTotalPages && handleUnitPageChange(unitFilterCurrentPage + 1)}
        disabled={unitFilterCurrentPage === unitFilterTotalPages}
        className={`px-2 py-1 rounded-md ${
          unitFilterCurrentPage === unitFilterTotalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#39A894] hover:bg-gray-100"
        }`}
      >
        بعدی
      </button>
    );

    return buttons;
  };

  const stepTitles = item_id == 8
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
              {header?.data?.title} / کارتابل درخواست ها
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
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#25C7AA] rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.in_progress}</div>
                </div>
                برای مشاهده جاری کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#77B7DC] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ status: 'done_temp' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#77b7dc80] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#77B7DC] rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.done_temp}</div>
                </div>
                برای مشاهده تایید و ارسال کلیک کنید
              </div>
              <div className="border-2 px-3 border-red-600 rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ status: 'rejected' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#dc262680] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="md:h-[40px] w-[20px] md:w-[40px] bg-red-600 rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.rejected}</div>
                </div>
                برای مشاهده رد شده کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#FFD140] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ status: 'action_needed' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#ffd14080] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="md:h-[40px] w-[20px] md:w-[40px] bg-[#FFD140] rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.action_needed}</div>
                </div>
                برای مشاهده نیازمند اصلاح کلیک کنید
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:gap-16 xl:gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
                <h2 className="text-base font-bold text-center min-w-fit lg:text-lg xl:text-[22px] flex justify-center items-center gap-[1rem]">
                  همه درخواست ها
                  <div>
                    <Link className="flex hover:scale-[1.03] active:scale-[1] transition-[0.9s] bg-sky-400 text-[16px] text-white whitespace-nowrap px-[1rem] py-[0.5rem] rounded-full" href={`/role/invoice?id=` + `&role=${role}&item_id=${item_id}`}>صورت حساب</Link>
                  </div>
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

                          {item_id && (
                            <div className="p-2 border-b">
                              <div className="font-bold mb-2">نوع واحد حقوقی</div>
                                <div className="px-2">
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={sub_type || ''}
                                        onChange={(e) => handleFilterChange({ sub_type: e.target.value })}
                                    >
                                        <option value="">همه</option>
                                        {item_id === '2' && subTypesData.mosque && Object.entries(subTypesData.mosque).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                        {item_id === '3' && subTypesData.school && Object.entries(subTypesData.school).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                        {item_id === '4' && subTypesData.center && subTypesData.center.map((value, index) => (
                                            <option key={index} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                        {item_id === '8' && subTypesData.university && subTypesData.university.map((value, index) => (
                                            <option key={index} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                          </div>
                        )}

                        {item_id && (item_id === '3') && (
                            <div className="p-2 border-b">
                                <div className="font-bold mb-2"> نوع مربی در مدارس</div>
                                  <div className="px-2">
                                      <select
                                          className="w-full p-2 border rounded"
                                          value={school_coach_type || ''}
                                          onChange={(e) => handleFilterChange({ school_coach_type: e.target.value })}
                                      >
                                          <option value="">همه</option>
                                          {Object.entries(schoolCoachTypes).map(([key, value]) => (
                                              <option key={key} value={key}>
                                                  {value}
                                              </option>
                                          ))}
                                      </select>
                                  </div>
                            </div>
                        )}

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
                                  value={localUnitSearchInput} // مقدار ورودی از state محلی
                                  onChange={(e) => setLocalUnitSearchInput(e.target.value)} // به‌روزرسانی state محلی
                                />
                                {loadingUnits && ( // نمایش spinner هنگام لودینگ واحدها
                                  <div className="flex justify-center items-center py-2">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                                {/* نمایش واحدهای paginated به جای select */}
                                <div className="max-h-40 overflow-y-auto border rounded">
                                  {units.length > 0 ? (
                                    units.map(unit => (
                                      <div
                                        key={unit.id}
                                        className={`p-2 cursor-pointer hover:bg-gray-100 ${unit_id === unit.id ? 'bg-[#D9EFFE] text-[#258CC7]' : ''}`}
                                        onClick={() => handleFilterChange({ unit_id: unit.id })} // تنظیم unit_id در فیلتر اصلی
                                      >
                                        {unit.title}
                                      </div>
                                    ))
                                  ) : (
                                    !loadingUnits && <div className="p-2 text-gray-500">یافت نشد</div>
                                  )}
                                </div>
                                {/* کنترل‌های Pagination برای واحدها */}
                                {unitFilterTotalPages > 1 && (
                                  <div className="flex justify-center items-center mt-2 gap-1 text-xs">
                                    {renderUnitPaginationButtons()} {/* رندر دکمه‌های pagination واحدها */}
                                  </div>
                                )}
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
                {(requests?.data && !loading) && requests?.data?.map((request) => (
                  <div key={request.id} className="flex flex-col border rounded-lg px-5 py-4 gap-2">
                    <h2 className="text-sm text-[#202020] pb-3">{request?.request_plan?.title || "بدون عنوان"}{request?.request_plan?.single_step && (
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
                          !request.status ? "text-[#959595] bg-[#F6F6F6]" :
                          request.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" :
                          "text-[#D9534F] bg-[#FDECEA]"}`}>
                        {request.status === "rejected" ? "رد شده" :
                          request.status === "in_progress" ? "جاری" :
                          !request.status ? "هنوز ارجاع نشده" :
                          request.status === "action_needed" ? "نیازمند اصلاح" :
                          (request.status === "done" && request.step === 'finish') ? "تایید شده" : "تایید و ارسال"}
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
                        {new Date(request.created_at).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">تاریخ بروزرسانی</span>
                      <span className="text-sm text-[#202020]">
                        {new Date(request.updated_at).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <Link href={`/role/kartabl/darkhast?id=` + request.id + `&role=${role}&item_id=${item_id}`}>
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
                      <tr key={request.id} className="border">
                        <td className="border border-gray-300 px-7 py-5 text-base">
                          {request?.request_plan?.title || "بدون عنوان"}
                          {request?.request_plan?.single_step && (
                            <div className="text-[#258CC7] bg-[#D9EFFE] text-[12px] py-1 px-4 mt-2 rounded-lg flex items-center justify-center">
                              <p>تک مرحله ای</p>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {request.id}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {new Date(request.created_at).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {new Date(request.updated_at).toLocaleDateString("fa-IR")}
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
                        <td className="border-x border-y-0 border-gray-300 px-7 py-5 text-center flex justify-center items-center">
                            <div className={`w-[169px] h-7 text-sm py-1 rounded-lg flex items-center justify-center
                              ${request.status === "in_progress" ? "text-[#258CC7] bg-[#D9EFFE]" :
                                !request.status ? "text-[#959595] bg-[#F6F6F6]" :
                                request.status === "done" ? "text-[#39A894] bg-[#DFF7F2]" :
                                request.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" :
                                "text-[#D9534F] bg-[#FDECEA]"}`}>
                              {request.status === "rejected" ? "رد شده" :
                                request.status === "in_progress" ? "جاری" :
                                !request.status ? "هنوز ارجاع نشده" :
                                request.status === "action_needed" ? "نیازمند اصلاح" :
                                (request.status === "done" && request.step === 'finish') ? "تایید شده" : "تایید و ارسال"}
                            </div>
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base underline underline-offset-2 text-center hover:text-[#D5B260] hover:decoration-[#D5B260]">
                          <Link href={`/role/kartabl/darkhast?id=` + request.id + `&role=${role}&item_id=${item_id}`}>
                          مشاهده درخواست</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination برای درخواست‌های اصلی */}
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
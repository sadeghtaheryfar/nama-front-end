"use client";
import Image from "next/image";
import filter from "./../../..//public/assets/filter.svg";
import sort from "./../../..//public/assets/sort.svg";
import Link from "next/link";


import HeaderProfile from "./../../../components/header-profile-admin/page";
import mosque from "./../../../public/assets/mosque.png";
import man from "./../../../public/assets/man.png";
import menu from "./../../../public/assets/menu.svg";
import notif from "./../../../public/assets/notif.svg";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Kartabl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [item_id, setItem_id] = useState();
  const [itemId, setitemId] = useState();
  const [role, setRole] = useState();
  const roleParam = searchParams.get("role");
  const itemIdParam = searchParams.get("item_id");
  const [header, setHeader] = useState(null);
  const [loadingHeader, setLoadingHeader] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [planSearch, setPlanSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const itemIdParam = searchParams.get("item_id");
    setRole(roleParam);
    setItem_id(itemIdParam);
    setitemId(itemIdParam);

    if (!roleParam && !itemIdParam) return;

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
  }, [router, searchParams]);

  useEffect(() => {
    if (!item_id) return;

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${item_id}&role=mosque_head_coach`);
        if (response.data) {
          setHeader(response.data);
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingHeader(false);
      }
    };
    fetching();
  }, [item_id]);

  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    if (!item_id) return;

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
  }, [item_id,role]);

  // --- تغییرات برای localStorage ---
  const [filters, setFilters] = useState(() => {
    // هنگام بارگذاری اولیه، ابتدا localStorage را بررسی کنید
    if (typeof window !== 'undefined') { // اطمینان از اینکه کد فقط در سمت کلاینت اجرا می شود
      const storedFilters = localStorage.getItem('kartabl_filters_from_detail');
      const cameFromDetailPage = localStorage.getItem('came_from_kartabl_detail');
      
      if (storedFilters && cameFromDetailPage === 'true') {
        localStorage.removeItem('came_from_kartabl_detail'); // پرچم را پس از استفاده حذف کنید
        return JSON.parse(storedFilters);
      } else {
        // اگر از صفحه جزئیات نیامده‌اید یا فیلتری ذخیره نشده است، localStorage را پاک کنید
        localStorage.removeItem('kartabl_filters_from_detail');
        localStorage.removeItem('came_from_kartabl_detail');
      }
    }
    // سپس از searchParams استفاده کنید
    return {
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "created_at",
      direction: searchParams.get("direction") || "",
      status: searchParams.get("status") || null,
      plan_id: searchParams.get("plan_id") || null,
      unit_id: searchParams.get("unit_id") || null,
    };
  });
  // --- پایان تغییرات برای localStorage ---


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);

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

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const updateURL = (newFilters, newPage) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.direction) params.set("direction", newFilters.direction);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.plan_id) params.set("plan_id", newFilters.plan_id);
    if (newFilters.unit_id) params.set("unit_id", newFilters.unit_id);
    if (newPage > 1) params.set("page", newPage.toString());
    params.set("role", role)
    params.set("item_id", itemId)
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  
  const [units, setUnits] = useState([]);
  useEffect(() => {
    if(!itemId) return;
    const fetchFutureCarts = async () => {
      try {
        const carts = await axios.get(
          `/api/unit?item_id=${itemId}&role=${role}`
        );
        if (carts.data) {
          setUnits(carts.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFutureCarts();
  }, [itemId]);
  
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    if(!itemId) return;
    const fetchFutureCarts = async () => {
      try {
        const carts = await axios.get(
          `/api/plans?item_id=${itemId}`
        );
        if (carts.data) {
          setPlans(carts.data.data);
        }
      } catch (error) {
          console.log(error);
      }
    };

    fetchFutureCarts();
  }, [itemId]);

  // Update filters and URL when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
    updateURL(newFilters, 1); // URL را نیز به‌روزرسانی کنید
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (!itemId || !role) return;

      setLoading(true);
      try {
        const { search, sort, direction, status, plan_id, unit_id } = filters;
        const response = await axios.get(`/api/darkhast`, {
          params: {
            q: search,
            sort,
            direction,
            status,
            plan_id,
            unit_id,
            per_page: itemsPerPage,
            page: currentPage,
            itemId,
            role
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
  }, [currentPage, itemId, filters,role]);
  
  useEffect(() => {
    setCurrentPage(1);
    updateURL(filters, 1); // اطمینان از به‌روزرسانی URL هنگام تغییر فیلترها یا itemId/role
  }, [filters, itemId, role]);
  
  const pathname = usePathname();
  const goBack = (e) => {
    const query = router.query;
    const searchParams = new URLSearchParams(window.location.search);
    const queryString = searchParams.toString();
    
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
    setCurrentPage(page);
    updateURL(filters, page); // URL را نیز هنگام تغییر صفحه به‌روزرسانی کنید
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
                  className="cursor-pointer w-[36px] md:w-[69px] md:mx-4 mx-2"
                  alt=""
                  src={menu}
                  onClick={() => goBack()}
                />
                <Image
                
                  className="cursor-pointer w-[36px] md:w-[69px]"
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
            <div className="grid grid-cols-1 md:grid-cols-4 text-[12px] md:text-[15px] gap-8 my-7">
              <div className="border-2 px-3 border-[#25C7AA] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'in_progress' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#25c7aa59] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#25C7AA] rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.in_progress}</div>
                </div>
                برای مشاهده جاری کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#77B7DC] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'done_temp' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#77b7dc80] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="h-[20px] w-[20px] md:h-[40px] md:w-[40px] bg-[#77B7DC] rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.done_temp}</div>
                </div>
                برای مشاهده تایید و ارسال کلیک کنید
              </div>
              <div className="border-2 px-3 border-red-600 rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'rejected' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#dc262680] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="md:h-[40px] w-[20px] md:w-[40px] bg-red-600 rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.rejected}</div>
                </div>
                برای مشاهده رد شده کلیک کنید
              </div>
              <div className="border-2 px-3 border-[#FFD140] rounded-full py-1 md:py-2 px-4 text-center relative cursor-pointer" onClick={() => { handleFilterChange({ ...filters, status: 'action_needed' }); setIsFilterOpen(false); }}>
                <div className="flex items-center justify-center bg-[#ffd14080] rounded-full h-[40px] md:h-[60px] w-[40px] md:w-[60px] absolute -right-4 md:-right-6 -top-2">
                  <div className="md:h-[40px] w-[20px] md:w-[40px] bg-[#FFD140] rounded-full flex items-center justify-center text-white font-bold">{info?.requests?.action_needed}</div>
                </div>
                برای مشاهده نیازمند اصلاح کلیک کنید
              </div>
            </div>

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
                        value={filters.search} // مقدار ورودی را به فیلترها وصل کنید
                        onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })} 
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
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
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
                                  value={filters.plan_id || ''}
                                  onChange={(e) => handleFilterChange({ ...filters, plan_id: e.target.value })}
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
                                  value={filters.unit_id || ''}
                                  onChange={(e) => handleFilterChange({ ...filters, unit_id: e.target.value })}
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
                              onClick={() => {
                                handleFilterChange({ 
                                  search: "", // جستجو را هم پاک کنید
                                  sort: "created_at",
                                  direction: "",
                                  status: null, 
                                  plan_id: null, 
                                  unit_id: null 
                                });
                                setPlanSearch('');
                                setUnitSearch('');
                                setIsFilterOpen(false);
                              }}
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
                      <span className="text-xs text-[#959595]">واحد حقوقی</span>
                      <span className="text-sm text-[#202020]">{request?.unit?.title}</span>
                    </div>

                    <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                      <span className="text-xs text-[#959595]">تاریخ ایجاد</span>
                      <span className="text-sm text-[#202020]">
                        {new Date(request.created_at).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <Link href={`/role/kartabl/darkhast?id=` + request.id + `&role=${roleParam}&item_id=${item_id}`}
                      onClick={() => {
                        // ذخیره فیلترها و URL فعلی در localStorage قبل از ناوبری
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('kartabl_filters_from_detail', JSON.stringify(filters));
                            localStorage.setItem('came_from_kartabl_detail', 'true'); // پرچم برای تشخیص بازگشت
                        }
                      }}
                    >
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
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {request.id}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {new Date(request.created_at).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {request?.user?.name}
                        </td>
                        <td className="border border-gray-300 px-7 py-5 text-base text-center">
                          {request?.unit?.title}
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
                          <Link href={`/role/kartabl/darkhast?id=` + request.id + `&role=${roleParam}&item_id=${item_id}`}
                            onClick={() => {
                              // ذخیره فیلترها و URL فعلی در localStorage قبل از ناوبری
                              if (typeof window !== 'undefined') {
                                  localStorage.setItem('kartabl_filters_from_detail', JSON.stringify(filters));
                                  localStorage.setItem('came_from_kartabl_detail', 'true'); // پرچم برای تشخیص بازگشت
                              }
                            }}
                          >مشاهده درخواست</Link>
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
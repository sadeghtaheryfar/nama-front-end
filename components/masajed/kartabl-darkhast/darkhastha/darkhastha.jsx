'use client';
import Image from "next/image";
import Link from "next/link";
import Carts2 from "../carts2/carts2";
import Table from "../table/table";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Darkhastha = () => {
  const [filters, setFilters] = useState({
    search: "",
    sort: "created_at",
    direction: "",
    status: null,
  });

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

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { search, sort, direction, status } = filters;
      const response = await axios.get(`/api/darkhast`, {
        params: {
          q: search,
          sort,
          direction,
          status,
          per_page: 100,
        },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setRequests([]);
    fetchRequests();
  }, [filters]);

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
                <input placeholder="جستجو کنید ..." className="w-full bg-transparent h-full focus:outline-none" onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
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
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setFilters({ ...filters, status: '' }); setIsFilterOpen(false); }}>همه</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setFilters({ ...filters, status: 'rejected' }); setIsFilterOpen(false); }}>رد شده</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setFilters({ ...filters, status: 'in_progress' }); setIsFilterOpen(false); }}>جاری</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setFilters({ ...filters, status: 'action_needed' }); setIsFilterOpen(false); }}>نیازمند اصلاح</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setFilters({ ...filters, status: 'done' }); setIsFilterOpen(false); }}>تایید شده</div>
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
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setFilters({ ...filters, direction: 'desc' }); setIsSortOpen(false); }}>جدید ترین</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setFilters({ ...filters, direction: 'asc' }); setIsSortOpen(false); }}>قدیمی ترین</div>
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

        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:hidden">
          {requests?.data && requests?.data?.map((request) => (
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
                    request.status === "action_needed" ? "text-[#D97706] bg-[#FEF3C7]" : 
                    "text-[#D9534F] bg-[#FDECEA]"}`}>
                  {request.status === "rejected" ? "رد شده" : 
                    request.status === "in_progress" ? "جاری" : 
                    request.status === "action_needed" ? "نیازمند اصلاح" : 
                    request.status === "done" ? "تایید شده" : "نامشخص"}
                </span>
              </div>

              <div className="bg-[#F6F6F6] rounded-lg flex items-center justify-between p-2">
                <span className="text-xs text-[#959595]">تاریخ ایجاد</span>
                <span className="text-sm text-[#202020]">
                  {new Date(request.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>

              <Link href={`/masajed/kartabl-darkhast/darkhast?id=` + request.id}>
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

              {requests?.data && requests?.data?.map((request) => (
                <tr key={request.id}>
                  <td className="border border-gray-300 px-7 py-5 text-base">
                    {request?.request_plan?.title || "بدون عنوان"}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {request.id}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-base text-center">
                    {new Date(request.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="border border-gray-300 px-7 py-5 text-center flex justify-center items-center">
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
                    <Link href={`/masajed/kartabl-darkhast/darkhast?id=` + request.id}>مشاهده درخواست</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Darkhastha;

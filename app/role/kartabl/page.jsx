"use client";
import Image from "next/image";
import Link from "next/link";
import HeaderProfile from "./../../../components/header-profile-admin/page";
import FilterBox from "./../../../components/role/kartable-filters-box";
import menu from "./../../../public/assets/menu.svg";
import notif from "./../../../public/assets/notif.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setRequestDashboardFilters,
    setRequestDashboardCurrentPage,
    setRequestDashboardTotalPages,
    setHeaderData,
    setGlobalDashboardParams,
} from "./../../../redux/features/dashboards/dashboardSlice";
import useDebounce from "./../../../components/utils/useDebounce";

const ENTITY_CONFIG = {
    2: { label: "مسجد", titleContext: "مسجد" },
    3: { label: "مدارس", titleContext: "مدرسه" },
    4: { label: "مراکز تعالی", titleContext: "مرکز تعالی" },
    9: { label: "بوستان", titleContext: "بوستان" },
    10: { label: "سرا", titleContext: "سرا" },
    11: { label: "ورزشگاه", titleContext: "ورزشگاه" },
    12: { label: "دارالقرآن", titleContext: "دارالقرآن" },
    13: { label: "موسسه فرهنگی", titleContext: "موسسه فرهنگی" },
    14: { label: "حوزه علمیه", titleContext: "حوزه علمیه" },
    15: { label: "مرکز قرآنی", titleContext: "مرکز قرآنی" },
};

const UNIVERSITY_TITLES = {
    approval_mosque_head_coach: "در انتظار تایید مسئول تشکل",
    approval_mosque_cultural_officer: "در انتظار تایید رابط دانشگاه",
    approval_area_interface: "در انتظار تایید ناظر",
    approval_executive_vice_president_mosques:
        "در انتظار تایید معاونت دانشجویی",
    approval_deputy_for_planning_and_programming:
        "در انتظار تایید معاونت طرح و برنامه",
    finish: "به اتمام رسیده",
};

const VALID_ROLES = [
    "mosque_head_coach",
    "mosque_cultural_officer",
    "area_interface",
    "executive_vice_president_mosques",
    "deputy_for_planning_and_programming",
];

const VALID_ITEM_IDS = [
    "1",
    "2",
    "3",
    "4",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
];

const generateGeneralTitles = (placeName) => ({
    approval_mosque_head_coach: `در انتظار تایید سر مربی ${placeName}`,
    approval_mosque_cultural_officer: `در انتظار تایید مسئول فرهنگی ${placeName}`,
    approval_area_interface: "در انتظار تایید رابط منطقه",
    approval_executive_vice_president_mosques: `در انتظار تایید معاونت اجرایی ${placeName}`,
    approval_deputy_for_planning_and_programming:
        "در انتظار تایید معاونت طرح و برنامه",
    finish: "به اتمام رسیده",
});

const getStatusBadge = (status, step) => {
    if (status === "rejected")
        return { text: "رد شده", className: "text-[#D9534F] bg-[#FDECEA]" };
    if (status === "in_progress")
        return { text: "جاری", className: "text-[#258CC7] bg-[#D9EFFE]" };
    if (status === "action_needed")
        return {
            text: "نیازمند اصلاح",
            className: "text-[#D97706] bg-[#FEF3C7]",
        };
    if (status === "done" && step === "finish")
        return { text: "تایید شده", className: "text-[#39A894] bg-[#DFF7F2]" };
    if (!status)
        return {
            text: "هنوز ارجاع نشده",
            className: "text-[#959595] bg-[#F6F6F6]",
        };
    return { text: "تایید و ارسال", className: "text-[#39A894] bg-[#DFF7F2]" };
};

export default function Kartabl() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
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
        currentPage,
        totalPages,
        school_coach_type,
        sub_type,
    } = useSelector((state) => state.dashboards.requestDashboard);

    const header = useSelector((state) => state.dashboards.headerData);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const [localSearchInput, setLocalSearchInput] = useState(reduxSearch);
    const debouncedSearchTerm = useDebounce(localSearchInput, 500);
    const [schoolCoachTypes, setSchoolCoachTypes] = useState({});
    const [subTypesData, setSubTypesData] = useState({});
    const [info, setInfo] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stepTitles, setStepTitles] = useState({});

    const itemsPerPage = 10;

    useEffect(() => {
        setLocalSearchInput(reduxSearch);
    }, [reduxSearch]);

    useEffect(() => {
        if (debouncedSearchTerm !== reduxSearch) {
            dispatch(
                setRequestDashboardFilters({ search: debouncedSearchTerm })
            );
            dispatch(setRequestDashboardCurrentPage(1));
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const roleParam = searchParams.get("role");
        const itemIdParam = searchParams.get("item_id");

        dispatch(
            setGlobalDashboardParams({ item_id: itemIdParam, role: roleParam })
        );

        if (!roleParam || !itemIdParam) {
            router.push("/");
            return;
        }

        if (
            !VALID_ROLES.includes(roleParam) ||
            !VALID_ITEM_IDS.includes(itemIdParam)
        ) {
            router.push("/");
        }
    }, [router, searchParams, dispatch]);

    useEffect(() => {
        if (!item_id) return;

        const id = String(item_id);
        if (id === "8") {
            setStepTitles(UNIVERSITY_TITLES);
        } else {
            const config = ENTITY_CONFIG[id];
            setStepTitles(
                config
                    ? generateGeneralTitles(config.titleContext)
                    : generateGeneralTitles("مسجد")
            );
        }

        const fetchHeader = async () => {
            try {
                const response = await axios.get(
                    `/api/show-item-dashboard?item_id=${item_id}&role=mosque_head_coach`
                );
                if (response.data) dispatch(setHeaderData(response.data));
            } catch (error) {
                console.error(error);
            }
        };
        fetchHeader();
    }, [item_id, dispatch]);

    useEffect(() => {
        if (!item_id || !role) return;
        const fetchInfo = async () => {
            try {
                const response = await axios.get(
                    `/api/info?item_id=${item_id}&role=${role}`
                );
                if (response.data) setInfo(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInfo();
    }, [item_id, role]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (item_id) params.set("item_id", item_id);
        if (role) params.set("role", role);

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
            shallow: true,
        });
    }, [item_id, role, pathname, router, searchParams]);

    const fetchRequests = useCallback(async () => {
        if (!item_id || !role) return;

        setLoading(true);
        try {
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
                role,
                school_coach_type,
                sub_type,
            };

            const response = await axios.get(`/api/darkhast`, { params });

            setRequests(response.data);
            if (response.data.school_coach_type)
                setSchoolCoachTypes(response.data.school_coach_type);
            if (response.data.sub_types)
                setSubTypesData(response.data.sub_types);

            const total =
                response.data.meta?.total || response.data.data?.length || 0;
            dispatch(
                setRequestDashboardTotalPages(
                    Math.ceil(total / itemsPerPage) || 1
                )
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        item_id,
        role,
        reduxSearch,
        sort,
        direction,
        status,
        plan_id,
        unit_id,
        itemsPerPage,
        dispatch,
        school_coach_type,
        sub_type,
    ]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target))
                setIsFilterOpen(false);
            if (sortRef.current && !sortRef.current.contains(event.target))
                setIsSortOpen(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleFilterChange = (newFilterState) => {
        dispatch(setRequestDashboardFilters(newFilterState));
        dispatch(setRequestDashboardCurrentPage(1));
    };

    const handleClearFilters = () => {
        dispatch(
            setRequestDashboardFilters({
                search: "",
                status: "",
                sort: "",
                direction: "",
                plan_id: "",
                unit_id: "",
                school_coach_type: "",
                sub_type: "",
            })
        );
        setLocalSearchInput("");
        dispatch(setRequestDashboardCurrentPage(1));
    };

    const goBack = (notifClicked = false) => {
        const params = new URLSearchParams();
        if (item_id) params.set("item_id", item_id);
        if (role) params.set("role", role);
        const queryString = params.toString();
        const newPath = notifClicked
            ? pathname.split("/").slice(0, -1).join("/") || "/"
            : "/";
        router.push(queryString ? `${newPath}?${queryString}` : newPath);
    };

    const handlePageChange = (page) => {
        dispatch(setRequestDashboardCurrentPage(page));
        document
            .getElementById("future-carts-section")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-10 w-full bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Image
                    src="/Images/masajed/kartabl-darkhast/Search.svg"
                    width={30}
                    height={30}
                    className="opacity-40"
                    alt="Empty"
                />
            </div>
            <p className="text-black text-lg font-medium">موردی یافت نشد</p>
            <p className="text-gray-400 text-sm mt-1">
                لطفا فیلترها را تغییر دهید یا دوباره جستجو کنید
            </p>
        </div>
    );

    const TableSkeleton = () => (
        <div className="animate-pulse w-full">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 py-4 px-6 border-b border-gray-100"
                >
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                </div>
            ))}
        </div>
    );

    const renderPaginationButtons = () => {
        const buttons = [];
        buttons.push(
            <button
                key="prev"
                onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                }
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
                onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                }
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
        <div className="h-screen relative bg-[#dbdbdb]">
            <div className="bg-[#002a4fd5] vector-nama2 h-[15rem] lg:h-[20rem] bg-linear-to-r md:pt-7 from-[#002A4F] to-[#003854]  relative overflow-hidden">
                <div className="absolute top-[9rem] lg:top-[11rem] w-full">
                    <img
                        className="w-full opacity-20"
                        src="/assets/Vector.png"
                        alt=""
                    />
                </div>
                <div className="flex justify-between items-center px-6 py-2 md:px-12">
                    <div className="flex items-center">
                        <img
                            src={
                                header?.data?.logo ||
                                "/Images/masajed/mosque.svg"
                            }
                            className="w-[36px] h-[36px] md:w-[130px] md:h-[130px]"
                        />
                        <div className="text-[#D5B260] text-[12px] md:text-[18px] font-bold md:text-3xl md:my-6 my-3 mx-4">
                            {header?.data?.title} / کارتابل گزارش ها
                        </div>
                    </div>
                    <div className="flex">
                        <div className="rounded-full hidden bg-[#43637E] text-white md:flex items-center p-3">
                            <HeaderProfile bgRole="#3A5C78" />
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
                    <HeaderProfile bgRole="#3A5C78" />
                </div>
            </div>

            <div className="bg-white absolute top-[150px] md:top-[160px] inset-x-6 md:inset-x-11 rounded p-3 md:p-6 scroll-kon">
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-4 text-[12px] md:text-[15px] gap-6 my-4">
                        {[
                            {
                                key: "in_progress",
                                color: "#25C7AA",
                                label: "جاری",
                                action: "برای مشاهده جاری کلیک کنید",
                            },
                            {
                                key: "done_temp",
                                color: "#77B7DC",
                                label: "تایید و ارسال",
                                action: "برای مشاهده تایید و ارسال کلیک کنید",
                            },
                            {
                                key: "rejected",
                                color: "#dc2626",
                                label: "رد شده",
                                action: "برای مشاهده رد شده کلیک کنید",
                            },
                            {
                                key: "action_needed",
                                color: "#FFD140",
                                label: "نیازمند اصلاح",
                                action: "برای مشاهده نیازمند اصلاح کلیک کنید",
                            },
                        ].map((statusItem) => (
                            <div
                                key={statusItem.key}
                                className="border-2 rounded-full py-2 px-4 text-center relative cursor-pointer hover:bg-gray-50 transition"
                                style={{ borderColor: statusItem.color }}
                                onClick={() => {
                                    handleFilterChange({
                                        status: statusItem.key,
                                    });
                                    setIsFilterOpen(false);
                                }}
                            >
                                <div
                                    className="flex items-center justify-center rounded-full h-[40px] md:h-[50px] w-[40px] md:w-[50px] absolute -right-4 md:-right-6 -top-2"
                                    style={{
                                        backgroundColor: `${statusItem.color}40`,
                                    }}
                                >
                                    <div
                                        className="h-[20px] w-[20px] md:h-[34px] md:w-[34px] rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm"
                                        style={{
                                            backgroundColor: statusItem.color,
                                        }}
                                    >
                                        {info?.requests?.[statusItem.key] || 0}
                                    </div>
                                </div>
                                {statusItem.action}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between mt-8 mb-6">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            همه درخواست ها
                            <Link
                                href={`/role/invoice?id=&role=${role}&item_id=${item_id}`}
                                className="bg-sky-400 hover:bg-sky-500 text-white text-sm px-3 py-1.5 rounded-full transition"
                            >
                                صورت حساب
                            </Link>
                        </h2>

                        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                            <div className="bg-[#F6F6F6] rounded-full flex items-center px-4 h-12 flex-grow lg:w-[400px]">
                                <Image
                                    width={20}
                                    height={20}
                                    alt="Search"
                                    src="/Images/masajed/kartabl-darkhast/Search.svg"
                                />
                                <input
                                    placeholder="جستجو کنید ..."
                                    className="w-full bg-transparent h-full px-2 focus:outline-none text-sm"
                                    onChange={(e) =>
                                        setLocalSearchInput(e.target.value)
                                    }
                                    value={localSearchInput}
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center justify-center gap-2 h-12 px-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-full min-w-fit transition"
                                >
                                    <span className="text-sm font-medium">
                                        حذف فیلتر
                                    </span>
                                </button>

                                <div ref={filterRef} className="relative">
                                    <button
                                        onClick={() =>
                                            setIsFilterOpen(!isFilterOpen)
                                        }
                                        className="flex items-center gap-2 h-12 px-4 border rounded-full hover:bg-gray-50 transition"
                                    >
                                        <Image
                                            width={20}
                                            height={20}
                                            alt="Filter"
                                            src="/Images/masajed/kartabl-darkhast/filter.svg"
                                        />
                                        <span className="text-sm">فیلتر</span>
                                    </button>
                                    {isFilterOpen && (
                                        <FilterBox
                                            item_id={item_id}
                                            role={role}
                                            schoolCoachTypes={schoolCoachTypes}
                                            subTypesData={subTypesData}
                                            onClose={setIsFilterOpen}
                                            setLocalSearchInput={
                                                setLocalSearchInput
                                            }
                                            setIsFilterOpen={setIsFilterOpen}
                                        />
                                    )}
                                </div>

                                <div ref={sortRef} className="relative">
                                    <button
                                        onClick={() =>
                                            setIsSortOpen(!isSortOpen)
                                        }
                                        className="flex items-center gap-2 h-12 px-4 border rounded-full hover:bg-gray-50 transition"
                                    >
                                        <Image
                                            width={20}
                                            height={20}
                                            alt="Sort"
                                            src="/Images/masajed/kartabl-darkhast/sort.svg"
                                        />
                                        <span className="text-sm">
                                            {direction === "desc"
                                                ? "جدید ترین"
                                                : direction === "asc"
                                                ? "قدیمی ترین"
                                                : "مرتب سازی"}
                                        </span>
                                    </button>
                                    {isSortOpen && (
                                        <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-20 overflow-hidden">
                                            <div
                                                className="p-3 hover:bg-gray-50 cursor-pointer text-sm"
                                                onClick={() => {
                                                    handleFilterChange({
                                                        direction: "desc",
                                                    });
                                                    setIsSortOpen(false);
                                                }}
                                            >
                                                جدید ترین
                                            </div>
                                            <div
                                                className="p-3 hover:bg-gray-50 cursor-pointer text-sm"
                                                onClick={() => {
                                                    handleFilterChange({
                                                        direction: "asc",
                                                    });
                                                    setIsSortOpen(false);
                                                }}
                                            >
                                                قدیمی ترین
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="w-full py-10">
                            <div className="hidden lg:block">
                                <TableSkeleton />
                            </div>
                            <div className="lg:hidden flex flex-col gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-40 bg-gray-100 animate-pulse rounded-lg"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ) : !requests?.data || requests?.data?.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <div
                                className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:hidden"
                                id="future-carts-section"
                            >
                                {requests.data.map((request) => {
                                    const badge = getStatusBadge(
                                        request.status,
                                        request.step
                                    );
                                    return (
                                        <div
                                            key={request.id}
                                            className="flex flex-col border rounded-lg p-4 gap-3 bg-white shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-sm font-bold text-black line-clamp-2">
                                                    {request?.request_plan
                                                        ?.title || "بدون عنوان"}
                                                </h2>
                                                {request?.request_plan
                                                    ?.single_step && (
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                                        تک مرحله‌ای
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-gray-50 p-2 rounded flex justify-between">
                                                    <span className="text-black">
                                                        شماره:
                                                    </span>
                                                    <span>{request.id}</span>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded flex justify-between">
                                                    <span className="text-black">
                                                        وضعیت:
                                                    </span>
                                                    <span
                                                        className={`${badge.className} px-1 rounded`}
                                                    >
                                                        {badge.text}
                                                    </span>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded flex justify-between col-span-2">
                                                    <span className="text-black">
                                                        مرحله:
                                                    </span>
                                                    <span className="truncate max-w-[150px]">
                                                        {
                                                            stepTitles[
                                                                request?.step
                                                            ]
                                                        }
                                                    </span>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded flex justify-between">
                                                    <span className="text-black">
                                                        تاریخ:
                                                    </span>
                                                    <span>
                                                        {new Date(
                                                            request.created_at
                                                        ).toLocaleDateString(
                                                            "fa-IR"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/role/kartabl/darkhast?id=${request.id}&role=${role}&item_id=${item_id}`}
                                                className="mt-2"
                                            >
                                                <button className="text-sm text-[#39A894] font-medium border border-[#39A894] rounded-lg w-full h-10 hover:bg-[#39A894] hover:text-white transition">
                                                    مشاهده درخواست
                                                </button>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="hidden xl:block overflow-x-auto">
                                <table className="min-w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-black border-b border-gray-200">
                                            <th className="px-6 py-4 text-right font-medium">
                                                نام درخواست
                                            </th>
                                            <th className="px-6 py-4 text-center font-medium">
                                                شماره
                                            </th>
                                            <th className="px-6 py-4 text-center font-medium">
                                                تاریخ ایجاد
                                            </th>
                                            <th className="px-6 py-4 text-center font-medium">
                                                تاریخ بروزرسانی
                                            </th>
                                            <th className="px-6 py-4 text-center font-medium">
                                                سر مربی
                                            </th>
                                            <th className="px-6 py-4 text-center font-medium">
                                                واحد حقوقی
                                            </th>
                                            <th className="px-6 py-4 text-center font-medium">
                                                مرحله
                                            </th>
                                            <th className="px-6 py-4 text-center font-medium">
                                                وضعیت
                                            </th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {requests.data.map((request) => {
                                            const badge = getStatusBadge(
                                                request.status,
                                                request.step
                                            );
                                            return (
                                                <tr
                                                    key={request.id}
                                                    className="hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-black">
                                                                {request
                                                                    ?.request_plan
                                                                    ?.title ||
                                                                    "بدون عنوان"}
                                                            </span>
                                                            {request
                                                                ?.request_plan
                                                                ?.single_step && (
                                                                <span className="text-[10px] text-blue-500 mt-1">
                                                                    تک مرحله ای
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-black">
                                                        {request.id}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-black">
                                                        {new Date(
                                                            request.created_at
                                                        ).toLocaleDateString(
                                                            "fa-IR"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-black">
                                                        {new Date(
                                                            request.updated_at
                                                        ).toLocaleDateString(
                                                            "fa-IR"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-black">
                                                        {request?.user?.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-black">
                                                        {request?.unit?.title}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center text-xs text-black max-w-[200px] truncate"
                                                        title={
                                                            stepTitles[
                                                                request?.step
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            stepTitles[
                                                                request?.step
                                                            ]
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-lg text-xs ${badge.className}`}
                                                        >
                                                            {badge.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Link
                                                            href={`/role/kartabl/darkhast?id=${request.id}&role=${role}&item_id=${item_id}`}
                                                            className="text-[#39A894] hover:text-[#2c8574] underline underline-offset-4 text-sm font-medium"
                                                        >
                                                            مشاهده
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center my-4 gap-2 text-sm">
                                    {renderPaginationButtons()}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

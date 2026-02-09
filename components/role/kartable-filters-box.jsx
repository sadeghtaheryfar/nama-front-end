"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "./../../components/utils/useDebounce";
import {
    setRequestDashboardFilters,
    setRequestDashboardCurrentPage,
    resetRequestDashboardFilters,
    setUnitFilterSearch,
    setUnitFilterCurrentPage,
    setUnitFilterTotalPages,
} from "./../../redux/features/dashboards/dashboardSlice";

export default function FilterBox({
    item_id,
    role,
    schoolCoachTypes,
    subTypesData,
    onClose,
    setLocalSearchInput,
    setIsFilterOpen,
}) {
    const dispatch = useDispatch();
    const boxRef = useRef(null);
    const [positionClass, setPositionClass] = useState("");

    const { status, plan_id, unit_id, school_coach_type, sub_type, region_id } =
        useSelector((state) => state.dashboards.requestDashboard);

    const {
        search: unitFilterSearch,
        currentPage: unitFilterCurrentPage,
        totalPages: unitFilterTotalPages,
    } = useSelector((state) => state.dashboards.unitFilter);

    const [localUnitSearchInput, setLocalUnitSearchInput] =
        useState(unitFilterSearch);
    const debouncedUnitSearchTerm = useDebounce(localUnitSearchInput, 500);

    const [units, setUnits] = useState([]);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const unitsPerPage = 10;

    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [planSearch, setPlanSearch] = useState("");
    const debouncedPlanSearchTerm = useDebounce(planSearch, 500);
    const [planCurrentPage, setPlanCurrentPage] = useState(1);
    const [planTotalPages, setPlanTotalPages] = useState(1);
    const plansPerPage = 10;

    const [regions, setRegions] = useState([]);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [regionSearch, setRegionSearch] = useState("");
    const debouncedRegionSearchTerm = useDebounce(regionSearch, 500);
    const [regionCurrentPage, setRegionCurrentPage] = useState(1);
    const [regionTotalPages, setRegionTotalPages] = useState(1);
    const regionsPerPage = 10;

    useEffect(() => {
        const fetchRegions = async () => {
            setLoadingRegions(true);
            try {
                const response = await axios.get(
                    `/api/regions?page=${regionCurrentPage}&per_page=${regionsPerPage}&q=${debouncedRegionSearchTerm}`,
                );
                if (response.data && response.data.data) {
                    setRegions(response.data.data);
                    if (response.data && response.data.total) {
                        setRegionTotalPages(
                            Math.ceil(response.data.total / regionsPerPage),
                        );
                    } else {
                        setRegionTotalPages(
                            Math.ceil(
                                response.data.data.length / regionsPerPage,
                            ) || 1,
                        );
                    }
                }
            } catch (error) {
                console.log("Error fetching regions:", error);
            } finally {
                setLoadingRegions(false);
            }
        };
        fetchRegions();
    }, [regionCurrentPage, debouncedRegionSearchTerm]);

    useEffect(() => {
        setRegionCurrentPage(1);
    }, [debouncedRegionSearchTerm]);

    useLayoutEffect(() => {
        if (boxRef.current) {
            const rect = boxRef.current.getBoundingClientRect();
            if (rect.left < 10) {
                setPositionClass("left-0");
            }
        }
    }, []);

    useEffect(() => {
        if (debouncedUnitSearchTerm !== unitFilterSearch) {
            dispatch(setUnitFilterSearch(debouncedUnitSearchTerm));
            dispatch(setUnitFilterCurrentPage(1));
        }
    }, [debouncedUnitSearchTerm, dispatch, unitFilterSearch]);

    useEffect(() => {
        if (!item_id || !role) return;

        const fetchUnits = async () => {
            setLoadingUnits(true);
            try {
                const response = await axios.get(
                    `/api/unit?item_id=${item_id}&role=${role}&page=${unitFilterCurrentPage}&per_page=${unitsPerPage}&q=${unitFilterSearch}`,
                );
                if (response.data && response.data.data) {
                    setUnits(response.data.data);
                    if (response.data.meta && response.data.meta.total) {
                        dispatch(
                            setUnitFilterTotalPages(
                                Math.ceil(
                                    response.data.meta.total / unitsPerPage,
                                ),
                            ),
                        );
                    } else {
                        dispatch(
                            setUnitFilterTotalPages(
                                Math.ceil(
                                    response.data.data.length / unitsPerPage,
                                ) || 1,
                            ),
                        );
                    }
                }
            } catch (error) {
                console.log("Error fetching units:", error);
            } finally {
                setLoadingUnits(false);
            }
        };
        fetchUnits();
    }, [
        item_id,
        role,
        unitFilterCurrentPage,
        unitFilterSearch,
        dispatch,
        unitsPerPage,
    ]);

    useEffect(() => {
        if (!item_id || !role) return;

        const fetchPlans = async () => {
            setLoadingPlans(true);
            try {
                const response = await axios.get(
                    `/api/filters-plans?item_id=${item_id}&role=${role}&page=${planCurrentPage}&per_page=${plansPerPage}&q=${debouncedPlanSearchTerm}`,
                );
                if (response.data && response.data.data) {
                    setPlans(response.data.data);
                    if (response.data.meta && response.data.meta.total) {
                        setPlanTotalPages(
                            Math.ceil(response.data.meta.total / plansPerPage),
                        );
                    } else {
                        setPlanTotalPages(
                            Math.ceil(
                                response.data.data.length / plansPerPage,
                            ) || 1,
                        );
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, [item_id, role, planCurrentPage, debouncedPlanSearchTerm]);

    useEffect(() => {
        setPlanCurrentPage(1);
    }, [debouncedPlanSearchTerm]);

    const handleFilterChange = (newFilterState) => {
        dispatch(setRequestDashboardFilters(newFilterState));
        dispatch(setRequestDashboardCurrentPage(1));
    };

    const handleResetFilters = () => {
        dispatch(resetRequestDashboardFilters());
        dispatch(setRequestDashboardFilters({ search: "" }));
        dispatch(setRequestDashboardCurrentPage(1));

        if (setLocalSearchInput) {
            setLocalSearchInput("");
        }

        setPlanSearch("");
        dispatch(setUnitFilterSearch(""));
        dispatch(setUnitFilterCurrentPage(1));
        setLocalUnitSearchInput("");

        setRegionSearch("");
        setRegionCurrentPage(1);

        onClose(false);
    };

    const handleRegionPageChange = (page) => {
        setRegionCurrentPage(page);
    };

    const renderRegionPaginationButtons = () => {
        const buttons = [];
        buttons.push(
            <button
                key="region-prev"
                onClick={() =>
                    regionCurrentPage > 1 &&
                    handleRegionPageChange(regionCurrentPage - 1)
                }
                disabled={regionCurrentPage === 1}
                className={`px-2 py-1 rounded-md ${
                    regionCurrentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                قبلی
            </button>,
        );

        const startPage = Math.max(1, regionCurrentPage - 1);
        const endPage = Math.min(regionTotalPages, regionCurrentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={`region-page-${i}`}
                    onClick={() => handleRegionPageChange(i)}
                    className={`px-2 py-1 rounded-md ${
                        regionCurrentPage === i
                            ? "bg-[#39A894] text-white"
                            : "hover:bg-gray-100"
                    }`}
                >
                    {i}
                </button>,
            );
        }

        buttons.push(
            <button
                key="region-next"
                onClick={() =>
                    regionCurrentPage < regionTotalPages &&
                    handleRegionPageChange(regionCurrentPage + 1)
                }
                disabled={regionCurrentPage === regionTotalPages}
                className={`px-2 py-1 rounded-md ${
                    regionCurrentPage === regionTotalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                بعدی
            </button>,
        );

        return buttons;
    };

    const handleUnitPageChange = (page) => {
        dispatch(setUnitFilterCurrentPage(page));
    };

    const handlePlanPageChange = (page) => {
        setPlanCurrentPage(page);
    };

    const renderUnitPaginationButtons = () => {
        const buttons = [];
        buttons.push(
            <button
                key="unit-prev"
                onClick={() =>
                    unitFilterCurrentPage > 1 &&
                    handleUnitPageChange(unitFilterCurrentPage - 1)
                }
                disabled={unitFilterCurrentPage === 1}
                className={`px-2 py-1 rounded-md ${
                    unitFilterCurrentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                قبلی
            </button>,
        );

        const startPage = Math.max(1, unitFilterCurrentPage - 1);
        const endPage = Math.min(
            unitFilterTotalPages,
            unitFilterCurrentPage + 1,
        );

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
                </button>,
            );
        }

        buttons.push(
            <button
                key="unit-next"
                onClick={() =>
                    unitFilterCurrentPage < unitFilterTotalPages &&
                    handleUnitPageChange(unitFilterCurrentPage + 1)
                }
                disabled={unitFilterCurrentPage === unitFilterTotalPages}
                className={`px-2 py-1 rounded-md ${
                    unitFilterCurrentPage === unitFilterTotalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                بعدی
            </button>,
        );

        return buttons;
    };

    const renderPlanPaginationButtons = () => {
        const buttons = [];
        buttons.push(
            <button
                key="plan-prev"
                onClick={() =>
                    planCurrentPage > 1 &&
                    handlePlanPageChange(planCurrentPage - 1)
                }
                disabled={planCurrentPage === 1}
                className={`px-2 py-1 rounded-md ${
                    planCurrentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                قبلی
            </button>,
        );

        const startPage = Math.max(1, planCurrentPage - 1);
        const endPage = Math.min(planTotalPages, planCurrentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={`plan-page-${i}`}
                    onClick={() => handlePlanPageChange(i)}
                    className={`px-2 py-1 rounded-md ${
                        planCurrentPage === i
                            ? "bg-[#39A894] text-white"
                            : "hover:bg-gray-100"
                    }`}
                >
                    {i}
                </button>,
            );
        }

        buttons.push(
            <button
                key="plan-next"
                onClick={() =>
                    planCurrentPage < planTotalPages &&
                    handlePlanPageChange(planCurrentPage + 1)
                }
                disabled={planCurrentPage === planTotalPages}
                className={`px-2 py-1 rounded-md ${
                    planCurrentPage === planTotalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                بعدی
            </button>,
        );

        return buttons;
    };

    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div
            ref={boxRef}
            className={`absolute z-10 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden ${positionClass}`}
        >
            <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* بخش فیلترهای انتخابی سریع */}
                <div className="p-3 grid grid-cols-1 gap-3 border-b bg-gray-50/50">
                    <div>
                        <div className="text-xs font-bold mb-1.5 text-gray-600">
                            وضعیت
                        </div>
                        <select
                            className="w-full p-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-[#39A894]/20 outline-none"
                            value={status || ""}
                            onChange={(e) =>
                                handleFilterChange({ status: e.target.value })
                            }
                        >
                            <option value="">همه وضعیت‌ها</option>
                            <option value="rejected">رد شده</option>
                            <option value="in_progress">جاری</option>
                            <option value="action_needed">نیازمند اصلاح</option>
                            <option value="done_temp">تایید و ارسال</option>
                            <option value="done">تایید شده</option>
                        </select>
                    </div>

                    {item_id && (
                        <div>
                            <div className="text-xs font-bold mb-1.5 text-gray-600">
                                نوع واحد حقوقی
                            </div>
                            <select
                                className="w-full p-2 text-sm border rounded-lg bg-white outline-none"
                                value={sub_type || ""}
                                onChange={(e) =>
                                    handleFilterChange({
                                        sub_type: e.target.value,
                                    })
                                }
                            >
                                <option value="">همه</option>
                                {item_id === "2" &&
                                    subTypesData.mosque &&
                                    Object.entries(subTypesData.mosque).map(
                                        ([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ),
                                    )}
                                {item_id === "3" &&
                                    subTypesData.school &&
                                    Object.entries(subTypesData.school).map(
                                        ([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ),
                                    )}
                                {item_id === "4" &&
                                    subTypesData.center &&
                                    subTypesData.center.map((value, index) => (
                                        <option key={index} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                {item_id === "8" &&
                                    subTypesData.university &&
                                    subTypesData.university.map(
                                        (value, index) => (
                                            <option key={index} value={value}>
                                                {value}
                                            </option>
                                        ),
                                    )}
                            </select>
                        </div>
                    )}

                    {item_id === "3" && (
                        <div>
                            <div className="text-xs font-bold mb-1.5 text-gray-600">
                                نوع مربی در مدارس
                            </div>
                            <select
                                className="w-full p-2 text-sm border rounded-lg bg-white outline-none"
                                value={school_coach_type || ""}
                                onChange={(e) =>
                                    handleFilterChange({
                                        school_coach_type: e.target.value,
                                    })
                                }
                            >
                                <option value="">همه</option>
                                {Object.entries(schoolCoachTypes).map(
                                    ([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    )}
                </div>

                {/* بخش‌های آکاردئونی برای لیست‌های طولانی */}
                <div className="divide-y divide-gray-100">
                    {/* اکشن پلن ها */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => toggleSection("plans")}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-sm font-bold text-gray-700">
                                اکشن پلن‌ها
                            </span>
                            <span
                                className={`text-[10px] transform transition-transform ${openSection === "plans" ? "rotate-180" : ""}`}
                            >
                                ▼
                            </span>
                        </button>
                        {openSection === "plans" && (
                            <div className="p-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="جستجو..."
                                    className="w-full p-2 text-xs border rounded-md mb-2 outline-none"
                                    value={planSearch}
                                    onChange={(e) =>
                                        setPlanSearch(e.target.value)
                                    }
                                />
                                <div className="max-h-32 overflow-y-auto border rounded-md relative">
                                    {loadingPlans && (
                                        <div className="absolute inset-0 bg-white/60 flex justify-center items-center z-10">
                                            <div className="w-5 h-5 border-2 border-[#39A894] border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() =>
                                                handleFilterChange({
                                                    plan_id: String(plan.id),
                                                })
                                            }
                                            className={`p-2 text-xs cursor-pointer hover:bg-gray-50 ${plan_id === String(plan.id) ? "bg-teal-50 text-[#39A894] font-medium" : ""}`}
                                        >
                                            {plan.title}
                                        </div>
                                    ))}
                                </div>
                                {planTotalPages > 1 && (
                                    <div className="flex justify-center mt-2 scale-90">
                                        {renderPlanPaginationButtons()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* واحدهای سازمانی */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => toggleSection("units")}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-sm font-bold text-gray-700">
                                واحدهای سازمانی
                            </span>
                            <span
                                className={`text-[10px] transform transition-transform ${openSection === "units" ? "rotate-180" : ""}`}
                            >
                                ▼
                            </span>
                        </button>
                        {openSection === "units" && (
                            <div className="p-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="جستجو..."
                                    className="w-full p-2 text-xs border rounded-md mb-2 outline-none"
                                    value={localUnitSearchInput}
                                    onChange={(e) =>
                                        setLocalUnitSearchInput(e.target.value)
                                    }
                                />
                                <div className="max-h-32 overflow-y-auto border rounded-md relative">
                                    {loadingUnits && (
                                        <div className="absolute inset-0 bg-white/60 flex justify-center items-center z-10">
                                            <div className="w-5 h-5 border-2 border-[#39A894] border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    {units.map((unit) => (
                                        <div
                                            key={unit.id}
                                            onClick={() =>
                                                handleFilterChange({
                                                    unit_id: unit.id,
                                                })
                                            }
                                            className={`p-2 text-xs cursor-pointer hover:bg-gray-50 ${unit_id === unit.id ? "bg-teal-50 text-[#39A894] font-medium" : ""}`}
                                        >
                                            {unit.title}
                                        </div>
                                    ))}
                                </div>
                                {unitFilterTotalPages > 1 && (
                                    <div className="flex justify-center mt-2 scale-90">
                                        {renderUnitPaginationButtons()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* مناطق */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => toggleSection("regions")}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-sm font-bold text-gray-700">
                                مناطق
                            </span>
                            <span
                                className={`text-[10px] transform transition-transform ${openSection === "regions" ? "rotate-180" : ""}`}
                            >
                                ▼
                            </span>
                        </button>
                        {openSection === "regions" && (
                            <div className="p-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="جستجو..."
                                    className="w-full p-2 text-xs border rounded-md mb-2 outline-none"
                                    value={regionSearch}
                                    onChange={(e) =>
                                        setRegionSearch(e.target.value)
                                    }
                                />
                                <div className="max-h-32 overflow-y-auto border rounded-md relative">
                                    {loadingRegions && (
                                        <div className="absolute inset-0 bg-white/60 flex justify-center items-center z-10">
                                            <div className="w-5 h-5 border-2 border-[#39A894] border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    {regions.map((region) => (
                                        <div
                                            key={region.id}
                                            onClick={() =>
                                                handleFilterChange({
                                                    region_id: region.id,
                                                })
                                            }
                                            className={`p-2 text-xs cursor-pointer hover:bg-gray-50 ${String(region_id) === String(region.id) ? "bg-teal-50 text-[#39A894] font-medium" : ""}`}
                                        >
                                            {region.title || region.name}
                                        </div>
                                    ))}
                                </div>
                                {regionTotalPages > 1 && (
                                    <div className="flex justify-center mt-2 scale-90">
                                        {renderRegionPaginationButtons()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* دکمه‌های عملیاتی */}
            <div className="p-3 bg-white border-t flex gap-2">
                <button
                    className="flex-1 p-2 bg-[#39A894] text-white text-sm font-bold rounded-lg hover:bg-[#2d8575] transition-colors"
                    onClick={() => onClose(false)}
                >
                    اعمال فیلتر
                </button>
                <button
                    className="flex-1 p-2 bg-white text-red-500 text-sm font-bold border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={handleResetFilters}
                >
                    حذف فیلتر
                </button>
            </div>
        </div>
    );
}

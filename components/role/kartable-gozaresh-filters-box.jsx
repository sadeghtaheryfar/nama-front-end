"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "./../../components/utils/useDebounce";
import {
    setReportDashboardFilters,
    setReportDashboardCurrentPage,
    resetReportDashboardFilters,
} from "./../../redux/features/dashboards/dashboardSlice";

export default function KartableReportFilterBox({
    item_id,
    role,
    schoolCoachTypes,
    subTypesData,
    onClose,
    setIsFilterOpen,
    setLocalSearchInput,
}) {
    const dispatch = useDispatch();
    const boxRef = useRef(null);
    const [positionClass, setPositionClass] = useState("");

    const { status, plan_id, unit_id, school_coach_type, sub_type } =
        useSelector((state) => state.dashboards.reportDashboard);

    const [units, setUnits] = useState([]);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [unitSearch, setUnitSearch] = useState("");
    const debouncedUnitSearchTerm = useDebounce(unitSearch, 500);
    const [unitCurrentPage, setUnitCurrentPage] = useState(1);
    const [unitTotalPages, setUnitTotalPages] = useState(1);
    const unitsPerPage = 10;

    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [planSearch, setPlanSearch] = useState("");
    const debouncedPlanSearchTerm = useDebounce(planSearch, 500);
    const [planCurrentPage, setPlanCurrentPage] = useState(1);
    const [planTotalPages, setPlanTotalPages] = useState(1);
    const plansPerPage = 10;

    useLayoutEffect(() => {
        if (boxRef.current) {
            const rect = boxRef.current.getBoundingClientRect();
            if (rect.left < 10) {
                setPositionClass("left-0");
            }
        }
    }, []);

    useEffect(() => {
        if (!item_id || !role) return;

        const fetchUnits = async () => {
            setLoadingUnits(true);
            try {
                const response = await axios.get(
                    `/api/unit?item_id=${item_id}&role=${role}&page=${unitCurrentPage}&per_page=${unitsPerPage}&q=${debouncedUnitSearchTerm}`
                );
                if (response.data && response.data.data) {
                    setUnits(response.data.data);
                    if (response.data.meta && response.data.meta.total) {
                        setUnitTotalPages(
                            Math.ceil(response.data.meta.total / unitsPerPage)
                        );
                    } else {
                        setUnitTotalPages(
                            Math.ceil(
                                response.data.data.length / unitsPerPage
                            ) || 1
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
    }, [item_id, role, unitCurrentPage, debouncedUnitSearchTerm]);

    useEffect(() => {
        setUnitCurrentPage(1);
    }, [debouncedUnitSearchTerm]);

    useEffect(() => {
        if (!item_id || !role) return;

        const fetchPlans = async () => {
            setLoadingPlans(true);
            try {
                const response = await axios.get(
                    `/api/filters-plans?item_id=${item_id}&role=${role}&page=${planCurrentPage}&per_page=${plansPerPage}&q=${debouncedPlanSearchTerm}`
                );
                if (response.data && response.data.data) {
                    setPlans(response.data.data);
                    if (response.data.meta && response.data.meta.total) {
                        setPlanTotalPages(
                            Math.ceil(response.data.meta.total / plansPerPage)
                        );
                    } else {
                        setPlanTotalPages(
                            Math.ceil(
                                response.data.data.length / plansPerPage
                            ) || 1
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
        dispatch(setReportDashboardFilters(newFilterState));
        dispatch(setReportDashboardCurrentPage(1));
    };

    const handleResetFilters = () => {
        dispatch(resetReportDashboardFilters());
        dispatch(setReportDashboardFilters({ search: "" }));
        dispatch(setReportDashboardCurrentPage(1));

        if (setLocalSearchInput) {
            setLocalSearchInput("");
        }

        setPlanSearch("");
        setUnitSearch("");

        if (onClose) {
            onClose(false);
        } else if (setIsFilterOpen) {
            setIsFilterOpen(false);
        }
    };

    const handleUnitPageChange = (page) => {
        setUnitCurrentPage(page);
    };

    const handlePlanPageChange = (page) => {
        setPlanCurrentPage(page);
    };

    const renderPaginationButtons = (
        current,
        total,
        onPageChange,
        keyPrefix
    ) => {
        const buttons = [];
        buttons.push(
            <button
                key={`${keyPrefix}-prev`}
                onClick={() => current > 1 && onPageChange(current - 1)}
                disabled={current === 1}
                className={`px-2 py-1 rounded-md ${
                    current === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                قبلی
            </button>
        );

        const startPage = Math.max(1, current - 1);
        const endPage = Math.min(total, current + 1);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={`${keyPrefix}-page-${i}`}
                    onClick={() => onPageChange(i)}
                    className={`px-2 py-1 rounded-md ${
                        current === i
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
                key={`${keyPrefix}-next`}
                onClick={() => current < total && onPageChange(current + 1)}
                disabled={current === total}
                className={`px-2 py-1 rounded-md ${
                    current === total
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
        <div
            ref={boxRef}
            className={`absolute z-10 mt-2 w-72 bg-white border rounded-[8px] shadow ${positionClass}`}
        >
            <div className="p-2 border-b">
                <div className="font-bold mb-2">وضعیت</div>
                <div className="px-2">
                    <select
                        className="w-full p-2 border rounded"
                        value={status || ""}
                        onChange={(e) =>
                            handleFilterChange({ status: e.target.value })
                        }
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
                            value={sub_type || ""}
                            onChange={(e) =>
                                handleFilterChange({ sub_type: e.target.value })
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
                                    )
                                )}
                            {item_id === "3" &&
                                subTypesData.school &&
                                Object.entries(subTypesData.school).map(
                                    ([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    )
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
                                subTypesData.university.map((value, index) => (
                                    <option key={index} value={value}>
                                        {value}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            )}

            {item_id && item_id === "3" && (
                <div className="p-2 border-b">
                    <div className="font-bold mb-2">نوع مربی در مدارس</div>
                    <div className="px-2">
                        <select
                            className="w-full p-2 border rounded"
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
                                )
                            )}
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
                        {loadingPlans && (
                            <div className="flex justify-center items-center py-2">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <div className="max-h-40 overflow-y-auto border rounded">
                            {plans.length > 0
                                ? plans.map((plan) => (
                                      <div
                                          key={plan.id}
                                          className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                              plan_id === String(plan.id)
                                                  ? "bg-[#D9EFFE] text-[#258CC7]"
                                                  : ""
                                          }`}
                                          onClick={() =>
                                              handleFilterChange({
                                                  plan_id: String(plan.id),
                                              })
                                          }
                                      >
                                          {plan.title}
                                      </div>
                                  ))
                                : !loadingPlans && (
                                      <div className="p-2 text-gray-500">
                                          یافت نشد
                                      </div>
                                  )}
                        </div>
                        {planTotalPages > 1 && (
                            <div className="flex justify-center items-center mt-2 gap-1 text-xs">
                                {renderPaginationButtons(
                                    planCurrentPage,
                                    planTotalPages,
                                    handlePlanPageChange,
                                    "plan"
                                )}
                            </div>
                        )}
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
                        {loadingUnits && (
                            <div className="flex justify-center items-center py-2">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <div className="max-h-40 overflow-y-auto border rounded">
                            {units.length > 0
                                ? units.map((unit) => (
                                      <div
                                          key={unit.id}
                                          className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                              unit_id === unit.id
                                                  ? "bg-[#D9EFFE] text-[#258CC7]"
                                                  : ""
                                          }`}
                                          onClick={() =>
                                              handleFilterChange({
                                                  unit_id: unit.id,
                                              })
                                          }
                                      >
                                          {unit.title}
                                      </div>
                                  ))
                                : !loadingUnits && (
                                      <div className="p-2 text-gray-500">
                                          یافت نشد
                                      </div>
                                  )}
                        </div>
                        {unitTotalPages > 1 && (
                            <div className="flex justify-center items-center mt-2 gap-1 text-xs">
                                {renderPaginationButtons(
                                    unitCurrentPage,
                                    unitTotalPages,
                                    handleUnitPageChange,
                                    "unit"
                                )}
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
    );
}

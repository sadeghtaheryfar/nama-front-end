"use client";
import { useEffect, useState } from "react";
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
    const { status, plan_id, unit_id, school_coach_type, sub_type } =
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
                    `/api/unit?item_id=${item_id}&role=${role}&page=${unitFilterCurrentPage}&per_page=${unitsPerPage}&q=${unitFilterSearch}`
                );
                if (response.data && response.data.data) {
                    setUnits(response.data.data);
                    if (response.data.meta && response.data.meta.total) {
                        dispatch(
                            setUnitFilterTotalPages(
                                Math.ceil(
                                    response.data.meta.total / unitsPerPage
                                )
                            )
                        );
                    } else {
                        dispatch(
                            setUnitFilterTotalPages(
                                Math.ceil(
                                    response.data.data.length / unitsPerPage
                                ) || 1
                            )
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
        dispatch(setRequestDashboardFilters(newFilterState));
        dispatch(setRequestDashboardCurrentPage(1));
    };

    const handleResetFilters = () => {
        dispatch(resetRequestDashboardFilters());
        dispatch(setRequestDashboardCurrentPage(1));
        setLocalSearchInput("");
        setPlanSearch("");
        dispatch(setUnitFilterSearch(""));
        dispatch(setUnitFilterCurrentPage(1));
        setLocalUnitSearchInput("");
        onClose(false);
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
            </button>
        );

        const startPage = Math.max(1, unitFilterCurrentPage - 1);
        const endPage = Math.min(
            unitFilterTotalPages,
            unitFilterCurrentPage + 1
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
                </button>
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
            </button>
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
            </button>
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
                </button>
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
            </button>
        );

        return buttons;
    };

    return (
        <div className="absolute z-10 mt-2 w-72 bg-white border rounded-[8px] shadow">
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
                    <div className="font-bold mb-2"> نوع مربی در مدارس</div>
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
                                {renderPlanPaginationButtons()}
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
                            value={localUnitSearchInput}
                            onChange={(e) =>
                                setLocalUnitSearchInput(e.target.value)
                            }
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
                        {unitFilterTotalPages > 1 && (
                            <div className="flex justify-center items-center mt-2 gap-1 text-xs">
                                {renderUnitPaginationButtons()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-2 border-t flex flex-col gap-2">
                <button
                    className="w-full p-2 bg-[#39A894] text-white rounded"
                    onClick={() => onClose(false)}
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

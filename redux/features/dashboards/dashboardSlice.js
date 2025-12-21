import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    banners: {
        data: null,
        itemId: null,
    },
    requestDashboard: {
        item_id: null,
        role: null,
        search: "",
        sort: "created_at",
        direction: "",
        status: null,
        plan_id: null,
        unit_id: null,
        currentPage: 1,
        totalPages: 1,
        school_coach_type: null,
        sub_type: null,
        version: null,
        request_type: null,
        from_date: null,
        to_date: null,
    },
    reportDashboard: {
        item_id: null,
        role: null,
        search: "",
        sort: "created_at",
        direction: "",
        status: null,
        plan_id: null,
        unit_id: null,
        currentPage: 1,
        totalPages: 1,
    },
    headerData: null,
    unitFilter: {
        search: "",
        currentPage: 1,
        totalPages: 1,
    },
};

const dashboardSlice = createSlice({
    name: "dashboards",
    initialState,
    reducers: {
        setRequestDashboardFilters: (state, action) => {
            if (action.payload.request_type !== undefined) {
                if (action.payload.request_type === "single") {
                    state.requestDashboard.single_request = true;
                    state.requestDashboard.normal_request = false;
                } else if (action.payload.request_type === "normal") {
                    state.requestDashboard.single_request = false;
                    state.requestDashboard.normal_request = true;
                } else {
                    state.requestDashboard.single_request = false;
                    state.requestDashboard.normal_request = false;
                }
            } else {
                if (action.payload.request_type === null) {
                    state.requestDashboard.single_request = false;
                    state.requestDashboard.normal_request = false;
                }
            }
            state.requestDashboard = {
                ...state.requestDashboard,
                ...action.payload,
            };
        },
        setBanners: (state, action) => {
            state.banners.data = action.payload.data;
            state.banners.itemId = action.payload.itemId;
        },
        setRequestDashboardCurrentPage: (state, action) => {
            state.requestDashboard.currentPage = action.payload;
        },
        setRequestDashboardTotalPages: (state, action) => {
            state.requestDashboard.totalPages = action.payload;
        },
        resetRequestDashboardFilters: (state) => {
            state.requestDashboard = {
                ...initialState.requestDashboard,
                item_id: state.requestDashboard.item_id,
                role: state.requestDashboard.role,
            };
            state.unitFilter = {
                ...initialState.unitFilter,
            };
        },

        setReportDashboardFilters: (state, action) => {
            state.reportDashboard = {
                ...state.reportDashboard,
                ...action.payload,
            };
        },
        setReportDashboardCurrentPage: (state, action) => {
            state.reportDashboard.currentPage = action.payload;
        },
        setReportDashboardTotalPages: (state, action) => {
            state.reportDashboard.totalPages = action.payload;
        },
        resetReportDashboardFilters: (state) => {
            state.reportDashboard = {
                ...initialState.reportDashboard,
                item_id: state.reportDashboard.item_id,
                role: state.reportDashboard.role,
            };
        },

        setHeaderData: (state, action) => {
            state.headerData = action.payload;
        },
        setGlobalDashboardParams: (state, action) => {
            state.requestDashboard.item_id = action.payload.item_id;
            state.requestDashboard.role = action.payload.role;
            state.reportDashboard.item_id = action.payload.item_id;
            state.reportDashboard.role = action.payload.role;
        },
        setUnitFilterSearch: (state, action) => {
            state.unitFilter.search = action.payload;
        },
        setUnitFilterCurrentPage: (state, action) => {
            state.unitFilter.currentPage = action.payload;
        },
        setUnitFilterTotalPages: (state, action) => {
            state.unitFilter.totalPages = action.payload;
        },
    },
});

export const {
    setRequestDashboardFilters,
    setRequestDashboardCurrentPage,
    setRequestDashboardTotalPages,
    resetRequestDashboardFilters,
    setReportDashboardFilters,
    setReportDashboardCurrentPage,
    setReportDashboardTotalPages,
    resetReportDashboardFilters,
    setHeaderData,
    setBanners,
    setGlobalDashboardParams,
    setUnitFilterSearch,
    setUnitFilterCurrentPage,
    setUnitFilterTotalPages,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

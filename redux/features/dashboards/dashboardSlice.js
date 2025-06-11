// redux/features/dashboards/dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
};

const dashboardSlice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {
    setRequestDashboardFilters: (state, action) => {
      state.requestDashboard = { ...state.requestDashboard, ...action.payload };
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
    },

    setReportDashboardFilters: (state, action) => {
      state.reportDashboard = { ...state.reportDashboard, ...action.payload };
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
  setGlobalDashboardParams,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
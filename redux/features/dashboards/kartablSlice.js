// redux/features/kartabl/kartablSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // State specific to the Kartabl (صورت حساب ها) page
  item_id: null,
  role: null,
  search: "",
  sort: "created_at",
  direction: "desc", // Default direction for 'جدید ترین'
  status: null,
  version: null,
  request_type: null, // 'single' or 'normal' or null for 'همه'
  from_date: null,
  to_date: null,
  currentPage: 1,
  totalPages: 1,
  // These booleans are derived from request_type, but explicitly
  // kept in state to match the API query parameters directly.
  single_request: false,
  normal_request: false,
  
  requests: [], // To store the fetched requests for this specific page
  total_request_amount: 0,
  total_report_amount: 0,
  request_and_report_total_amount: 0,
  versions: {}, // To store available versions from API response
  headerData: null, // Header data for this page, if it's specific to Kartabl
};

const kartablSlice = createSlice({
  name: 'kartabl',
  initialState,
  reducers: {
    setKartablFilters: (state, action) => {
      // Merge new filters into the kartabl state
      // Use Object.assign to directly update the state object for simplicity
      // and ensure that properties not in action.payload are retained.
      Object.assign(state, action.payload);

      // Handle mutual exclusivity for request_type
      if (action.payload.request_type !== undefined) {
        if (action.payload.request_type === "single") {
          state.single_request = true;
          state.normal_request = false;
        } else if (action.payload.request_type === "normal") {
          state.single_request = false;
          state.normal_request = true;
        } else { // If 'همه' or null is selected
          state.single_request = false;
          state.normal_request = false;
        }
      }
    },
    setKartablCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setKartablTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    resetKartablFilters: (state) => {
      // Reset only filters, keep item_id and role as they are part of initial routing context
      // Create a new object by spreading initialState and then overriding item_id/role
      Object.assign(state, {
        ...initialState,
        item_id: state.item_id,
        role: state.role,
        currentPage: 1, // Reset current page to 1
        requests: [], // Clear fetched data
        total_request_amount: 0,
        total_report_amount: 0,
        request_and_report_total_amount: 0,
        versions: {}, // Clear versions
      });
    },
    setKartablData: (state, action) => {
        // This reducer is to store the actual fetched data (requests array and totals)
        state.requests = action.payload.data;
        state.total_request_amount = action.payload.total_request_amount;
        state.total_report_amount = action.payload.total_report_amount;
        state.request_and_report_total_amount = action.payload.request_and_report_total_amount;
        state.versions = action.payload.versions || {}; // Store versions for filter dropdown
    },
    setKartablHeaderData: (state, action) => {
      state.headerData = action.payload;
    },
    setKartablGlobalParams: (state, action) => {
      // These are parameters passed from the URL to initialize the page's context
      state.item_id = action.payload.item_id;
      state.role = action.payload.role;
    },
  },
});

export const {
  setKartablFilters,
  setKartablCurrentPage,
  setKartablTotalPages,
  resetKartablFilters,
  setKartablData,
  setKartablHeaderData,
  setKartablGlobalParams,
} = kartablSlice.actions;

export default kartablSlice.reducer;
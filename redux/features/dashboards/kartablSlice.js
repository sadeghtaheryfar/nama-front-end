// redux/features/kartabl/kartablSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  item_id: null,
  role: null,
  search: "",
  sort: "created_at",
  direction: "desc",
  status: null,
  version: null,
  request_type: null, 
  from_date: null,
  to_date: null,
  currentPage: 1,
  totalPages: 1,
  single_request: false,
  normal_request: false,
  
  requests: [], 
  total_request_amount: 0,
  total_report_amount: 0,
  request_and_report_total_amount: 0,
  versions: {},
  headerData: null, 
};

const kartablSlice = createSlice({
  name: 'kartabl',
  initialState,
  reducers: {
    setKartablFilters: (state, action) => {
      Object.assign(state, action.payload);

      if (action.payload.request_type !== undefined) {
        if (action.payload.request_type === "single") {
          state.single_request = true;
          state.normal_request = false;
        } else if (action.payload.request_type === "normal") {
          state.single_request = false;
          state.normal_request = true;
        } else { 
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
      Object.assign(state, {
        ...initialState,
        item_id: state.item_id,
        role: state.role,
        currentPage: 1,
        requests: [],
        total_request_amount: 0,
        total_report_amount: 0,
        request_and_report_total_amount: 0,
        versions: {},
      });
    },
    setKartablData: (state, action) => {
        state.requests = action.payload.data;
        state.total_request_amount = action.payload.total_request_amount;
        state.total_report_amount = action.payload.total_report_amount;
        state.request_and_report_total_amount = action.payload.request_and_report_total_amount;
        state.versions = action.payload.versions || {};
    },
    setKartablHeaderData: (state, action) => {
      state.headerData = action.payload;
    },
    setKartablGlobalParams: (state, action) => {
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
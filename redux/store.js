import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboards/dashboardSlice';
import kartablReducer from './features/dashboards/kartablSlice'; 

export const store = configureStore({
    reducer: {
        dashboards: dashboardReducer,
        kartabl: kartablReducer,
    },
});
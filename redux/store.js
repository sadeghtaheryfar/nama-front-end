import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboards/dashboardSlice';
import kartablReducer from './features/dashboards/kartablSlice'; 
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        dashboards: dashboardReducer,
        kartabl: kartablReducer,
        user: userReducer,
    },
});
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboards/dashboardSlice';

export const store = configureStore({
    reducer: {
        dashboards: dashboardReducer,
    },
});
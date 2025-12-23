"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Toaster } from "react-hot-toast";
import AuthGuard from "./AuthGuard";
import GlobalErrorBoundary from "./GlobalErrorBoundary";

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <GlobalErrorBoundary>
                <AuthGuard>
                    <Toaster />
                    {children}
                </AuthGuard>
            </GlobalErrorBoundary>
        </Provider>
    );
}

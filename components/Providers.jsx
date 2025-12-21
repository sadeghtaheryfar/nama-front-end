"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Toaster } from "react-hot-toast";
import AuthGuard from "./AuthGuard";

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <AuthGuard>
                <Toaster />
                {children}
            </AuthGuard>
        </Provider>
    );
}

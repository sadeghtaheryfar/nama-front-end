"use client";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Toaster } from "react-hot-toast";
import AuthGuard from "../components/AuthGuard";
import { Suspense } from "react";

export default function RootLayout({ children }) {
    return (
        <html dir="rtl" lang="fa">
            <head>
                <title>نما</title>
                <link
                    rel="shortcut icon"
                    href="/assets/logo-arman.png"
                    type="image/x-icon"
                />
            </head>
            <body style={{ position: "relative" }}>
                <Provider store={store}>
                    <Suspense fallback={null}>
                        <AuthGuard>
                            <Toaster />
                            {children}
                        </AuthGuard>
                    </Suspense>
                </Provider>
            </body>
        </html>
    );
}

"use client";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
        this.reqInterceptor = null;
        this.resInterceptor = null;
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.logError({
            message: error?.message,
            stack: error?.stack,
            componentStack: errorInfo?.componentStack,
            source: "ReactRenderError",
        });
    }

    componentDidMount() {
        window.addEventListener("error", this.handleWindowError);
        window.addEventListener(
            "unhandledrejection",
            this.handlePromiseRejection
        );

        this.setupAxiosInterceptors();
    }

    componentWillUnmount() {
        window.removeEventListener("error", this.handleWindowError);
        window.removeEventListener(
            "unhandledrejection",
            this.handlePromiseRejection
        );

        if (this.reqInterceptor !== null)
            axios.interceptors.request.eject(this.reqInterceptor);
        if (this.resInterceptor !== null)
            axios.interceptors.response.eject(this.resInterceptor);
    }

    handleWindowError = (event) => {
        this.logError({
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            source: "WindowError",
        });
    };

    handlePromiseRejection = (event) => {
        this.logError({
            message: event.reason?.message || "Unhandled Rejection",
            stack: event.reason?.stack,
            source: "UnhandledPromiseRejection",
        });
    };

    setupAxiosInterceptors = () => {
        this.reqInterceptor = axios.interceptors.request.use((config) => {
            const token = Cookies.get("token");
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

        this.resInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const url = error?.config?.url || "";

                if (
                    url.includes("client-log") ||
                    url.includes("/api/profile")
                ) {
                    return Promise.reject(error);
                }

                if (error?.response?.status !== 401) {
                    await this.logError({
                        message: error.message,
                        url: url,
                        status: error?.response?.status,
                        data: error?.response?.data,
                        source: "AxiosError",
                    });
                }
                return Promise.reject(error);
            }
        );
    };

    // --- تابع اصلی ارسال لاگ به سرور ---
    logError = async (errorContext) => {
        try {
            const LOG_API_URL = "http://arman.armaniran.org/api/v1/client-log";
            const token = Cookies.get("token");

            const formdata = new FormData();
            formdata.append("context", JSON.stringify(errorContext));
            formdata.append("client_version", "1.0.0");
            formdata.append("platform", "web");

            // ارسال بدون انتظار (Fire & Forget) برای جلوگیری از کندی
            axios
                .post(LOG_API_URL, formdata, {
                    headers: {
                        Accept: "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                })
                .catch((e) => console.error("Silent Log Fail:", e));
        } catch (err) {
            console.error("Log System Error:", err);
        }
    };

    render() {
        if (this.state.hasError) {
            // میتوانید یک کامپوننت گرافیکی برای خطای مرگبار اینجا برگردانید
            return null;
        }
        return this.props.children;
    }
}

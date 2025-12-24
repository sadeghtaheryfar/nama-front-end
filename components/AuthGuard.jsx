"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

export default function AuthGuard({ children }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCriticalError, setHasCriticalError] = useState(false);

    const sendClientLog = async (errorContext) => {
        try {
            const token = Cookies.get("token");
            const formdata = new FormData();
            formdata.append("context", JSON.stringify(errorContext));
            formdata.append("client_version", "1.0.0");
            formdata.append("platform", "web");

            await axios.post(
                "http://arman.armaniran.org/api/v1/client-log",
                formdata,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.error("Logging failed:", err);
        }
    };

    const handleAuthFailure = async () => {
        Cookies.remove("token");
        try {
            const { data } = await axios.get("/api/url");
            if (data?.verify_url) {
                window.location.href = data.verify_url;
            } else {
                setHasCriticalError(true);
            }
        } catch (error) {
            setHasCriticalError(true);
        }
    };

    useEffect(() => {
        const token = Cookies.get("token");

        const handleGlobalError = (event) => {
            sendClientLog({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                source: "WindowError",
            });
            setHasCriticalError(true);
        };

        const handlePromiseRejection = (event) => {
            sendClientLog({
                message: event.reason?.message || "Unhandled Promise Rejection",
                stack: event.reason?.stack,
                source: "UnhandledRejection",
            });
            setHasCriticalError(true);
        };

        window.addEventListener("error", handleGlobalError);
        window.addEventListener("unhandledrejection", handlePromiseRejection);

        const reqInterceptor = axios.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const resInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                // شرط عدم لاگ کردن برای روت پروفایل و خودِ لاگ
                if (
                    error?.config?.url?.includes("client-log") ||
                    error?.config?.url?.includes("/api/profile")
                ) {
                    return Promise.reject(error);
                }

                if (error?.response?.status === 401) {
                    await handleAuthFailure();
                } else {
                    await sendClientLog({
                        message: error.message,
                        url: error?.config?.url,
                        status: error?.response?.status,
                        data: error?.response?.data,
                        source: "AxiosInterceptor",
                    });
                    setHasCriticalError(true);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
            window.removeEventListener("error", handleGlobalError);
            window.removeEventListener(
                "unhandledrejection",
                handlePromiseRejection
            );
        };
    }, []);

    useEffect(() => {
        const validateAuth = async () => {
            if (user && Object.keys(user).length > 0) {
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await axios.get(`/api/profile`);
                dispatch(setUser(data));
                setIsLoading(false);
            } catch (error) {
                if (
                    error?.response?.status === 401 ||
                    error?.response?.status === 403 ||
                    error?.response?.status === 500
                ) {
                    await handleAuthFailure();
                } else {
                    setIsLoading(false);
                }
            }
        };

        validateAuth();
    }, [user, dispatch]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-[9999] text-white">
                <p className="text-lg">در حال اعتبارسنجی...</p>
            </div>
        );
    }

    return <>{children}</>;
}

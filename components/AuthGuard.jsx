"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import SystemError from "./SystemError";

export default function AuthGuard({ children }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCriticalError, setHasCriticalError] = useState(false);

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

        const reqInterceptor = axios.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const resInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error?.response?.status === 401) {
                    await handleAuthFailure();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
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

    if (hasCriticalError) {
        return <SystemError />;
    }

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-[9999] text-white">
                <p className="text-lg">در حال اعتبارسنجی...</p>
            </div>
        );
    }

    return <>{children}</>;
}

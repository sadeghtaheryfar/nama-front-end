"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function AuthGuard({ children }) {
    const params = useSearchParams();
    const [isChecking, setIsChecking] = useState(true);
    const [axiosActiveRequests, setAxiosActiveRequests] = useState(0);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use((config) => {
            setAxiosActiveRequests((prev) => prev + 1);
            const token = Cookies.get("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                setAxiosActiveRequests((prev) => prev - 1);
                return response;
            },
            (error) => {
                setAxiosActiveRequests((prev) => prev - 1);
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    useEffect(() => {
        const validateAuth = async () => {
            const tokenFromParams = params.get("jwt");

            if (tokenFromParams) {
                Cookies.set("token", tokenFromParams);
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete("jwt");
                window.history.replaceState(null, "", newUrl.toString());
                setIsChecking(false);
                return;
            }

            const accessToken = Cookies.get("token");

            if (!accessToken) {
                try {
                    const { data } = await axios.get("/api/url");
                    if (data?.verify_url) {
                        window.location.href = data.verify_url;
                    }
                } catch (error) {
                    setIsChecking(false);
                }
            } else {
                try {
                    await axios.get(`/api/profile`);
                    setIsChecking(false);
                } catch (error) {
                    Cookies.remove("token");
                    try {
                        const { data } = await axios.get("/api/url");
                        if (data?.verify_url) {
                            window.location.href = data.verify_url;
                        }
                    } catch (urlError) {
                        setIsChecking(false);
                    }
                }
            }
        };

        validateAuth();
    }, []);

    const showLoading = isChecking || axiosActiveRequests > 0;

    return (
        <>
            {showLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-[9999] text-white loading-container-main">
                    <p className="text-lg">لطفاً صبر کنید ...</p>
                </div>
            )}
            {children}
        </>
    );
}

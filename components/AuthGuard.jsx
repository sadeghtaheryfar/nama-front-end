"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useSearchParams } from "next/navigation";

export default function AuthGuard({ children }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const urlToken =
                searchParams.get("jwt") || searchParams.get("token");
            let token = Cookies.get("token");

            if (urlToken) {
                token = urlToken;
                Cookies.set("token", token, { expires: 365, path: "/" });
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
            }

            if (!token) {
                if (sessionStorage.getItem("auth_retrying")) {
                    setIsError(true);
                    setIsLoading(false);
                    return;
                }
                sessionStorage.setItem("auth_retrying", "true");
                return redirectToLogin();
            }

            if (!user || Object.keys(user).length === 0) {
                await fetchUserProfile(token);
            } else {
                sessionStorage.removeItem("auth_retrying");
                setIsLoading(false);
            }
        } catch (error) {
            if (sessionStorage.getItem("auth_retrying")) {
                setIsError(true);
                setIsLoading(false);
            } else {
                sessionStorage.setItem("auth_retrying", "true");
                redirectToLogin();
            }
        }
    };

    const fetchUserProfile = async (token) => {
        try {
            const { data } = await axios.get(`/api/profile`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            sessionStorage.removeItem("auth_retrying");
            dispatch(setUser(data));
            setIsLoading(false);
        } catch (error) {
            Cookies.remove("token");
            if (sessionStorage.getItem("auth_retrying")) {
                setIsError(true);
                setIsLoading(false);
            } else {
                sessionStorage.setItem("auth_retrying", "true");
                redirectToLogin();
            }
        }
    };

    const redirectToLogin = async () => {
        try {
            const { data } = await axios.get(`/api/url`);
            if (data?.verify_url) {
                window.location.href = data.verify_url;
            }
        } catch (error) {
            console.error("Redirect Error:", error);
        }
    };

    const handleRetry = () => {
        sessionStorage.removeItem("auth_retrying");
        setIsError(false);
        setIsLoading(true);
        redirectToLogin();
    };

    if (isError) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[9999] text-white">
                <p className="text-lg font-bold mb-4">احراز هویت انجام نشد</p>
                <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 font-bold transition-colors"
                >
                    تلاش دوباره
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[9999] text-white">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-bold">در حال اعتبارسنجی...</p>
            </div>
        );
    }

    return <>{children}</>;
}

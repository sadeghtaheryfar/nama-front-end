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
            (error) => {
                if (error?.response?.status === 401) {
                    Cookies.remove("token");
                    window.location.reload();
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
                    Cookies.remove("token");
                    window.location.reload();
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

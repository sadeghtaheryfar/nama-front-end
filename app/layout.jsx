"use client";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { relative } from "path";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [axiosActiveRequests, setAxiosActiveRequests] = useState(0);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      setAxiosActiveRequests((prev) => prev + 1);
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
    const fetchInitial = async () => {
      const tokenFromParams = params.get("jwt");
      if (tokenFromParams) {
        Cookies.set("token", tokenFromParams);
        window.history.replaceState(null, "", "/");
        setLoading(false);
        return;
      }

      const accessToken = Cookies.get("token");

      if (!accessToken) {
        try {
          const url = await axios.get("/api/url");
          if (url.data) {
            router.push(url.data.verify_url);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await axios.get(`/api/profile`, {
            headers: {
              Accept: "application/json",
              Authorization: `bearer ${accessToken}`,
            },
          });
        } catch (error) {
          console.log("Invalid token:", error);
          Cookies.remove("token");
          try {
            const url = await axios.get("/api/url");
            if (url.data) {
              router.push(url.data.verify_url);
            }
          } catch (urlError) {
            console.log(urlError);
          }
        }
      }

      setLoading(false);
    };

    fetchInitial();
  }, []);

  const showGlobalLoading = loading || axiosActiveRequests > 0;

  return (
    <html dir="rtl" lang="fa">
      <head>
        <title>نما</title>
        <link rel="shortcut icon" href="/assets/logo-arman.png" type="image/x-icon" />
      </head>
      <body style={{ position:relative }}>
        <Provider store={store}>
          {showGlobalLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50 text-white loading-container-main">
              <p className="text-lg">لطفاً صبر کنید ...</p>
            </div>
          )}
          
          <Toaster/>

          {!loading && children}
        </Provider>
      </body>
    </html>
  );
}
"use client";

import React from "react";

const SystemError = () => {
    const handleHardReset = () => {
        if (typeof window !== "undefined") {
            localStorage.clear();
            sessionStorage.clear();

            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie =
                    name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }

            if ("caches" in window) {
                caches.keys().then((names) => {
                    names.forEach((name) => {
                        caches.delete(name);
                    });
                });
            }

            window.location.href = "/";
        }
    };

    return (
        <div className="error-wrapper">
            <div className="error-container">
                <div className="icon-box">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1>مشکل در سیستم</h1>
                <p>
                    متاسفانه مشکلی پیش آمده است. لطفا با پشتیبانی در ارتباط
                    باشید.
                </p>
                <button className="retry-btn" onClick={handleHardReset}>
                    تلاش دوباره
                </button>
            </div>

            <style jsx>{`
                .error-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    color: #333;
                    direction: rtl;
                }

                .error-container {
                    background: white;
                    padding: 3rem;
                    border-radius: 20px;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                    transition: transform 0.3s ease;
                }

                .icon-box {
                    width: 80px;
                    height: 80px;
                    background-color: #fef2f2;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }

                .icon-box svg {
                    width: 40px;
                    height: 40px;
                    color: #ef4444;
                }

                h1 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: #1f2937;
                    font-family: inherit;
                }

                p {
                    color: #6b7280;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                    font-size: 0.95rem;
                    font-family: inherit;
                }

                .retry-btn {
                    background-color: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    font-size: 1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background-color 0.2s, transform 0.1s;
                    width: 100%;
                    font-weight: bold;
                    font-family: inherit;
                }

                .retry-btn:hover {
                    background-color: #1d4ed8;
                }

                .retry-btn:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};

export default SystemError;

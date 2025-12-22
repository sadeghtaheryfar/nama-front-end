"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-50 text-center px-4"
            dir="rtl"
        >
            {/* بک‌گراند 404 بزرگ و محو */}
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] sm:text-[20rem] font-black text-gray-300 select-none opacity-50 blur-sm animate-pulse">
                404
            </h1>

            <div className="relative z-10 space-y-6 max-w-lg">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 mx-auto animate-bounce">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12 text-blue-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                    </svg>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    ای وای! اینجا بن‌بسته... 🚧
                </h2>

                <p className="text-gray-500 text-lg leading-relaxed">
                    متأسفیم، صفحه‌ای که دنبالش می‌گردید احتمالا حذف شده یا آدرس
                    رو اشتباه وارد کردید.
                </p>

                <div className="pt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 ml-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                        بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    );
}

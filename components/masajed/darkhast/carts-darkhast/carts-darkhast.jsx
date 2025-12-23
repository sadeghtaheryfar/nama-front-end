"use client";
import Image from "next/image";
import Link from "next/link";
import ButtonSabt from "../button-sabt/button-sabt";
import CartsDarkhastFuture from "./carts-darkhast-future";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CartsDarkhastActive from "./carts-darkhast-active";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useDebounce from "../../../utils/useDebounce";

const CartsDarkhast = () => {
    const [futureCarts, setFutureCarts] = useState([]);
    const [futureCartsLoading, setFutureCartsLoading] = useState(false);
    const [activeCartsLoading, setActiveCartsLoading] = useState(false);
    const [activeCarts, setActiveCarts] = useState([]);
    const pathname = usePathname();
    const pathSegments = pathname.split("/");
    const itemId = pathSegments[1];

    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const isInitialMount = useRef(true);

    useEffect(() => {
        const qFromUrl = searchParams.get("q");
        setSearchTerm(qFromUrl || "");

        const pageFromUrl = Number(searchParams.get("page")) || 1;
        setCurrentPage(pageFromUrl);

        isInitialMount.current = false;
    }, [searchParams]);

    useEffect(() => {
        const fetchFutureCarts = async () => {
            setFutureCartsLoading(true);
            try {
                const carts = await axios.get(
                    `/api/future?item_id=${itemId}&role=mosque_head_coach`
                );
                if (carts.data) {
                    setFutureCarts(carts.data.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setFutureCartsLoading(false);
            }
        };

        fetchFutureCarts();
    }, [itemId]);

    useEffect(() => {
        const fetchActiveCarts = async () => {
            if (!itemId) return;
            setActiveCartsLoading(true);
            try {
                const queryParams = new URLSearchParams();
                queryParams.append("item_id", itemId);
                queryParams.append("role", "mosque_head_coach");
                queryParams.append("page", currentPage.toString());
                queryParams.append("per_page", itemsPerPage.toString());

                if (debouncedSearchTerm) {
                    queryParams.append("q", debouncedSearchTerm);
                }

                const active = await axios.get(
                    `/api/active?${queryParams.toString()}`
                );
                if (active.data) {
                    setActiveCarts(active.data.data);
                    if (active.data.meta && active.data.meta.total) {
                        setTotalPages(
                            Math.ceil(active.data.meta.total / itemsPerPage)
                        );
                    } else {
                        setTotalPages(
                            active.data.data.length > 0
                                ? Math.ceil(
                                      active.data.data.length / itemsPerPage
                                  )
                                : 1
                        );
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setActiveCartsLoading(false);
            }
        };

        fetchActiveCarts();

        const current = new URLSearchParams();
        current.set("page", currentPage.toString());
        if (debouncedSearchTerm) {
            current.set("q", debouncedSearchTerm);
        }

        const newQueryString = current.toString();
        const currentQueryString = searchParams.toString();

        if (!isInitialMount.current && newQueryString !== currentQueryString) {
            router.push(`${pathname}?${newQueryString}`, undefined, {
                shallow: true,
            });
        }
    }, [currentPage, itemId, debouncedSearchTerm, pathname, router]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        document
            .getElementById("future-carts-section")
            .scrollIntoView({ behavior: "smooth" });
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        buttons.push(
            <button
                key="prev"
                onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                قبلی
            </button>
        );

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 rounded-md hover:bg-gray-100"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="px-2">
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === i
                            ? "bg-[#39A894] text-white"
                            : "hover:bg-gray-100"
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="ellipsis2" className="px-2">
                        ...
                    </span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded-md hover:bg-gray-100"
                >
                    {totalPages}
                </button>
            );
        }

        buttons.push(
            <button
                key="next"
                onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#39A894] hover:bg-gray-100"
                }`}
            >
                بعدی
            </button>
        );

        return buttons;
    };

    return (
        <>
            <div className="mt-7">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="جستجو در درخواست‌ها..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full max-w-md p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39A894] focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 md:mt-9 lg:mt-11 xl:mt-12 gap-6 md:gap-7 lg:gap-9 2xl:gap-x-10">
                    {activeCartsLoading && (
                        <section className="flex justify-center items-center flex-col w-full h-[20rem]">
                            <div className="w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-full animate-slide"></div>
                                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer"></div>
                            </div>
                        </section>
                    )}

                    {activeCarts &&
                        !activeCartsLoading &&
                        activeCarts.length >= 1 &&
                        activeCarts.map((item, index) => {
                            return (
                                <CartsDarkhastActive key={index} item={item} />
                            );
                        })}

                    {!activeCartsLoading &&
                        activeCarts.length === 0 &&
                        (debouncedSearchTerm ? (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                نتیجه‌ای برای جستجوی شما یافت نشد.
                            </div>
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                درخواستی برای نمایش وجود ندارد
                            </div>
                        ))}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 mb-4 gap-2 text-sm">
                    {renderPaginationButtons()}
                </div>
            )}
            <div id="future-carts-section" className="mt-8">
                <hr className="h-2 mb-5 xl:mt-12" />
                <h2 className="text-lg font-semibold md:my-4 lg:my-7 xl:my-9">
                    درخواست های آینده
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7 lg:gap-9 2xl:gap-10">
                    {futureCartsLoading && (
                        <section className="flex justify-center items-center flex-col w-full h-[8rem]">
                            <div className="w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-full animate-slide"></div>
                                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer"></div>
                            </div>
                        </section>
                    )}

                    {futureCarts &&
                        futureCarts.length >= 1 &&
                        futureCarts.map((item, index) => {
                            return (
                                <CartsDarkhastFuture
                                    key={index}
                                    image={item.image}
                                    title={item.title}
                                    id={item.id}
                                    body={item.body}
                                />
                            );
                        })}

                    {!futureCartsLoading && futureCarts.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            درخواستی برای نمایش وجود ندارد
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartsDarkhast;

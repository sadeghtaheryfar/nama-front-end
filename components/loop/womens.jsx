"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const schools = () => {
    const [loading, setLoading] = useState();
    const [data, setData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    const itemId = 4;
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await axios.get(`/api/loop/index?item_id=${itemId}&role=mosque_head_coach&page=${currentPage}&per_page=${itemsPerPage}`);
                if (data.data) {
                    setData(data.data);
                    
                    if (data.data.meta && data.data.meta.total) {
                        setTotalPages(Math.ceil(data.data.meta.total / itemsPerPage));
                    } else {
                        setTotalPages(Math.ceil(data.data.data.length / itemsPerPage) || 1);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemId, searchParams]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        document.getElementById("future-carts-section").scrollIntoView({ behavior: "smooth" });
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        buttons.push(
        <button
            key="prev"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
            currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#EB82DA] hover:bg-gray-100"
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
                ? "bg-[#EB82DA] text-white"
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
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#EB82DA] hover:bg-gray-100"
            }`}
        >
            بعدی
        </button>
        );
        
        return buttons;
    };

    const [loadingExport, setLoadingExport] = useState();
    const exportfile = () => {
        setLoadingExport(true);
        const url = `https://arman.armaniran.org/api/v1/rings/export?item_id=${itemId}&role=mosque_head_coach`;

        fetch(url, {
            method: 'GET',
            headers: {
                // **This is where you add the token**
                Authorization: `bearer ${Cookies.get("token")}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status} - ${text}`);
                });
            }
            return response.blob();
        })
        .then(blob => {
            if (blob.size === 0) {
                toast.error('فایل دریافت شده خالی است. لطفاً با پشتیبانی تماس بگیرید.');
                return;
            }

            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'exported_data.xlsx';
            
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            toast.success("فایل با موفقیت دانلود شد.");
        })
        .catch(error => {
            console.error('خطا در دانلود فایل:', error);
            toast.error(`خطا در دانلود فایل: ${error.message || 'مشکل ناشناخته'}.`);
        })
        .finally(() => {
            setLoadingExport(false);
        });
    };
    

    return (
        <>
            {data && (
                <section className="mt-[2rem]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-[14px] lg:text-[20px]">مرکز تعالی بانوان</h3>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={(e) => exportfile()} className="hover:scale-[1.04] active:scale-[1] transition-[0.9s] py-[0.5rem] text-[#EB82DA] px-[0.75rem] lg:px-[1rem] rounded-[0.5rem] shadow-lg flex justify-center items-center gap-2 text-[10px] lg:text-[14px]">
                                <span className="hidden lg:block">{loadingExport ? 'صبر کنید ...' : 'خروجی اکسل مرکز تعالی بانوان'}</span>

                                <span className="lg:hidden">{loadingExport ? 'صبر کنید ...' : 'اکسل'}</span>

                                <svg className="w-[18px] lg:w-[24px] h-[18px] lg:h-[24px]" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.6563 16.864C19.0722 16.5388 19.5299 16.285 20.0432 16.1615C20.2778 16.1048 20.3537 16.0153 20.3537 15.7683C20.3469 13.1463 20.348 10.5243 20.3594 7.90116C20.3639 6.92329 20.0908 6.06326 19.3883 5.36187C17.9209 3.89563 16.4547 2.42713 14.9862 0.963152C14.3256 0.304818 13.5267 -0.00225376 12.5908 1.24497e-05C9.43849 0.0090773 6.28619 -0.00225404 3.13502 0.00681081C1.44896 0.0113432 0.0167117 1.45039 0.00424749 3.13531C-0.00255115 3.99421 0.00198252 4.85311 0.00198252 5.712C0.00198252 11.1011 -0.00594839 16.489 0.00991509 21.878C0.0133144 23.0179 0.569668 23.8904 1.51355 24.5159C2.43816 25.1289 3.47835 24.9861 4.52081 24.9839C4.35538 24.4547 4.30892 23.9448 4.47889 23.4349C4.53214 23.2751 4.44489 23.2627 4.32365 23.2638C3.98372 23.2672 3.64379 23.2683 3.30385 23.2638C2.90613 23.2593 2.54241 23.1584 2.2342 22.8876C1.81835 22.5228 1.74357 22.0491 1.7447 21.529C1.75376 19.3591 1.74923 17.1881 1.74923 15.0182C1.74923 11.1113 1.7583 7.2043 1.7413 3.29735C1.7379 2.49965 2.33845 1.73933 3.2472 1.745C5.95532 1.76086 8.66457 1.75293 11.3727 1.74613C11.5744 1.74613 11.6254 1.80845 11.6231 2.00334C11.6129 2.91889 11.6129 3.83444 11.6197 4.74999C11.6231 5.23836 11.5665 5.73353 11.7024 6.21057C12.1727 7.8547 13.3092 8.7136 15.0224 8.72493C16.0887 8.73173 17.1549 8.7306 18.2212 8.7272C18.6574 8.72606 18.5894 8.71813 18.5906 9.08639C18.594 11.5781 18.5917 14.0687 18.5951 16.5604C18.5963 16.6533 18.5521 16.7632 18.6563 16.864ZM18.0093 6.97428C16.9725 6.97768 15.9357 6.97655 14.8989 6.97541C13.9981 6.97428 13.3749 6.34994 13.3726 5.44685C13.3704 4.29675 13.3726 3.14665 13.3726 1.97842C13.5528 1.99655 13.6661 2.10533 13.7749 2.21297C15.2366 3.67015 16.6949 5.12959 18.1543 6.58903C18.2529 6.68761 18.3322 6.80091 18.3844 6.94029C18.2495 7.00034 18.1271 6.97428 18.0093 6.97428Z" fill="#EB82DA"/>
                                <path d="M22.8819 20.3948C22.3403 20.2939 21.7896 20.3551 21.2435 20.3438C20.7506 20.3336 20.3619 20.0832 20.3653 19.7636C20.3698 19.4532 20.7302 19.2095 21.2242 19.1948C21.5641 19.1857 21.9041 19.1914 22.244 19.1914C22.8479 19.1914 23.4519 19.1982 24.0558 19.1891C24.636 19.1801 25.0008 18.8175 24.9895 18.2815C24.9793 17.783 24.6043 17.451 24.0468 17.4498C23.5652 17.4487 23.0836 17.4498 22.465 17.4498C21.9539 17.4849 21.3013 17.3898 20.6542 17.5031C19.6843 17.673 18.8356 18.4481 18.6611 19.3251C18.405 20.618 19.3387 21.8463 20.7177 22.0468C21.2922 22.1307 21.8667 22.0774 22.4412 22.099C22.8547 22.1148 23.2275 22.3675 23.2423 22.6417C23.2593 22.9567 22.9488 23.2105 22.4785 23.2434C21.7715 23.2921 21.0633 23.2615 20.3562 23.2604C20.0356 23.2604 19.7138 23.2445 19.3954 23.2717C18.9421 23.3091 18.5875 23.7182 18.5999 24.1499C18.6124 24.5997 18.9954 24.9906 19.4622 24.9952C20.4718 25.0042 21.4814 24.9986 22.4921 24.994C22.8649 24.9929 23.2207 24.9 23.5607 24.7527C24.8286 24.2054 25.3612 22.8207 24.7334 21.6616C24.3357 20.9285 23.6808 20.5443 22.8819 20.3948Z" fill="#EB82DA"/>
                                <path d="M12.0266 18.8492C12.1807 18.6611 12.2396 18.4311 12.1954 18.1841C12.132 17.8272 11.9314 17.5813 11.579 17.4838C11.2051 17.3796 10.8878 17.4884 10.6453 17.7898C10.1536 18.3994 9.66065 19.0067 9.18475 19.6288C9.03858 19.8203 8.9706 19.7852 8.84256 19.6209C8.36779 19.0101 7.88508 18.4062 7.39785 17.8068C7.06131 17.3921 6.54008 17.3286 6.14236 17.6391C5.75371 17.9428 5.70612 18.4719 6.04038 18.8957C6.59561 19.5982 7.14743 20.3053 7.72191 20.9931C7.88168 21.1846 7.85562 21.2899 7.71285 21.4633C7.14969 22.1477 6.59901 22.8423 6.05172 23.5392C5.70952 23.9743 5.74804 24.4898 6.1299 24.7969C6.53782 25.1244 7.06358 25.0496 7.42391 24.6054C7.89868 24.0196 8.37572 23.4338 8.83462 22.8355C8.98646 22.6384 9.06351 22.6667 9.20175 22.8434C9.66972 23.4474 10.1536 24.0389 10.6295 24.6371C10.8108 24.8649 11.0385 24.9941 11.3331 24.9929C11.7728 24.9941 12.1048 24.7131 12.1909 24.2848C12.2657 23.9165 12.0787 23.6525 11.868 23.3907C11.3309 22.7222 10.7972 22.0491 10.2589 21.3817C10.166 21.2662 10.1241 21.1721 10.2431 21.0429C10.8799 20.3449 11.4306 19.579 12.0266 18.8492Z" fill="#EB82DA"/>
                                <path d="M17.1064 23.2547C16.3426 23.2502 15.5789 23.2525 14.8164 23.2672C14.669 23.2706 14.6011 23.2094 14.5705 23.0961C14.5421 22.9884 14.5399 22.8729 14.5399 22.7607C14.5376 21.3273 14.5387 19.8939 14.5387 18.4605C14.5387 18.1909 14.498 17.9359 14.3065 17.7274C14.0696 17.4691 13.707 17.3796 13.375 17.4974C13.0057 17.6288 12.7915 17.9223 12.7892 18.3393C12.7836 19.1314 12.787 19.9234 12.7881 20.7154C12.7881 21.461 12.7802 22.2055 12.7904 22.951C12.8051 24.0977 13.6719 24.9748 14.8141 24.9929C15.5869 25.0054 16.3608 24.9952 17.1347 24.9974C17.3194 24.9974 17.4893 24.9521 17.6412 24.8479C17.9505 24.636 18.0944 24.2541 17.9981 23.9051C17.8882 23.5119 17.5539 23.257 17.1064 23.2547Z" fill="#EB82DA"/>
                                </svg>
                            </button>

                            <Link href={`/loop/add?item_id=${itemId}`} className="hover:scale-[1.04] active:scale-[1] transition-[0.9s] bg-[#EB82DA] text-white py-[0.5rem] px-[0.75rem] lg:px-[1rem] rounded-[0.5rem] shadow-lg flex justify-center items-center gap-2 text-[10px] lg:text-[14px]">
                                <span className="hidden lg:block">برای افزودن حلقه کلیک کنید</span>

                                <span className="lg:hidden"> افزودن حلقه</span>

                                <svg className="w-[18px] lg:w-[24px] h-[18px] lg:h-[24px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12H18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 18V6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-[2rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {loading && (
                            <section className='flex justify-center items-center flex-col w-full h-[16rem]'>
                                <div className='w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden'>
                                    <div className='absolute top-0 left-0 h-full w-full animate-slide'></div>
                                    <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer'></div>
                                </div>
                            </section>
                        )}

                        {(data && data?.data?.length > 0) && 
                            data?.data?.map((item) => (
                                <div key={item?.id} className="w-full border border-[#DFDFDF] rounded-[1rem] p-[1.5rem] group hover:border-[#EB82DA] transition-all duration-200">
                                    <div className="flex justify-between items-start">
                                        <div className="w-[50%]">
                                            <img className="w-[50%]" src="/Images/Insurance.png" alt="" />
                                        </div>

                                        <div>
                                            <Link href={`/loop/update?id=${item?.id}&item_id=${itemId}`} className="hover:scale-[1.08] active:scale-[1] transition-[0.9s] flex justify-center items-center gap-2 text-[#EB82DA] font-semibold text-[14px]">
                                                <span>ویرایش حلقه</span>

                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#EB82DA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M16.04 3.01976L8.16 10.8998C7.86 11.1998 7.56 11.7898 7.5 12.2198L7.07 15.2298C6.91 16.3198 7.68 17.0798 8.77 16.9298L11.78 16.4998C12.2 16.4398 12.79 16.1398 13.1 15.8398L20.98 7.95976C22.34 6.59976 22.98 5.01976 20.98 3.01976C18.98 1.01976 17.4 1.65976 16.04 3.01976Z" stroke="#EB82DA" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#EB82DA" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="text-[20px] font-semibold mt-[1rem] group-hover:text-[#EB82DA] transition-all duration-200">
                                        <p>مرکز تعالی بانوان: {item?.title} </p>
                                    </div>

                                    <div className="text-[14px] text-[#818595] mt-[0.5rem]">
                                        <p>نام سرگروه : {item?.name}</p>
                                        
                                        <p>تعداد اعضای حلقه:  {item?.members_count} نفر</p>
                                    </div>

                                    <div className="w-full">
                                        <Link href={`/loop/show?id=${item?.id}&item_id=${itemId}`} className="hover:scale-[1.04] active:scale-[1] transition-[0.9s] text-[#EB82DA] border border-[#EB82DA] group-hover:text-white group-hover:bg-[#EB82DA] transition-all duration-200 rounded-[0.5rem] w-full flex justify-center items-center p-[0.5rem] mt-[0.5rem]">مشاهده بیشتر</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {data?.data?.length == 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                        درخواستی برای نمایش وجود ندارد
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 mb-4 gap-2 text-sm">
                            {renderPaginationButtons()}
                        </div>  
                    )}
                </section>
            )}
        </>
    );
};

export default schools;
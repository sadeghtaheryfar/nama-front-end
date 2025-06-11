'use client';
import axios from "axios";
import Link from "next/link";
import { usePathname,useRouter  } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const  Header = ({bgBox,bgRole}) => {
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [placeText, setPlaceText] = useState("");
    
    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");
    const itemId = pathSegments[1];

    const [showRoleMenu, setShowRoleMenu] = useState(false);

    useEffect(() => {
        // Set the place text based on itemId
        if (itemId === "2") {
            setPlaceText("مساجد");
        } else if (itemId === "3") {
            setPlaceText("مدارس");
        } else if (itemId === "4") {
            setPlaceText("مراکز تعالی");
        } else {
            setPlaceText("");
        }

        const fetching = async () => {
            try {
                const response = await axios.get(`/api/profile?item_id=${itemId}`);
                if (response.data) {
                    setProfile(response.data);
                }

                const hasHeadCoachRole = response.data?.data?.roles?.some(
                    role => role.role_en === "mosque_head_coach"
                );

                if (!hasHeadCoachRole) {
                    if (pathname !== "/2" || pathname !== "/3" || pathname !== "/4") {
                        router.push("/" + itemId);
                    }
                }
            } catch (error) {
                console.log("خطا در دریافت بنرها:", error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetching();
    }, [itemId]);

    // Updated role options to use dynamic place text
    const getRoleOptions = () => [
        { key: 'mosque_head_coach', label: `سرمربی ${placeText}` },
        { key: 'mosque_cultural_officer', label: `مسئول فرهنگی ${placeText}` },
        { key: 'area_interface', label: 'رابط منطقه' },
        { key: 'executive_vice_president_mosques', label: `معاونت اجرایی ${placeText}` },
        { key: 'deputy_for_planning_and_programming', label: 'معاونت طرح و برنامه' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showRoleMenu && !event.target.closest(".role-menu-container")) {
                setShowRoleMenu(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showRoleMenu]);

    const translateRole = (role) => {
        if (role === "admin") {
            return "ادمین";
        } else if (role === "super_admin") {
            return "سوپر ادمین";
        } else if (role === "user") {
            return "کاربر";
        } else {
            return "نامشخص";
        }
    };

    // Updated translateNama to use dynamic place text
    const translateNama = (role) => {
        if (role === "mosque_head_coach") {
            return `سرمربی ${placeText}`;
        } else if (role === "mosque_cultural_officer") {
            return `مسئول فرهنگی ${placeText}`;
        } else if (role === "area_interface") {
            return "رابط منطقه";
        } else if (role === "executive_vice_president_mosques") {
            return `معاونت اجرایی ${placeText}`;
        } else if (role === "deputy_for_planning_and_programming") {
            return "معاونت طرح و برنامه";
        } else {
            return "نامشخص";
        }
    };


    const logout = () => {
        Cookies.remove('token');
        window.location.href = '/';
    }

    return (
        <>
            <img
                className="w-12 lg:w-16 rounded-full"
                alt="user"
                width={0}
                height={0}
                src={profile?.data?.avatar || '/Images/home/user.jpg'}
            />
                <div className="flex flex-col gap-1 leading-5">
                <span className="text-xs lg:text-lg font-medium text-right" dir="rtl">سلام {profile?.data?.name || ' '}!</span>
                <span className="text-[10px] lg:text-sm font-medium">شناسه یکتا : {profile?.data?.id || ' '}</span>
                </div>

                {pathname != '/' && (
                    <div style={{ backgroundColor: bgRole }} className='hover:scale-[1.03] active:scale-[1] transition-[0.9s] relative z-[12] px-2 py-1 rounded-xl cursor-pointer' onClick={() => setShowRoleMenu(!showRoleMenu)}>
                        <div>
                            <div className='flex justify-between items-center gap-6 sm:gap-8 lg:gap-16 cursor-pointer'>
                                <span className='text-xs lg:text-base font-medium'>نقش</span>
                                <img className='w-5' alt='#' width={0} height={0} src={'/Images/home/edit-2.svg'} />
                            </div>
                            <span className='text-[10px] lg:text-sm'>
                                {translateNama(
                                    profile?.data?.roles?.find(role => role.role_en === 'mosque_head_coach')?.role_en
                                )}
                            </span>
                        </div>
                        {(showRoleMenu && itemId) && (
                            <div style={{ backgroundColor: '#fff' }} className='absolute top-full right-0 mt-2 w-full rounded-xl shadow-lg z-10 overflow-hidden text-black'>
                                {profile?.data?.roles?.map((role) => (
                                    <a
                                        href={(role.role_en == 'mosque_head_coach') ? `/${itemId}` : `/role?role=${role.role_en}&item_id=${itemId}`}
                                        key={role.role_en}
                                        className='!px-4 !py-2 hover:bg-gray-200 cursor-pointer !w-full flex text-[14px]'
                                    >
                                        {role.role} {placeText}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col leading-7">
                <span className="text-xs lg:text-base font-medium">سطح دسترسی</span>
                <span className="text-[10px] lg:text-sm flex">{translateRole(profile?.data?.arman_role)}</span>
            </div>
        </>
    );
};

export default Header;
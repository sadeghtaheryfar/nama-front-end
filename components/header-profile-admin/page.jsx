'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const Header = ({ bgBox, bgRole }) => {
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const [placeText, setPlaceText] = useState("");
    const router = useRouter();
    
    const searchParams = useSearchParams();
    const roleFromUrl = searchParams.get('role');
    const itemIdFromUrl = searchParams.get('item_id');
    const itemId = searchParams.get('item_id');
    const idFromUrl = searchParams.get('id');
    const [currentRole, setCurrentRole] = useState(roleFromUrl);

    useEffect(() => {
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
                const response = await axios.get(`/api/profile?item_id=${itemIdFromUrl}`);
                if (response.data) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.log('خطا در دریافت پروفایل:', error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetching();
    }, [itemId]);

    const roleOptions = profile?.data?.roles?.map(role => ({
        key: role.role_en,
        label: role.role
    })) || [];

    useEffect(() => {
        if (loadingProfile) return;
        const validItemIds = ['1', '2', '3', '4'];
        const validRoles = roleOptions.map(role => role.key);
    
        if (!itemIdFromUrl || !validItemIds.includes(itemIdFromUrl) || !roleFromUrl || !validRoles.includes(roleFromUrl)) {
            router.replace('/');
        }
    }, [itemIdFromUrl, roleFromUrl, router, roleOptions, loadingProfile]);

    const handleRoleChange = (newRole) => {
        setCurrentRole(newRole);
        setShowRoleMenu(false);
        if(newRole == 'mosque_head_coach') 
            router.push(`/${itemIdFromUrl}`);
        else
            router.push(`?id=${idFromUrl}&role=${newRole}&item_id=${itemIdFromUrl}`);
    };

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

    return (
        <>
            <img
                className='w-12 lg:w-16 rounded-full ml-4'
                alt='user'
                width={0}
                height={0}
                src={profile?.data?.avatar || '/Images/home/Ellipse 477.svg'}
            />
            <div className='flex flex-col gap-1 leading-5'>
                <span className='text-xs lg:text-lg font-medium text-right' dir='rtl'>سلام {profile?.data?.name || ' '}!</span>
                <span className='text-[10px] lg:text-sm font-medium'>شناسه یکتا : {profile?.data?.id || ' '}</span>
            </div>
            <div style={{ backgroundColor: bgRole }} className='relative mx-2 px-2 py-1 rounded-xl cursor-pointer' onClick={() => setShowRoleMenu(!showRoleMenu)}>
                <div className='flex justify-between items-center gap-6 sm:gap-8 lg:gap-16 cursor-pointer'>
                    <span className='text-xs lg:text-base font-medium'>نقش</span>
                    <img className='w-5' alt='#' width={0} height={0} src={'/Images/home/edit-2.svg'} />
                </div>
                <span className='text-[10px] lg:text-sm'>
                    {roleOptions.find((role) => role.key === currentRole)?.label || 'نامشخص'}
                </span>
                {showRoleMenu && (
                    <div style={{ backgroundColor: '#fff' }} className='absolute top-full right-0 mt-2 w-full rounded-xl shadow-lg z-[50] overflow-hidden text-black'>
                        {profile?.data?.roles?.map((role) => (
                            <div
                                key={role.role_en}
                                className='px-4 py-2 hover:bg-gray-200 cursor-pointer text-[14px]'
                                onClick={() => handleRoleChange(role.role_en)}
                            >
                                {role.role} {placeText}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='flex flex-col leading-7'>
                <span className='text-xs lg:text-base font-medium'>سطح دسترسی</span>
                <span className='text-[10px] lg:text-sm'>{translateRole(profile?.data?.arman_role)}</span>
            </div>
        </>
    );
};

export default Header;
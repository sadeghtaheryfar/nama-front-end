'use client';
import axios from "axios";
import { useEffect, useState } from "react";

const Header = ({bgBox,bgRole}) => {
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get("/api/profile");
                if (response.data) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.log("خطا در دریافت بنرها:", error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetching();
    }, []);

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

    const translateNama = (role) => {
        if (role === "mosque_head_coach") {
            return "سرمربی مسجد";
        } else if (role === "mosque_cultural_officer") {
            return " مسئول فرهنگی مسجد";
        } else if (role === "area_interface") {
            return "رابط منطقه";
        } else if (role === "executive_vice_president_mosques") {
            return "معاونت اجرایی مساجد";
        } else if (role === "deputy_for_planning_and_programming") {
            return "معاونت طرح و برنامه";
        } else {
            return "نامشخص";
        }
    };

    return (
        <>
            <img
                className="w-12 lg:w-16"
                alt="user"
                width={0}
                height={0}
                src={profile?.data?.avatar || '/Images/home/Ellipse 477.svg'}
            />
                <div className="flex flex-col gap-1 leading-5">
                <span className="text-xs lg:text-lg font-medium text-right" dir="rtl">سلام {profile?.data?.name || ' '}!</span>
                <span className="text-[10px] lg:text-sm font-medium">شناسه یکتا : {profile?.data?.id || ' '}</span>
                </div>
                <div style={{ backgroundColor: bgRole }} className={`px-2 py-1 rounded-xl`}>
                <div className="flex justify-between items-center gap-6 sm:gap-8 lg:gap-16">
                    <span className="text-xs lg:text-base font-medium">نقش</span>
                    <img className="w-5" alt="#" width={0} height={0} src={"/Images/home/edit-2.svg"} />
                </div>
                <span className="text-[10px] lg:text-sm">{translateRole(profile?.data?.nama_role)}</span>
                </div>
                <div className="flex flex-col leading-7">
                <span className="text-xs lg:text-base font-medium">سطح دسترسی</span>
                <span className="text-[10px] lg:text-sm">{translateRole(profile?.data?.arman_role)}</span>
            </div>
        </>
    );
};

export default Header;
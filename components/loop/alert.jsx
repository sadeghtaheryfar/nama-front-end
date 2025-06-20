"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Alert = () => {
    const [profile, setProfile] = useState(null);
    const [hasMosqueAccess, setHasMosqueAccess] = useState(false);
    const [hasSchoolAccess, setHasSchoolAccess] = useState(false);
    const [hasWomensCenterAccess, setHasWomensCenterAccess] = useState(false);
    const [hasUniversityAccess, setHasUniversityAccess] = useState(false);
    const [limitedAccessMessage, setLimitedAccessMessage] = useState("");

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(`/api/profile`);
                if (response.data && response.data.data) {
                    setProfile(response.data.data);

                    let canAccessMosque = false;
                    let canAccessSchool = false;
                    let canAccessWomensCenter = false;
                    let canUniversity = false;

                    response.data.data.roles.forEach(role => {
                        if (role.role_en === "mosque_head_coach" && role.ring === true && role.item_id) {
                            if (role.item_id.id === 2) {
                                canAccessMosque = true;
                            } else if (role.item_id.id === 3) {
                                canAccessSchool = true;
                            } else if (role.item_id.id === 4) {
                                canAccessWomensCenter = true;
                            } else if (role.item_id.id === 8) {
                                canUniversity = true;
                            }
                        }
                    });

                    setHasMosqueAccess(canAccessMosque);
                    setHasSchoolAccess(canAccessSchool);
                    setHasWomensCenterAccess(canAccessWomensCenter);
                    setHasUniversityAccess(canUniversity);

                    let accessibleParts = [];
                    if (canAccessMosque) {
                        accessibleParts.push("مساجد");
                    }
                    if (canAccessSchool) {
                        accessibleParts.push("مدارس");
                    }
                    if (canAccessWomensCenter) {
                        accessibleParts.push("مرکز تعالی بانوان");
                    }
                    if (canUniversity) {
                        accessibleParts.push("دانشگاه");
                    }

                    let inaccessibleParts = [];
                    if (!canAccessMosque) {
                        inaccessibleParts.push("مساجد");
                    }
                    if (!canAccessSchool) {
                        inaccessibleParts.push("مدارس");
                    }
                    if (!canAccessWomensCenter) {
                        inaccessibleParts.push("مرکز تعالی بانوان");
                    }
                    if (!canUniversity) {
                        inaccessibleParts.push("دانشگاه");
                    }

                    if (inaccessibleParts.length > 0) {
                        let message = "";
                        if (accessibleParts.length > 0) {
                            message += `در حال حاضر شما تنها به بخش${accessibleParts.length > 1 ? "‌های" : ""} ${accessibleParts.join(" و ")} دسترسی دارید و `;
                        } else {
                            message += `در حال حاضر شما به هیچ بخشی دسترسی ندارید و `;
                        }
                        
                        message += `امکان مشاهده یا ویرایش اطلاعات مربوط به بخش${inaccessibleParts.length > 1 ? "‌های" : ""} ${inaccessibleParts.join(" و ")} برای شما فعال نیست. در صورتی که نیاز به دسترسی به این بخش‌ها دارید یا فکر می‌کنید این محدودیت به اشتباه اعمال شده است، لطفاً با ادمین سامانه تماس بگیرید تا مشکل بررسی و در صورت لزوم رفع گردد.`;
                        
                        setLimitedAccessMessage(message);
                    } else {
                        setLimitedAccessMessage(""); // No limited access if all are true
                    }

                }
            } catch (error) {
                console.log("خطا در دریافت پروفایل:", error);
            }
        };
        fetching();
    }, []);

    if (hasMosqueAccess && hasSchoolAccess && hasWomensCenterAccess && hasUniversityAccess) {
        return null; // Don't show the alert if the user has access to all sections
    }

    if (!profile) {
        return null; // Optionally, show a loading state or nothing until profile is loaded
    }

    return (
        <section className="my-[4rem] w-full flex flex-col lg:flex-row justify-start items-center gap-[2rem] bg-[#EDF4FA] p-[1rem] rounded-[1rem]">
            <div className="w-full">
                <p className="text-[18px] font-semibold">دسترسی محدود</p>

                {limitedAccessMessage && (
                    <p className="text-justify">
                        {limitedAccessMessage}
                    </p>
                )}
            </div>

            <div className="w-full lg:w-[19rem] lg:min-w-[19rem] relative flex justify-center items-center">
                <img className="lg:absolute w-[90%] mb-[-5rem] lg:!mb-[0px]" src="/Images/Oil lamp-bro.png" alt="" />
            </div>
        </section>
    );
};

export default Alert;
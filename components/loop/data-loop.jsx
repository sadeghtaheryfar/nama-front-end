"use client";
import Schools from "./schools";
import Masjed from "./masjed";
import Womens from "./womens";
import University from "./university";
import Alert from "./alert";
import { useState } from "react";
import { useSelector } from "react-redux";

const DataLoop = () => {
    const user = useSelector((state) => state.user);
    const [type, setType] = useState("all");

    const roleIds =
        user?.data?.roles
            ?.filter((role) => role.ring == true)
            ?.map((role) => role.item_id?.id) || [];

    const hasMosque = roleIds.includes(2);
    const hasSchool = roleIds.includes(3);
    const hasUniversity = roleIds.includes(8);
    const hasWomens = roleIds.includes(4);

    const activeRolesCount = [
        hasMosque,
        hasSchool,
        hasUniversity,
        hasWomens,
    ].filter(Boolean).length;
    const isRestricted = activeRolesCount > 0;
    const showButtons = !isRestricted || activeRolesCount > 1;

    return (
        <section className="mt-[2rem]">
            <div>
                <h1 className="text-[20px] font-semibold">ایجاد حلقه</h1>

                {showButtons && (
                    <div className="w-full lg:w-max flex justify-start gap-2 lg:gap-4 mt-[1rem]">
                        <button
                            className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${
                                type == "all" ? "bg-[#0068B2] text-white" : ""
                            }`}
                            onClick={(e) => setType("all")}
                        >
                            همه
                        </button>
                        {(!isRestricted || hasSchool) && (
                            <button
                                className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${
                                    type == "school"
                                        ? "bg-[#0068B2] text-white"
                                        : ""
                                }`}
                                onClick={(e) => setType("school")}
                            >
                                مدرسه
                            </button>
                        )}
                        {(!isRestricted || hasMosque) && (
                            <button
                                className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${
                                    type == "mosque"
                                        ? "bg-[#39A894] text-white"
                                        : ""
                                }`}
                                onClick={(e) => setType("mosque")}
                            >
                                مسجد
                            </button>
                        )}
                        {(!isRestricted || hasWomens) && (
                            <button
                                className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${
                                    type == "center"
                                        ? "bg-[#EB82DA] text-white"
                                        : ""
                                }`}
                                onClick={(e) => setType("center")}
                            >
                                مرکز تعالی بانوان
                            </button>
                        )}
                        {(!isRestricted || hasUniversity) && (
                            <button
                                className={`hover:scale-[1.08] active:scale-[1] transition-[0.9s] px-[0.75rem] py-[0.4rem] border border-[#F5F5F5] rounded-[0.5rem] shadow-lg cursor-pointer text-[10px] lg:text-[14px] ${
                                    type == "university"
                                        ? "bg-[#c33232] text-white"
                                        : ""
                                }`}
                                onClick={(e) => setType("university")}
                            >
                                دانشگاه
                            </button>
                        )}
                    </div>
                )}
            </div>

            {activeRolesCount === 1 ? (
                <>
                    {hasMosque && <Masjed />}
                    {hasSchool && <Schools />}
                    {hasUniversity && <University />}
                    {hasWomens && <Womens />}
                </>
            ) : type == "all" ? (
                <>
                    {(!isRestricted || hasSchool) && <Schools />}
                    {(!isRestricted || hasMosque) && <Masjed />}
                    {(!isRestricted || hasWomens) && <Womens />}
                    {(!isRestricted || hasUniversity) && <University />}
                </>
            ) : type == "school" ? (
                <Schools />
            ) : type == "mosque" ? (
                <Masjed />
            ) : type == "university" ? (
                <University />
            ) : (
                <Womens />
            )}

            <Alert />
        </section>
    );
};

export default DataLoop;

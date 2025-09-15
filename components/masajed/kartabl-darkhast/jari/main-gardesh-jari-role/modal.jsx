'use clint';
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Modal = ({ showModal, setShowModal, hnadleForm, selectedReason, setSelectedReason, backSteps }) => {
    if (!showModal) return null;
    const searchParams = useSearchParams();
    const [itemId, setItemId] = useState(searchParams.get("item_id"));
    console.log('>>>>>>>>>>>', itemId)

    const getBackStepLabels = (id, step) => {
        const defaultLabels = {
            "approval_mosque_head_coach": "تایید سر مربی مسجد",
            "approval_mosque_cultural_officer": "تایید مسئول فرهنگی مسجد",
            "approval_area_interface": "تایید رابط منطقه",
            "approval_executive_vice_president_mosques": "تایید معاونت اجرایی مسجد",
            "approval_deputy_for_planning_and_programming": "تایید معاونت طرح و برنامه"
        };

        const getItem8Label = (role) => {
            if (role === "approval_mosque_head_coach") {
                return `مسئول تشکل`;
            } else if (role === "approval_mosque_cultural_officer") {
                return `رابط دانشگاه`;
            } else if (role === "approval_area_interface") {
                return "ناظر";
            } else if (role === "approval_executive_vice_president_mosques") {
                return `معاونت دانشجویی`;
            } else if (role === "approval_deputy_for_planning_and_programming") {
                return "معاونت طرح و برنامه";
            } else {
                return "نامشخص";
            }
        };

        if (id === "8") {
            return getItem8Label(step)
        } else if (id === "3") {
            return defaultLabels[step]?.replace("مسجد", "مدرسه") || step;
        } else if (id === "4") {
            return defaultLabels[step]?.replace("مسجد", "مرکز تعالی بانوان") || step;
        } else {
            return defaultLabels[step] || step;
        }
    };

    return createPortal(
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">ارجاع این درخواست به بخش مربوطه</h3>

                <select
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                >
                    <option value="">لطفا بخش مربوطه را انتخاب کنید</option>
                    {backSteps && backSteps.map((step, index) => (
                        <option key={index} value={step}>
                            {getBackStepLabels(itemId, step)}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                        انصراف
                    </button>
                    <button
                        onClick={() => {
                            setShowModal(false);
                            hnadleForm('action_needed');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        تایید و ارسال فرم
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
import React from 'react';
import { createPortal } from "react-dom";

const RejectConfirmationModal = ({ show, onClose, onConfirm, loading }) => {
    if (!show) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in-up"> {/* Added animation class */}
                <h2 className="text-xl font-bold mb-4 text-center">تایید رد درخواست</h2>
                <p className="mb-6 text-center">
                    آیا از رد کلی درخواست مطمئن هستید؟ با انجام این عمل، امکان بازگشت وجود ندارد و یکی از فرصت‌های اکشن پلن کاربر از بین خواهد رفت.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        disabled={loading}
                    >
                        {loading ? 'در حال ارسال...' : 'بله، مطمئنم'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                        خیر
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RejectConfirmationModal;
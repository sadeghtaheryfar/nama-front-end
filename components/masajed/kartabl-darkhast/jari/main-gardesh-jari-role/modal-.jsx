import { createPortal } from "react-dom";

const Modal = ({ showModal, setShowModal, hnadleForm, selectedReason , setSelectedReason }) => {
  if (!showModal) return null;

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] border border-gray-200">
            <h3 className="text-lg font-semibold mb-4"> ارجاع این درخواست   به بخش مربوطه</h3>
            
            <select
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
            >
                <option value={null}>لطفا بخش مربوطه را انتخاب کنید </option>
                <option value="approval_mosque_head_coach">تایید سر مربی مسجد</option>
                <option value="approval_mosque_cultural_officer">تایید مسئول فرهنگی مسجد</option>
                <option value="approval_area_interface">تایید  رابط منطقه</option>
                <option value="approval_executive_vice_president_mosques">تایید معاونت اجرایی مساجد</option>
                <option value="approval_deputy_for_planning_and_programming">تایید معاونت طرح و برنامه</option>
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
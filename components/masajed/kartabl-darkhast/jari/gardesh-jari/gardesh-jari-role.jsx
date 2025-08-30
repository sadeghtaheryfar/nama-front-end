"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";


const CommentsModal = ({ isOpen, onClose, title, comments, loading }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-[90%] h-[90%] max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : comments && comments.data && comments.data.length > 0 ? (
            <div className="space-y-4 p-2">
              {comments.data.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <div className="flex items-start gap-3 mb-3">
                    {comment.user && comment.user.avatar && (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 flex justify-center items-start lg:items-center flex-col lg:flex-row">
                        <p>{`${comment?.user?.name} - ${comment.display_name}` || "کاربر"}</p> 
                        <div className="mr-[0.5rem] text-gray-500 flex gap-[0.2rem] items-center justify-start flex-wrap leading-5">
                          <small>تبدیل از </small>

                          <div className="text-red-500">
                            {comment?.from_status == 'rejected' ? (
                                <small>رد شده </small>
                            ): comment?.from_status == 'in_progress' ? (
                              <small>
                                جاری
                              </small>
                            ): comment?.from_status == 'done_temp' ? (
                              <small>
                                تاید و ارسال
                              </small>
                            ) : comment?.from_status == 'action_needed' ? (
                              <small>
                                نیازمند اصلاح
                              </small>
                            ) : comment?.from_status == 'done' ? (
                              <small>
                                تایید شده
                              </small>
                            ) : (
                              <small>
                                نامشخص  
                              </small>
                            )}
                          </div>

                          <small>به</small>

                          <div className="text-green-500">
                            {comment?.to_status == 'rejected' ? (
                                <small>رد شده </small>
                            ): comment?.to_status == 'in_progress' ? (
                              <small>
                                جاری
                              </small>
                            ): comment?.to_status == 'done_temp' ? (
                              <small>
                                تاید و ارسال
                              </small>
                            ) : comment?.to_status == 'action_needed' ? (
                              <small>
                                نیازمند اصلاح
                              </small>
                            ) : comment?.to_status == 'done' ? (
                              <>
                                تایید شده
                              </>
                            ) : (
                              <small>
                                نامشخص  
                              </small>
                            )}
                          </div>
                        </div>
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 px-2 py-1">{comment.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-gray-500">هیچ نظری یافت نشد</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const GardeshJariRole = ({data}) => {
  const searchParams = useSearchParams();
  const item_id = searchParams.get("item_id");
  const currentRole = searchParams.get("role"); 
  const [step, setStep] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const [comments, setRequsestComments] = useState();
  const [commentsLoading, setRequsestCommentsLoading] = useState(false);

  useEffect(() => {
    if (!item_id || !currentRole || !selectedStep) return;
    setRequsestCommentsLoading(true);
    
    const fetching = async () => {
      try {
        const id = searchParams.get("id");
        const response = await axios.get(`/api/report/comments?id=${id}&item_id=${item_id}&role=${currentRole}&step=${selectedStep}`);
        
        if (response.data) {
          setRequsestComments(response?.data);
        }
      } catch (error) {
        console.log("خطا", error);
      } finally {
        setRequsestCommentsLoading(false);
      }
    };
    fetching();
  }, [item_id, currentRole, selectedStep]);

  const handleStepClick = (stepName, title) => {
    if(currentRole === 'executive_vice_president_mosques' || currentRole === 'deputy_for_planning_and_programming')
    {
      setSelectedStep(stepName);
      setModalTitle(title);
      setIsModalOpen(true);
    }else{
      console.log("شما اجازه مشاهده کامنت‌های این مرحله را ندارید.");
      return;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStep(null);
  };

  const getStepStatus = (stepName, associatedRole) => {
    const currentRequestStep = data?.data?.data?.step;
    const currentRequestStatus = data?.data?.data?.status;

    // If the entire request is finished, all steps should be 'prev_done' (green)
    if (currentRequestStep === 'finish') {
        return 'prev_done';
    }

    const stepsOrder = [
      'approval_mosque_head_coach',
      'approval_mosque_cultural_officer',
      'approval_area_interface',
      'approval_executive_vice_president_mosques',
      'approval_deputy_for_planning_and_programming'
    ];

    const stepIndex = stepsOrder.indexOf(stepName);
    const currentRequestStepIndex = stepsOrder.indexOf(currentRequestStep);

    if (stepIndex === currentRequestStepIndex) {
      // This is the current active step
      if (currentRequestStatus === 'in_progress') {
        if (currentRole === associatedRole) {
          return 'current_in_progress_responsible'; // Blue, 'جاری'
        } else {
          return 'current_in_progress_other_viewer'; // Yellow, 'در انتظار تایید فلانی'
        }
      }
      if (currentRequestStatus === 'rejected') return 'current_rejected'; // Red
      if (currentRequestStatus === 'action_needed') return 'current_action_needed'; // Yellow
      if (currentRequestStatus === 'done') return 'current_done'; // Green (should not be current if status is 'done' unless it's the final 'done' state)
    } else if (stepIndex < currentRequestStepIndex) {
      // This is a past step (already completed)
      return 'prev_done'; // Green, implies it has been completed
    }
    // This is a future step (stepIndex > currentRequestStepIndex)
    return 'future'; // White/Grey
  };

  const getStepImage = (stepName, associatedRole) => {
    const status = getStepStatus(stepName, associatedRole);
    switch (status) {
      case 'current_in_progress_responsible':
        return "/Images/masajed/kartabl-darkhast/jari/jari.svg"; // Blue for current (responsible)
      case 'current_in_progress_other_viewer':
        return "/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"; // Yellow for current (other viewer)
      case 'current_rejected':
        return "/Images/masajed/kartabl-darkhast/rad/rad.svg";
      case 'current_action_needed':
        return "/Images/masajed/kartabl-darkhast/eslah/eslah1.svg";
      case 'prev_done':
        return "/Images/masajed/kartabl-darkhast/jari/tik.svg"; // Green for previous done
      case 'future':
      default:
        return "/Images/masajed/kartabl-darkhast/jari/tik1.svg"; // Grey for future
    }
  };

  const getStepColorClass = (stepName, associatedRole) => {
    const status = getStepStatus(stepName, associatedRole);
    switch (status) {
      case 'current_in_progress_responsible':
        return "text-[#258CC7]"; // Blue
      case 'current_in_progress_other_viewer':
        return "text-[#F6BB00]"; // Yellow
      case 'current_rejected':
        return "text-[#D32F2F]"; // Red
      case 'current_action_needed':
        return "text-[#F6BB00]"; // Yellow
      case 'prev_done':
        return "text-[#25C7AA]"; // Green
      case 'future':
      default:
        return "text-[#959595]"; // Grey
    }
  };

  const getLineColorClass = (stepName, index, array, associatedRole) => {
    const status = getStepStatus(stepName, associatedRole);
    const currentRequestStep = data?.data?.data?.step;
    const stepsOrder = [
      'approval_mosque_head_coach',
      'approval_mosque_cultural_officer',
      'approval_area_interface',
      'approval_executive_vice_president_mosques',
      'approval_deputy_for_planning_and_programming'
    ];
    const stepIndex = stepsOrder.indexOf(stepName);
    const currentRequestStepIndex = stepsOrder.indexOf(currentRequestStep);

    if (index < array.length - 1) { // Only for lines between steps
        // If the entire request is finished, all lines should be green
        if (currentRequestStep === 'finish') {
            return "border-[#25C7AA]";
        }
        
      if (stepIndex < currentRequestStepIndex || status === 'prev_done') {
        return "border-[#25C7AA]"; // Green for lines of completed steps
      } else if (status === 'current_in_progress_responsible') {
        return "border-[#258CC7]"; // Blue for line of current responsible step
      } else if (status === 'current_in_progress_other_viewer' || status === 'current_action_needed') { 
        return "border-[#F6BB00]"; // Yellow for line of current (other viewer) or action needed
      } else if (status === 'current_rejected') {
        return "border-[#D32F2F]"; // Red for line of current rejected step
      } else {
        return "border-[#DFDFDF]"; // Default grey for future lines
      }
    }
    return "border-transparent"; // No border for the last step
  };

  const getStepText = (stepName, associatedRole) => {
		let stepTitles;
		let roleDisplayNames;

		if (item_id == 8) {
			stepTitles = {
				'approval_mosque_head_coach': 'تایید مسئول تشکل',
				'approval_mosque_cultural_officer': 'تایید رابط دانشگاه',
				'approval_area_interface': 'تایید ناظر',
				'approval_executive_vice_president_mosques': 'تایید معاونت دانشجویی',
				'approval_deputy_for_planning_and_programming': 'تایید معاونت طرح و برنامه',
			};
			roleDisplayNames = {
				'mosque_head_coach': 'مسئول تشکل',
				'mosque_cultural_officer': 'رابط دانشگاه',
				'area_interface': 'ناظر',
				'executive_vice_president_mosques': 'معاونت دانشجویی',
				'deputy_for_planning_and_programming': 'معاونت طرح و برنامه',
			};
		} else {
			stepTitles = {
				'approval_mosque_head_coach': 'تایید سر مربی مسجد',
				'approval_mosque_cultural_officer': 'تایید مسئول فرهنگی مسجد',
				'approval_area_interface': 'تایید رابط منطقه',
				'approval_executive_vice_president_mosques': 'تایید معاونت اجرایی مساجد',
				'approval_deputy_for_planning_and_programming': 'تایید معاونت طرح و برنامه',
			};
			roleDisplayNames = {
				'mosque_head_coach': 'سر مربی مسجد',
				'mosque_cultural_officer': 'مسئول فرهنگی مسجد',
				'area_interface': 'رابط منطقه',
				'executive_vice_president_mosques': 'معاونت اجرایی مساجد',
				'deputy_for_planning_and_programming': 'معاونت طرح و برنامه',
			};
		}
		
		const status = getStepStatus(stepName, associatedRole);

		if (status === 'current_in_progress_responsible') {
			return stepTitles[stepName];
		} else if (status === 'current_in_progress_other_viewer') {
			const displayRoleKey = stepName.replace('approval_', '');
			return `در انتظار ${stepTitles[stepName]}`;
		} else if (status === 'current_rejected') {
			return stepTitles[stepName];
		} else if (status === 'current_action_needed') {
			return stepTitles[stepName];
		}
		
		// For 'done' or future steps
		return stepTitles[stepName];
	};

  const getStepMessageContent = (stepName) => {
    if (stepName === 'approval_mosque_head_coach') {
      return data?.data?.data?.body != null ? data?.data?.data?.body : "";
    } else {
      const messages = data?.data?.data?.messages || {};
      const messageKey = stepName.replace('approval_', '');
      return messages[messageKey];
    }
  };

  const stepsConfig = item_id == 8
    ? [
        { name: 'approval_mosque_head_coach', title: 'تایید مسئول تشکل', associatedRole: 'mosque_head_coach' },
        { name: 'approval_mosque_cultural_officer', title: 'تایید رابط دانشگاه', associatedRole: 'mosque_cultural_officer' },
        { name: 'approval_area_interface', title: 'تایید ناظر', associatedRole: 'area_interface' },
        { name: 'approval_executive_vice_president_mosques', title: 'تایید معاونت دانشجویی', associatedRole: 'executive_vice_president_mosques' },
        { name: 'approval_deputy_for_planning_and_programming', title: 'تایید معاونت طرح و برنامه', associatedRole: 'deputy_for_planning_and_programming' },
    ]
    : [
        { name: 'approval_mosque_head_coach', title: 'تایید سر مربی ', associatedRole: 'mosque_head_coach' },
        { name: 'approval_mosque_cultural_officer', title: 'تایید مسئول فرهنگی ', associatedRole: 'mosque_cultural_officer' },
        { name: 'approval_area_interface', title: 'تایید رابط منطقه', associatedRole: 'area_interface' },
        { name: 'approval_executive_vice_president_mosques', title: 'تایید معاونت اجرایی ', associatedRole: 'executive_vice_president_mosques' },
        { name: 'approval_deputy_for_planning_and_programming', title: 'تایید معاونت طرح و برنامه', associatedRole: 'deputy_for_planning_and_programming' },
    ];

  return (
    <div className="flex flex-col gap-4 lg:gap-6 xl:gap-9">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between items-center">
              <h2 className="text-base font-bold text-center lg:text-lg md:text-right xl:text-xl 2xl:text-[22px]">
                گردش کار گزارش شماره {data?.data?.id}
              </h2>
      </div>

      {/* Mobile Design */}
      <div className="flex items-start flex-col justify-center font-[sans-serif] w-full lg:hidden">
        {stepsConfig.map((stepItem, index, array) => (
          <div key={stepItem.name} className="flex items-start gap-4 w-full">
            <div className="flex flex-col items-center self-stretch">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick(stepItem.name, stepItem.title)}>
                <Image
                  width={0}
                  height={0}
                  className="w-8"
                  alt={`وضعیت ${stepItem.title}`}
                  src={getStepImage(stepItem.name, stepItem.associatedRole)}
                />
              </div>
              {index < array.length - 1 && (
                <div className={`flex-grow border-r border-dashed min-h-[18px] ${getLineColorClass(stepItem.name, index, array, stepItem.associatedRole)}`}></div>
              )}
            </div>
            
            <div className="flex flex-col flex-1 overflow-hidden pb-2">
              <span className={`text-sm ${getStepColorClass(stepItem.name, stepItem.associatedRole)} font-medium`}>{getStepText(stepItem.name, stepItem.associatedRole)}</span>
              <p className="text-sm break-words overflow-hidden">{getStepMessageContent(stepItem.name)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Design - Refactored to use map */}
      <div className="hidden lg:flex items-end justify-between">
        {stepsConfig.map((stepItem, index, array) => (
          <div key={stepItem.name} className={`w-full flex flex-col items-start relative`}>
            <div className={`flex items-center w-full`}>
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick(stepItem.name, stepItem.title)}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={getStepImage(stepItem.name, stepItem.associatedRole)}
                />
              </div>
              {index < array.length - 1 && (
                <div className={`w-full h-[2px] border-b border-dashed ${getLineColorClass(stepItem.name, index, array, stepItem.associatedRole)}`}></div>
              )}
            </div>
            <span className={`text-sm ${getStepColorClass(stepItem.name, stepItem.associatedRole)} mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit`}>
              {getStepText(stepItem.name, stepItem.associatedRole)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Desktop Messages - Retained original structure */}
      <div className="hidden lg:flex items-end justify-between">
        {stepsConfig.map((stepItem, index) => (
          <div key={stepItem.name} className={`w-full flex flex-col items-start`}>
            <p>{getStepMessageContent(stepItem.name)}</p>
          </div>
        ))}
      </div>

      <CommentsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        comments={comments}
        loading={commentsLoading}
      />
    </div>
  );
};

export default GardeshJariRole;
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
  const role = searchParams.get("role");
  const [step, setStep] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const [comments, setRequsestComments] = useState();
  const [commentsLoading, setRequsestCommentsLoading] = useState(false);

  useEffect(() => {
    if (!item_id && !role && !selectedStep) return;
    setRequsestCommentsLoading(true);
    
    const fetching = async () => {
      try {
        const id = searchParams.get("id");
        const response = await axios.get(`/api/request/comments?id=${id}&item_id=${item_id}&role=${role}&step=${selectedStep}`);
        
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
  }, [item_id,role,selectedStep]);

  const handleStepClick = (stepName, title) => {
    if(role == 'executive_vice_president_mosques' || role == 'deputy_for_planning_and_programming')
    {
      setSelectedStep(stepName);
      setModalTitle(title);
      setIsModalOpen(true);
    }else{
      return;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6 xl:gap-9">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between items-center">
              <h2 className="text-base font-bold text-center lg:text-lg md:text-right xl:text-xl 2xl:text-[22px]">
                گردش کار درخواست شماره {data?.data?.id}
              </h2>
      </div>

      <div className="flex items-start flex-col justify-center font-[sans-serif] w-full lg:hidden">
        {/* تایید سر مربی مسجد */}
        <div className="flex items-start gap-4 w-full">
          <div className="flex flex-col items-center self-stretch">
            <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_head_coach', 'تایید سر مربی مسجد ')}>
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="وضعیت تایید"
                src={data?.data?.data?.step === 'approval_mosque_head_coach' 
                  ? data?.data?.data?.status === 'in_progress' 
                    ? "/Images/masajed/kartabl-darkhast/jari/jari.svg"
                    : data?.data?.data?.status === 'rejected'
                      ? "/Images/masajed/kartabl-darkhast/rad/rad.svg"
                      : data?.data?.data?.status === 'done'
                        ? "/Images/masajed/kartabl-darkhast/rad/tik.svg"
                        : "/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"
                  : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming', 'approval_executive_vice_president_mosques', 'approval_area_interface', 'approval_mosque_cultural_officer'].includes(data?.data?.data?.step)
                    ? "/Images/masajed/kartabl-darkhast/jari/tik.svg"
                    : "/Images/masajed/kartabl-darkhast/jari/tik1.svg"
                }
              />
            </div>
            <div className={`flex-grow border-r border-dashed min-h-[18px] ${
              data?.data?.data?.step === 'approval_mosque_head_coach'
                ? data?.data?.data?.status === 'in_progress'
                  ? "border-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "border-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "border-[#25C7AA]"
                      : "border-[#F6BB00]"
                : data?.data?.data?.step === 'finish'
                  ? "border-[#25C7AA]" 
                  : "border-[#959595]"
            }`}></div>
          </div>
          
          <div className="flex flex-col flex-1 overflow-hidden pb-2">
            <span className={`text-sm ${
              data?.data?.data?.step === 'approval_mosque_head_coach'
                ? data?.data?.data?.status === 'in_progress'
                  ? "text-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "text-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "text-[#25C7AA]"
                      : "text-[#F6BB00]"
                : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming', 'approval_executive_vice_president_mosques', 'approval_area_interface', 'approval_mosque_cultural_officer'].includes(data?.data?.data?.step)
                  ? "text-[#25C7AA]" 
                  : "text-[#959595]"
            } font-medium`}>تایید سر مربی مسجد</span>
            <p className="text-sm break-words overflow-hidden">{data?.data?.data?.body}</p>
          </div>
        </div>

        {/* تایید مسئول فرهنگی مسجد */}
        <div className="flex items-start gap-4 w-full">
          <div className="flex flex-col items-center self-stretch">
            <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_cultural_officer', 'تایید مسئول فرهنگی مسجد ')}>
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="وضعیت تایید"
                src={(data?.data?.data?.step === 'approval_mosque_cultural_officer' && data?.data?.data?.status != null)
                  ? data?.data?.data?.status === 'in_progress' 
                    ? "/Images/masajed/kartabl-darkhast/jari/jari.svg"
                    : data?.data?.data?.status === 'rejected'
                      ? "/Images/masajed/kartabl-darkhast/rad/rad.svg"
                      : data?.data?.data?.status === 'done'
                        ? "/Images/masajed/kartabl-darkhast/rad/tik.svg"
                        : "/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"
                  : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming', 'approval_executive_vice_president_mosques', 'approval_area_interface'].includes(data?.data?.data?.step)
                    ? "/Images/masajed/kartabl-darkhast/jari/tik.svg"
                    : "/Images/masajed/kartabl-darkhast/jari/tik1.svg"
                }
              />
            </div>
            <div className={`flex-grow border-r border-dashed min-h-[18px] ${
              (data?.data?.data?.step === 'approval_deputy_for_planning_and_programming' && data?.data?.data?.status != null)
                ? data?.data?.data?.status === 'in_progress'
                  ? "border-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "border-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "border-[#25C7AA]"
                      : "border-[#F6BB00]"
                : data?.data?.data?.step === 'finish'
                  ? "border-[#25C7AA]" 
                  : "border-[#959595]"
            }`}></div>
          </div>
          
          <div className="flex flex-col flex-1 overflow-hidden pb-2">
            <span className={`text-sm ${
              (data?.data?.data?.step === 'approval_mosque_cultural_officer' && data?.data?.data?.status != null)
                ? data?.data?.data?.status === 'in_progress'
                  ? "text-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "text-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "text-[#25C7AA]"
                      : "text-[#F6BB00]"
                : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming', 'approval_executive_vice_president_mosques', 'approval_area_interface'].includes(data?.data?.data?.step)
                  ? "text-[#25C7AA]" 
                  : "text-[#959595]"
            } font-medium`}>تایید مسئول فرهنگی مسجد</span>
            <p className="text-sm break-words overflow-hidden">{data?.data?.data?.messages?.mosque_cultural_officer}</p>
          </div>
        </div>

        {/* تایید رابط منطقه */}
        <div className="flex items-start gap-4 w-full">
          <div className="flex flex-col items-center self-stretch">
            <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_area_interface', 'تایید رابط منطقه ')}>
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="وضعیت تایید"
                src={(data?.data?.data?.step === 'approval_area_interface' && data?.data?.data?.status != null)
                  ? data?.data?.data?.status === 'in_progress' 
                    ? "/Images/masajed/kartabl-darkhast/jari/jari.svg"
                    : data?.data?.data?.status === 'rejected'
                      ? "/Images/masajed/kartabl-darkhast/rad/rad.svg"
                      : data?.data?.data?.status === 'done'
                        ? "/Images/masajed/kartabl-darkhast/rad/tik.svg"
                        : "/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"
                  : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming', 'approval_executive_vice_president_mosques'].includes(data?.data?.data?.step)
                    ? "/Images/masajed/kartabl-darkhast/jari/tik.svg"
                    : "/Images/masajed/kartabl-darkhast/jari/tik1.svg"
                }
              />
            </div>
            <div className={`flex-grow border-r border-dashed min-h-[18px] ${
              (data?.data?.data?.step === 'approval_deputy_for_planning_and_programming' && data?.data?.data?.status != null)
                ? data?.data?.data?.status === 'in_progress'
                  ? "border-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "border-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "border-[#25C7AA]"
                      : "border-[#F6BB00]"
                : data?.data?.data?.step === 'finish'
                  ? "border-[#25C7AA]" 
                  : "border-[#959595]"
            }`}></div>
          </div>
          
          <div className="flex flex-col flex-1 overflow-hidden pb-2">
            <span className={`text-sm ${
              (data?.data?.data?.step === 'approval_area_interface' && data?.data?.data?.status != null)
                ? data?.data?.data?.status === 'in_progress'
                  ? "text-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "text-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "text-[#25C7AA]"
                      : "text-[#F6BB00]"
                : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming', 'approval_executive_vice_president_mosques'].includes(data?.data?.data?.step)
                  ? "text-[#25C7AA]" 
                  : "text-[#959595]"
            } font-medium`}>تایید رابط منطقه</span>
            <p className="text-sm break-words overflow-hidden">{data?.data?.data?.messages?.area_interface}</p>
          </div>
        </div>

        {/* تایید معاونت اجرایی مساجد */}
        <div className="flex items-start gap-4 w-full">
          <div className="flex flex-col items-center self-stretch">
            <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_executive_vice_president_mosques', 'تایید معاونت اجرایی مساجد ')}>
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="وضعیت تایید"
                src={(data?.data?.data?.step === 'approval_executive_vice_president_mosques' && data?.data?.data?.status != null)
                  ? data?.data?.data?.status === 'in_progress' 
                    ? "/Images/masajed/kartabl-darkhast/jari/jari.svg"
                    : data?.data?.data?.status === 'rejected'
                      ? "/Images/masajed/kartabl-darkhast/rad/rad.svg"
                      : data?.data?.data?.status === 'done'
                        ? "/Images/masajed/kartabl-darkhast/rad/tik.svg"
                        : "/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"
                  : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming'].includes(data?.data?.data?.step)
                    ? "/Images/masajed/kartabl-darkhast/jari/tik.svg"
                    : "/Images/masajed/kartabl-darkhast/jari/tik1.svg"
                }
              />
            </div>
            <div className={`flex-grow border-r border-dashed min-h-[18px] ${
              (data?.data?.data?.step === 'approval_deputy_for_planning_and_programming' && data?.data?.data?.status != null)
                ? data?.data?.data?.status === 'in_progress'
                  ? "border-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "border-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "border-[#25C7AA]"
                      : "border-[#F6BB00]"
                : data?.data?.data?.step === 'finish'
                  ? "border-[#25C7AA]" 
                  : "border-[#959595]"
            }`}></div>
          </div>
          
          <div className="flex flex-col flex-1 overflow-hidden pb-2">
            <span className={`text-sm ${
              (data?.data?.data?.step === 'approval_executive_vice_president_mosques' && data?.data?.data?.status != null)
                ? data?.data?.data?.status === 'in_progress'
                  ? "text-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "text-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "text-[#25C7AA]"
                      : "text-[#F6BB00]"
                : data?.data?.data?.step === 'finish' || ['approval_deputy_for_planning_and_programming'].includes(data?.data?.data?.step)
                  ? "text-[#25C7AA]" 
                  : "text-[#959595]"
            } font-medium`}>تایید معاونت اجرایی مساجد</span>
            <p className="text-sm break-words overflow-hidden">{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
          </div>
        </div>

        {/* تایید معاونت طرح و برنامه */}
        <div className="flex items-start gap-4 w-full">
          <div className="flex flex-col items-center self-stretch">
            <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_deputy_for_planning_and_programming', 'تایید معاونت طرح و برنامه ')}>
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="وضعیت تایید"
                src={data?.data?.data?.step === 'approval_deputy_for_planning_and_programming' 
                  ? data?.data?.data?.status === 'in_progress' 
                    ? "/Images/masajed/kartabl-darkhast/jari/jari.svg"
                    : data?.data?.data?.status === 'rejected'
                      ? "/Images/masajed/kartabl-darkhast/rad/rad.svg"
                      : data?.data?.data?.status === 'done'
                        ? "/Images/masajed/kartabl-darkhast/rad/tik.svg"
                        : "/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"
                  : data?.data?.data?.step === 'finish'
                    ? "/Images/masajed/kartabl-darkhast/jari/tik.svg"
                    : "/Images/masajed/kartabl-darkhast/jari/tik1.svg"
                }
              />
            </div>
          </div>
          
          <div className="flex flex-col flex-1 overflow-hidden pb-2">
            <span className={`text-sm ${
              data?.data?.data?.step === 'approval_deputy_for_planning_and_programming'
                ? data?.data?.data?.status === 'in_progress'
                  ? "text-[#258CC7]"
                  : data?.data?.data?.status === 'rejected'
                    ? "text-[#D32F2F]"
                    : data?.data?.data?.status === 'done'
                      ? "text-[#25C7AA]"
                      : "text-[#F6BB00]"
                : data?.data?.data?.step === 'finish'
                  ? "text-[#25C7AA]" 
                  : "text-[#959595]"
            } font-medium`}>تایید معاونت طرح و برنامه</span>
            <p className="text-sm break-words overflow-hidden">{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-end justify-between">
        {/* تایید سر مربی مسجد */}
        {data?.data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_head_coach', 'تایید سر مربی مسجد')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید سر مربی مسجد</span>
              </>
            ) : data?.data?.data?.status == 'done' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_head_coach', 'تایید سر مربی مسجد')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/tik.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : data?.data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_head_coach', 'تایید سر مربی مسجد')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید سر مربی مسجد</span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_head_coach', 'تایید سر مربی مسجد')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید سر مربی مسجد</span>
              </>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full mr-10 2xl:mr-12">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_head_coach', 'تایید سر مربی مسجد')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید سر مربی مسجد</span>
          </div>
        )}

        {/* تایید مسئول فرهنگی مسجد */}
        {(data?.data?.data?.step == 'approval_mosque_cultural_officer' && data?.data?.data?.status != null) ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_cultural_officer', 'تایید مسئول فرهنگی مسجد ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید مسئول فرهنگی مسجد </span>
              </>
            ) : data?.data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_cultural_officer', 'تایید مسئول فرهنگی مسجد ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید مسئول فرهنگی مسجد </span>
              </>
            ) : data?.data?.data?.status == 'done' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_cultural_officer', 'تایید مسئول فرهنگی مسجد ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/tik.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_cultural_officer', 'تایید مسئول فرهنگی مسجد ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید مسئول فرهنگی مسجد </span>
              </>
            )}
          </div>
        ) : data?.data?.data?.step == 'approval_mosque_head_coach' || (data?.data?.data?.step == 'approval_mosque_cultural_officer' && data?.data?.data?.status == null) ? (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full mr-7 2xl:mr-9">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_cultural_officer', 'تایید مسئول فرهنگی مسجد ')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
            </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-40px]">تایید مسئول فرهنگی مسجد</span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full mr-7 2xl:mr-9">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_mosque_cultural_officer', 'تایید مسئول فرهنگی مسجد ')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-40px]">تایید مسئول فرهنگی مسجد</span>

          </div>
        )}
        
        {/* تایید  رابط منطقه */}
        {(data?.data?.data?.step == 'approval_area_interface' && data?.data?.data?.status != null) ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_area_interface', 'تایید  رابط منطقه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید  رابط منطقه </span>
              </>
            ) : data?.data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_area_interface', 'تایید  رابط منطقه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید  رابط منطقه </span>
              </>
            ) : data?.data?.data?.status == 'done' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_area_interface', 'تایید  رابط منطقه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/tik.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_area_interface', 'تایید  رابط منطقه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید  رابط منطقه </span>
              </>
            )}
          </div>
        ) : data?.data?.data?.step == 'approval_mosque_cultural_officer' || data?.data?.data?.step == 'approval_mosque_head_coach' || (data?.data?.data?.step == 'approval_area_interface' && data?.data?.data?.status == null) ? (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full mr-7 2xl:mr-9">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_area_interface', 'تایید  رابط منطقه ')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
            </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px] min-w-fit 2xl:mr-[-10px]">تایید  رابط منطقه</span>

          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full mr-7 2xl:mr-9">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_area_interface', 'تایید  رابط منطقه ')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px] min-w-fit 2xl:mr-[-10px]">تایید  رابط منطقه</span>

          </div>
        )}

        {/* تایید معاونت اجرایی مساجد */}
        {(data?.data?.data?.step == 'approval_executive_vice_president_mosques' && data?.data?.data?.status != null) ? (
          <div className="w-full flex flex-col items-start">
          {data?.data?.data?.status == 'in_progress' ? (
            <>
              <div className="flex items-center w-full mr-10 2xl:mr-12">
                <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_executive_vice_president_mosques', 'تایید معاونت اجرایی مساجد')}>
                  <Image
                    width={0}
                    height={0}
                    className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                  />
                </div>
                <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
              </div>
              <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت اجرایی مساجد </span>
            </>
          ) : data?.data?.data?.status == 'rejected' ? (
            <>
              <div className="flex items-center w-full mr-10 2xl:mr-12">
                <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_executive_vice_president_mosques', 'تایید معاونت اجرایی مساجد')}>
                  <Image
                    width={0}
                    height={0}
                    className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                  />
                </div>
                <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
              </div>
              <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت اجرایی مساجد </span>
            </>
          ) : data?.data?.data?.status == 'done' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_executive_vice_president_mosques', 'تایید معاونت اجرایی مساجد')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/tik.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
          ) : (
            <>
              <div className="flex items-center w-full mr-10 2xl:mr-12">
                <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_executive_vice_president_mosques', 'تایید معاونت اجرایی مساجد')}>
                  <Image
                    width={0}
                    height={0}
                    className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                  />
                </div>
                <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
              </div>
              <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت اجرایی مساجد </span>
            </>
          )}
        </div>
        ) : data?.data?.data?.step == 'approval_area_interface' || data?.data?.data?.step == 'approval_mosque_cultural_officer' || data?.data?.data?.step == 'approval_mosque_head_coach' || (data?.data?.data?.step == 'approval_executive_vice_president_mosques' && data?.data?.data?.status == null) ? (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full mr-7 2xl:mr-9">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_executive_vice_president_mosques', 'تایید معاونت اجرایی مساجد')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
            </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-48px]">تایید معاونت اجرایی مساجد</span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full mr-7 2xl:mr-9">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_executive_vice_president_mosques', 'تایید معاونت اجرایی مساجد')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-48px]">تایید معاونت اجرایی مساجد</span>
          </div>
        )}

        {/* تایید معاونت طرح و برنامه */}
        {data?.data?.data?.step == 'approval_deputy_for_planning_and_programming' ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_deputy_for_planning_and_programming', 'تایید معاونت طرح و برنامه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : data?.data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_deputy_for_planning_and_programming', 'تایید معاونت طرح و برنامه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : data?.data?.data?.status == 'done' ? (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_deputy_for_planning_and_programming', 'تایید معاونت طرح و برنامه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/tik.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full mr-10 2xl:mr-12">
                  <div className="flex items-center justify-center cursor-pointer" onClick={() => handleStepClick('approval_deputy_for_planning_and_programming', 'تایید معاونت طرح و برنامه ')}>
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            )}
          </div>
        ) : data?.data?.data?.step != 'finish' ? (
          <div className="w-full flex flex-col max-w-fit">
            <div className="flex items-center justify-center ml-14 2xl:ml-16 cursor-pointer" onClick={() => handleStepClick('approval_deputy_for_planning_and_programming', 'تایید معاونت طرح و برنامه ')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px]">تایید معاونت طرحی و برنامه</span>
          </div>
        ) : (
          <div className="w-full flex flex-col max-w-fit">
            <div className="flex items-center justify-center ml-14 2xl:ml-16 cursor-pointer" onClick={() => handleStepClick('approval_deputy_for_planning_and_programming', 'تایید معاونت طرح و برنامه ')}>
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px]">تایید معاونت طرح و برنامه</span>
          </div>
        )}
      </div>
      
      <div className="hidden lg:flex items-end justify-between">
        <div className="w-full flex flex-col items-start">
          <p>{data?.data?.data?.body}</p>
        </div>

        <div className="w-full flex flex-col items-start mr-10 2xl:mr-12">
          <p>{data?.data?.data?.messages?.mosque_cultural_officer}</p>
        </div>

        <div className="w-full flex flex-col items-start mr-10 2xl:mr-12">
          <p>{data?.data?.data?.messages?.area_interface}</p>
        </div>

        <div className="w-full flex flex-col items-start mr-10 2xl:mr-12">
          <p>{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
        </div>

        <div className="w-full flex flex-col items-start mr-10 2xl:mr-12">
          <p>{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
        </div>
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
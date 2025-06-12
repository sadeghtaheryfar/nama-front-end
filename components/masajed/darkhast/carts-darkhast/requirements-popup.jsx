import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";

const RequirementItem = ({ requirement, itemId, onClosePopup, level = 0 }) => {
  const isCompleted = requirement.completed_cycle > 0;
  const isActive = requirement.active;
  const hasPendingRequests = requirement.previous_requests > 0;
  const hasSubRequirements = requirement.requirements && requirement.requirements.length > 0; 

  let buttonContent;
  let buttonClass;
  let isButtonDisabled = false;

  if (!isActive) {
    buttonContent = "غیر فعال";
    buttonClass = "text-xs px-2 py-0.5 border border-red-600 text-red-600 bg-red-50 rounded whitespace-nowrap cursor-not-allowed";
    isButtonDisabled = true;
  } else {
    if (isCompleted) {
      buttonContent = (
        <span className="flex items-center gap-1">
          تکمیل شده
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 10 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </span>
      );
      buttonClass = "text-xs px-2 py-0.5 border border-green-600 text-green-600 bg-green-50 rounded whitespace-nowrap cursor-not-allowed";
      isButtonDisabled = true;
    } else if (hasPendingRequests) {
      buttonContent = "ارسال شده";
      buttonClass = "text-xs px-2 py-0.5 border border-yellow-600 text-yellow-600 bg-yellow-50 rounded whitespace-nowrap cursor-not-allowed";
      isButtonDisabled = true;
    } else {
      buttonContent = "ثبت";
      buttonClass = "text-xs px-2 py-0.5 bg-[#39A894] text-white rounded hover:bg-[#39A894]/90 whitespace-nowrap";
      isButtonDisabled = false;
    }
  }

  const paddingRight = level * 2 + 'rem';

  return (
    <div className="relative pb-2">
      {/* خط عمودی راهنما (بخشی از شاخه از والد) */}
      {level > 0 && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-300"
          style={{ right: `calc(${paddingRight} - 2rem)` }}
        ></div>
      )}
      {/* خط افقی کوچک (وصل‌کننده به محتوای آیتم فعلی) */}
      {level > 0 && (
        <div
          className="absolute h-0.5 bg-gray-300 w-4" 
          style={{ top: '1.25rem', right: `calc(${paddingRight} - 2rem)` }}
        ></div>
      )}

      {/* ناحیه محتوای اصلی: flex برای عنوان و دکمه در یک خط */}
      <div
        className="flex items-center justify-between gap-2 py-1 pr-2"
        style={{ marginRight: paddingRight }}
      >
        <h3 className="font-bold text-sm text-gray-800">
          {requirement.title}
          <span className="text-xs text-[#808393] mr-2">(شناسه: {requirement.id})</span>
        </h3>
        
        {/* دکمه فشرده (به طور طبیعی به دلیل justify-between در سمت چپ قرار می‌گیرد) */}
        {isActive && !isCompleted && !hasPendingRequests ? (
          <Link href={`/${itemId}/darkhast/sabt?id=${requirement.id}`} onClick={onClosePopup}>
            <button className={buttonClass}>{buttonContent}</button>
          </Link>
        ) : (
          <button className={buttonClass} disabled={isButtonDisabled}>
            {buttonContent}
          </button>
        )}
      </div>

      {/* کانتینر برای فرزندان (زیرپیش‌نیازها) */}
      {hasSubRequirements && !isActive && (
        <div className="pt-1">
          {requirement.requirements.map((subReq) => (
            <RequirementItem
              key={subReq.id}
              requirement={subReq}
              itemId={itemId}
              onClosePopup={onClosePopup}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const RequirementsPopup = ({ requirements, onClose, itemId }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleOverlayClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (typeof document === 'undefined') {
    return null;
  }

  let portalRoot = document.getElementById('modal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-lg transform scale-95 transition-all duration-300 ease-out animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-[#39A894]">تکمیل پیش نیازها</h2>
        
        <p className="text-sm text-gray-700 mb-4 text-right leading-relaxed">
          برای فعال شدن و ثبت درخواست اصلی، لازم است ابتدا پیش‌نیازهای زیر را به ترتیب و اولویت تکمیل کنید. پیش‌نیازهایی که نیاز به اقدام شما دارند با دکمه "ثبت" مشخص شده‌اند و پس از تکمیل هر پیش‌نیاز، مراحل بعدی به صورت خودکار برای شما فعال خواهند شد.
        </p>

        {requirements.map((req) => (
          <RequirementItem
            key={req.id}
            requirement={req}
            itemId={itemId}
            onClosePopup={onClose}
            level={0}
          />
        ))}
      </div>
    </div>,
    portalRoot
  );
};

export default RequirementsPopup;
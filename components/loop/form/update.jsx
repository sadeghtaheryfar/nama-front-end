"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from 'react-hot-toast';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Cookies from "js-cookie";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const OPERATIONAL_AREA_OPTIONS = [
    { value: "آموزشی", label: "آموزشی" },
    { value: "پرورشی", label: "پرورشی" },
    { value: "فرهنگی", label: "فرهنگی" },
    { value: "هنری", label: "هنری" },
];

const SKILL_AREA_OPTIONS = [
    { value: "اردویی", label: "اردویی" },
    { value: "مهارت افزایی", label: "مهارت افزایی" },
    { value: "تعلیم و تربیتی", label: "تعلیم و تربیتی" },
    { value: "قرآنی", label: "قرآنی" },
    { value: "ورزشی", label: "ورزشی" },
    { value: "هنری", label: "هنری" },
    { value: "فرهنگی", label: "فرهنگی" },
    { value: "رسانه ای", label: "رسانه ای" },
];

const convertPersianDigitsToLatin = (s) => {
    if (!s) return '';
    return s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
};

const FloatingLabelInput = ({
    placeholder,
    type = 'text',
    required = false,
    id = '',
    register,
    name,
    errors,
    validationRules = {},
    isMultiLine = false,
    disabled = false,
    watch
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const watchedValue = watch(name);
    const hasValue = watchedValue !== null && watchedValue !== undefined && watchedValue !== '';
    const isActive = isFocused || hasValue;
    const inputId = id || `input-${placeholder.replace(/\s+/g, '-').toLowerCase()}`;

    const InputComponent = isMultiLine ? 'textarea' : 'input';

    const fieldError = errors[name] || name.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
            if (part.includes('[') && part.includes(']')) {
                const arrayKey = part.substring(0, part.indexOf('['));
                const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
                return acc[arrayKey]?.[index];
            }
            return acc[part];
        }
        return undefined;
    }, errors);


    return (
        <div className="relative w-full">
            <InputComponent
                id={inputId}
                type={type}
                {...register(name, validationRules)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`p-[1rem] border ${fieldError ? 'border-red-500' : 'border-[#EEEEEE]'} w-full rounded-[1rem] ${isMultiLine ? 'pt-[1.5rem] pb-[0.5rem] h-24' : 'pt-[1.5rem] pb-[0.5rem]'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={disabled}
            />
            <label
                htmlFor={inputId}
                className={`absolute ${fieldError ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-[#9796A1]'} transition-all duration-200 ${
                    isActive
                        ? 'text-xs top-[0.5rem] right-[1rem]'
                        : 'text-base top-[1rem] right-[1rem]'
                }`}
            >
                {placeholder}<span style={{ fontFamily: "none" }}>{required ? ' *' : ''}</span>
            </label>
            {fieldError && (
                <span className="text-red-500 text-xs mt-1 block">
                    {fieldError.message}
                </span>
            )}
        </div>
    );
};

const FloatingLabelSelect = ({
    placeholder,
    required = false,
    id = '',
    register,
    name,
    errors,
    validationRules = {},
    options = [],
    disabled = false,
    watch
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const watchedValue = watch(name);
    const hasValue = watchedValue !== null && watchedValue !== undefined && watchedValue !== '';
    const isActive = isFocused || hasValue;
    const selectId = id || `select-${placeholder.replace(/\s+/g, '-').toLowerCase()}`;

    const fieldError = errors[name] || name.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
            if (part.includes('[') && part.includes(']')) {
                const arrayKey = part.substring(0, part.indexOf('['));
                const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
                return acc[arrayKey]?.[index];
            }
            return acc[part];
        }
        return undefined;
    }, errors);


    return (
        <div className="relative w-full">
            <select
                id={selectId}
                {...register(name, validationRules)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`p-[1rem] border ${fieldError ? 'border-red-500' : 'border-[#EEEEEE]'} w-full rounded-[1rem] pt-[1.5rem] pb-[0.5rem] appearance-none ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={disabled}
            >
                <option value=""></option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label
                htmlFor={selectId}
                className={`absolute ${fieldError ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-[#9796A1]'} transition-all duration-200 ${
                    isActive
                        ? 'text-xs top-[0.5rem] right-[1rem]'
                        : 'text-base top-[1rem] right-[1rem]'
                }`}
            >
                {placeholder}<span style={{ fontFamily: "none" }}>{required ? ' *' : ''}</span>
            </label>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="#9796A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            {fieldError && (
                <span className="text-red-500 text-xs mt-1 block">
                    {fieldError.message}
                </span>
            )}
        </div>
    );
};

const FileInput = ({
    label,
    id,
    name,
    register,
    errors,
    required = false,
    multiple = false,
    validationRules = {},
    selectedFileNames = [],
    setValue,
    watch,
    isImagePreview = false,
    accept = '',
    uploadProgress,
    isUploading,
    disabled = false,
    initialImageUrl = null
}) => {
    const inputId = id || `file-input-${name}`;
    const fieldError = errors[name] || name.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
            if (part.includes('[') && part.includes(']')) {
                const arrayKey = part.substring(0, part.indexOf('['));
                const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
                return acc[arrayKey]?.[index];
            }
            return acc[part];
        }
        return undefined;
    }, errors);

    const watchedFiles = watch(name);
    const displayImage = (watchedFiles && watchedFiles.length > 0)
        ? URL.createObjectURL(watchedFiles[0])
        : initialImageUrl;

    return (
        <div className="relative w-full">
            <input
                id={inputId}
                type="file"
                multiple={multiple}
                {...register(name, validationRules)}
                className="hidden"
                accept={accept}
                disabled={disabled}
            />
            <label
                htmlFor={inputId}
                className={`absolute text-xs top-[0.5rem] right-[1rem] ${fieldError ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-[#9796A1]'} transition-all duration-200`}
            >
                {label}<span style={{ fontFamily: "none" }}>{required ? ' *' : ''}</span>
            </label>
            <div
                className={`p-[1rem] border ${fieldError ? 'border-red-500' : 'border-[#EEEEEE]'} w-full rounded-[1rem] pt-[1.5rem] pb-[0.5rem] flex items-center justify-between cursor-pointer ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && document.getElementById(inputId).click()}
            >
                <span className="text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap ml-2">
                    {selectedFileNames.length > 0
                        ? selectedFileNames.join(', ')
                        : (initialImageUrl && !watchedFiles?.length)
                            ? 'عکس موجود است'
                            : `انتخاب ${label.includes('عکس') ? 'عکس' : label.includes('فیلم') ? 'فیلم' : 'فایل'}`
                    }
                </span>
                <button
                    type="button"
                    className={`text-white bg-[#0068B2] rounded px-3 py-1 text-sm flex-shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        !disabled && document.getElementById(inputId).click();
                    }}
                    disabled={disabled}
                >
                    {selectedFileNames.length > 0 || initialImageUrl ? 'انتخاب مجدد' : 'انتخاب'}
                </button>
            </div>
            {fieldError && (
                <span className="text-red-500 text-xs mt-1 block">
                    {fieldError.message}
                </span>
            )}
            {isUploading && uploadProgress > 0 && (
                <div className="flex justify-center w-full items-center mt-2">
                    <div className="mt-4 w-24 h-24">
                        <CircularProgressbar
                            value={uploadProgress}
                            text={`${uploadProgress}%`}
                            styles={buildStyles({
                                rotation: 0.25,
                                strokeLinecap: 'butt',
                                textSize: '16px',
                                pathTransitionDuration: 0.5,
                                pathColor: `rgba(57, 168, 148, ${uploadProgress / 100})`,
                                textColor: '#39A894',
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                            })}
                        />
                        <p className="text-center text-sm mt-2">در حال آپلود فایل‌ها...</p>
                    </div>
                </div>
            )}
             {isImagePreview && displayImage && (
                <div className="relative w-full p-[1rem] rounded-[1rem] pt-[1.5rem] pb-[0.5rem]">
                    <label className={`absolute text-xs top-[0.5rem] right-[1rem] text-[#9796A1] transition-all duration-200`}>
                        پیش نمایش عکس پرسنلی
                    </label>
                    <img
                        src={displayImage}
                        alt="پیش نمایش عکس پرسنلی"
                        className="mt-2 w-24 h-24 object-cover rounded-[0.5rem]"
                    />
                </div>
            )}
        </div>
    );
};

const Form = ({ initialData, itemId }) => {
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors }, watch, setValue, reset } = useForm({
        defaultValues: {
            loop_name: '',
            trainer_full_name: '',
            trainer_national_code: '',
            trainer_date_of_birth: '',
            trainer_postal_code: '',
            trainer_address: '',
            trainer_phone_number: '',
            trainer_education_level: '',
            trainer_field_of_study: '',
            trainer_job: '',
            trainer_sheba_number: '',
            trainer_skill_domain: [],
            trainer_loop_functional_domain: [],
            trainer_profile_picture: null,
            trainer_additional_info: '',
            members: [{
                full_name: '',
                national_code: '',
                date_of_birth: '',
                postal_code: '',
                address: '',
                phone_number: '',
                father_name: '',
                profile_picture: null,
                additional_info: ''
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "members",
    });
    const [isTrainerMyself, setIsTrainerMyself] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const today = new Date();

    // States for delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingLoop, setIsDeletingLoop] = useState(false); // Not used for member deletion
    const [memberToDelete, setMemberToDelete] = useState(null);

    // Effect to pre-fill the form when initialData is provided (for update mode)
    useEffect(() => {
        if (initialData) {
            reset({
                loop_name: initialData.title || '',
                trainer_full_name: initialData.name || '',
                trainer_national_code: initialData.national_code || '',
                // Convert Gregorian birthdate from initialData to Persian for DatePicker
                trainer_date_of_birth: initialData.birthdate ? new DateObject({
                    date: initialData.birthdate.split(' ')[0],
                    calendar: gregorian, // Specify that the input date is Gregorian
                }).convert(persian).format("YYYY-MM-DD") : '', // Format to YYYY-MM-DD in Persian

                trainer_postal_code: initialData.postal_code || '',
                trainer_address: initialData.address || '',
                trainer_phone_number: initialData.phone || '',
                trainer_education_level: initialData.level_of_education || '',
                trainer_field_of_study: initialData.field_of_study || '',
                trainer_job: initialData.job || '',
                trainer_sheba_number: initialData.sheba_number || '',
                trainer_skill_domain: initialData.skill_area || [],
                trainer_loop_functional_domain: initialData.functional_area || [],
                trainer_profile_picture: null,
                trainer_additional_info: initialData.description || '',

                members: initialData.members?.map(member => ({
                    id: member.id, // Keep the member ID for deletion purposes
                    full_name: member.name || '',
                    national_code: member.national_code || '',
                    // Convert Gregorian birthdate for members too
                    date_of_birth: member.birthdate ? new DateObject({
                        date: member.birthdate.split(' ')[0],
                        calendar: gregorian,
                    }).convert(persian).format("YYYY-MM-DD") : '',
                    postal_code: member.postal_code || '',
                    address: member.address || '',
                    phone_number: member.phone || '',
                    father_name: member.father_name || '',
                    profile_picture: null,
                    additional_info: member.description || '',
                })) || [{
                    full_name: '',
                    national_code: '',
                    date_of_birth: '',
                    postal_code: '',
                    address: '',
                    phone_number: '',
                    father_name: '',
                    profile_picture: null,
                    additional_info: ''
                }]
            });
        }
    }, [initialData, reset]);

    const handleAddMember = () => {
        append({
            full_name: '',
            national_code: '',
            date_of_birth: '',
            postal_code: '',
            address: '',
            phone_number: '',
            father_name: '',
            profile_picture: null,
            additional_info: ''
        });
    };

    const [loadingdelete, setLoadingdelete] = useState(false);
    const confirmDelete = async () => {
        setLoadingdelete(true);
        try {
            await axios.delete(`https://arman.armaniran.org/api/v1/rings/${initialData.id}/${memberToDelete.id}?item_id=${itemId}&role=mosque_head_coach`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                }
            });
            toast.success("دانش آموز با موفقیت حذف شد.");

            const updatedLoopData = await axios.get(`https://arman.armaniran.org/api/v1/rings/${initialData.id}?item_id=${itemId}&role=mosque_head_coach`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                }
            });
            if (updatedLoopData.data && updatedLoopData.data.data) {
                const newInitialData = updatedLoopData.data.data;
                reset({
                    loop_name: newInitialData.title || '',
                    trainer_full_name: newInitialData.name || '',
                    trainer_national_code: newInitialData.national_code || '',
                    trainer_date_of_birth: newInitialData.birthdate ? new DateObject({
                        date: newInitialData.birthdate.split(' ')[0],
                        calendar: gregorian,
                    }).convert(persian).format("YYYY-MM-DD") : '',
                    trainer_postal_code: newInitialData.postal_code || '',
                    trainer_address: newInitialData.address || '',
                    trainer_phone_number: newInitialData.phone || '',
                    trainer_education_level: newInitialData.level_of_education || '',
                    trainer_field_of_study: newInitialData.field_of_study || '',
                    trainer_job: newInitialData.job || '',
                    trainer_sheba_number: newInitialData.sheba_number || '',
                    trainer_skill_domain: newInitialData.skill_area || [],
                    trainer_loop_functional_domain: newInitialData.functional_area || [],
                    trainer_profile_picture: null,
                    trainer_additional_info: newInitialData.description || '',
                    members: newInitialData.members?.map(member => ({
                        id: member.id, // Make sure to keep the member ID
                        full_name: member.name || '',
                        national_code: member.national_code || '',
                        date_of_birth: member.birthdate ? new DateObject({
                            date: member.birthdate.split(' ')[0],
                            calendar: gregorian,
                        }).convert(persian).format("YYYY-MM-DD") : '',
                        postal_code: member.postal_code || '',
                        address: member.address || '',
                        phone_number: member.phone || '',
                        father_name: member.father_name || '',
                        profile_picture: null,
                        additional_info: member.description || '',
                    })) || []
                });
            }
            setShowDeleteModal(false);
            setMemberToDelete(null);
        } catch (error) {
            console.error("Error during deletion:", error);
            toast.error("خطا در حذف. لطفا مجددا تلاش کنید.");
            setShowDeleteModal(false);
            setMemberToDelete(null);
        }finally{
            setLoadingdelete(false);
        }
    };


    const onSubmit = async (data) => {
        setIsUploading(true);
        setUploadProgress(0);

        const formdata = new FormData();
        formdata.append("title", data.loop_name);

        if (itemId) {
            formdata.append("item_id", itemId);
        }

        if (!isTrainerMyself) {
            formdata.append("name", data.trainer_full_name);
            formdata.append("national_code", data.trainer_national_code);
            // Change: Send Persian date with Latin digits, format YYYY/MM/DD
            if (data.trainer_date_of_birth) {
                const latinDigitsDate = convertPersianDigitsToLatin(data.trainer_date_of_birth);
                formdata.append("birthdate", latinDigitsDate);
            } else {
                formdata.append("birthdate", '');
            }

            formdata.append("postal_code", data.trainer_postal_code);
            formdata.append("address", data.trainer_address);
            formdata.append("phone", data.trainer_phone_number);
            formdata.append("level_of_education", data.trainer_education_level);
            formdata.append("field_of_study", data.trainer_field_of_study);
            formdata.append("job", data.trainer_job);
            formdata.append("sheba_number", data.trainer_sheba_number);

            if (data.trainer_skill_domain && Array.isArray(data.trainer_skill_domain)) {
                data.trainer_skill_domain.forEach((skill) => {
                    formdata.append(`skill_area[]`, skill);
                });
            }
            if (data.trainer_loop_functional_domain && Array.isArray(data.trainer_loop_functional_domain)) {
                data.trainer_loop_functional_domain.forEach((area) => {
                    formdata.append(`functional_area[]`, area);
                });
            }

            if (data.trainer_profile_picture && data.trainer_profile_picture.length > 0) {
                formdata.append("image", data.trainer_profile_picture[0], data.trainer_profile_picture[0].name);
            } else if (initialData?.image?.original) {
                formdata.append("image_url", initialData.image.original);
            } else {
                // If no new file and no initial image, you might want to explicitly send an empty string or null
                // to signal deletion if that's how your API works.
            }

            if (data.trainer_additional_info) {
                formdata.append("description", data.trainer_additional_info);
            }
        }


        if (data.members && Array.isArray(data.members)) {
            data.members.forEach((member, index) => {
                formdata.append(`members[${index}][name]`, member.full_name || '');
                formdata.append(`members[${index}][national_code]`, member.national_code || '');
                // Change: Send Persian date with Latin digits, format YYYY/MM/DD
                if (member.date_of_birth) {
                    const latinDigitsDate = convertPersianDigitsToLatin(member.date_of_birth);
                    formdata.append(`members[${index}][birthdate]`, latinDigitsDate);
                } else {
                    formdata.append(`members[${index}][birthdate]`, '');
                }
                
                formdata.append(`members[${index}][postal_code]`, member.postal_code || '');
                formdata.append(`members[${index}][address]`, member.address || '');
                formdata.append(`members[${index}][phone]`, member.phone_number || '');
                formdata.append(`members[${index}][father_name]`, member.father_name || '');

                if (member.profile_picture && member.profile_picture.length > 0) {
                    formdata.append(`members[${index}][image]`, member.profile_picture[0], member.profile_picture[0].name);
                } else if (initialData?.members?.[index]?.image?.original) {
                    formdata.append(`members[${index}][image_url]`, initialData.members[index].image.original);
                } else {
                    //
                }

                if (member.additional_info) {
                    formdata.append(`members[${index}][description]`, member.additional_info);
                }

                // If member has an ID (meaning it's an existing member), include it
                if (initialData?.members?.[index]?.id) {
                    formdata.append(`members[${index}][id]`, initialData.members[index].id);
                }
            });
        }

        try {
            const token = Cookies.get("token");
            let response;
            const url = `https://arman.armaniran.org/api/v1/rings/${initialData?.id}?item_id=${itemId}&role=mosque_head_coach`;

            formdata.append('_method', 'PATCH');

            response = await axios({
                method: 'POST', // Use POST with _method=PATCH
                url: url,
                data: formdata,
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setIsUploading(false);
            if (response.status === 200 || response.status === 201) {
                toast.success(`فرم با موفقیت ${itemId ? 'ویرایش' : 'ثبت'} شد! به زودی به صفحه اصلی منتقل میشوید`);

                setTimeout(() => {
                    router.push(`/loop`);
                }, 3000);
            }

        } catch (error) {
            setIsUploading(false);
            console.error("Submission Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                const errorResponse = error.response.data;
                toast.error(`خطا در ${itemId ? 'ویرایش' : 'ثبت'} فرم: ${errorResponse.message || "خطای ناشناخته"}`);
                if (errorResponse.errors) {
                    Object.keys(errorResponse.errors).forEach(key => {
                        const errorMessage = errorResponse.errors[key][0];
                        toast.error(`${key}: ${errorMessage}`);
                    });
                }
            } else {
                toast.error("خطا در ارسال فرم.");
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
                    <div className="w-full border-b pb-[1rem]">
                        <FloatingLabelInput
                            id="loop_name"
                            name="loop_name"
                            placeholder="نام حلقه را اینجا بنویسید"
                            required={true}
                            register={register}
                            errors={errors}
                            watch={watch}
                            validationRules={{
                                required: "نام حلقه الزامی است"
                            }}
                        />
                    </div>

                    <div className="mt-[1rem]">
                        <h3 className="text-[18px] font-semibold">مشخصات مربی حلقه</h3>

                        {/* You can re-enable this if you want the "Moby myself" checkbox */}
                        {/* <div className="flex justify-start items-center">
                            <input
                                type="checkbox"
                                name="me"
                                id="me"
                                className="ml-[0.5rem]"
                                onChange={(e) => setIsTrainerMyself(e.target.checked)}
                            />
                            <label htmlFor="me" className="mr-[0.5rem]">مربی خودم هستم.</label>
                        </div> */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 mt-[1rem]">
                            <FloatingLabelInput
                                id="trainer_full_name"
                                name="trainer_full_name"
                                placeholder="نام و نام خانوادگی"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "نام و نام خانوادگی مربی الزامی است"
                                }}
                            />

                            <FloatingLabelInput
                                id="trainer_national_code"
                                name="trainer_national_code"
                                placeholder="کد ملی"
                                type="text"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "کد ملی مربی الزامی است",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "کد ملی نامعتبر است (10 رقم)"
                                    }
                                }}
                            />

                            <div className="relative w-full">
                                <Controller
                                    control={control}
                                    name="trainer_date_of_birth"
                                    rules={{
                                        required: isTrainerMyself ? false : "تاریخ تولد مربی الزامی است",
                                        validate: value => {
                                            if (value) {
                                                // Convert the displayed Persian date back to Gregorian for validation against 'today'
                                                const gregorianDateFromPicker = new DateObject({
                                                    date: value,
                                                    calendar: persian,
                                                }).convert(gregorian).toDate(); // Convert to standard JS Date object

                                                if (gregorianDateFromPicker > today) {
                                                    return "تاریخ تولد نمی‌تواند از تاریخ امروز بیشتر باشد";
                                                }
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field }) => (
                                        <div className='w-full'>
                                            <label
                                                htmlFor="trainer_date_of_birth"
                                                className={`absolute text-xs top-[0.5rem] right-[1rem] ${errors.trainer_date_of_birth ? 'text-red-500' : 'text-[#9796A1]'} transition-all duration-200`}
                                            >
                                                تاریخ تولد{isTrainerMyself ? '' : ' *'}
                                            </label>
                                            <DatePicker
                                                calendar={persian}
                                                editable={false}
                                                locale={persian_fa}
                                                value={field.value}
                                                onChange={(date) => {
                                                    const formattedDate = date ? date.format("YYYY-MM-DD") : ""; // This will be Persian YYYY-MM-DD
                                                    const latinFormattedDate = convertPersianDigitsToLatin(formattedDate);
                                                    field.onChange(latinFormattedDate);
                                                }}
                                                inputClass={`p-[1rem] border ${errors.trainer_date_of_birth ? 'border-red-500' : 'border-[#EEEEEE]'} rounded-[1rem] pt-[1.5rem] pb-[0.5rem] w-full ${isTrainerMyself ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                calendarPosition="bottom-right"
                                                disabled={isTrainerMyself}
                                                // maxDate is a Gregorian Date object
                                                maxDate={today}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.trainer_date_of_birth && (
                                    <span className="text-red-500 text-xs mt-1 block">
                                        {errors.trainer_date_of_birth.message}
                                    </span>
                                )}
                            </div>

                            <FloatingLabelInput
                                id="trainer_postal_code"
                                name="trainer_postal_code"
                                placeholder="کد پستی"
                                type="text"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "کد پستی مربی الزامی است",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "کد پستی نامعتبر است (10 رقم)"
                                    }
                                }}
                            />

                            <div className="col-span-1 sm:col-span-2">
                                <FloatingLabelInput
                                    id="trainer_address"
                                    name="trainer_address"
                                    placeholder="آدرس"
                                    required={true}
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    isMultiLine={false}
                                    disabled={isTrainerMyself}
                                    validationRules={{
                                        required: isTrainerMyself ? false : "آدرس مربی الزامی است"
                                    }}
                                />
                            </div>

                            <FloatingLabelInput
                                id="trainer_phone_number"
                                name="trainer_phone_number"
                                placeholder="شماره تماس"
                                type="tel"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "شماره تماس مربی الزامی است",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "شماره تماس نامعتبر است"
                                    }
                                }}
                            />

                            <FloatingLabelInput
                                id="trainer_education_level"
                                name="trainer_education_level"
                                placeholder="میزان تحصیلات"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                validationRules={{
                                    required: isTrainerMyself ? false : "میزان تحصیلات مربی الزامی است"
                                }}
                            />

                            <FloatingLabelInput
                                id="trainer_field_of_study"
                                name="trainer_field_of_study"
                                placeholder="رشته تحصیلی"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                validationRules={{
                                    required: isTrainerMyself ? false : "رشته تحصیلی مربی الزامی است"
                                }}
                            />

                            <FloatingLabelInput
                                id="trainer_job"
                                name="trainer_job"
                                placeholder="شغل"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "شغل مربی الزامی است"
                                }}
                            />

                            <FloatingLabelInput
                                id="trainer_sheba_number"
                                name="trainer_sheba_number"
                                placeholder="شماره شبا به نام مربی"
                                type="text"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "شماره شبا مربی الزامی است",
                                    pattern: {
                                        value: /^IR\d{24}$/,
                                        message: "شماره شبا نامعتبر است (باید با IR شروع شود و 26 کاراکتر باشد)"
                                    }
                                }}
                            />

                            <div className="relative w-full p-[1rem] border rounded-[1rem] pt-[1.5rem] pb-[0.5rem] flex flex-wrap gap-2">
                                <label className={`absolute text-xs top-[0.5rem] right-[1rem] ${errors.trainer_skill_domain ? 'text-red-500' : 'text-[#9796A1]'} transition-all duration-200`}>
                                    حوزه مهارتی<span style={{ fontFamily: "none" }}> *</span>
                                </label>
                                {SKILL_AREA_OPTIONS.map((option) => (
                                    <label key={option.value} className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            value={option.value}
                                            {...register("trainer_skill_domain", {
                                                validate: (value) => {
                                                    if (!isTrainerMyself && watch("trainer_skill_domain")?.length === 0) {
                                                        return "حوزه مهارتی مربی الزامی است";
                                                    }
                                                    return true;
                                                }
                                            })}
                                            disabled={isTrainerMyself}
                                            checked={watch("trainer_skill_domain")?.includes(option.value) || false}
                                            onChange={(e) => {
                                                const currentValues = watch("trainer_skill_domain") || [];
                                                if (e.target.checked) {
                                                    setValue("trainer_skill_domain", [...currentValues, option.value]);
                                                } else {
                                                    setValue("trainer_skill_domain", currentValues.filter(val => val !== option.value));
                                                }
                                            }}
                                            className="ml-1"
                                        />
                                        {option.label}
                                    </label>
                                ))}
                                {errors.trainer_skill_domain && (
                                    <span className="text-red-500 text-xs mt-1 block w-full">
                                        {errors.trainer_skill_domain.message}
                                    </span>
                                )}
                            </div>

                            <div className="relative w-full p-[1rem] border rounded-[1rem] pt-[1.5rem] pb-[0.5rem] flex flex-wrap gap-2">
                                <label className={`absolute text-xs top-[0.5rem] right-[1rem] ${errors.trainer_loop_functional_domain ? 'text-red-500' : 'text-[#9796A1]'} transition-all duration-200`}>
                                    حوزه عملکردی حلقه<span style={{ fontFamily: "none" }}> *</span>
                                </label>
                                {OPERATIONAL_AREA_OPTIONS.map((option) => (
                                    <label key={option.value} className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            value={option.value}
                                            {...register("trainer_loop_functional_domain", {
                                                validate: (value) => {
                                                    if (!isTrainerMyself && watch("trainer_loop_functional_domain")?.length === 0) {
                                                        return "حوزه عملکردی حلقه الزامی است";
                                                    }
                                                    return true;
                                                }
                                            })}
                                            disabled={isTrainerMyself}
                                            checked={watch("trainer_loop_functional_domain")?.includes(option.value) || false}
                                            onChange={(e) => {
                                                const currentValues = watch("trainer_loop_functional_domain") || [];
                                                if (e.target.checked) {
                                                    setValue("trainer_loop_functional_domain", [...currentValues, option.value]);
                                                } else {
                                                    setValue("trainer_loop_functional_domain", currentValues.filter(val => val !== option.value));
                                                }
                                            }}
                                            className="ml-1"
                                        />
                                        {option.label}
                                    </label>
                                ))}
                                {errors.trainer_loop_functional_domain && (
                                    <span className="text-red-500 text-xs mt-1 block w-full">
                                        {errors.trainer_loop_functional_domain.message}
                                    </span>
                                )}
                            </div>

                            <FileInput
                                id="trainer_profile_picture"
                                name="trainer_profile_picture"
                                label="برای آپلود عکس پرسنلی کلیک کنید"
                                register={register}
                                errors={errors}
                                required={!isTrainerMyself && !(initialData?.image?.original || watch('trainer_profile_picture')?.length > 0)}
                                disabled={isTrainerMyself}
                                selectedFileNames={watch('trainer_profile_picture') && watch('trainer_profile_picture').length > 0 ? [watch('trainer_profile_picture')[0].name] : []}
                                setValue={setValue}
                                watch={watch}
                                validationRules={{
                                    required: isTrainerMyself ? false : (initialData?.image?.original ? false : "عکس پرسنلی مربی الزامی است")
                                }}
                                uploadProgress={uploadProgress}
                                isUploading={isUploading}
                                isImagePreview={true}
                                initialImageUrl={initialData?.image?.original}
                            />

                            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                                <FloatingLabelInput
                                    id="trainer_additional_info"
                                    name="trainer_additional_info"
                                    placeholder="توضیحات تکمیلی (دستاوردها، گواهی های اخذ شده و ...)"
                                    isMultiLine={true}
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    disabled={isTrainerMyself}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* باکس عضو حلقه */}
                {fields.map((field, index) => (
                    <div key={field.id} className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 lg:mt-2 container mx-auto md:p-9 xl:px-12">
                        <h3 className="text-[18px] font-semibold text-[#0068B2]">شماره {index + 1}: <span className="text-[14px] text-[#3B3B3B]">عضو حلقه</span> </h3>

                        {/* دکمه حذف عضو */}
                        {/* Only show delete button if the member already has an ID (i.e., exists in initialData) */}
                        <button
                            type="button"
                            onClick={() => {
                                // اگر عضو دارای id باشد (از بک‌اند آمده باشد)، از modal حذف API استفاده می‌کنیم
                                if (initialData?.members?.[index]?.id) {
                                    setMemberToDelete(initialData.members[index]);
                                    setIsDeletingLoop(false); // تأیید که حذف حلقه نیست
                                    setShowDeleteModal(true);
                                } else {
                                    // اگر عضو جدید باشد (فقط در فرم اضافه شده)، آن را مستقیماً از useFieldArray حذف می‌کنیم
                                    remove(index);
                                }
                            }}
                            className="absolute top-6 left-6 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 mt-[1rem]">
                            <FloatingLabelInput
                                id={`members_${index}_full_name`}
                                name={`members[${index}].full_name`}
                                placeholder="نام و نام خانوادگی"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                validationRules={{
                                    required: "نام و نام خانوادگی عضو الزامی است"
                                }}
                            />

                            <FloatingLabelInput
                                id={`members_${index}_national_code`}
                                name={`members[${index}].national_code`}
                                placeholder="کد ملی"
                                type="text"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                validationRules={{
                                    required: "کد ملی عضو الزامی است",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "کد ملی نامعتبر است (10 رقم)"
                                    }
                                }}
                            />

                            <div className="relative w-full">
                                <Controller
                                    control={control}
                                    name={`members[${index}].date_of_birth`}
                                    rules={{
                                        required: "تاریخ تولد عضو الزامی است",
                                        validate: value => {
                                            if (value) {
                                                // Convert the displayed Persian date back to Gregorian for validation
                                                const gregorianDateFromPicker = new DateObject({
                                                    date: value,
                                                    calendar: persian,
                                                }).convert(gregorian).toDate();

                                                if (gregorianDateFromPicker > today) {
                                                    return "تاریخ تولد نمی‌تواند از تاریخ امروز بیشتر باشد";
                                                }
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field }) => (
                                        <div className='w-full'>
                                            <label
                                                htmlFor={`members_${index}_date_of_birth`}
                                                className={`absolute text-xs top-[0.5rem] right-[1rem] ${errors.members?.[index]?.date_of_birth ? 'text-red-500' : 'text-[#9796A1]'} transition-all duration-200`}
                                            >
                                                تاریخ تولد *
                                            </label>
                                            <DatePicker
                                                editable={false}
                                                calendar={persian}
                                                locale={persian_fa}
                                                value={field.value}
                                                onChange={(date) => {
                                                    const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                                                    const latinFormattedDate = convertPersianDigitsToLatin(formattedDate);
                                                    field.onChange(latinFormattedDate);
                                                }}
                                                inputClass={`p-[1rem] border ${errors.members?.[index]?.date_of_birth ? 'border-red-500' : 'border-[#EEEEEE]'} rounded-[1rem] pt-[1.5rem] pb-[0.5rem] w-full`}
                                                calendarPosition="bottom-right"
                                                maxDate={today}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.members?.[index]?.date_of_birth && (
                                    <span className="text-red-500 text-xs mt-1 block">
                                        {errors.members[index].date_of_birth.message}
                                    </span>
                                )}
                            </div>

                            <FloatingLabelInput
                                id={`members_${index}_postal_code`}
                                name={`members[${index}].postal_code`}
                                placeholder="کد پستی"
                                type="text"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                validationRules={{
                                    required: "کد پستی عضو الزامی است",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "کد پستی نامعتبر است (10 رقم)"
                                    }
                                }}
                            />

                            <div className="col-span-1 sm:col-span-2">
                                <FloatingLabelInput
                                    id={`members_${index}_address`}
                                    name={`members[${index}].address`}
                                    placeholder="آدرس"
                                    required={true}
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    isMultiLine={false}
                                    validationRules={{
                                        required: "آدرس عضو الزامی است"
                                    }}
                                />
                            </div>

                            <FloatingLabelInput
                                id={`members_${index}_phone_number`}
                                name={`members[${index}].phone_number`}
                                placeholder="شماره تماس"
                                type="tel"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                validationRules={{
                                    required: "شماره تماس عضو الزامی است",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "شماره تماس نامعتبر است"
                                    }
                                }}
                            />

                            <FloatingLabelInput
                                id={`members_${index}_father_name`}
                                name={`members[${index}].father_name`}
                                placeholder="نام پدر"
                                required={true}
                                register={register}
                                errors={errors}
                                watch={watch}
                                validationRules={{
                                    required: "نام پدر عضو الزامی است"
                                }}
                            />

                            <FileInput
                                id={`members_${index}_profile_picture`}
                                name={`members[${index}].profile_picture`}
                                label="برای آپلود عکس پرسنلی کلیک کنید"
                                register={register}
                                errors={errors}
                                required={!(initialData?.members?.[index]?.image?.original || watch(`members[${index}].profile_picture`)?.length > 0)}
                                selectedFileNames={watch(`members[${index}].profile_picture`) && watch(`members[${index}].profile_picture`).length > 0 ? [watch(`members[${index}].profile_picture`)[0].name] : []}
                                setValue={setValue}
                                watch={watch}
                                validationRules={{
                                    required: initialData?.members?.[index]?.image?.original ? false : "عکس پرسنلی عضو الزامی است"
                                }}
                                uploadProgress={uploadProgress}
                                isUploading={isUploading}
                                isImagePreview={true}
                                initialImageUrl={initialData?.members?.[index]?.image?.original}
                            />

                            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                                <FloatingLabelInput
                                    id={`members_${index}_additional_info`}
                                    name={`members[${index}].additional_info`}
                                    placeholder="توضیحات تکمیلی (دستاوردها، گواهی های اخذ شده و ...)"
                                    isMultiLine={true}
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 lg:mt-2 container mx-auto md:p-9 xl:px-12">
                    <button
                        type="button"
                        onClick={handleAddMember}
                        className="w-full py-[1.5rem] px-[1rem] border-[2px] border-dashed rounded-[1rem] my-[1rem] gap-[1rem] text-[#0068B2] font-bold flex justify-center items-center"
                    >
                        <p>برای اضافه کردن نفر جدید کلیک کنید</p>

                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.3335 14H18.6668" stroke="#0068B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 18.6667V9.33337" stroke="#0068B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.5002 25.6667H17.5002C23.3335 25.6667 25.6668 23.3334 25.6668 17.5V10.5C25.6668 4.66671 23.3335 2.33337 17.5002 2.33337H10.5002C4.66683 2.33337 2.3335 4.66671 2.3335 10.5V17.5C2.3335 23.3334 4.66683 25.6667 10.5002 25.6667Z" stroke="#0068B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className="flex justify-center items-center">
                        <button type="submit" className="px-[2rem] py-[0.5rem] rounded-[0.5rem]  text-white bg-[#0068B2]" disabled={isUploading}>
                            {isUploading ? 'در حال ارسال...' : itemId ? 'تایید و ویرایش حلقه' : 'تایید و ثبت حلقه'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                        <p className="text-lg font-semibold mb-4">
                            {isDeletingLoop ? "آیا از حذف کامل حلقه اطمینان دارید؟" : "آیا از حذف این دانش آموز اطمینان دارید؟"}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                {loadingdelete ? 'صبر کنید ...' : 'بله، حذف کن'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setMemberToDelete(null); // Clear member to delete if cancelled
                                }}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                خیر، انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Form;
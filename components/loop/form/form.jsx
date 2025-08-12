"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from 'react-hot-toast';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Cookies from "js-cookie";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useClickAway } from 'react-use'; // Import useClickAway if not already
// import Select2Input from './Select2Input'; // Remove this import
import FloatingLabelMultiSelect from './FloatingLabelMultiSelect'; // Import the new component

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
// ... (rest of your existing imports and helper functions like convertPersianDigitsToLatin, FloatingLabelInput, FloatingLabelSelect, FileInput)

// ... (Your existing convertPersianDigitsToLatin, FloatingLabelInput, FloatingLabelSelect, FileInput components)

const convertPersianDigitsToLatin = (s) => {
    return s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۴۵۶۷۸۹'.indexOf(d));
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
    disabled = false
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(register(name)?.value || '');
    const isActive = isFocused || inputValue !== '';
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
                onChange={(e) => {
                    setInputValue(e.target.value);
                    register(name).onChange(e);
                }}
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
                {placeholder}<span style={{ fontFamily: "none",color: 'red' }}>{required ? ' *' : ''}</span>
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
    disabled = false
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectValue, setSelectValue] = useState(register(name)?.value || '');
    const isActive = isFocused || selectValue !== '';
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
                onChange={(e) => {
                    setSelectValue(e.target.value);
                    register(name).onChange(e);
                }}
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
                {placeholder}<span style={{ fontFamily: "none",color: 'red' }}>{required ? ' *' : ''}</span>
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
    disabled = false
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

    const filePreviews = watch(name) ? Array.from(watch(name)).map(file => ({
        url: URL.createObjectURL(file),
        name: file.name
    })) : [];

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
                {label}<span style={{ fontFamily: "none",color: 'red' }}>{required ? ' *' : ''}</span>
            </label>
            <div
                className={`p-[1rem] border ${fieldError ? 'border-red-500' : 'border-[#EEEEEE]'} w-full rounded-[1rem] pt-[1.5rem] pb-[0.5rem] flex items-center justify-between cursor-pointer ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && document.getElementById(inputId).click()}
            >
                <span className="text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap ml-2">
                    {selectedFileNames.length > 0
                        ? selectedFileNames.join(', ')
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
                    {selectedFileNames.length > 0 ? 'انتخاب مجدد' : 'انتخاب'}
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
        </div>
    );
};


const DataLoop = ({item_id}) => {
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm({
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
        trainer_skill_domain: [], // Keep as array for multi-select
        trainer_loop_functional_domain: [], // Keep as array for multi-select
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
    const [memberCount, setMemberCount] = useState(1);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const today = new Date();


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
    const onSubmit = async (data) => {
        setIsUploading(true);
        setUploadProgress(0);

        const formdata = new FormData();
        formdata.append("title", data.loop_name);
        if (!isTrainerMyself) {
            formdata.append("name", data.trainer_full_name);
            formdata.append("national_code", data.trainer_national_code);
            formdata.append("birthdate", data.trainer_date_of_birth);
            formdata.append("postal_code", data.trainer_postal_code);
            formdata.append("address", data.trainer_address);
            formdata.append("phone", data.trainer_phone_number);
            formdata.append("level_of_education", data.trainer_education_level);
            formdata.append("field_of_study", data.trainer_field_of_study);
            formdata.append("job", data.trainer_job);
            formdata.append("sheba_number", data.trainer_sheba_number);

            // trainer_skill_domain and trainer_loop_functional_domain are arrays
            if (data.trainer_skill_domain && Array.isArray(data.trainer_skill_domain)) {
                data.trainer_skill_domain.forEach((skill, index) => {
                    formdata.append(`skill_area[${index}]`, skill);
                });
            }

            if (data.trainer_loop_functional_domain && Array.isArray(data.trainer_loop_functional_domain)) {
                data.trainer_loop_functional_domain.forEach((area, index) => {
                    formdata.append(`functional_area[${index}]`, area);
                });
            }

            if (data.trainer_profile_picture && data.trainer_profile_picture.length > 0) {
                formdata.append("image", data.trainer_profile_picture[0], data.trainer_profile_picture[0].name);
            }
            if (data.trainer_additional_info) {
                formdata.append("description", data.trainer_additional_info);
            }
        }


        if (data.members && Array.isArray(data.members)) {
            data.members.forEach((member, index) => {
                formdata.append(`members[${index}][name]`, member.full_name || '');
                formdata.append(`members[${index}][national_code]`, member.national_code || '');
                formdata.append(`members[${index}][birthdate]`, member.date_of_birth || '');
                formdata.append(`members[${index}][postal_code]`, member.postal_code || '');
                formdata.append(`members[${index}][address]`, member.address || '');
                formdata.append(`members[${index}][phone]`, member.phone_number || '');
                formdata.append(`members[${index}][father_name]`, member.father_name || '');
                if (member.profile_picture && member.profile_picture.length > 0) {
                    formdata.append(`members[${index}][image]`, member.profile_picture[0], member.profile_picture[0].name);
                }
                if (member.additional_info) {
                    formdata.append(`members[${index}][description]`, member.additional_info);
                }
            });
        }

        try {
            const token = Cookies.get("token"); // Get token from cookies
            const response = await axios.post(
                `https://arman.armaniran.org/api/v1/rings?item_id=${item_id}&role=mosque_head_coach`,
                formdata,
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}` // Use Bearer token
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            setIsUploading(false);
            if (response.status === 201) {
                toast.success("فرم با موفقیت ثبت شد! به زودی به صفحه اصلی منتقل میشوید");

                setTimeout(() => {
                    router.push(`/loop`);
                }, 3000);
            }

        } catch (error) {
            setIsUploading(false);
            console.error("Submission Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                const errorResponse = error.response.data;
                toast.error(`خطا در ثبت فرم: ${errorResponse.message || "خطای ناشناخته"}`);
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
                            validationRules={{
                                required: "نام حلقه الزامی است"
                            }}
                        />
                    </div>

                    <div className="mt-[1rem]">
                        <h3 className="text-[18px] font-semibold">مشخصات مربی حلقه</h3>

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
                                                const selectedDate = new Date(value.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3'));
                                                if (selectedDate > today) {
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
                                                تاریخ تولد<span style={{ fontFamily: "none",color: 'red' }}>{!isTrainerMyself ? ' *' : ''}</span>
                                            </label>
                                            <DatePicker
                                                calendar={persian}
                                                editable={false}
                                                locale={persian_fa}
                                                value={field.value}
                                                onChange={(date) => {
                                                    const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                                                    const latinFormattedDate = convertPersianDigitsToLatin(formattedDate);
                                                    field.onChange(latinFormattedDate);
                                                }}
                                                inputClass={`p-[1rem] border ${errors.trainer_date_of_birth ? 'border-red-500' : 'border-[#EEEEEE]'} rounded-[1rem] pt-[1.5rem] pb-[0.5rem] w-full ${isTrainerMyself ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                calendarPosition="bottom-right"
                                                disabled={isTrainerMyself}
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
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "کد پستی مربی الزامی است",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "کد ملی نامعتبر است (10 رقم)"
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
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "شماره شبا مربی الزامی است",
                                    pattern: {
                                        value: /^IR\d{24}$/,
                                        message: "شماره شبا نامعتبر است (باید با IR شروع شود و 26 کاراکتر باشد)"
                                    }
                                }}
                            />

                            {/* Use FloatingLabelMultiSelect for Skill Area */}
                            <Controller
                                name="trainer_skill_domain"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (!isTrainerMyself && (!value || value.length === 0)) {
                                            return "حوزه مهارتی مربی الزامی است";
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field }) => (
                                    <FloatingLabelMultiSelect
                                        placeholder="حوزه مهارتی"
                                        required={!isTrainerMyself}
                                        id="trainer_skill_domain"
                                        control={control}
                                        field={field}
                                        name={field.name}
                                        errors={errors}
                                        options={SKILL_AREA_OPTIONS}
                                        disabled={isTrainerMyself}
                                    />
                                )}
                            />

                            {/* Use FloatingLabelMultiSelect for Operational Area */}
                            <Controller
                                name="trainer_loop_functional_domain"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (!isTrainerMyself && (!value || value.length === 0)) {
                                            return "حوزه عملکردی حلقه الزامی است";
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field }) => (
                                    <FloatingLabelMultiSelect
                                        placeholder="حوزه عملکردی حلقه"
                                        required={!isTrainerMyself}
                                        id="trainer_loop_functional_domain"
                                        control={control}
                                        name={field.name}
                                        field={field}
                                        errors={errors}
                                        options={OPERATIONAL_AREA_OPTIONS}
                                        disabled={isTrainerMyself}
                                    />
                                )}
                            />

                            <FileInput
                                id="trainer_profile_picture"
                                name="trainer_profile_picture"
                                label="برای آپلود عکس پرسنلی کلیک کنید"
                                register={register}
                                errors={errors}
                                required={!isTrainerMyself}
                                disabled={isTrainerMyself}
                                selectedFileNames={watch('trainer_profile_picture') && watch('trainer_profile_picture').length > 0 ? [watch('trainer_profile_picture')[0].name] : []}
                                setValue={setValue}
                                watch={watch}
                                validationRules={{
                                    required: isTrainerMyself ? false : "عکس پرسنلی مربی الزامی است"
                                }}
                                uploadProgress={uploadProgress}
                                isUploading={isUploading}
                                isImagePreview={true}
                            />

                            <div className="relative w-full p-[1rem] rounded-[1rem] pt-[1.5rem] pb-[0.5rem]">
                                <label className={`absolute text-xs top-[0.5rem] right-[1rem] text-[#9796A1] transition-all duration-200`}>
                                    پیش نمایش عکس پرسنلی
                                </label>
                                {watch('trainer_profile_picture') && watch('trainer_profile_picture')[0] && (
                                    <img
                                        src={URL.createObjectURL(watch('trainer_profile_picture')[0])}
                                        alt="پیش نمایش عکس پرسنلی"
                                        className="mt-2 w-24 h-24 object-cover rounded-[0.5rem]"
                                    />
                                )}
                            </div>

                            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                                <FloatingLabelInput
                                    id="trainer_additional_info"
                                    name="trainer_additional_info"
                                    placeholder="توضیحات تکمیلی (دستاوردها، گواهی های اخذ شده و ...)"
                                    isMultiLine={true}
                                    register={register}
                                    errors={errors}
                                    disabled={isTrainerMyself}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* باکس عضو حلقه */}
                {fields.map((field, index) => (
                    <div key={index} className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 lg:mt-2 container mx-auto md:p-9 xl:px-12">
                        <h3 className="text-[18px] font-semibold text-[#0068B2]">شماره {index + 1}: <span className="text-[14px] text-[#3B3B3B]">عضو حلقه</span> </h3>

                        {/* دکمه حذف عضو */}
                        {fields.length > 1 && ( // Only show remove button if there's more than one member
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-6 left-6 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 1 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 mt-[1rem]">
                            <FloatingLabelInput
                                id={`members_${index}_full_name`}
                                name={`members[${index}].full_name`}
                                placeholder="نام و نام خانوادگی"
                                required={true}
                                register={register}
                                errors={errors}
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
                                                const selectedDate = new Date(value.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3'));
                                                if (selectedDate > today) {
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
                                                تاریخ تولد <span style={{ fontFamily: "none",color: 'red' }}>{!isTrainerMyself ? ' *' : ''}</span>
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
                                validationRules={{
                                    required: "کد پستی عضو الزامی است",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "کد ملی نامعتبر است (10 رقم)"
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
                                required={true}
                                selectedFileNames={watch(`members[${index}].profile_picture`) && watch(`members[${index}].profile_picture`).length > 0 ? [watch(`members[${index}].profile_picture`)[0].name] : []}
                                setValue={setValue}
                                watch={watch}
                                validationRules={{
                                    required: "عکس پرسنلی عضو الزامی است"
                                }}
                                uploadProgress={uploadProgress}
                                isUploading={isUploading}
                                isImagePreview={true}
                            />

                            <div className="relative w-full p-[1rem] rounded-[1rem] pt-[1.5rem] pb-[0.5rem]">
                                <label className={`absolute text-xs top-[0.5rem] right-[1rem] text-[#9796A1] transition-all duration-200`}>
                                    پیش نمایش عکس پرسنلی
                                </label>
                                {watch(`members[${index}].profile_picture`) && watch(`members[${index}].profile_picture`)[0] && (
                                    <img
                                        src={URL.createObjectURL(watch(`members[${index}].profile_picture`)[0])}
                                        alt="پیش نمایش عکس پرسنلی"
                                        className="mt-2 w-24 h-24 object-cover rounded-[0.5rem]"
                                    />
                                )}
                            </div>

                            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                                <FloatingLabelInput
                                    id={`members_${index}_additional_info`}
                                    name={`members[${index}].additional_info`}
                                    placeholder="توضیحات تکمیلی (دستاوردها، گواهی های اخذ شده و ...)"
                                    isMultiLine={true}
                                    register={register}
                                    errors={errors}
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
                            {isUploading ? 'در حال ارسال...' : 'تایید و ثبت حلقه'}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default DataLoop;
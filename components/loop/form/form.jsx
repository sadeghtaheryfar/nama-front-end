"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-hot-toast';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const convertPersianDigitsToLatin = (s) => {
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
    isMultiLine = false
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(register(name)?.value || '');
    const isActive = isFocused || inputValue !== '';
    const inputId = id || `input-${placeholder.replace(/\s+/g, '-').toLowerCase()}`;

    const InputComponent = isMultiLine ? 'textarea' : 'input';

    // Correctly access nested errors based on the 'name' string
    // This handles paths like 'members[0].full_name'
    const fieldError = errors[name] || name.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
            // Handle array access (e.g., members[0])
            if (part.includes('[') && part.includes(']')) {
                const arrayKey = part.substring(0, part.indexOf('['));
                const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
                return acc[arrayKey]?.[index];
            }
            // Handle object property access
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
                className={`p-[1rem] border ${fieldError ? 'border-red-500' : 'border-[#EEEEEE]'} w-full rounded-[1rem] ${isMultiLine ? 'pt-[1.5rem] pb-[0.5rem] h-24' : 'pt-[1.5rem] pb-[0.5rem]'}`}
            />
            <label
                htmlFor={inputId}
                className={`absolute ${fieldError ? 'text-red-500' : 'text-[#9796A1]'} transition-all duration-200 ${
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
    disabled = false
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectValue, setSelectValue] = useState(register(name)?.value || '');
    const isActive = isFocused || selectValue !== '';
    const selectId = id || `select-${placeholder.replace(/\s+/g, '-').toLowerCase()}`;

    // Correctly access nested errors based on the 'name' string
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
    setValue, // Pass setValue from useForm
    watch, // Pass watch from useForm
    filePreviews = [], // New prop for image/video previews
    isImagePreview = false, // New prop to indicate if it's an image preview
    accept = ''
}) => {
    const inputId = id || `file-input-${name}`;
    // Correctly access nested errors based on the 'name' string
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
            <input
                id={inputId}
                type="file"
                multiple={multiple}
                {...register(name, validationRules)}
                className="hidden" // Hide the actual input
                accept={accept}
            />
            <label
                htmlFor={inputId}
                className={`absolute text-xs top-[0.5rem] right-[1rem] ${fieldError ? 'text-red-500' : 'text-[#9796A1]'} transition-all duration-200`}
            >
                {label}<span style={{ fontFamily: "none" }}>{required ? ' *' : ''}</span>
            </label>
            <div className={`p-[1rem] border ${fieldError ? 'border-red-500' : 'border-[#EEEEEE]'} w-full rounded-[1rem] pt-[1.5rem] pb-[0.5rem] flex items-center justify-between cursor-pointer`}
                 onClick={() => document.getElementById(inputId).click()}>
                <span className="text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap ml-2">
                    {selectedFileNames.length > 0
                        ? selectedFileNames.join(', ')
                        : `انتخاب ${label.includes('عکس') ? 'عکس' : label.includes('فیلم') ? 'فیلم' : 'فایل'}`
                    }
                </span>
                <button type="button" className="text-white bg-[#0068B2] rounded px-3 py-1 text-sm flex-shrink-0">
                    {selectedFileNames.length > 0 ? 'انتخاب مجدد' : 'انتخاب'}
                </button>
            </div>
            {fieldError && (
                <span className="text-red-500 text-xs mt-1 block">
                    {fieldError.message}
                </span>
            )}
            {filePreviews.length > 0 && multiple && isImagePreview && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {filePreviews.map((preview, index) => (
                        <div key={preview.url} className="relative w-24 h-24 border rounded overflow-hidden">
                            <img src={preview.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => {
                                    const currentFiles = watch(name);
                                    const newFiles = Array.from(currentFiles).filter((_, i) => i !== index);
                                    const dataTransfer = new DataTransfer();
                                    newFiles.forEach(file => dataTransfer.items.add(file));
                                    setValue(name, dataTransfer.files, { shouldValidate: true });
                                    URL.revokeObjectURL(preview.url); // Clean up the object URL
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
             {selectedFileNames.length > 0 && multiple && !isImagePreview && ( // Fallback for non-image multiple files
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedFileNames.map((fileName, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                            <span>{fileName}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    const currentFiles = watch(name);
                                    const newFiles = Array.from(currentFiles).filter((_, i) => i !== index);
                                    const dataTransfer = new DataTransfer();
                                    newFiles.forEach(file => dataTransfer.items.add(file));
                                    setValue(name, dataTransfer.files, { shouldValidate: true });
                                }}
                                className="mr-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const DataLoop = () => {
    const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm();
    const [isTrainerMyself, setIsTrainerMyself] = useState(false);
    const [memberCount, setMemberCount] = useState(1); // Start with one member


    const handleAddMember = () => {
        setMemberCount(prevCount => prevCount + 1);
    };

    const onSubmit = (data) => {
        console.log(data);
        toast.success("فرم با موفقیت ثبت شد!");
        // Here you would typically send data to a backend
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

                        <div className="flex justify-start items-center">
                            <input
                                type="checkbox"
                                name="me"
                                id="me"
                                className="ml-[0.5rem]"
                                onChange={(e) => setIsTrainerMyself(e.target.checked)}
                            />
                            <label htmlFor="me" className="mr-[0.5rem]">مربی خودم هستم.</label>
                        </div>

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
                                    rules={{ required: isTrainerMyself ? false : "تاریخ تولد مربی الزامی است" }}
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
                                                    const formattedDate = date ? date.format("YYYY/MM/DD") : "";
                                                    const latinFormattedDate = convertPersianDigitsToLatin(formattedDate);
                                                    field.onChange(latinFormattedDate);
                                                }}
                                                inputClass={`p-[1rem] border ${errors.trainer_date_of_birth ? 'border-red-500' : 'border-[#EEEEEE]'} rounded-[1rem] pt-[1.5rem] pb-[0.5rem] w-full ${isTrainerMyself ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                calendarPosition="bottom-right"
                                                disabled={isTrainerMyself}
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

                            <FloatingLabelSelect
                                id="trainer_education_level"
                                name="trainer_education_level"
                                placeholder="میزان تحصیلات"
                                required={true}
                                register={register}
                                errors={errors}
                                disabled={isTrainerMyself}
                                options={[
                                    { value: "cycle", label: "سیکل" },
                                    { value: "diploma", label: "دیپلم" },
                                    { value: "bachelor", label: "لیسانس" },
                                    { value: "doctorate", label: "دکترا" },
                                ]}
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
                                disabled={isTrainerMyself}
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
                                        value: /^IR\d{24}$/, // Basic SHEBA format (IR + 24 digits)
                                        message: "شماره شبا نامعتبر است (باید با IR شروع شود و 26 کاراکتر باشد)"
                                    }
                                }}
                            />

                            <FloatingLabelSelect
                                id="trainer_skill_domain"
                                name="trainer_skill_domain"
                                placeholder="حوزه مهارتی"
                                required={true}
                                register={register}
                                errors={errors}
                                disabled={isTrainerMyself}
                                options={[
                                    { value: "frontend", label: "Front End" },
                                    { value: "backend", label: "Back End" },
                                ]}
                                validationRules={{
                                    required: isTrainerMyself ? false : "حوزه مهارتی مربی الزامی است"
                                }}
                            />

                            <FloatingLabelInput
                                id="trainer_loop_functional_domain"
                                name="trainer_loop_functional_domain"
                                placeholder="حوزه عملکردی حلقه"
                                required={true}
                                register={register}
                                errors={errors}
                                disabled={isTrainerMyself}
                                validationRules={{
                                    required: isTrainerMyself ? false : "حوزه عملکردی حلقه الزامی است"
                                }}
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
                {[...Array(memberCount)].map((_, index) => (
                    <div key={index} className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-8 lg:mt-2 container mx-auto md:p-9 xl:px-12">
                        <h3 className="text-[18px] font-semibold text-[#0068B2]">شماره {index + 1}: <span className="text-[14px] text-[#3B3B3B]">عضو حلقه</span> </h3>

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
                                    rules={{ required: "تاریخ تولد عضو الزامی است" }}
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
                                                    const formattedDate = date ? date.format("YYYY/MM/DD") : "";
                                                    const latinFormattedDate = convertPersianDigitsToLatin(formattedDate);
                                                    field.onChange(latinFormattedDate);
                                                }}
                                                inputClass={`p-[1rem] border ${errors.members?.[index]?.date_of_birth ? 'border-red-500' : 'border-[#EEEEEE]'} rounded-[1rem] pt-[1.5rem] pb-[0.5rem] w-full`}
                                                calendarPosition="bottom-right"
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
                        <button type="submit" className="px-[2rem] py-[0.5rem] rounded-[0.5rem]  text-white bg-[#0068B2]">تایید و ثبت حلقه</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default DataLoop;
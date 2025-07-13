"use client";
import HeaderMasjed from "./../../../../components/header-profile-loop/page";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import toast, { Toaster } from 'react-hot-toast';

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const TEHRAN_COORDS = [35.6892, 51.3890];

const LocationMapPickerNoSSR = dynamic(
  () => import("./LocationMapPicker"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[300px] text-gray-500 bg-gray-100">در حال بارگذاری نقشه...</div> }
);


const FormDetailPage = () => {
  const pathname = usePathname();
  const [header, setHeader] = useState(null);
  const [loadingHeader, setLoadingHeader] = useState(true);

  const [formData, setFormData] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();
  const { itemId } = params;

  const searchParams = useSearchParams();
  const formId = pathname.split("/").pop();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {}
  });

  const watchedFields = watch();

  useEffect(() => {
    if (!itemId || !formId) {
      router.push("/");
      return;
    }

    setLoadingForm(true);
    setError(null);
    const fetching = async () => {
      try {
        const request = await axios.get(
          `/api/forms/show?item_id=${itemId}&role=mosque_head_coach&id=${formId}`
        );

        if (request.data && request.data.data) {
          const fetchedFormData = request.data.data;
          setFormData(fetchedFormData);

          const defaultValues = {};
          if (fetchedFormData.report && fetchedFormData.report.reports) {
            Object.keys(fetchedFormData.report.reports).forEach(fieldId => {
              const reportItem = fetchedFormData.report.reports[fieldId];
              const fieldTitle = reportItem.form?.title;
              if (fieldTitle && reportItem.value !== undefined) {
                // فیلدهای file و date را در نظر نمی‌گیریم
                if (reportItem.form.type === 'file' || reportItem.form.type === 'date') {
                  return;
                }

                if (reportItem.form.type === 'location') {
                  try {
                    const locValue = JSON.parse(reportItem.value);
                    if (locValue && typeof locValue.lat === 'number' && typeof locValue.lng === 'number') {
                        defaultValues[fieldTitle] = locValue;
                    } else {
                        const parts = String(reportItem.value).split(',');
                        if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                            defaultValues[fieldTitle] = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
                        } else {
                           defaultValues[fieldTitle] = { lat: TEHRAN_COORDS[0], lng: TEHRAN_COORDS[1] };
                        }
                    }
                  } catch (e) {
                      const parts = String(reportItem.value).split(',');
                      if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                          defaultValues[fieldTitle] = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
                      } else {
                           defaultValues[fieldTitle] = { lat: TEHRAN_COORDS[0], lng: TEHRAN_COORDS[1] };
                      }
                  }
                } else if (reportItem.form.type === 'checkbox') {
                  if (typeof reportItem.value === 'string' && reportItem.value.includes(',')) {
                      defaultValues[fieldTitle] = reportItem.value.split(',');
                  } else if (Array.isArray(reportItem.value)) {
                      defaultValues[fieldTitle] = reportItem.value;
                  } else if (reportItem.value !== null && reportItem.value !== undefined) {
                      defaultValues[fieldTitle] = [String(reportItem.value)];
                  }
                } else {
                  defaultValues[fieldTitle] = String(reportItem.value);
                }
              }
            });
          }
          reset(defaultValues);
        } else {
          setError("اطلاعات فرم یافت نشد.");
        }
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("خطا در بارگذاری اطلاعات فرم. لطفا دوباره تلاش کنید.");
      } finally {
        setLoadingForm(false);
      }
    };
    fetching();
  }, [itemId, formId, reset]);

  const handleFileChange = useCallback((event, fieldOnChange, allowedMimeTypes) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const hasAllowedMimeTypes = allowedMimeTypes && allowedMimeTypes.length > 0 && allowedMimeTypes[0] !== "";
      const isAllowed = hasAllowedMimeTypes ? allowedMimeTypes.some(mime => mime.toLowerCase() === fileExtension) : true;

      if (!isAllowed) {
        toast.error(`فایل انتخاب شده مجاز نیست. فقط فرمت‌های ${allowedMimeTypes.join(', ')} مجاز هستند.`);
        event.target.value = '';
        fieldOnChange(null);
      } else {
        fieldOnChange(file);
      }
    } else {
      fieldOnChange(null);
    }
  }, []);

  const isFieldVisible = useCallback((field) => {
    if (!formData || !formData.items) return true;

    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every(condition => {
      const targetField = formData.items.find(item => item.id == condition.form);

      if (!targetField) return true;

      const watchedValue = watchedFields[targetField.title];

      if (condition.action === 'visible') {
        if (['select', 'radio'].includes(targetField.type)) {
          return watchedValue === condition.target;
        }
        if (targetField.type === 'checkbox') {
            return Array.isArray(watchedValue) && watchedValue.includes(condition.target);
        }
        if (condition.target !== null && condition.target !== undefined && condition.target !== "") {
            return watchedValue == condition.target;
        } else {
            return watchedValue !== undefined && watchedValue !== null && watchedValue !== '';
        }
      }
      return true;
    });
  }, [formData, watchedFields]);

  const onSubmit = async (data) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("توکن احراز هویت یافت نشد. لطفاً وارد شوید.");
      router.push("/login");
      return;
    }

    const formDataToSend = new FormData();

    formData.items.forEach(field => {
        const value = data[field.title];

        if (field.type !== 'file' && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
            return;
        }

        if (field.type === 'file') {
            if (value instanceof File) {
                formDataToSend.append(`items[${field.id}]`, value, value.name);
            }
        } else if (field.type === 'location') {
            if (value && value.lat !== undefined && value.lng !== undefined) {
                formDataToSend.append(`items[${field.id}][lat]`, value.lat);
                formDataToSend.append(`items[${field.id}][lng]`, value.lng);
            }
        } else if (field.type === 'date') {
            if (value && typeof value.format === 'function') {
                formDataToSend.append(`items[${field.id}]`, value.format("YYYY/MM/DD"));
            } else if (value) {
                formDataToSend.append(`items[${field.id}]`, String(value));
            }
        } else if (field.type === 'checkbox') {
            if (Array.isArray(value)) {
                value.forEach(item => {
                    formDataToSend.append(`items[${field.id}][]`, item);
                });
            }
        } else {
            formDataToSend.append(`items[${field.id}]`, String(value));
        }
    });

    try {
      const response = await axios.post(
        `https://arman.armaniran.org/api/v1/forms/submit/${formId}?item_id=${itemId}&role=mosque_head_coach`,
        formDataToSend,
        {
          headers: {
            "Accept": "application/json",
            "Authorization": `bearer ${token}`,
          },
        }
      );

      toast.success("اطلاعات با موفقیت ارسال شد! به زودی به صفحه فرم ها منتقل می شوید .");
      setTimeout(() => {
        window.location = `/${itemId}/forms`
      }, 3000);
      reset();
    } catch (apiError) {
      console.error("Error submitting form:", apiError.response ? apiError.response.data : apiError.message);
      toast.error(apiError.response ? apiError.response.data.message || "خطا در ارسال فرم. لطفا دوباره تلاش کنید." : "خطا در ارسال فرم. لطفا دوباره تلاش کنید.");
    } finally {
    }
  };

  useEffect(() => {
    fetch("/Images/masajed/header-desktop-msj.svg")
      .then((response) => response.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

        const rectElements = svgDoc.querySelectorAll("rect");
        rectElements.forEach((rect) => {
          rect.setAttribute("fill", "#012B4F");
        });

        const serializer = new XMLSerializer();
        const modifiedSvgText = serializer.serializeToString(svgDoc);

        const svgBlob = new Blob([modifiedSvgText], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const headerElement = document.querySelector(
          ".lg\\:bg-header-masjed-desktop"
        );
        if (headerElement) {
          headerElement.style.backgroundImage = `url(${svgUrl})`;
        }
      })
      .catch((error) => {
        console.error("خطا در بارگذاری یا پردازش SVG:", error);
      });
  }, []);

  const lightenColor = (color, percent) => {
    const hex = color.startsWith("#") ? color.substring(1) : color;
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.min(255, Math.floor(r + ((255 - r) * percent) / 100));
    g = Math.min(255, Math.floor(g + ((255 - g) * percent) / 100));
    b = Math.min(255, Math.floor(b + ((255 - b) * percent) / 100));
    const newHex =
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");

    return `#${newHex}`;
  };

  const [lighterColor, setLighterColor] = useState();
  const [solighterColor, setSoLighterColor] = useState();

  useEffect(() => {
    setLighterColor(lightenColor("#012B4F", 15));
    setSoLighterColor(lightenColor("#012B4F", 30));
  }, []);

  const goBack = (e) => {
    if (e) {
      const newPath = pathname.split("/").slice(0, -1).join("/") || "/";
      router.push(newPath);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <header className="container mx-auto">
          <div className="grid grid-cols-3 items-center md:grid-cols-8 pt-10">
            <div className="flex items-end gap-3 leading-5 col-span-2 md:col-span-3 md:items-start md:translate-y-5 lg:translate-y-9 xl:translate-y-5 lg:gap-6 xl:gap-10 2xl:gap-12">
              <img
                className="w-10 md:w-16 lg:w-24 xl:w-32"
                alt="#"
                width={0}
                height={0}
                src={header?.data?.logo || "/Images/masajed/mosque.svg"}
              />
              <span className="text-[#D5B260] text-lg font-semibold flex items-center gap-1 md:text-2xl lg:text-3xl lg:pt-3 xl:text-4xl">
                {formData?.title || "جزئیات فرم"}
              </span>
            </div>
            <div className="flex gap-3 justify-self-end md:col-start-8 lg:gap-4 xl:gap-6">
              <img
                onClick={() => goBack()}
                className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                alt="#"
                width={0}
                height={0}
                src={"/Images/home/header/notification.svg"}
                style={{ backgroundColor: lighterColor }}
              />
              <img
                onClick={() => goBack(true)}
                className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                alt="#"
                width={0}
                height={0}
                src={"/Images/home/header/menu.svg"}
                style={{ backgroundColor: lighterColor }}
              />
            </div>
            <div
              style={{ backgroundColor: lighterColor }}
              className="flex items-center justify-evenly gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4 relative z-[12]"
            >
              <HeaderMasjed bgRole={solighterColor} />
            </div>
          </div>
        </header>

        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
          {loadingForm ? (
            <section className="flex justify-center items-center flex-col w-full h-[20rem]">
              <div className="w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full animate-slide"></div>
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer"></div>
              </div>
            </section>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
              <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
                بازگشت
              </button>
            </div>
          ) : !formData ? (
            <div className="text-center text-gray-600">
              <p>فرم یافت نشد.</p>
              <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
                بازگشت
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {formData.title}
                {formData.required && (
                  <span className="text-red-500 text-base font-normal mr-2">
                    (اجباری)
                  </span>
                )}
              </h2>

              {formData.report && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                  <p className="font-bold">نیازمند اصلاح:</p>
                  <p>{formData.report.message || "برخی فیلدها نیاز به بازبینی دارند."}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {isSubmitting && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 rounded-[20px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-4 text-lg text-gray-800">در حال ارسال فرم...</p>
                    </div>
                  </div>
                )}

                {formData.items && formData.items.length > 0 ? (
                  formData.items
                    .sort((a, b) => a.sort - b.sort)
                    .map((field) => {
                      const fieldName = field.title;
                      const isVisible = isFieldVisible(field);

                      if (!isVisible) return null;

                      const validationRules = {
                        required: (field.required && field.type !== 'radio' && field.type !== 'checkbox') ? "این فیلد اجباری است." : false,
                        ...(field.type === "number" && {
                          min: field.min ? { value: parseFloat(field.min), message: `حداقل مقدار ${field.min} است.` } : undefined,
                          max: field.max ? { value: parseFloat(field.max), message: `حداکثر مقدار ${field.max} است.` } : undefined,
                        }),
                        ...(field.type === "file" && field.required && {
                          validate: {
                            requiredFile: (value) => (value && value instanceof File) || "این فیلد اجباری است.",
                            allowedTypes: (value) => {
                              if (!value || !(value instanceof File)) return true;
                              const fileExtension = value.name.split('.').pop().toLowerCase();
                              const hasAllowedMimeTypes = field.mime_types && field.mime_types.length > 0 && field.mime_types[0] !== "";
                              const isAllowed = hasAllowedMimeTypes ? field.mime_types.some(mime => mime.toLowerCase() === fileExtension) : true;
                              return isAllowed || `فقط فرمت‌های ${field.mime_types.join(', ')} مجاز هستند.`;
                            },
                          },
                        }),
                        ...(field.type === "location" && field.required && {
                            validate: (value) => {
                                if (!value || value.lat === undefined || value.lng === undefined) {
                                    return "انتخاب موقعیت مکانی اجباری است.";
                                }
                                return true;
                            }
                        }),
                        ...(field.type === "radio" && field.required && {
                          validate: (value) => (value !== undefined && value !== null && value !== "") || "انتخاب حداقل یک گزینه اجباری است.",
                        }),
                        ...(field.type === "checkbox" && field.required && {
                            validate: (value) => Array.isArray(value) && value.length > 0 || "انتخاب حداقل یک گزینه اجباری است.",
                        }),
                      };

                      return (
                        <div key={field.id} className="form-group mb-6">
                          <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-2">
                            {field.title}
                            {field.required && (
                              <span className="text-red-500 text-xs mr-1" style={{ fontFamily: 'sans-serif' }}>*</span>
                            )}
                          </label>

                          {field.type === "text" && (
                            <input
                              type="text"
                              id={fieldName}
                              {...register(fieldName, validationRules)}
                              placeholder={field.placeholder || ""}
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              disabled={isSubmitting}
                            />
                          )}

                          {field.type === "number" && (
                            <input
                              type="number"
                              id={fieldName}
                              {...register(fieldName, validationRules)}
                              placeholder={field.placeholder || ""}
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              disabled={isSubmitting}
                            />
                          )}

                          {field.type === "textarea" && (
                            <textarea
                              id={fieldName}
                              {...register(fieldName, validationRules)}
                              placeholder={field.placeholder || ""}
                              rows="4"
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              disabled={isSubmitting}
                            ></textarea>
                          )}

                          {field.type === "select" && (
                            <div className="relative">
                              <select
                                id={fieldName}
                                {...register(fieldName, validationRules)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
                                disabled={isSubmitting}
                              >
                                <option value="">انتخاب کنید...</option>
                                {field.options.map((option, optIndex) => (
                                  <option key={optIndex} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                          )}

                          {field.type === "select2" && (
                            <div className="relative">
                              <select
                                id={fieldName}
                                {...register(fieldName, validationRules)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
                                disabled={isSubmitting}
                              >
                                <option value="">انتخاب کنید (لیست حرفه ای)...</option>
                                {field.options.map((option, optIndex) => (
                                  <option key={optIndex} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                          )}

                          {field.type === "radio" && (
                            <Controller
                              control={control}
                              name={fieldName}
                              rules={validationRules}
                              render={({ field: { onChange, value, name, ref } }) => (
                                <div className="mt-3 space-y-3">
                                  {field.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center">
                                      <input
                                        type="radio"
                                        id={`${name}-${optIndex}`}
                                        name={name}
                                        value={option}
                                        checked={value === option}
                                        onChange={onChange}
                                        onBlur={ref}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                        disabled={isSubmitting}
                                      />
                                      <label
                                        htmlFor={`${name}-${optIndex}`}
                                        className="mr-3 block text-sm text-gray-900"
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            />
                          )}

                          {field.type === "checkbox" && (
                            <Controller
                              control={control}
                              name={fieldName}
                              rules={validationRules}
                              render={({ field: { onChange, value, name, ref } }) => (
                                <div className="mt-3 space-y-3">
                                  {field.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`${name}-${optIndex}`}
                                        name={name}
                                        value={option}
                                        checked={Array.isArray(value) && value.includes(option)}
                                        onChange={(e) => {
                                          const newValues = e.target.checked
                                            ? [...(Array.isArray(value) ? value : []), option]
                                            : (Array.isArray(value) ? value : []).filter((v) => v !== option);
                                          onChange(newValues);
                                        }}
                                        onBlur={ref}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        disabled={isSubmitting}
                                      />
                                      <label
                                        htmlFor={`${name}-${optIndex}`}
                                        className="mr-3 block text-sm text-gray-900"
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            />
                          )}

                          {field.type === "file" && (
                            <Controller
                              control={control}
                              name={fieldName}
                              rules={validationRules}
                              render={({ field: { onChange, onBlur, name, ref } }) => (
                                <div>
                                  <input
                                    type="file"
                                    id={name}
                                    name={name}
                                    onBlur={onBlur}
                                    onChange={(e) => handleFileChange(e, onChange, field.mime_types)}
                                    ref={ref}
                                    accept={field.mime_types && field.mime_types.length > 0 && field.mime_types[0] !== ""
                                        ? field.mime_types.map(m => `.${m}`).join(',')
                                        : ''}
                                    className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                    disabled={isSubmitting}
                                  />
                                  {field.mime_types && field.mime_types.length > 0 && field.mime_types[0] !== "" && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      پسوند‌های مجاز: {field.mime_types.join(", ")}
                                    </p>
                                  )}
                                  {watchedFields[fieldName] instanceof File && (
                                      <p className="mt-1 text-sm text-gray-600">
                                          فایل انتخاب شده: {watchedFields[fieldName].name}
                                      </p>
                                  )}
                                </div>
                              )}
                            />
                          )}

                          {field.type === "date" && (
                            <Controller
                              control={control}
                              name={fieldName}
                              rules={validationRules}
                              render={({ field }) => (
                                <DatePicker
                                  value={field.value}
                                  onChange={(dateObject) => {
                                    field.onChange(dateObject);
                                  }}
                                  calendar={persian}
                                  locale={persian_fa}
                                  calendarPosition="bottom-right"
                                  inputClass="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
                                  placeholder={field.placeholder || "انتخاب تاریخ"}
                                  disabled={isSubmitting}
                                />
                              )}
                            />
                          )}

                          {field.type === "location" && (
                            <div className="mt-1 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 relative z-[1]">
                              <LocationMapPickerNoSSR
                                initialPosition={watchedFields[fieldName] ? [watchedFields[fieldName].lat, watchedFields[fieldName].lng] : TEHRAN_COORDS}
                                onSelectPosition={(latlng) => setValue(fieldName, latlng)}
                                disabled={isSubmitting}
                              />
                              {watchedFields[fieldName] && watchedFields[fieldName].lat !== undefined && watchedFields[fieldName].lng !== undefined && (
                                <div className="p-3 bg-gray-50 border-t border-gray-300 text-center text-sm text-gray-700">
                                  <p>مکان انتخاب شده:</p>
                                  <p>عرض جغرافیایی: {watchedFields[fieldName].lat.toFixed(6)}</p>
                                  <p>طول جغرافیایی: {watchedFields[fieldName].lng.toFixed(6)}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {field.help && (
                            <p className="mt-2 text-sm text-gray-500">{field.help}</p>
                          )}

                          {errors[fieldName] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[fieldName].message || errors[fieldName]?.lat?.message || errors[fieldName]?.lng?.message}
                            </p>
                          )}
                        </div>
                      );
                    })
                ) : (
                  <p className="text-gray-600">فیلدی برای این فرم وجود ندارد.</p>
                )}

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "در حال ارسال..." : "ذخیره و ارسال"}
                  </button>
                  <Link href={`/${itemId}/forms`}>
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      انصراف
                    </button>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default FormDetailPage;
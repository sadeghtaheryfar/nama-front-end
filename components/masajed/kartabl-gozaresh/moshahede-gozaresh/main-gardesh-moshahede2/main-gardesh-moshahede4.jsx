"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatPrice } from "../../../../../components/utils/formatPrice";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { DateObject } from "react-multi-date-picker";
import 'react-circular-progressbar/dist/styles.css';
import toast, { Toaster } from 'react-hot-toast';
import '../../../../../styles/form.css';

// Function to convert numbers to Persian text
const convertToPersianText = (number) => {
  // This is a placeholder function - you would implement the actual conversion here
  // For example: 25000 -> "بیست و پنج هزار ریال"
  return `${number} ریال`;
};

const MainGardeshMoshahede4 = ({ id, data }) => {
  const router = useRouter();

  const [student, setStudent] = useState("");
  const [time, setTime] = useState("");
  const [des, setDes] = useState("");
  const [cost, setCost] = useState("");
  const [imamLetter, setImamLetter] = useState(null);
  const [connectionLetter, setConntectionLetter] = useState(null);
  const [images, setImages] = useState([]); // For the main images (minimum 3)
  const [videos, setVideos] = useState([]); // For the main report video (single video)
  const [otherVideos, setOtherVideos] = useState([]); // For additional videos (up to 10)
  const [moreImages, setMoreImages] = useState([]); // For additional images (up to 10)
  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Field validation states
  const [errors, setErrors] = useState({
    student: "",
    time: "",
    cost: "",
    des: "",
    images: "",
    videos: "",
    otherVideos: "",
    moreImages: "",
  });

  // Track if fields have been touched
  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    des: false,
    images: false,
    videos: false,
    otherVideos: false,
    moreImages: false,
  });

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  useEffect(() => {
    if (data?.data?.report) {
      setStudent(data?.data?.report?.students || "");
      setDes(data?.data?.report?.body || "");
      setCost(data?.data?.report?.amount || "");

      if (data?.data?.report?.date) {
        const gregorianDate = new Date(data.data.report.date);
        const persianDate = new DateObject({
          date: gregorianDate,
          calendar: persian
        });
        const formattedDate = `${persianDate.year}-${persianDate.month.number.toString().padStart(2, '0')}-${persianDate.day.toString().padStart(2, '0')}`;
        setTime(formattedDate);
      }

      setCheckBox(data?.data?.report?.confirm || false);
    }

    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
      videos.forEach(v => URL.revokeObjectURL(v.preview));
      otherVideos.forEach(v => URL.revokeObjectURL(v.preview));
      moreImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [data, images, videos, otherVideos, moreImages]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prev) => [...prev, ...files]);
    setTouched(prev => ({ ...prev, images: true }));
    validateField("images", [...images, ...files]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    validateField("images", updatedImages);
  };

  const handleMoreImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newValidFiles = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        newValidFiles.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setMoreImages(prev => {
      const combinedFiles = [...prev, ...newValidFiles];
      if (combinedFiles.length > 10) {
        toast.error("حداکثر ۱۰ تصویر اضافی مجاز است.");
        newValidFiles.forEach(img => URL.revokeObjectURL(img.preview));
        setErrors(prevErrors => ({ ...prevErrors, moreImages: "حداکثر ۱۰ تصویر اضافی مجاز است" }));
        return prev;
      }
      return combinedFiles;
    });

    setTouched(prev => ({ ...prev, moreImages: true }));
    validateField("moreImages", [...moreImages, ...newValidFiles]);

    if (hasInvalidType) {
      toast.error("فقط فایل‌های تصویری مجاز هستند.");
    }
    event.target.value = '';
  };

  const removeMoreImage = (idToRemove) => {
    setMoreImages(prev => {
      const imageToRemove = prev.find(img => img.id === idToRemove);
      if (imageToRemove && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      const updatedImages = prev.filter(img => img.id !== idToRemove);
      if (touched.moreImages) {
        validateField("moreImages", updatedImages);
      }
      return updatedImages;
    });
  };

  // Handler for the main report video
  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newValidVideos = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("video/")) {
        newValidVideos.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setVideos(prev => {
        const combinedVideos = [...prev, ...newValidVideos];
        if (combinedVideos.length > 1) {
            toast.error("فقط یک ویدئو اصلی مجاز است.");
            newValidVideos.forEach(v => URL.revokeObjectURL(v.preview));
            return prev;
        }
        return combinedVideos;
    });

    setTouched(prev => ({ ...prev, videos: true }));
    validateField("videos", [...videos, ...newValidVideos]);

    if (hasInvalidType) {
        toast.error("فقط فایل‌های ویدئویی مجاز هستند.");
    }
    event.target.value = '';
  };

  // Function to remove the main video
  const removeVideo = (idToRemove) => {
    setVideos(prev => {
        const videoToRemove = prev.find(v => v.id === idToRemove);
        if (videoToRemove) {
            URL.revokeObjectURL(videoToRemove.preview);
        }
        const updatedVideos = prev.filter(v => v.id !== idToRemove);
        if (touched.videos) {
            validateField("videos", updatedVideos);
        }
        toast.success("ویدئو اصلی با موفقیت حذف شد.");
        return updatedVideos;
    });
  };

  // Handler for other videos
  const handleOtherVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newValidOtherVideos = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("video/")) {
        newValidOtherVideos.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setOtherVideos(prev => {
        const combinedVideos = [...prev, ...newValidOtherVideos];
        if (combinedVideos.length > 10) {
            toast.error("حداکثر ۱۰ ویدئو اضافی مجاز است.");
            newValidOtherVideos.forEach(v => URL.revokeObjectURL(v.preview));
            return prev;
        }
        return combinedVideos;
    });

    setTouched(prev => ({ ...prev, otherVideos: true }));
    validateField("otherVideos", [...otherVideos, ...newValidOtherVideos]);

    if (hasInvalidType) {
        toast.error("فقط فایل‌های ویدئویی مجاز هستند.");
    }
    event.target.value = '';
  };

  // Function to remove an other video
  const removeOtherVideo = (idToRemove) => {
    setOtherVideos(prev => {
        const videoToRemove = prev.find(v => v.id === idToRemove);
        if (videoToRemove) {
            URL.revokeObjectURL(videoToRemove.preview);
        }
        const updatedVideos = prev.filter(v => v.id !== idToRemove);
        if (touched.otherVideos) {
            validateField("otherVideos", updatedVideos);
        }
        toast.success("ویدئو اضافی با موفقیت حذف شد.");
        return updatedVideos;
    });
  };

  const convertPersianToEnglish = (str) => {
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
    const englishNumbers = "0123456789";

    return str.replace(/[\u06F0-\u06F9]/g, (char) =>
      englishNumbers[persianNumbers.indexOf(char)]
    );
  };

  // Helper function to get field class based on validation state
  const getFieldClass = (field) => {
    const baseClass = "block w-full p-4 border rounded-lg";

    if (!touched[field]) {
      return `${baseClass} border-[#DFDFDF]`; // Default grey if not touched
    }

    if (errors[field]) {
      return `${baseClass} border-red-500 bg-red-50`; // Red if touched and has error
    }

    return `${baseClass} border-green-500 bg-green-50`; // Green if touched and no error
  };

  // Handle field changes for input fields (not file uploads)
  const handleFieldChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);

    switch (field) {
      case "student":
        setStudent(value);
        break;
      case "time":
        setTime(value);
        break;
      case "des":
        setDes(value);
        break;
      case "cost":
        setCost(value);
        break;
      default:
        break; // Added default to handle all cases
    }
  };


  // Validate individual fields
  const validateField = (field, value) => {
    let errorMessage = "";

    switch (field) {
      case "student":
        if (!value) {
          errorMessage = "تعداد دانش آموزان را وارد کنید";
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "لطفا یک عدد معتبر وارد کنید";
        }
        break;
      case "time":
        if (!value) {
          errorMessage = "تاریخ برگزاری را انتخاب کنید";
        }
        break;

      case "cost":
        if (!value) errorMessage = "هزینه کلی عملیات الزامی است";
        break;
      case "des":
        if (!value) {
          errorMessage = "توضیحات را وارد کنید";
        }
        break;
      case "images":
        // اگر فیلد اجباری است و کاربر هیچ فایلی انتخاب نکرده باشد
        if (data?.data?.request_plan?.report_images_required && value.length === 0) {
          errorMessage = "حداقل 3 تصویر الزامی است";
        }
        // اگر تعداد تصاویر کمتر از 3 باشد (صرف نظر از اجباری بودن کلی فیلد)
        else if (value.length < 3) {
            errorMessage = "حداقل 3 تصویر الزامی است";
        }
        // اگر تعداد تصاویر بیشتر از 10 باشد
        else if (value.length > 10) {
          errorMessage = "حداکثر 10 تصویر مجاز است";
        }
        break;

      case "videos":
        // اگر فیلد اجباری است و کاربر هیچ فایلی انتخاب نکرده باشد
        if (data?.data?.request_plan?.report_video_required && value.length === 0) {
            errorMessage = "آپلود حداقل یک ویدئو الزامی است.";
        }
        // اگر تعداد ویدئوهای اصلی بیشتر از 1 باشد (فقط یک ویدئو اصلی مجاز است)
        else if (value.length > 1) {
            errorMessage = "فقط یک ویدئو اصلی مجاز است.";
        }
        // اگر هر یک از فایل‌های آپلود شده از نوع ویدئو نباشند
        else if (value.some(fileObj => fileObj.file && !fileObj.file.type.startsWith("video/"))) {
            errorMessage = "فقط فایل‌های ویدئویی مجاز هستند";
        }
        break;

      case "otherVideos":
        // اگر فیلد اجباری است و کاربر هیچ فایلی انتخاب نکرده باشد
        if (data?.data?.request_plan?.report_other_video_required && value.length === 0) {
            errorMessage = "آپلود حداقل یک ویدئو اضافی الزامی است.";
        }
        // اگر تعداد ویدئوهای اضافی بیشتر از 10 باشد
        else if (value.length > 10) {
            errorMessage = "حداکثر ۱۰ ویدئو اضافی مجاز است";
        }
        // اگر هر یک از فایل‌های آپلود شده از نوع ویدئو نباشند
        else if (value.some(fileObj => fileObj.file && !fileObj.file.type.startsWith("video/"))) {
            errorMessage = "فقط فایل‌های ویدئویی مجاز هستند";
        }
        break;
        
      case "moreImages":
        if (data?.data?.request_plan?.report_images2_required && value.length === 0) {
            errorMessage = "حداقل یک تصویر اضافی الزامی است.";
        } else if (value.length > 10) {
            errorMessage = "حداکثر ۱۰ تصویر اضافی مجاز است";
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    // console.log(`Validating field: ${field}, Value:`, value, `Error: ${errorMessage}, Is Valid: ${!errorMessage}`); // For debugging
    return !errorMessage;
  };

  const convertToPersianWords = (num) => {
    if (!num) return "";
    const yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
    const dahgan = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
    const dah_ta_bist = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
    const sadgan = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
    const scale = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

    if (num === 0) return "صفر";
    let result = "";
    const numStr = num.toString();
    const groups = [];
    for (let i = numStr.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      groups.unshift(numStr.substring(start, i));
    }

    for (let i = 0; i < groups.length; i++) {
      const groupIndex = groups.length - 1 - i;
      const group = parseInt(groups[i]);

      if (group === 0) continue;
      let groupStr = "";
      const hundreds = Math.floor(group / 100);
      const tens = Math.floor((group % 100) / 10);
      const ones = group % 10;

      if (hundreds > 0) {
        groupStr += sadgan[hundreds] + " ";
      }
      if (tens === 1) {
        groupStr += dah_ta_bist[ones] + " ";
      } else {
        if (tens > 0) {
          groupStr += dahgan[tens] + " ";
        }
        if (ones > 0) {
          groupStr += yekan[ones] + " ";
        }
      }
      if (groupStr) {
        result += groupStr + scale[groupIndex] + " ";
      }
    }
    return result.trim() + " ریال";
  };

  function formatToCurrency(amount) {
    const number = Number(amount);
    if (isNaN(number)) {
      return "مقدار وارد شده معتبر نیست";
    }
    const formattedNumber = number.toLocaleString("fa-IR");
    return `${formattedNumber} ریال`;
  }

  const validateForm = () => {
    // Ensure all fields are marked as touched before final validation
    setTouched({
      student: true,
      time: true,
      cost: true,
      des: true,
      images: true,
      videos: true,
      otherVideos: true,
      moreImages: true,
    });

    // Run validations and collect results
    const validStudent = validateField("student", student);
    const validCost = validateField("cost", cost);
    const validTime = validateField("time", time);
    const validDes = validateField("des", des);
    const validImages = validateField("images", images);
    const validVideos = validateField("videos", videos);
    const validOtherVideos = validateField("otherVideos", otherVideos);
    const validMoreImages = validateField("moreImages", moreImages);

    // Return true only if all validations pass
    return validStudent && validTime && validDes && validImages && validCost && validVideos && validOtherVideos && validMoreImages;
  };


  const hnadleForm = async () => {
    setMessage({ text: "", type: "" });

    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      return;
    } else {
      setStatusCheckBox("");
    }

    // Call validateForm to ensure all fields are validated and touched state is updated
    if (!validateForm()) {
      setStatusSend("لطفا خطاهای فرم را برطرف کنید.");
      return;
    } else {
      setStatusSend("");
    }

    const englishTime = convertPersianToEnglish(String(time));

    const formDataToSend = new FormData();
    formDataToSend.append("students", Number(student));
    formDataToSend.append("body", des);
    formDataToSend.append("date", englishTime);
    formDataToSend.append("amount", Number(cost));
    images.forEach((img, index) => {
      formDataToSend.append(`images[${index + 1}]`, img);
    });

    if (videos.length > 0) {
      formDataToSend.append("report_video", videos[0].file);
    }

    if (otherVideos.length > 0) {
      otherVideos.forEach((videoObj, index) => {
        formDataToSend.append(`otherVideos[${index}]`, videoObj.file);
      });
    }
    
    moreImages.forEach((imgObj, index) => {
      formDataToSend.append(`images2[${index}]`, imgObj.file);
    });


    setLoading(true);
    setIsUploading(true);

    try {
      const submitForm = await axios.post(
        `https://arman.armaniran.org/api/v1/reports/${data?.data?.report?.id}?_method=PATCH&item_id=${itemId}&role=mosque_head_coach`,
        formDataToSend,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("token")}`,
            Accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (submitForm) {
        toast.success("عملیات با موفقیت انجام شد . به زودی به صفحه اصلی منتقل می شوید",{
          duration: 3000,
        });
        setTimeout(() => {
          router.push(`/${itemId}/kartabl-gozaresh`);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setStatusSend(error.response.data.error);
      }
      if (error.response?.data?.errors?.images_more) {
        setErrors(prevErrors => ({ ...prevErrors, moreImages: error.response.data.errors.images_more.join(', ') }));
      }
      // Added specific error handling for videos and otherVideos if needed from backend
      if (error.response?.data?.errors?.report_video) {
        setErrors(prevErrors => ({ ...prevErrors, videos: error.response.data.errors.report_video.join(', ') }));
      }
      if (error.response?.data?.errors?.otherVideos) {
        setErrors(prevErrors => ({ ...prevErrors, otherVideos: error.response.data.errors.otherVideos.join(', ') }));
      }

    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <Toaster /> {/* Ensure Toaster is included for toast messages */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl">
          گزارش شماره ({data?.data?.report?.id})
        </h2>

        <div className="text-sm font-semibold text-[#FFC200] bg-[#FEF4D9] min-w-20 h-10 flex items-center justify-center rounded-lg px-3 lg:text-lg xl:text-2xl 2xl:text-[26px] lg:h-12">
          {data?.data?.report?.message
            ? `نیازمند اصلاح - ${data?.data?.report?.message}`
            : "نیازمند اصلاح"}
        </div>
      </div>

      <hr className="h-2 mt-4 mb-7 md:mb-10" />
      <div className="w-full bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
            <label htmlFor="student" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              تعداد دانش آموزان نوجوان <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="student"
                value={student}
                onChange={(e) => handleFieldChange("student", e.target.value)}
                onBlur={() => validateField("student", student)}
                name="student"
                placeholder="به عنوان مثال 25 عدد..."
                className={getFieldClass("student")}
              />
              {touched.student && errors.student && (
                <p className="mt-1 text-sm text-red-500">{errors.student}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="hesab"
              className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
            >
              هزینه کلی عملیات
              <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={cost}
              onChange={(e) => handleFieldChange("cost", e.target.value)}
              onBlur={() => validateField("cost", cost)}
              min={1000}
              max={10000000000000}
              placeholder="از 1،000 تا 10،000،000،000،000"
              className={getFieldClass("cost")}
            />
            {errors.cost && touched.cost && (
              <div className="text-red-500 text-sm mt-1">{errors.cost}</div>
            )}
            {cost ? (
              <>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">مبلغ به حروف: </span>
                  {convertToPersianWords(Number(cost))}
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">مبلغ به عدد: </span>
                  {formatToCurrency(cost)}
                </div>
              </>
            ) : (
              <small className="mt-2">&nbsp;</small>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="calendar" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              تاریخ برگزاری <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
            </label>
            <div className="relative w-full">
              <DatePicker
                editable={false}
                // maxDate={new Date()}
                value={time}
                onChange={(val) => handleFieldChange("time", val)}
                onOpen={() => setTouched(prev => ({ ...prev, time: true }))}
                calendar={persian}
                locale={persian_fa}
                inputClass={getFieldClass("time").replace("block w-full", "")}
                format="YYYY-MM-DD"
                placeholder="انتخاب تاریخ"
              />
              {touched.time && errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4 mt-3">
          <label htmlFor="des" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            توضیحات تکمیلی <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
          </label>
          <textarea
            className={getFieldClass("des") + " md:h-24"}
            id="des"
            name="des"
            value={des}
            onChange={(e) => handleFieldChange("des", e.target.value)}
            onBlur={() => validateField("des", des)}
            rows="10"
            cols="15"
            placeholder="در اینجا تایپ کنید …"
          />
          {touched.des && errors.des && (
            <p className="mt-1 text-sm text-red-500">{errors.des}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          {data?.data?.request_plan?.show_report_images && (
            <div className="mb-4">
              <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
                آپلود فایل تصویری حداقل ۳ عدد {data?.data?.request_plan?.report_images_required && <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>}
              </h3>
              <label
                htmlFor="file-upload_1"
                className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                  touched.images && errors.images
                    ? "border-red-500 bg-red-50"
                    : images.length >= 3 && !errors.images
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                }`}
              >
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
                <Image
                  className="w-7"
                  alt="#"
                  width={0}
                  height={0}
                  src={images.length > 0 ? "/Images/masajed/upload.svg" : "/Images/masajed/darkhast/sabt/Group.svg"}
                />
                <input
                  id="file-upload_1"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
              {touched.images && errors.images && (
                <p className="mt-1 text-sm text-red-500">{errors.images}</p>
              )}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(image)}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.data?.request_plan?.show_report_images2 && (
            <div className="mb-4">
              <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
                آپلود فایل تصویری بیشتر (اختیاری) <span className="text-sm text-gray-500">(حداکثر ۱۰ عدد)</span>
                {data?.data?.request_plan?.report_images2_required && <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>}
              </h3>
              <label
                htmlFor="file-upload_more_images"
                className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                  touched.moreImages && errors.moreImages
                    ? "border-red-500 bg-red-50"
                    : moreImages.length > 0 && !errors.moreImages
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                }`}
              >
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
                {moreImages.length > 0 ? (
                  <Image className="w-7" alt="تایید آپلود" width={0} height={0} src="/Images/masajed/upload.svg" />
                ) : (
                  <Image className="w-7" alt="آپلود فایل" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
                )}
                <input id="file-upload_more_images" type="file" multiple className="hidden" onChange={handleMoreImageUpload} accept="image/*" />
              </label>
              {errors.moreImages && touched.moreImages && (
                <p className="mt-1 text-xs text-red-500">{errors.moreImages}</p>
              )}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {moreImages.map((image, index) => (
                  <div key={image.id || index} className="relative w-24 h-24">
                    <img src={image.preview} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeMoreImage(image.id || index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.data?.request_plan?.show_report_video && (
            <div className="mb-4">
              <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
                آپلود فایل ویدئویی (اصلی) {data?.data?.request_plan?.report_video_required && <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>}
              </h3>
              <label
                htmlFor="file-upload_videos"
                className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                  touched.videos && errors.videos // اگر تاچ شده و خطا دارد -> قرمز
                    ? "border-red-500 bg-red-50"
                    : videos.length > 0 && !errors.videos // اگر فایل دارد و خطا ندارد -> سبز
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300" // در بقیه حالات (مثل لمس نشده، یا لمس شده و خالی بدون خطا) -> خاکستری
                }`}
              >
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
                {videos.length > 0 ? (
                  <Image className="w-7" alt="تایید آپلود" width={0} height={0} src="/Images/masajed/upload.svg" />
                ) : (
                  <Image className="w-7" alt="آپلود فایل" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
                )}
                <input id="file-upload_videos" type="file" /* Removed 'multiple' here as only one main video is allowed */ className="hidden" onChange={handleVideoUpload} accept="video/*" />
              </label>
              <small className="text-yellow-600">در صورت گویا نبودن تصاویر، فایل ویدئو بارگذاری شود. (حداکثر ۱ ویدئو)</small>
              {touched.videos && errors.videos && (
                <p className="mt-1 text-xs text-red-500">{errors.videos}</p>
              )}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {videos.map((videoFile, index) => (
                  <div key={videoFile.id} className="relative w-full aspect-video">
                    <video controls className="w-full h-full object-cover rounded-lg">
                      <source src={videoFile.preview} type={videoFile.file?.type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                      onClick={() => removeVideo(videoFile.id)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.data?.request_plan?.show_report_other_video && (
            <div className="mb-4">
              <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
                آپلود فایل ویدئویی بیشتر <span className="text-sm text-gray-500">(حداکثر ۱۰ عدد)</span>
                {data?.data?.request_plan?.report_other_video_required && <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>}
              </h3>
              <label
                htmlFor="file-upload_other_videos"
                className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                  touched.otherVideos && errors.otherVideos
                    ? "border-red-500 bg-red-50"
                    : otherVideos.length > 0 && !errors.otherVideos
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                }`}
              >
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
                {otherVideos.length > 0 ? (
                  <Image className="w-7" alt="تایید آپلود" width={0} height={0} src="/Images/masajed/upload.svg" />
                ) : (
                  <Image className="w-7" alt="آپلود فایل" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
                )}
                <input id="file-upload_other_videos" type="file" multiple className="hidden" onChange={handleOtherVideoUpload} accept="video/*" />
              </label>
              {touched.otherVideos && errors.otherVideos && (
                <p className="mt-1 text-xs text-red-500">{errors.otherVideos}</p>
              )}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {otherVideos.map((videoFile, index) => (
                  <div key={videoFile.id} className="relative w-full aspect-video">
                    <video controls className="w-full h-full object-cover rounded-lg">
                      <source src={videoFile.preview} type={videoFile.file?.type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                      onClick={() => removeOtherVideo(videoFile.id)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start mb-7 mt-7">
          <input
            id="checked-checkbox"
            type="checkbox"
            checked={checkbox}
            onChange={(event) => setCheckBox(event.target.checked)}
            className="min-w-5 h-5 appearance-none checked:bg-[#39A894] border border-gray-300 rounded checked:ring-offset-2 checked:ring-1 ring-gray-300"
          />
          <label
            htmlFor="checked-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
          >
            تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در صورت عدم تطبیق مسئولیت آن
            را می پذیرم.{" "}
          </label>
          <span className="text-red-500 px-2">{statusCheckBox}</span>
        </div>

        <div className="flex justify-center w-full flex-col items-center">
          <button
            onClick={() => hnadleForm()}
            className="w-full h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white md:max-w-[214px]"
            disabled={loading}
          >
            {loading ? "صبر کنید ..." : "تایید و ثبت اطلاعات"}
          </button>

          {isUploading && uploadProgress > 0 && (
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
          )}

          {message.text && (
            <p
              className={`mt-4 text-center text-sm p-2 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}
          <span className="p-2 text-red-600">{statusSend}</span>
        </div>
      </div>
    </div>
  );
};

export default MainGardeshMoshahede4;
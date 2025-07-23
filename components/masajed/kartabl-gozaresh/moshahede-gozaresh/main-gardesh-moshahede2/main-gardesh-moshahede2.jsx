"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState,useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatPrice } from "../../../../../components/utils/formatPrice";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { DateObject } from "react-multi-date-picker"; // <--- این خط اضافه شد
import 'react-circular-progressbar/dist/styles.css';
import '../../../../../styles/form.css';
import toast from "react-hot-toast";

const MainGardeshMoshahede2 = ({ id, data }) => {
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

  // Validation states for each field
  const [errors, setErrors] = useState({
    student: "",
    cost: "",
    time: "",
    des: "", // Added des to errors state for consistency
    images: "",
    videos: "",
    otherVideos: "", // Added error state for other videos
    moreImages: "", // Added error state for additional images
  });

  // Track if fields have been touched/interacted with
  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    des: false,
    images: false,
    videos: false,
    otherVideos: false,
    moreImages: false, // Added touched state for additional images
  });

  // Ensure initial data from 'data' prop is populated to states
  useEffect(() => {
    if (data?.data?.report) {
      setStudent(data.data.report.students || "");
      setDes(data.data.report.body || "");
      setCost(data.data.report.amount || "");

      if (data.data.report.date) {
        // Assuming date is Gregorian from API, convert to Persian for DatePicker
        const gregorianDate = new Date(data.data.report.date);
        const persianDate = new DateObject({
          date: gregorianDate,
          calendar: persian
        });
        const formattedDate = `${persianDate.year}-${persianDate.month.number.toString().padStart(2, '0')}-${persianDate.day.toString().padStart(2, '0')}`;
        setTime(formattedDate);
      }
    }
    // Cleanup function for Object URLs
    return () => {
      videos.forEach(v => {
        if (v.preview) { // Check if preview URL exists to revoke
          URL.revokeObjectURL(v.preview);
        }
      });
      otherVideos.forEach(v => {
        if (v.preview) {
          URL.revokeObjectURL(v.preview);
        }
      });
      moreImages.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
       images.forEach(img => { // Also include main images in cleanup
        if (img.preview) { // Assuming images might be in {file, preview} format too, if not, adjust.
          URL.revokeObjectURL(img.preview);
        } else if (typeof img === 'object' && img instanceof File) {
            URL.revokeObjectURL(URL.createObjectURL(img)); // For raw File objects
        }
      });
    };
  }, [data, videos, otherVideos, moreImages, images]); // Added images to dependency array

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  // Helper function to get field class based on validation state
  const getFieldClass = (fieldName) => {
    const baseClass = "block w-full p-4 border rounded-lg text-gray-700";
    if (!touched[fieldName]) return `${baseClass} border-[#DFDFDF]`; // Default grey if not touched
    if (errors[fieldName]) return `${baseClass} border-red-500 bg-red-50`; // Red if touched and has error
    return `${baseClass} border-green-500 bg-green-50`; // Green if touched and no error
  };

  const validateField = (name, value) => {
    let error = "";

    switch(name) {
      case "student":
        if (!value) error = "تعداد دانش آموزان الزامی است";
        else if (isNaN(Number(value)) || Number(value) <= 0) error = "لطفا یک عدد مثبت و معتبر وارد کنید"; // Changed message for clarity
        break;
      case "time":
        if (!value) error = "تاریخ برگزاری الزامی است";
        break;
      case "cost":
        if (!value) error = "هزینه کلی عملیات الزامی است";
        else if (isNaN(Number(value)) || Number(value) <= 0) error = "لطفا یک عدد مثبت و معتبر وارد کنید"; // Added validation for cost number
        break;
      case "des": // Validation for description field
        if (!value || value.trim() === "") error = "توضیحات تکمیلی الزامی است";
        break;
      case "images":
        if (data?.data?.request_plan?.report_images_required && value.length === 0) {
          error = "حداقل 3 تصویر الزامی است";
        } else if (value.length > 0 && value.length < 3) { // If files are present but less than 3
          error = "حداقل 3 تصویر الزامی است";
        } else if (value.length > 10) {
          error = "حداکثر 10 تصویر مجاز است";
        }
        break;
      case "videos":
        if (data?.data?.request_plan?.report_video_required && value.length === 0) {
          error = "آپلود حداقل یک ویدئو اصلی الزامی است";
        } else if (value.length > 1) { // Only one main video allowed
          error = "فقط یک ویدئو اصلی مجاز است";
        } else if (value.some(fileObj => fileObj.file && !fileObj.file.type.startsWith("video/"))) {
          error = "فقط فایل‌های ویدئویی مجاز هستند";
        }
        break;
      case "otherVideos":
        if (data?.data?.request_plan?.report_other_video_required && value.length === 0) {
          error = "آپلود حداقل یک ویدئو اضافی الزامی است";
        } else if (value.length > 10) { // Max 10 other videos
          error = "حداکثر ۱۰ ویدئو اضافی مجاز است";
        } else if (value.some(fileObj => fileObj.file && !fileObj.file.type.startsWith("video/"))) {
          error = "فقط فایل‌های ویدئویی مجاز هستند";
        }
        break;
      case "moreImages": // Validation for additional images
        if (data?.data?.request_plan?.report_images2_required && value.length === 0) {
          error = "حداقل یک تصویر اضافی الزامی است";
        } else if (value.length > 10) {
          error = "حداکثر ۱۰ تصویر اضافی مجاز است";
        } else if (value.some(fileObj => fileObj.file && !fileObj.file.type.startsWith("image/"))) {
          error = "فقط فایل‌های تصویری مجاز هستند";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Generic handler for input fields to set state and validate on change
  const handleFieldChange = (name, value) => {
    // For text inputs and DatePicker, set touched immediately
    setTouched(prev => ({ ...prev, [name]: true }));
    let errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));

    switch(name) {
      case "student":
        setStudent(value);
        break;
      case "cost":
        setCost(value);
        break;
      case "time":
        setTime(value);
        break;
      case "des": // Handle description change as well
        setDes(value);
        break;
      default:
        break;
    }
  };


  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    let value;
    switch(name) {
      case "student": value = student; break;
      case "cost": value = cost; break;
      case "time": value = time; break;
      case "des": value = des; break; // Added des to blur handling
      case "images": value = images; break;
      case "videos": value = videos; break;
      case "moreImages": value = moreImages; break;
      case "otherVideos": value = otherVideos; break; // Added otherVideos to blur handling
      default: value = "";
    }
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Specific handlers for file inputs, which also trigger validation
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFilesWithPreview = files.map(file => ({
      id: Date.now() + Math.random(), // Assign a unique ID
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newFilesWithPreview]); // Store objects with file and preview
    setTouched(prev => ({ ...prev, images: true }));
    validateField("images", [...images, ...newFilesWithPreview]);
    event.target.value = ''; // Clear input to allow re-selection of same file
  };

  const removeImage = (idToRemove) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === idToRemove);
      if (imageToRemove && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      const updatedImages = prev.filter(img => img.id !== idToRemove);
      validateField("images", updatedImages); // Validate after removal
      return updatedImages;
    });
  };

  const handleMoreImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFilesWithPreview = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        newFilesWithPreview.push({ id: Date.now() + Math.random(), file: file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setMoreImages(prev => {
      const combinedFiles = [...prev, ...newFilesWithPreview];
      if (combinedFiles.length > 10) {
        toast.error("حداکثر ۱۰ تصویر اضافی مجاز است.");
        newFilesWithPreview.forEach(img => URL.revokeObjectURL(img.preview));
        return prev;
      }
      return combinedFiles;
    });

    setTouched(prev => ({ ...prev, moreImages: true }));
    validateField("moreImages", [...moreImages, ...newFilesWithPreview]);

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
      validateField("moreImages", updatedImages);
      return updatedImages;
    });
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFilesWithPreview = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("video/")) {
        newFilesWithPreview.push({ id: Date.now() + Math.random(), file: file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setVideos(prev => {
      // For main video, limit to 1. If multiple selected, only take the first.
      const combinedVideos = [...prev, ...newFilesWithPreview];
      if (combinedVideos.length > 1) { // Only 1 main video allowed
        toast.error("فقط یک ویدئو اصلی مجاز است.");
        newFilesWithPreview.forEach(v => URL.revokeObjectURL(v.preview)); // Clean up excess previews
        return prev; // Return previous state if over limit
      }
      return combinedVideos;
    });

    setTouched(prev => ({ ...prev, videos: true }));
    validateField("videos", [...videos, ...newFilesWithPreview]);

    if (hasInvalidType) {
      toast.error("فقط فایل‌های ویدئویی مجاز هستند.");
    }
    event.target.value = '';
  };

  const removeVideo = (idToRemove) => {
    setVideos(prev => {
      const videoToRemove = prev.find(v => v.id === idToRemove);
      if (videoToRemove && videoToRemove.preview) {
        URL.revokeObjectURL(videoToRemove.preview);
      }
      const updatedVideos = prev.filter(v => v.id !== idToRemove);
      validateField("videos", updatedVideos);
      toast.success("ویدئو اصلی با موفقیت حذف شد.");
      return updatedVideos;
    });
  };

  // Handler for other videos (distinct from main 'videos' state)
  const handleOtherVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFilesWithPreview = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("video/")) {
        newFilesWithPreview.push({ id: Date.now() + Math.random(), file: file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setOtherVideos(prev => {
      const combinedVideos = [...prev, ...newFilesWithPreview];
      if (combinedVideos.length > 10) { // Max 10 other videos
        toast.error("حداکثر ۱۰ ویدئو اضافی مجاز است.");
        newFilesWithPreview.forEach(v => URL.revokeObjectURL(v.preview)); // Clean up excess previews
        return prev; // Return previous state if over limit
      }
      return combinedVideos;
    });

    setTouched(prev => ({ ...prev, otherVideos: true }));
    validateField("otherVideos", [...otherVideos, ...newFilesWithPreview]);

    if (hasInvalidType) {
      toast.error("فقط فایل‌های ویدئویی مجاز هستند.");
    }
    event.target.value = '';
  };

  const removeOtherVideo = (idToRemove) => {
    setOtherVideos(prev => {
      const videoToRemove = prev.find(v => v.id === idToRemove);
      if (videoToRemove && videoToRemove.preview) {
        URL.revokeObjectURL(videoToRemove.preview);
      }
      const updatedVideos = prev.filter(v => v.id !== idToRemove);
      validateField("otherVideos", updatedVideos);
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
    // Mark all fields as touched to trigger immediate validation feedback
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

    // Run all validations and store results locally
    const currentErrors = {
      student: validateField("student", student),
      time: validateField("time", time),
      cost: validateField("cost", cost),
      des: validateField("des", des),
      images: validateField("images", images),
      videos: validateField("videos", videos),
      otherVideos: validateField("otherVideos", otherVideos),
      moreImages: validateField("moreImages", moreImages),
    };

    // Update the state with all collected errors
    setErrors(currentErrors);

    // Check if any field has an error message
    return !Object.values(currentErrors).some(error => error !== "");
  };

  const hnadleForm = async () => {
    setMessage({ text: "", type: "" });

    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      return;
    } else {
      setStatusCheckBox("");
    }

    // Validate the form before submission
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
    
    // Append main images
    images.forEach((imgObj, index) => {
      formDataToSend.append(`images[${index + 1}]`, imgObj.file);
    });

    // Append main video
    if (videos.length > 0) {
      formDataToSend.append("video", videos[0].file);
    }

    // Append other videos
    if (otherVideos.length > 0) {
      otherVideos.forEach((videoObj, index) => {
        formDataToSend.append(`otherVideos[${index}]`, videoObj.file);
      });
    }
    
    // Append additional images
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
      } else {
        setStatusSend("خطا در ارسال اطلاعات. لطفا دوباره تلاش کنید.");
      }
      // Handle specific backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        setErrors(prevErrors => ({
            ...prevErrors,
            student: backendErrors.students?.join(', ') || '',
            cost: backendErrors.amount?.join(', ') || '',
            time: backendErrors.date?.join(', ') || '',
            des: backendErrors.body?.join(', ') || '',
            images: backendErrors['images.1']?.join(', ') || backendErrors['images.2']?.join(', ') || backendErrors['images.3']?.join(', ') || backendErrors.images?.join(', ') || '',
            videos: backendErrors.report_video?.join(', ') || '',
            otherVideos: backendErrors.otherVideos?.join(', ') || '',
            moreImages: backendErrors.images2?.join(', ') || '',
        }));
        // Mark fields as touched if backend returns errors for them
        setTouched(prevTouched => ({
            ...prevTouched,
            student: backendErrors.students ? true : prevTouched.student,
            cost: backendErrors.amount ? true : prevTouched.cost,
            time: backendErrors.date ? true : prevTouched.time,
            des: backendErrors.body ? true : prevTouched.des,
            images: (backendErrors['images.1'] || backendErrors.images) ? true : prevTouched.images,
            videos: backendErrors.report_video ? true : prevTouched.videos,
            otherVideos: backendErrors.otherVideos ? true : prevTouched.otherVideos,
            moreImages: backendErrors.images2 ? true : prevTouched.moreImages,
        }));
      }
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold md:text-lg xl:text-2xl">
          ارسال گزارش
        </h2>
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
                onBlur={() => handleBlur("student")}
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
              onBlur={() => handleBlur("cost")}
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
                value={time}
                onChange={(val) => handleFieldChange("time", val)}
                onOpen={() => setTouched(prev => ({ ...prev, time: true }))}
                calendar={persian}
                locale={persian_fa}
                inputClass={getFieldClass("time").replace("block w-full", "")} // Using getFieldClass
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
            className={getFieldClass("des") + " md:h-24"} // Using getFieldClass
            id="des"
            name="des"
            value={des}
            onChange={(e) => handleFieldChange("des", e.target.value)}
            onBlur={() => handleBlur("des")}
            rows="10"
            cols="15"
            placeholder="در اینجا تایپ کنید …"
          />
          {touched.des && errors.des && (
            <p className="mt-1 text-sm text-red-500">{errors.des}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          {/* Main Images Field */}
          {data?.data?.request_plan?.show_report_images && (
            <div className="mb-4">
              <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
                آپلود فایل تصویری حداقل ۳ عدد {data?.data?.request_plan?.report_images_required && <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>}
              </h3>
              <label
                htmlFor="file-upload_1"
                className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                  touched.images && errors.images // اگر تاچ شده و خطا دارد -> قرمز
                    ? "border-red-500 bg-red-50"
                    : images.length >= 3 && !errors.images // اگر 3 تا یا بیشتر بود و اروری نبود، سبز کن
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300" // در بقیه حالات (از جمله وقتی کمتر از 3 تاست اما ارور نیست) خاکستری
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
                {images.map((image) => ( // Use image.id for key
                  <div key={image.id} className="relative w-24 h-24">
                    <img
                      src={image.preview} // Use .preview from the stored object
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeImage(image.id)} // Remove by id
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Images Field */}
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
                {moreImages.map((image) => ( // Use image.id for key
                  <div key={image.id} className="relative w-24 h-24">
                    <img src={image.preview} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeMoreImage(image.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Video Field */}
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
                {videos.map((videoFile) => ( // Use videoFile.id for key
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

          {/* Other Videos Field */}
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
                {otherVideos.map((videoFile) => ( // Use videoFile.id for key
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
            <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
          </label>
        </div>
        {statusCheckBox && (
          <p className="mb-4 text-xs text-red-500">{statusCheckBox}</p>
        )}

        <div className="flex justify-center w-full flex-col items-center">
          <button
            onClick={() => hnadleForm()}
            className="w-full h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white md:max-w-[214px]"
            disabled={loading}
          >
            {loading ? 'صبر کنید ...' : 'تایید و ثبت اطلاعات'}
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
          {statusSend && (
            <p className="mt-2 p-2 text-red-600 text-sm">{statusSend}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainGardeshMoshahede2;
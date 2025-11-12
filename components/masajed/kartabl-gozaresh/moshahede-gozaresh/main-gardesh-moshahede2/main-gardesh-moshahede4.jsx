"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { DateObject } from "react-multi-date-picker";
import 'react-circular-progressbar/dist/styles.css';
import toast, { Toaster } from 'react-hot-toast';
import '../../../../../styles/form.css';

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
      groupStr += sadgan[hundreds];
    }
    if (tens === 1) {
      groupStr += (groupStr ? " و " : "") + dah_ta_bist[ones];
    } else {
      if (tens > 0) {
        groupStr += (groupStr ? " و " : "") + dahgan[tens];
      }
      if (ones > 0) {
        groupStr += (groupStr ? " و " : "") + yekan[ones];
      }
    }
    if (groupStr) {
      result += groupStr + (scale[groupIndex] ? " " + scale[groupIndex] : "") + (i < groups.length - 1 && parseInt(groups[i+1]) !== 0 ? " و " : " ");
    }
  }
  return result.trim() + " ریال";
};

const MainGardeshMoshahede4 = ({ id, data }) => {
  const router = useRouter();

  const [student, setStudent] = useState("");
  const [time, setTime] = useState("");
  const [des, setDes] = useState("");
  const [cost, setCost] = useState("");

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  const [newVideos, setNewVideos] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  
  const [newOtherVideos, setNewOtherVideos] = useState([]);
  const [existingOtherVideos, setExistingOtherVideos] = useState([]);
  
  const [newMoreImages, setNewMoreImages] = useState([]);
  const [existingMoreImages, setExistingMoreImages] = useState([]);

  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && data?.data?.report) {
      const report = data.data.report;
      setStudent(report.students || "");
      setDes(report.body || "");
      setCost(report.amount || "");

      if (report.date) {
        const gregorianDate = new Date(report.date);
        const persianDate = new DateObject({
          date: gregorianDate,
          calendar: persian
        });
        const formattedDate = `${persianDate.year}-${persianDate.month.number.toString().padStart(2, '0')}-${persianDate.day.toString().padStart(2, '0')}`;
        setTime(formattedDate);
      }
      setCheckBox(report.confirm || false);

      if (report.images && report.images.length > 0) {
        setExistingImages(report.images.map(img => ({ id: img.id, preview: img.original, file: null, isExisting: true })));
      }
      if (report.video) {
        setExistingVideos([{ id: report.video.id, preview: report.video.original, file: null, isExisting: true }]);
      }
      if (report.other_videos && report.other_videos.length > 0) {
        setExistingOtherVideos(report.other_videos.map(v => ({ id: v.id, preview: v.original, file: null, isExisting: true })));
      }
      if (report.images2 && report.images2.length > 0) {
        setExistingMoreImages(report.images2.map(img => ({ id: img.id, preview: img.original, file: null, isExisting: true })));
      }

      setIsInitialLoad(false);
    }

    return () => {
      newImages.forEach(img => URL.revokeObjectURL(img.preview));
      newVideos.forEach(v => URL.revokeObjectURL(v.preview));
      newOtherVideos.forEach(v => URL.revokeObjectURL(v.preview));
      newMoreImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [data]);

  const allImages = [...existingImages, ...newImages];
  const allVideos = [...existingVideos, ...newVideos];
  const allOtherVideos = [...existingOtherVideos, ...newOtherVideos];
  const allMoreImages = [...existingMoreImages, ...newMoreImages];

  const handleDeleteExistingFile = async (fileId) => {
    try {
      setLoading(true);
      const reportId = data?.data?.id;
      
      const response = await axios.delete(
        `https://arman.armaniran.org/api/v1/requests/remove-file/${fileId}?item_id=${itemId}&role=mosque_head_coach`,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("token")}`,
            Accept: "application/json",
          },
        }
      );
      toast.success("فایل قدیمی با موفقیت حذف شد.");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("خطا در حذف فایل قدیمی. لطفا دوباره تلاش کنید.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files).map(file => ({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file), isExisting: false }));
    setNewImages((prev) => {
      const combinedFiles = [...existingImages, ...prev, ...files];
      if (combinedFiles.length > 10) {
          toast.error("حداکثر ۱۰ تصویر مجاز است.");
          files.forEach(img => URL.revokeObjectURL(img.preview));
          setErrors(prevErrors => ({ ...prevErrors, images: "حداکثر ۱۰ تصویر مجاز است" }));
          return prev;
      }
      return [...prev, ...files];
    });
    setTouched(prev => ({ ...prev, images: true }));
    validateField("images", [...existingImages, ...newImages, ...files]);
    event.target.value = '';
  };

  const removeImage = async (idToRemove, isExisting) => {
    if (isExisting) {
      const success = await handleDeleteExistingFile(idToRemove);
      if (success) {
        setExistingImages(prev => {
          const updatedImages = prev.filter(img => img.id !== idToRemove);
          validateField("images", [...updatedImages, ...newImages]);
          return updatedImages;
        });
      }
    } else {
      setNewImages(prev => {
        const imageToRemove = prev.find(img => img.id === idToRemove);
        if (imageToRemove && imageToRemove.preview) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
        const updatedImages = prev.filter(img => img.id !== idToRemove);
        validateField("images", [...existingImages, ...updatedImages]);
        return updatedImages;
      });
    }
  };

  const handleMoreImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newValidFiles = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        newValidFiles.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file), isExisting: false });
      } else {
        hasInvalidType = true;
      }
    });

    setNewMoreImages(prev => {
      const combinedFiles = [...existingMoreImages, ...prev, ...newValidFiles];
      if (combinedFiles.length > 10) {
        toast.error("حداکثر ۱۰ تصویر اضافی مجاز است.");
        newValidFiles.forEach(img => URL.revokeObjectURL(img.preview));
        setErrors(prevErrors => ({ ...prevErrors, moreImages: "حداکثر ۱۰ تصویر اضافی مجاز است" }));
        return prev;
      }
      return [...prev, ...newValidFiles];
    });

    setTouched(prev => ({ ...prev, moreImages: true }));
    validateField("moreImages", [...existingMoreImages, ...newMoreImages, ...newValidFiles]);

    if (hasInvalidType) {
      toast.error("فقط فایل‌های تصویری مجاز هستند.");
    }
    event.target.value = '';
  };

  const removeMoreImage = async (idToRemove, isExisting) => {
    if (isExisting) {
      const success = await handleDeleteExistingFile(idToRemove);
      if (success) {
        setExistingMoreImages(prev => {
          const updatedImages = prev.filter(img => img.id !== idToRemove);
          if (touched.moreImages) {
            validateField("moreImages", [...updatedImages, ...newMoreImages]);
          }
          return updatedImages;
        });
      }
    } else {
      setNewMoreImages(prev => {
        const imageToRemove = prev.find(img => img.id === idToRemove);
        if (imageToRemove && imageToRemove.preview) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
        const updatedImages = prev.filter(img => img.id !== idToRemove);
        if (touched.moreImages) {
          validateField("moreImages", [...existingMoreImages, ...updatedImages]);
        }
        return updatedImages;
      });
    }
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newValidVideos = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("video/")) {
        newValidVideos.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file), isExisting: false });
      } else {
        hasInvalidType = true;
      }
    });

    setNewVideos(prev => {
      const combinedVideos = [...existingVideos, ...prev, ...newValidVideos];
      if (combinedVideos.length > 1) {
        toast.error("فقط یک ویدئو اصلی مجاز است.");
        newValidVideos.forEach(v => URL.revokeObjectURL(v.preview));
        return prev;
      }
      if (newValidVideos.length > 0) {
          prev.forEach(v => URL.revokeObjectURL(v.preview));
          setExistingVideos([]);
          return newValidVideos;
      }
      return prev;
    });

    setTouched(prev => ({ ...prev, videos: true }));
    validateField("videos", [...existingVideos, ...newVideos, ...newValidVideos]);

    if (hasInvalidType) {
      toast.error("فقط فایل‌های ویدئویی مجاز هستند.");
    }
    event.target.value = '';
  };

  const removeVideo = async (idToRemove, isExisting) => {
    if (isExisting) {
      const success = await handleDeleteExistingFile(idToRemove);
      if (success) {
        setExistingVideos(prev => {
          const updatedVideos = prev.filter(v => v.id !== idToRemove);
          if (touched.videos) {
              validateField("videos", [...updatedVideos, ...newVideos]);
          }
          return updatedVideos;
        });
      }
    } else {
      setNewVideos(prev => {
        const videoToRemove = prev.find(v => v.id === idToRemove);
        if (videoToRemove) {
          URL.revokeObjectURL(videoToRemove.preview);
        }
        const updatedVideos = prev.filter(v => v.id !== idToRemove);
        if (touched.videos) {
          validateField("videos", [...existingVideos, ...updatedVideos]);
        }
        return updatedVideos;
      });
    }
  };

  const handleOtherVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newValidOtherVideos = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (file.type.startsWith("video/")) {
        newValidOtherVideos.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file), isExisting: false });
      } else {
        hasInvalidType = true;
      }
    });

    setNewOtherVideos(prev => {
      const combinedVideos = [...existingOtherVideos, ...prev, ...newValidOtherVideos];
      if (combinedVideos.length > 10) {
        toast.error("حداکثر ۱۰ ویدئو اضافی مجاز است.");
        newValidOtherVideos.forEach(v => URL.revokeObjectURL(v.preview));
        return prev;
      }
      return [...prev, ...newValidOtherVideos];
    });

    setTouched(prev => ({ ...prev, otherVideos: true }));
    validateField("otherVideos", [...existingOtherVideos, ...newOtherVideos, ...newValidOtherVideos]);

    if (hasInvalidType) {
      toast.error("فقط فایل‌های ویدئویی مجاز هستند.");
    }
    event.target.value = '';
  };

  const removeOtherVideo = async (idToRemove, isExisting) => {
    if (isExisting) {
      const success = await handleDeleteExistingFile(idToRemove);
      if (success) {
        setExistingOtherVideos(prev => {
          const updatedVideos = prev.filter(v => v.id !== idToRemove);
          if (touched.otherVideos) {
              validateField("otherVideos", [...updatedVideos, ...newOtherVideos]);
          }
          return updatedVideos;
        });
      }
    } else {
      setNewOtherVideos(prev => {
        const videoToRemove = prev.find(v => v.id === idToRemove);
        if (videoToRemove) {
          URL.revokeObjectURL(videoToRemove.preview);
        }
        const updatedVideos = prev.filter(v => v.id !== idToRemove);
        if (touched.otherVideos) {
          validateField("otherVideos", [...existingOtherVideos, ...updatedVideos]);
        }
        return updatedVideos;
      });
    }
  };

  const convertPersianToEnglish = (str) => {
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
    const englishNumbers = "0123456789";

    return str.replace(/[\u06F0-\u06F9]/g, (char) =>
      englishNumbers[persianNumbers.indexOf(char)]
    );
  };

  const getFieldClass = (field) => {
    const baseClass = "block w-full p-4 border rounded-lg";

    if (!touched[field]) {
      return `${baseClass} border-[#DFDFDF]`;
    }

    if (errors[field]) {
      return `${baseClass} border-red-500 bg-red-50`;
    }

    return `${baseClass} border-green-500 bg-green-50`;
  };

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
        break;
    }
  };


  const validateField = (field, value) => {
    let errorMessage = "";

    if (data?.data?.request_plan?.type === "university" && (field === "student" || field === "time" || field === "cost")) {
        return true;
    }

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
        const combinedImagesCount = allImages.length;
        if (data?.data?.request_plan?.report_images_required && combinedImagesCount === 0) {
          errorMessage = "حداقل 3 تصویر الزامی است";
        } else if (combinedImagesCount < 3) {
            errorMessage = "حداقل 3 تصویر الزامی است";
        } else if (combinedImagesCount > 10) {
          errorMessage = "حداکثر 10 تصویر مجاز است";
        }
        break;

      case "videos":
        const combinedVideosCount = allVideos.length;
        if (data?.data?.request_plan?.report_video_required && combinedVideosCount === 0) {
            errorMessage = "آپلود حداقل یک ویدئو الزامی است.";
        } else if (combinedVideosCount > 1) {
            errorMessage = "فقط یک ویدئو اصلی مجاز است.";
        }
        break;

      case "otherVideos":
        const combinedOtherVideosCount = allOtherVideos.length;
        if (data?.data?.request_plan?.report_other_video_required && combinedOtherVideosCount === 0) {
            errorMessage = "آپلود حداقل یک ویدئو اضافی الزامی است.";
        } else if (combinedOtherVideosCount > 10) {
            errorMessage = "حداکثر ۱۰ ویدئو اضافی مجاز است";
        }
        break;
        
      case "moreImages":
        const combinedMoreImagesCount = allMoreImages.length;
        if (data?.data?.request_plan?.report_images2_required && combinedMoreImagesCount === 0) {
            errorMessage = "حداقل یک تصویر اضافی الزامی است.";
        } else if (combinedMoreImagesCount > 10) {
            errorMessage = "حداکثر ۱۰ تصویر اضافی مجاز است";
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return !errorMessage;
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

    let validStudent = true;
    let validCost = true;
    let validTime = true;

    if (data?.data?.request_plan?.type !== "university") {
        validStudent = validateField("student", student);
        validCost = validateField("cost", cost);
        validTime = validateField("time", time);
    }
    
    const validDes = validateField("des", des);
    const validImages = validateField("images", allImages);
    const validVideos = validateField("videos", allVideos);
    const validOtherVideos = validateField("otherVideos", allOtherVideos);
    const validMoreImages = validateField("moreImages", allMoreImages);

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

    if (!validateForm()) {
      setStatusSend("لطفا خطاهای فرم را برطرف کنید.");
      return;
    } else {
      setStatusSend("");
    }

    const englishTime = convertPersianToEnglish(String(time));

    const formDataToSend = new FormData();
    if (data?.data?.request_plan?.type !== "university") {
      formDataToSend.append("students", Number(student));
      formDataToSend.append("date", englishTime);
      formDataToSend.append("amount", Number(cost));
    }
    formDataToSend.append("body", des);
    
    // فقط فایل‌های جدید را ارسال می‌کنیم
    newImages.forEach((img, index) => {
      formDataToSend.append(`images[${index}]`, img.file);
    });

    if (newVideos.length > 0) {
      formDataToSend.append("report_video", newVideos[0].file);
    }

    newOtherVideos.forEach((videoObj, index) => {
      formDataToSend.append(`other_videos[${index}]`, videoObj.file);
    });
    
    newMoreImages.forEach((imgObj, index) => {
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
      if (error.response?.data?.errors?.images2) {
        setErrors(prevErrors => ({ ...prevErrors, moreImages: error.response.data.errors.images2.join(', ') }));
      }
      if (error.response?.data?.errors?.images) {
        setErrors(prevErrors => ({ ...prevErrors, images: error.response.data.errors.images.join(', ') }));
      }
      if (error.response?.data?.errors?.report_video) {
        setErrors(prevErrors => ({ ...prevErrors, videos: error.response.data.errors.report_video.join(', ') }));
      }
      if (error.response?.data?.errors?.other_videos) {
        setErrors(prevErrors => ({ ...prevErrors, otherVideos: error.response.data.errors.other_videos.join(', ') }));
      }
      if (error.response?.data?.errors?.amount) {
        setErrors(prevErrors => ({ ...prevErrors, cost: error.response.data.errors.amount.join(', ') }));
      }
      if (error.response?.data?.errors?.date) {
        setErrors(prevErrors => ({ ...prevErrors, time: error.response.data.errors.date.join(', ') }));
      }
      if (error.response?.data?.errors?.students) {
        setErrors(prevErrors => ({ ...prevErrors, student: error.response.data.errors.students.join(', ') }));
      }


    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="relative z-30 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
      <Toaster />
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
        
        {data?.data?.request_plan?.type !== "university" && (
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
        )}

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
                    : allImages.length >= 3 && !errors.images
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
                  src={allImages.length > 0 ? "/Images/masajed/upload.svg" : "/Images/masajed/darkhast/sabt/Group.svg"}
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
                {allImages.map((image) => (
                  <div key={image.id} className="relative w-24 h-24">
                    <img
                      src={image.preview || URL.createObjectURL(image.file)}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                      onClick={() => removeImage(image.id, image.isExisting)}
                      disabled={loading}
                    >
                      &times;
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
                    : allMoreImages.length > 0 && !errors.moreImages
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                }`}
              >
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
                {allMoreImages.length > 0 ? (
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
                {allMoreImages.map((image) => (
                  <div key={image.id} className="relative w-24 h-24">
                    <img src={image.preview || URL.createObjectURL(image.file)} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                      onClick={() => removeMoreImage(image.id, image.isExisting)}
                      disabled={loading}
                    >
                      &times;
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
                  touched.videos && errors.videos
                    ? "border-red-500 bg-red-50"
                    : allVideos.length > 0 && !errors.videos
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                }`}
              >
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
                {allVideos.length > 0 ? (
                  <Image className="w-7" alt="تایید آپلود" width={0} height={0} src="/Images/masajed/upload.svg" />
                ) : (
                  <Image className="w-7" alt="آپلود فایل" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
                )}
                <input id="file-upload_videos" type="file" className="hidden" onChange={handleVideoUpload} accept="video/*" />
              </label>
              <small className="text-yellow-600">در صورت گویا نبودن تصاویر، فایل ویدئو بارگذاری شود. (حداکثر ۱ ویدئو)</small>
              {touched.videos && errors.videos && (
                <p className="mt-1 text-xs text-red-500">{errors.videos}</p>
              )}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {allVideos.map((videoFile) => (
                  <div key={videoFile.id} className="relative w-full aspect-video">
                    <video controls className="w-full h-full object-cover rounded-lg">
                      <source src={videoFile.preview || URL.createObjectURL(videoFile.file)} type={videoFile.file?.type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                      onClick={() => removeVideo(videoFile.id, videoFile.isExisting)}
                      disabled={loading}
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
                    : allOtherVideos.length > 0 && !errors.otherVideos
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                }`}
              >
                <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                  برای آپلود فایل کلیک کنید
                </span>
                {allOtherVideos.length > 0 ? (
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
                {allOtherVideos.map((videoFile) => (
                  <div key={videoFile.id} className="relative w-full aspect-video">
                    <video controls className="w-full h-full object-cover rounded-lg">
                      <source src={videoFile.preview || URL.createObjectURL(videoFile.file)} type={videoFile.file?.type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                      onClick={() => removeOtherVideo(videoFile.id, videoFile.isExisting)}
                      disabled={loading}
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
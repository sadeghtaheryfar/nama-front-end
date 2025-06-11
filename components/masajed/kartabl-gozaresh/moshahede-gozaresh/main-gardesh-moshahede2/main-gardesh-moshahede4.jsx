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
import 'react-circular-progressbar/dist/styles.css';
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
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
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
  });

  // Track if fields have been touched
  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    des: false,
    images: false,
  });

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prev) => [...prev, ...files]);
    setTouched(prev => ({ ...prev, images: true }));
    
    // Validate images
    validateField("images", [...images, ...files]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    validateField("images", updatedImages);
  };

  useEffect(() => {
    if (data?.data?.report) {
      setStudent(data?.data?.report?.students);
      setDes(data?.data?.report?.body);
    }
  }, [data]);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("video/")) {
      setStatusSend("فقط فایل ویدئویی مجاز است.");
      return;
    }
    setVideo(file);
  };

  const convertPersianToEnglish = (str) => {
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
    const englishNumbers = "0123456789";

    return str.replace(/[\u06F0-\u06F9]/g, (char) =>
      englishNumbers[persianNumbers.indexOf(char)]
    );
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
        if (!value || value.length < 3) {
          errorMessage = "حداقل 3 تصویر الزامی است";
        } else if (value.length > 10) {
          errorMessage = "حداکثر 10 تصویر مجاز است";
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return !errorMessage;
  };

  // Handle field changes
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
    }
  };

  // Get form field class based on validation state
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
  
  const convertToPersianWords = (num) => {
    if (!num) return "";
    
    const yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
    const dahgan = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
    const dah_ta_bist = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
    const sadgan = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
    const scale = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];
    
    if (num === 0) return "صفر";
    
    let result = "";
    let scaleIndex = 0;
    
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
    const validStudent = validateField("student", student);
    const validCost = validateField("cost", cost);
    const validTime = validateField("time", time);
    const validDes = validateField("des", des);
    const validImages = validateField("images", images);
    
    // Mark all fields as touched
    setTouched({
      student: true,
      time: true,
      cost: true,
      des: true,
      images: true,
    });
    
    return validStudent && validTime && validDes && validImages && validCost;
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
    formDataToSend.append("students", Number(student));
    formDataToSend.append("body", des);
    formDataToSend.append("date", englishTime);
    formDataToSend.append("amount", Number(cost));
    images.forEach((img, index) => {
      formDataToSend.append(`images[${index + 1}]`, img);
    });
    if (video) {
      formDataToSend.append("video", video);
    }
    
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
              onBlur={() => validateField("cost", student)}
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
                maxDate={new Date()}
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
          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
              آپلود فایل تصویری حداقل ۳ عدد <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
            </h3>
            <label
              htmlFor="file-upload_1"
              className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                touched.images && errors.images 
                  ? "border-red-500 bg-red-50" 
                  : images.length >= 3 
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
  
          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
              آپلود فایل ویدئویی حداقل ۳۰ ثانیه (اختیاری)
            </h3>
            <label
              htmlFor="file-upload_2"
              className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
            >
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
              <Image
                className="w-7"
                alt="#"
                width={0}
                height={0}
                src={video ? "/Images/masajed/upload.svg" : "/Images/masajed/darkhast/sabt/Group.svg"}
              />
              <input
                id="file-upload_2"
                type="file"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </label>
            <small className="text-yellow-600">در صورت گویا نبودن گویا نبودن تصاویر فایل ویدئو بارگزاری شود</small>
            {video && (
              <div className="mt-2 w-full">
                <video controls className="w-full rounded-lg">
                  <source src={URL.createObjectURL(video)} type={video.type} />
                </video>
              </div>
            )}
          </div>
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

"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatPrice } from "../../../../../components/utils/formatPrice";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../../../../styles/form.css';

const MainGardeshMoshahede2 = ({ id, data }) => {
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
  
  // Validation states for each field
  const [errors, setErrors] = useState({
    student: "",
    cost: "",
    time: "",
    images: "",
    video: ""
  });
  
  // Track if fields have been touched/interacted with
  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    des: false,
    images: false,
    video: false
  });

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const validateField = (name, value) => {
    let error = "";
    
    switch(name) {
      case "student":
        if (!value) error = "تعداد دانش آموزان الزامی است";
        else if (isNaN(value) || value <= 0) error = "لطفا یک عدد مثبت وارد کنید";
        break;
      case "time":
        if (!value) error = "تاریخ برگزاری الزامی است";
        break;
      case "cost":
        if (!value) error = "هزینه کلی عملیات الزامی است";
        break;
      case "images":
        if (value.length < 3) error = "حداقل ۳ تصویر الزامی است";
        else if (value.length > 10) error = "حداکثر ۱۰ تصویر مجاز است";
        break;
      case "video":
        if (value && !value.type.startsWith("video/")) error = "فقط فایل ویدئویی مجاز است";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let value;
    switch(name) {
      case "student":
        value = student;
        break;
      case "cost":
        value = cost;
        break;
      case "time":
        value = time;
        break;
      case "images":
        value = images;
        break;
      case "video":
        value = video;
        break;
      default:
        value = "";
    }
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCostChange = (event) => {
    const value = event.target.value;
    setCost(value);
    
    if (touched.cost) {
      const error = validateField("cost", value);
      setErrors(prev => ({ ...prev, cost: error }));
    }
  };

  const handleStudentChange = (event) => {
    const value = event.target.value;
    setStudent(value);
    
    if (touched.student) {
      const error = validateField("student", value);
      setErrors(prev => ({ ...prev, student: error }));
    }
  };

  const handleTimeChange = (value) => {
    setTime(value);
    
    if (touched.time) {
      const error = validateField("time", value);
      setErrors(prev => ({ ...prev, time: error }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);
    
    setTouched(prev => ({ ...prev, images: true }));
    const error = validateField("images", newImages);
    setErrors(prev => ({ ...prev, images: error }));
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    if (touched.images) {
      const error = validateField("images", newImages);
      setErrors(prev => ({ ...prev, images: error }));
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setVideo(file);
    setTouched(prev => ({ ...prev, video: true }));
    
    const error = validateField("video", file);
    setErrors(prev => ({ ...prev, video: error }));
  };

  const convertPersianToEnglish = (str) => {
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
    const englishNumbers = "0123456789";
  
    return str.replace(/[\u06F0-\u06F9]/g, (char) => 
      englishNumbers[persianNumbers.indexOf(char)]
    );
  };

  // Convert number to Persian text
  const numberToText = (num) => {
    if (!num || isNaN(num)) return "";
    
    const units = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
    const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
    const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];
    
    if (num === 0) return "صفر";
    
    const numStr = String(num);
    if (num < 20) return units[num];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      return tens[ten] + (unit > 0 ? " و " + units[unit] : "");
    }
    
    // For simplicity, we'll handle up to 9999
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return units[hundred] + " صد" + (remainder > 0 ? " و " + numberToText(remainder) : "");
    }
    
    if (num < 10000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      return units[thousand] + " هزار" + (remainder > 0 ? " و " + numberToText(remainder) : "");
    }
    
    return numStr; // For larger numbers, return as is
  };

  const validateForm = () => {
    const formErrors = {
      student: validateField("student", student),
      cost: validateField("cost", cost),
      time: validateField("time", time),
      images: validateField("images", images),
      video: validateField("video", video)
    };
    
    setErrors(formErrors);
    setTouched({
      student: true,
      cost: true,
      time: true,
      des: true,
      images: true,
      video: true
    });
    
    return !Object.values(formErrors).some(error => error);
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
    formDataToSend.append("amount", Number(cost));
    formDataToSend.append("body", des);
    formDataToSend.append("date", englishTime);
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
      if(error.response?.data?.error) {
        setStatusSend(error.response.data.error);
      } else {
        setStatusSend("خطا در ارسال اطلاعات. لطفا دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Helper function to determine input field class based on validation state
  const getFieldClass = (fieldName) => {
    const baseClass = "block w-full p-4 border rounded-lg text-gray-700";
    if (!touched[fieldName]) return `${baseClass} border-[#DFDFDF]`;
    if (errors[fieldName]) return `${baseClass} border-red-500 bg-red-50`;
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
              تعداد دانش آموزان نوجوان <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="student"
                value={student}
                onChange={handleStudentChange}
                onBlur={() => handleBlur("student")}
                name="student"
                placeholder="به عنوان مثال 25 عدد..."
                className={getFieldClass("student")}
              />
              {errors.student && touched.student && (
                <p className="mt-1 text-xs text-red-500">{errors.student}</p>
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
              onChange={handleCostChange}
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
              تاریخ برگزاری <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
            </label>
            <div className="relative w-full">
              <DatePicker
                maxDate={new Date()}
                editable={false}
                value={time}
                onChange={handleTimeChange}
                onOpen={() => setTouched(prev => ({ ...prev, time: true }))}
                onClose={() => handleBlur("time")}
                calendar={persian}
                locale={persian_fa}
                inputClass={!touched.time ? "block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700" :
                          errors.time ? "block w-full p-4 border border-red-500 rounded-lg text-gray-700 bg-red-50" :
                          "block w-full p-4 border border-green-500 rounded-lg text-gray-700 bg-green-50"}
                format="YYYY-MM-DD"
                placeholder="انتخاب تاریخ"
              />
              {errors.time && touched.time && (
                <p className="mt-1 text-xs text-red-500">{errors.time}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4 mt-3">
          <label htmlFor="textarea" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            توضیحات تکمیلی
          </label>
          <textarea
            className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700 md:h-24"
            id="des"
            name="des"
            value={des}
            onChange={(event) => setDes(event.target.value)}
            rows="10"
            cols="15"
            placeholder="در اینجا تایپ کنید …"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
              آپلود فایل تصویری <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span> <span className="text-sm text-gray-500">(حداقل ۳ و حداکثر ۱۰ عدد)</span>
            </h3>
            <label
              htmlFor="file-upload_1"
              className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                touched.images
                  ? errors.images
                    ? "border-red-500 bg-red-50"
                    : "border-green-500 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
              {images.length > 0 && !errors.images ? (
                <Image className="w-7" alt="تایید آپلود" width={0} height={0} src="/Images/masajed/upload.svg" />
              ) : (
                <Image className="w-7" alt="آپلود فایل" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
              )}
              <input id="file-upload_1" type="file" multiple className="hidden" onChange={handleImageUpload} />
            </label>
            {errors.images && touched.images && (
              <p className="mt-1 text-xs text-red-500">{errors.images}</p>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover rounded-lg" />
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
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">آپلود فایل ویدئویی حداقل ۳۰ ثانیه (اختیاری) </h3>
            <label
              htmlFor="file-upload_2"
              className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${
                touched.video
                  ? errors.video
                    ? "border-red-500 bg-red-50"
                    : video ? "border-green-500 bg-green-50" : "border-gray-300"
                  : "border-gray-300"
              }`}
            >
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
              {video && !errors.video ? (
                <Image className="w-7" alt="تایید آپلود" width={0} height={0} src="/Images/masajed/upload.svg" />
              ) : (
                <Image className="w-7" alt="آپلود فایل" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
              )}
              <input id="file-upload_2" type="file" className="hidden" onChange={handleVideoUpload} />
            </label>
            <small className="text-yellow-600">در صورت گویا نبودن گویا نبودن تصاویر فایل ویدئو بارگزاری شود</small>
            {errors.video && touched.video && (
              <p className="mt-1 text-xs text-red-500">{errors.video}</p>
            )}
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
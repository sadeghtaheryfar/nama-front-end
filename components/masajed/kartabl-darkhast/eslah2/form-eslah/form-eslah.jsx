"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../../../../styles/form.css';

const convertToPersianText = (num) => {
  if (!num) return "";
  
  const persianWords = {
    0: "صفر",
    1: "یک",
    2: "دو",
    3: "سه",
    4: "چهار",
    5: "پنج",
    6: "شش",
    7: "هفت",
    8: "هشت",
    9: "نه",
    10: "ده",
    11: "یازده",
    12: "دوازده",
    13: "سیزده",
    14: "چهارده",
    15: "پانزده",
    16: "شانزده",
    17: "هفده",
    18: "هجده",
    19: "نوزده",
    20: "بیست",
    30: "سی",
    40: "چهل",
    50: "پنجاه",
    60: "شصت",
    70: "هفتاد",
    80: "هشتاد",
    90: "نود",
    100: "صد",
    200: "دویست",
    300: "سیصد",
    400: "چهارصد",
    500: "پانصد",
    600: "ششصد",
    700: "هفتصد",
    800: "هشتصد",
    900: "نهصد",
  };

  const units = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];
  
  if (num === 0) return persianWords[0];
  
  const numStr = Math.floor(Math.abs(num)).toString();
  let result = "";
  let counter = 0;

  // Process the number in groups of three digits
  for (let i = numStr.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    const group = parseInt(numStr.substring(start, i));
    
    if (group !== 0) {
      let groupText = "";
      
      // Convert the group to text
      if (group < 20) {
        groupText = persianWords[group] || "";
      } else if (group < 100) {
        const tens = Math.floor(group / 10) * 10;
        const ones = group % 10;
        groupText = persianWords[tens] + (ones > 0 ? " و " + persianWords[ones] : "");
      } else {
        const hundreds = Math.floor(group / 100) * 100;
        const remainder = group % 100;
        
        groupText = persianWords[hundreds];
        
        if (remainder > 0) {
          if (remainder < 20) {
            groupText += " و " + persianWords[remainder];
          } else {
            const tens = Math.floor(remainder / 10) * 10;
            const ones = remainder % 10;
            groupText += " و " + persianWords[tens] + (ones > 0 ? " و " + persianWords[ones] : "");
          }
        }
      }
      
      // Add the unit (thousand, million, etc.)
      if (counter > 0) {
        groupText += " " + units[counter];
      }
      
      // Add this group to the result
      result = groupText + (result ? " و " + result : "");
    }
    
    counter++;
  }
  
  return result || persianWords[0];
};

const FormEslah = ({ data }) => {
  const router = useRouter();
  
  const [student, setStudent] = useState("");
  const [studentError, setStudentError] = useState("");
  const [id, setID] = useState("");
  const [cost, setCost] = useState("");
  const [costError, setCostError] = useState("");
  const [costText, setCostText] = useState("");
  const [time, setTime] = useState("");
  const [timeError, setTimeError] = useState("");
  const [des, setDes] = useState("");
  const [imamLetter, setImamLetter] = useState(null);
  const [imamLetterError, setImamLetterError] = useState("");
  const [connectionLetter, setConntectionLetter] = useState(null);
  const [connectionLetterError, setConnectionLetterError] = useState("");
  const [statusFile1, setStatusFile1] = useState("مقدار فایل وجود ندارد");
  const [statusFile2, setStatusFile2] = useState("مقدار فایل وجود ندارد");
  const [file1Uploaded, setFile1Uploaded] = useState(false);
  const [file2Uploaded, setFile2Uploaded] = useState(false);
  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  useEffect(() => {
    if(data) {
      setStudent(data?.students);
      setID(data?.id);
      setCost(data?.amount);
      setDes(data?.body);

      if (data?.date) {
        const gregorianDate = new Date(data.date);
        
        const persianDate = new DateObject({
          date: gregorianDate,
          calendar: persian
        });
        
        const formattedDate = `${persianDate.year}/${persianDate.month.number.toString().padStart(2, '0')}/${persianDate.day.toString().padStart(2, '0')}`;
        setTime(formattedDate);
}
      

      if (!data.imam_letter) {
        setImamLetterError("");
        setStatusFile1("فایل اختیاری است");
      }
      
      if (!data.area_interface_letter) {
        setConnectionLetterError("");
        setStatusFile2("فایل اختیاری است");
      }
    }
  }, [data]);

  useEffect(() => {
    if (cost) {
      setCostText(convertToPersianText(parseInt(cost)));
    } else {
      setCostText("");
    }
  }, [cost]);

  const validateForm = () => {
    let isValid = true;

    if (!student) {
      setStudentError("تعداد دانش آموزان الزامی است.");
      isValid = false;
    } else {
      setStudentError("");
    }

    if (!cost) {
      setCostError("هزینه کلی الزامی است.");
      isValid = false;
    } else {
      setCostError("");
    }

    if (!time) {
      setTimeError("تاریخ برگزاری الزامی است.");
      isValid = false;
    } else {
      setTimeError("");
    }

    if (data?.imam_letter && !imamLetter) {
      setImamLetterError("نامه امام جماعت الزامی است.");
      isValid = false;
    } else {
      setImamLetterError("");
    }

    if (data?.area_interface_letter && !connectionLetter) {
      setConnectionLetterError("نامه رابط منطقه الزامی است.");
      isValid = false;
    } else {
      setConnectionLetterError("");
    }

    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      isValid = false;
    } else {
      setStatusCheckBox("");
    }

    return isValid;
  };

  const handleFile1 = (event) => {
    if (event.target.value === "") {
      if (data?.imam_letter) {
        setStatusFile1("مقدار فایل وجود ندارد");
        setFile1Uploaded(false);
        setImamLetter(null);
        setImamLetterError("نامه امام جماعت الزامی است.");
      } else {
        setStatusFile1("فایل اختیاری است");
        setFile1Uploaded(false);
        setImamLetter(null);
      }
      return;
    }
    if (true) {
      setImamLetter(event.target.files);
      setStatusFile1("فایل مورد نظر انتخاب شد");
      setFile1Uploaded(true);
      setImamLetterError("");
    } else {
      setStatusFile1("فرمت فایل انتخابی مجاز نمی باشد");
      setFile1Uploaded(false);
      setImamLetter(null);
      if (data?.imam_letter) {
        setImamLetterError("فرمت فایل انتخابی مجاز نمی باشد");
      }
    }
  };

  const handleFile2 = (event) => {
    setStatusSend("");

    if (event.target.value === "") {
      if (data?.area_interface_letter) {
        setStatusFile2("مقدار فایل وجود ندارد");
        setFile2Uploaded(false);
        setConntectionLetter(null);
        setConnectionLetterError("نامه رابط منطقه الزامی است.");
      } else {
        setStatusFile2("فایل اختیاری است");
        setFile2Uploaded(false);
        setConntectionLetter(null);
      }
      return;
    }

    if (true) {
      setConntectionLetter(event.target.files);
      setStatusFile2("فایل مورد نظر انتخاب شد");
      setFile2Uploaded(true);
      setConnectionLetterError("");
    } else {
      setStatusFile2("فرمت فایل انتخابی مجاز نمی باشد");
      setFile2Uploaded(false);
      setConntectionLetter(null);
      if (data?.area_interface_letter) {
        setConnectionLetterError("فرمت فایل انتخابی مجاز نمی باشد");
      }
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = `${date.year}/${date.month.number.toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
      setTime(formattedDate);
      setTimeError("");
    } else {
      setTime("");
      setTimeError("تاریخ برگزاری الزامی است.");
    }
  };

  const handleStudentChange = (event) => {
    const value = event.target.value;
    setStudent(value);
    if (!value) {
      setStudentError("تعداد دانش آموزان الزامی است.");
    } else {
      setStudentError("");
    }
  };

  const handleCostChange = (event) => {
    const value = event.target.value;
    setCost(value);
    
    if (!value) {
      setCostError("هزینه کلی الزامی است.");
      setCostText("");
    } else {
      setCostError("");
      setCostText(convertToPersianText(parseInt(value)));
    }
  };

  const hnadleForm = async () => {
    if (!validateForm()) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else {
      setStatusSend("");
    }

    const newDate = time.replaceAll("/", "-");

    const formDataToSend = new FormData();
    formDataToSend.append("students", Number(student));
    formDataToSend.append("amount", Number(cost));
    formDataToSend.append("body", des);
    formDataToSend.append("date", newDate);
    formDataToSend.append("request_plan_id", id);
    
    if (imamLetter && imamLetter[0]) {
      formDataToSend.append("imam_letter", imamLetter[0]);
    }
    
    if (connectionLetter && connectionLetter[0]) {
      formDataToSend.append("area_interface_letter", connectionLetter[0]);
    }
    
    setLoading(true);
    setIsUploading(true);

    try {
      const submitForm = await axios.post(
        `https://arman.armaniran.org/api/v1/requests/${id}?_method=PATCH&item_id=${itemId}&role=mosque_head_coach`,
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

      if (submitForm.data) {
        localStorage.setItem("submittedForm", JSON.stringify(submitForm.data));
        router.push(`/${itemId}/kartabl-darkhast`);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setStatusSend(error.response.data.error);
      } else {
        setStatusSend("خطا در ارسال اطلاعات");
        if(error.response && error.response?.data?.errors?.amount[0])
        {
          setCostError(error.response?.data?.errors?.amount[0]);
        }
      }
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
        <div className="mb-4">
          <label htmlFor="options" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            تعداد دانش آموزان نوجوان <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="student"
              value={student}
              onChange={handleStudentChange}
              name="student"
              placeholder="به عنوان مثال 25 عدد..."
              className={`block w-full p-4 border rounded-lg text-gray-700 ${
                studentError ? 'border-red-500' : student ? 'border-green-500' : 'border-[#DFDFDF]'
              }`}
            />
            {studentError && <p className="text-red-500 text-sm mt-1">{studentError}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="hesab" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            هزینه کلی عملیات <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={cost}
            onChange={handleCostChange}
            min={1000}
            max={10000000000000}
            placeholder="از 1،000 تا 10،000،000،000،000"
            className={`block w-full p-4 border rounded-lg text-gray-700 ${
              costError ? 'border-red-500' : cost ? 'border-green-500' : 'border-[#DFDFDF]'
            }`}
          />
          {costError && <p className="text-red-500 text-sm mt-1">{costError}</p>}
          {costText && <p className="text-gray-600 text-sm mt-1">{costText} ریال</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="calendar" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            تاریخ برگزاری <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
          </label>
          <div className="relative">
            <DatePicker
              editable={false}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              value={time}
              onChange={handleDateChange}
              inputClass={`block w-full p-4 border rounded-lg text-gray-700 ${
                timeError ? 'border-red-500' : time ? 'border-green-500' : 'border-[#DFDFDF]'
              }`}
              placeholder="انتخاب تاریخ"
            />
            {timeError && <p className="text-red-500 text-sm mt-1">{timeError}</p>}
          </div>
        </div>
      </div>

      <div className="mb-4 mt-3">
        <label htmlFor="textarea" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
          توضیحات تکمیلی
        </label>
        <textarea
          className={`block w-full p-4 border rounded-lg text-gray-700 md:h-24 ${
            des ? 'border-green-500' : 'border-[#DFDFDF]'
          }`}
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
            آپلود فایل پیوست نامه امام جماعت {data?.imam_letter && <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>}
          </h3>
          <label
            htmlFor="file-upload_1"
            className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer ${
              imamLetterError ? 'border-red-500' : file1Uploaded ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between pt-5 pb-6">
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
            </div>
            <Image
              className="w-7"
              alt="#"
              width={0}
              height={0}
              src={file1Uploaded ? "/Images/masajed/upload.svg" : "/Images/masajed/darkhast/sabt/Group.svg"}
            />
            <input
              id="file-upload_1"
              name="imamLetter"
              type="file"
              className="hidden"
              onChange={(event) => handleFile1(event)}
            />
            <small>{statusFile1}</small>
          </label>
          {imamLetterError && <p className="text-red-500 text-sm mt-1">{imamLetterError}</p>}
        </div>

        <div className="mb-4">
          <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
            آپلود فایل نامه رابط منطقه {data?.area_interface_letter && <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>}
          </h3>
          <label
            htmlFor="file-upload_2"
            className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer ${
              connectionLetterError ? 'border-red-500' : file2Uploaded ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between pt-5 pb-6">
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
            </div>
            <Image
              className="w-7"
              alt="#"
              width={0}
              height={0}
              src={file2Uploaded ? "/Images/masajed/upload.svg" : "/Images/masajed/darkhast/sabt/Group.svg"}
            />
            <input
              id="file-upload_2"
              name="connectionLetter"
              type="file"
              className="hidden"
              onChange={(event) => handleFile2(event)}
            />
            <small>{statusFile2}</small>
          </label>
          {connectionLetterError && <p className="text-red-500 text-sm mt-1">{connectionLetterError}</p>}
        </div>
      </div>

      <div className="flex items-start mb-7 mt-7">
        <input
          id="checked-checkbox"
          type="checkbox"
          checked={checkbox}
          onChange={(event) => setCheckBox(event.target.checked)}
          className={`min-w-5 h-5 appearance-none checked:bg-[#39A894] border rounded checked:ring-offset-2 checked:ring-1 ring-gray-300`}
        />
        <label
          htmlFor="checked-checkbox"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
        >
          تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در صورت عدم تطبیق مسئولیت آن
          را می پذیرم. <span className="text-red-500" style={{ fontFamily : 'none' }}>*</span>
        </label>
        {statusCheckBox && <span className="text-red-500 px-2">{statusCheckBox}</span>}
      </div>
      <div className="flex justify-center w-full flex-col items-center">
        <button
          onClick={() => hnadleForm()}
          className="w-full h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white md:max-w-[214px]"
        >
          {loading ? 'صبر کنید ...' : 'تایید و ثبت اطلاعات'}
        </button>
        {statusSend && <span className="p-2 text-red-600">{statusSend}</span>}
      </div>

      {isUploading && uploadProgress > 0 && (
        <div className="flex justify-center w-full items-center">
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

export default FormEslah;
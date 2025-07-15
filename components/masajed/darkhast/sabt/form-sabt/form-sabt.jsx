"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatPrice } from "../../../../../components/utils/formatPrice";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../../../../styles/form.css';

const FormSabt = ({ id, data }) => {
  const router = useRouter();

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const [student, setStudent] = useState("");
  const [cost, setCost] = useState("");
  const [time, setTime] = useState("");
  const [des, setDes] = useState("");
  // Storing objects with file and its preview URL
  const [imamLetters, setImamLetters] = useState([]);
  const [connectionLetters, setConnectionLetters] = useState([]);
  const [additionalAttachments, setAdditionalAttachments] = useState([]); // Added state for additional attachments
  const [statusFile1, setStatusFile1] = useState("مقدار فایل وجود ندارد");
  const [statusFile2, setStatusFile2] = useState("مقدار فایل وجود ندارد");
  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [isImamLetterRequired, setIsImamLetterRequired] = useState(false);
  const [isAreaLetterRequired, setIsAreaLetterRequired] = useState(false);

  const [typeField, setTypeField] = useState(null);

  useEffect(() => {
    if (!pathname) return;
    const pathSegments = pathname.split("/");
    const itemId = pathSegments[1];

    const fetching = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${itemId}&role=mosque_head_coach`);
        if (response.data) {
          if (response?.data?.data?.title == "مساجد") {
            setTypeField('امام جماعت')
          } else if (response?.data?.data?.title == "مدارس") {
            setTypeField('مدیر')
          }
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      }
    };
    fetching();
  }, []);

  useEffect(() => {
    if (data) {
      setIsImamLetterRequired(data.imam_letter === true);
      setIsAreaLetterRequired(data.area_interface_letter === true);
    }
  }, [data]);

  // Clean up object URLs when component unmounts
  // This useEffect will run once when the component unmounts.
  // It's also good to clean up URLs when files are explicitly removed.
  useEffect(() => {
    return () => {
      imamLetters.forEach(file => URL.revokeObjectURL(file.preview));
      connectionLetters.forEach(file => URL.revokeObjectURL(file.preview));
      additionalAttachments.forEach(file => URL.revokeObjectURL(file.preview)); // Clean up additional attachments
    };
  }, []); // Empty dependency array means it runs only on mount and unmount


  // Validation states
  const [errors, setErrors] = useState({
    student: "",
    cost: "",
    time: "",
    imamLetter: "",
    connectionLetter: "",
    additionalAttachments: "", // Added for validation
  });

  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    imamLetter: false,
    connectionLetter: false,
    additionalAttachments: false, // Added for validation
  });

  // Function to convert numbers to Persian words
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

    // Convert to string and process in groups of 3 digits
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

  const handleFileChange = (event, setFiles, setStatus, fieldName) => {
    setStatusSend("");

    const files = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "application/pdf"];
    const newFiles = [];
    let hasInvalidType = false;

    files.forEach(file => {
      if (allowedTypes.includes(file.type)) {
        // Add a unique ID to each file object for better keying in React lists
        newFiles.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setFiles((prevFiles) => {
      const combinedFiles = [...prevFiles, ...newFiles];
      if (combinedFiles.length > 10) {
        if (setStatus) setStatus("حداکثر 10 فایل مجاز است"); // Only set status if it's provided
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "حداکثر 10 فایل مجاز است" }));
        // Revoke URLs of files that exceed the limit immediately
        newFiles.forEach(file => URL.revokeObjectURL(file.preview));
        return prevFiles; // Do not update state if more than 10 files
      }
      if (setStatus) setStatus(newFiles.length > 0 ? "فایل(های) مورد نظر انتخاب شد" : "مقدار فایل وجود ندارد");
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: hasInvalidType ? "فقط فایل‌های عکس مجاز هستند" : "" }));
      setTouched((prevTouched) => ({ ...prevTouched, [fieldName]: true }));
      return combinedFiles;
    });
    // Clear the input value so the same file can be selected again
    event.target.value = '';
  };

  const removeFile = (setFiles, idToRemove, fieldName) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find(file => file.id === idToRemove);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview); // Revoke the URL of the removed file
      }
      const updatedFiles = prevFiles.filter((file) => file.id !== idToRemove);
      // Re-validate if a required field becomes empty after removal
      if (fieldName === "imamLetter" && isImamLetterRequired && updatedFiles.length === 0) {
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: `فایل نامه الزامی است` }));
      } else if (fieldName === "connectionLetter" && isAreaLetterRequired && updatedFiles.length === 0) {
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "فایل نامه رابط منطقه الزامی است" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
      }
      return updatedFiles;
    });
  };


  const validateStudent = (value) => {
    if (!value) {
      return "تعداد دانش آموزان الزامی است";
    } else if (isNaN(value) || value <= 0) {
      return "لطفا یک عدد معتبر وارد کنید";
    }
    return "";
  };

  const validateTime = (value) => {
    if (!value) {
      return "تاریخ برگزاری الزامی است";
    }
    return "";
  };

  const handleStudentChange = (event) => {
    const value = event.target.value;
    setStudent(value);
    setErrors({
      ...errors,
      student: validateStudent(value),
    });
    setTouched({ ...touched, student: true });
  };

  const handleCostChange = (event) => {
    const value = event.target.value;
    setCost(value);
    setErrors({
      ...errors,
    });
    setTouched({ ...touched, cost: true });
  };

  const handleTimeChange = (value) => {
    setTime(value);
    setErrors({
      ...errors,
      time: validateTime(value),
    });
    setTouched({ ...touched, time: true });
  };

  const validateImamLetter = (files) => {
    if (isImamLetterRequired && files.length === 0) {
      return `فایل نامه الزامی است`;
    }
    return "";
  };

  const validateAreaLetter = (files) => {
    if (isAreaLetterRequired && files.length === 0) {
      return "فایل نامه رابط منطقه الزامی است";
    }
    return "";
  };

  // No specific validation for additionalAttachments, but you can add it if needed
  const validateAdditionalAttachments = (files) => {
    // Example: If you want to limit the number of additional files
    // if (files.length > 5) {
    //   return "حداکثر 5 فایل پیوست اضافی مجاز است.";
    // }
    return "";
  };

  const convertPersianToEnglish = (str) => {
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
    const englishNumbers = "0123456789";

    return str.replace(/[\u06F0-\u06F9]/g, (char) =>
      englishNumbers[persianNumbers.indexOf(char)]
    );
  };

  const hnadleForm = async () => {
    // Mark all fields as touched
    setTouched({
      student: true,
      cost: true,
      time: true,
      imamLetter: true,
      connectionLetter: true,
      additionalAttachments: true, // Mark additional attachments as touched
    });

    // Validate all fields
    const newErrors = {
      student: validateStudent(student),
      time: validateTime(time),
      imamLetter: validateImamLetter(imamLetters),
      connectionLetter: validateAreaLetter(connectionLetters),
      additionalAttachments: validateAdditionalAttachments(additionalAttachments), // Validate additional attachments
    };

    setErrors(newErrors);

    // Check if there are any validation errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      return;
    } else {
      setStatusCheckBox("");
    }

    if (hasErrors) {
      setStatusSend("مقادیر فرم ناقص است.");
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
    formDataToSend.append("request_plan_id", id);

    if (imamLetters.length > 0) {
      formDataToSend.append("imam_letter", imamLetters[0].file); // First file for imam_letter
      for (let i = 1; i < imamLetters.length; i++) {
        formDataToSend.append(`other_imam_letter[${i - 1}]`, imamLetters[i].file); // Other files for other_imam_letter
      }
    }

    if (connectionLetters.length > 0) {
      formDataToSend.append("area_interface_letter", connectionLetters[0].file); // First file for area_interface_letter
      for (let i = 1; i < connectionLetters.length; i++) {
        formDataToSend.append(`other_area_interface_letter[${i - 1}]`, connectionLetters[i].file); // Other files for other_area_interface_letter
      }
    }

    // Append additional attachments
    if (additionalAttachments.length > 0) {
      additionalAttachments.forEach((fileObj, index) => {
        formDataToSend.append(`images[${index}]`, fileObj.file);
      });
    }

    setLoading(true);
    setIsUploading(true);

    try {
      const submitForm = await axios.post(
        `https://arman.armaniran.org/api/v1/requests?item_id=${itemId}&role=mosque_head_coach`,
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
        router.push(
          `/${itemId}/darkhast/sabt/sabt1/sabt2?id=${submitForm.data.data.id}&darkhast=${id}`
        );
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setStatusSend(error.response.data.error);
      } else {
        setStatusSend("خطا در ارسال اطلاعات");
        if (error.response && error.response.data.errors.amount && error.response.data.errors.amount[0]) {
          const newErrors = {
            ...errors,
            cost: error.response.data.errors.amount[0]
          };

          setErrors(newErrors);
        }
      }
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getBorderStyle = (fieldName) => {
    if (!touched[fieldName]) return "border-[#DFDFDF]";
    return errors[fieldName] ? "border-red-500" : "border-green-500";
  };

  // Required field indicator
  const RequiredStar = () => (
    <span className="text-red-500 mr-1" style={{ fontFamily: 'none' }}>*</span>
  );

  function formatToCurrency(amount) {
    const number = Number(amount);

    if (isNaN(number)) {
      return "مقدار وارد شده معتبر نیست";
    }

    const formattedNumber = number.toLocaleString("fa-IR");

    return `${formattedNumber} ریال`;
  }

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
        <div className="mb-4">
          <label
            htmlFor="options"
            className="block text-base lg:text-lg text-[#3B3B3B] mb-2 "
          >
            تعداد دانش آموزان / نوجوان
            <RequiredStar />
          </label>
          <div className="relative">
            <input
              type="number"
              id="student"
              value={student}
              onChange={handleStudentChange}
              onBlur={() => setTouched({ ...touched, student: true })}
              name="student"
              placeholder="به عنوان مثال 25 عدد..."
              className={`block w-full p-4 border rounded-lg text-gray-700 ${getBorderStyle(
                "student"
              )}`}
            />
            {touched.student && errors.student && (
              <div className="text-red-500 text-sm mt-1">{errors.student}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="hesab"
            className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
          >
            هزینه کلی عملیات
            <RequiredStar />
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={cost}
            onChange={handleCostChange}
            onBlur={() => setTouched({ ...touched, cost: true })}
            min={1000}
            max={10000000000000}
            placeholder="از 1،000 تا 10،000،000،000،000"
            className={`block w-full p-4 border rounded-lg text-gray-700 ${getBorderStyle(
              "cost"
            )}`}
          />
          {touched.cost && errors.cost && (
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
          <label
            htmlFor="calendar"
            className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
          >
            تاریخ برگزاری
            <RequiredStar />
          </label>
          <div className="relative w-full">
            <DatePicker
              value={time}
              onChange={(val) => handleTimeChange(val)}
              onOpen={() => setTouched({ ...touched, time: true })}
              calendar={persian}
              locale={persian_fa}
              minDate={new Date()}
              editable={false}
              inputClass={`block w-full p-4 border rounded-lg text-gray-700 ${getBorderStyle(
                "time"
              )}`}
              format="YYYY-MM-DD"
              placeholder="انتخاب تاریخ"
            />
            {touched.time && errors.time && (
              <div className="text-red-500 text-sm mt-1">{errors.time}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 mt-3">
        <label
          htmlFor="textarea"
          className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
        >
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
        {/* Upload Imam Letter Files */}
        <div className="mb-4">
          <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
            آپلود فایل پیوست نامه {typeField}
            {isImamLetterRequired && <RequiredStar />}
          </h3>
          <label
            htmlFor="file-upload_imam"
            className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${getBorderStyle(
              "imamLetter"
            )}`}
          >
            <div className="flex items-center justify-between pt-5 pb-6">
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
            </div>
            {imamLetters.length > 0 ? (
              <Image
                className="w-7"
                alt="تأیید آپلود"
                width={0}
                height={0}
                src={"/Images/masajed/upload.svg"}
              />
            ) : (
              <Image
                className="w-7"
                alt="آپلود فایل"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/Group.svg"}
              />
            )}
            <input
              id="file-upload_imam"
              name="imamLetter"
              type="file"
              multiple // Allow multiple file selection
              className="hidden"
              onChange={(event) => handleFileChange(event, setImamLetters, setStatusFile1, "imamLetter")}
              accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf" // Specify accepted file types
            />
          </label>
          {touched.imamLetter && errors.imamLetter && (
            <div className="text-red-500 text-sm mt-1">{errors.imamLetter}</div>
          )}
          {imamLetters.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {imamLetters.map((file) => (
                <div key={file.id} className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden group">
                  <img src={file.preview} alt={`پیش نمایش ${file.file.name}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(setImamLetters, file.id, "imamLetter")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none transition-opacity"
                    title="حذف فایل"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Area Interface Letter Files */}
        <div className="mb-4">
          <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
            آپلود فایل نامه رابط منطقه
            {isAreaLetterRequired && <RequiredStar />}
          </h3>
          <label
            htmlFor="file-upload_connection"
            className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${getBorderStyle(
              "connectionLetter"
            )}`}
          >
            <div className="flex items-center justify-between pt-5 pb-6">
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
            </div>
            {connectionLetters.length > 0 ? (
              <Image
                className="w-7"
                alt="تأیید آپلود"
                width={0}
                height={0}
                src={"/Images/masajed/upload.svg"}
              />
            ) : (
              <Image
                className="w-7"
                alt="آپلود فایل"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/Group.svg"}
              />
            )}
            <input
              id="file-upload_connection"
              name="connectionLetter"
              type="file"
              multiple // Allow multiple file selection
              className="hidden"
              onChange={(event) => handleFileChange(event, setConnectionLetters, setStatusFile2, "connectionLetter")}
              accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf" // Specify accepted file types
            />
          </label>
          {touched.connectionLetter && errors.connectionLetter && (
            <div className="text-red-500 text-sm mt-1">
              {errors.connectionLetter}
            </div>
          )}
          {connectionLetters.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {connectionLetters.map((file) => (
                <div key={file.id} className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden group">
                  <img src={file.preview} alt={`پیش نمایش ${file.file.name}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(setConnectionLetters, file.id, "connectionLetter")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none transition-opacity"
                    title="حذف فایل"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Additional Attachments */}
        <div className="mb-4">
          <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
            آپلود پیوست‌های بیشتر
          </h3>
          <label
            htmlFor="file-upload_additional"
            className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${getBorderStyle(
              "additionalAttachments"
            )}`}
          >
            <div className="flex items-center justify-between pt-5 pb-6">
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
            </div>
            {additionalAttachments.length > 0 ? (
              <Image
                className="w-7"
                alt="تأیید آپلود"
                width={0}
                height={0}
                src={"/Images/masajed/upload.svg"}
              />
            ) : (
              <Image
                className="w-7"
                alt="آپلود فایل"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/Group.svg"}
              />
            )}
            <input
              id="file-upload_additional"
              name="additionalAttachments"
              type="file"
              multiple // Allow multiple file selection
              className="hidden"
              onChange={(event) => handleFileChange(event, setAdditionalAttachments, null, "additionalAttachments")}
              accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf" // Specify accepted file types
            />
          </label>
          {touched.additionalAttachments && errors.additionalAttachments && (
            <div className="text-red-500 text-sm mt-1">
              {errors.additionalAttachments}
            </div>
          )}
          {additionalAttachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {additionalAttachments.map((file) => (
                <div key={file.id} className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden group">
                  <img src={file.preview} alt={`پیش نمایش ${file.file.name}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(setAdditionalAttachments, file.id, "additionalAttachments")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none transition-opacity"
                    title="حذف فایل"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start mb-7 mt-7">
        <input
          id="checked-checkbox"
          type="checkbox"
          value={checkbox}
          onChange={(event) => setCheckBox(event.target.checked)}
          className="min-w-5 h-5 appearance-none checked:bg-[#39A894] border border-gray-300 rounded  checked:ring-offset-2 checked:ring-1 ring-gray-300"
        />
        <label
          htmlFor="checked-checkbox"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
        >
          تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در صورت
          عدم تطبیق مسئولیت آن را می پذیرم.{" "}
          <RequiredStar />
        </label>
        <span className="p-2 text-red-600">{statusCheckBox}</span>
      </div>

      <div className="flex justify-center w-full flex-col items-center">
        <button
          onClick={() => hnadleForm()}
          className="w-full h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white md:max-w-[214px]"
        >
          {loading ? "صبر کنید ..." : "تایید و ثبت اطلاعات"}
        </button>
        <span className="p-2 text-red-600">{statusSend}</span>
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

export default FormSabt;
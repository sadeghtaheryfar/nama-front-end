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
import toast, { Toaster } from 'react-hot-toast'; // Correct import for react-hot-toast

// Helper function to convert numbers to Persian words
const convertToPersianWords = (num) => {
  if (!num) return "";

  const persianWords = {
    0: "صفر", 1: "یک", 2: "دو", 3: "سه", 4: "چهار", 5: "پنج", 6: "شش", 7: "هفت", 8: "هشت", 9: "نه",
    10: "ده", 11: "یازده", 12: "دوازده", 13: "سیزده", 14: "چهارده", 15: "پانزده", 16: "شانزده",
    17: "هفده", 18: "هجده", 19: "نوزده",
    20: "بیست", 30: "سی", 40: "چهل", 50: "پنجاه", 60: "شصت", 70: "هفتاد", 80: "هشتاد", 90: "نود",
    100: "صد", 200: "دویست", 300: "سیصد", 400: "چهارصد", 500: "پانصد", 600: "ششصد", 700: "هفتصد",
    800: "هشتصد", 900: "نهصد",
  };

  const units = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  if (num === 0) return persianWords[0];

  let numStr = Math.floor(Math.abs(num)).toString();
  let result = "";
  let counter = 0;

  for (let i = numStr.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    const group = parseInt(numStr.substring(start, i));

    if (group !== 0) {
      let groupText = "";
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
      if (counter > 0) {
        groupText += " " + units[counter];
      }
      result = groupText + (result ? " و " + result : "");
    }
    counter++;
  }
  return result.trim() + " ریال"; // Added ريال to the end
};

const FormEslah = ({ data: initialRequestData }) => { // Renamed data to initialRequestData for clarity
  const router = useRouter();

  // Form fields states, initialized from initialRequestData prop
  const [student, setStudent] = useState(initialRequestData?.students || "");
  const [id, setID] = useState(initialRequestData?.id || ""); // Request ID
  const [cost, setCost] = useState(initialRequestData?.amount || "");
  const [costText, setCostText] = useState(""); // Cost in Persian words
  const [time, setTime] = useState(""); // Date
  const [des, setDes] = useState(initialRequestData?.body || ""); // Description

  // File states: array of objects { id, file, preview, isExisting }
  const [imamLetters, setImamLetters] = useState([]);
  const [connectionLetters, setConnectionLetters] = useState([]);
  const [additionalAttachments, setAdditionalAttachments] = useState([]); // Added state for additional attachments

  // UI states
  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false); // For form submission loading
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // For file upload progress

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1]; // Item ID from URL

  // API-driven requirements for file fields
  const [isImamLetterRequired, setIsImamLetterRequired] = useState(false);
  const [isAreaLetterRequired, setIsAreaLetterRequired] = useState(false);
  const [typeField, setTypeField] = useState(null); // 'امام جماعت' or 'مدیر'

  // Validation errors states (using a single object for all errors)
  const [errors, setErrors] = useState({
    student: "",
    cost: "",
    time: "",
    imamLetter: "",
    connectionLetter: "",
    additionalAttachments: "", // Added for validation of new field
  });

  // Touched states for input validation UI
  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    imamLetter: false,
    connectionLetter: false,
    additionalAttachments: false, // Added for validation of new field
  });

  // --- Effects ---

  // 1. Initialize form fields and file states from initialRequestData prop
  useEffect(() => {
    if (initialRequestData) {
      setStudent(initialRequestData.students || "");
      setID(initialRequestData.id || "");
      setCost(initialRequestData.amount || "");
      setDes(initialRequestData.body || "");

      // Convert Gregorian date to Persian for DatePicker
      if (initialRequestData.date) {
        const gregorianDate = new Date(initialRequestData.date);
        const persianDate = new DateObject({
          date: gregorianDate,
          calendar: persian
        });
        const formattedDate = `${persianDate.year}/${persianDate.month.number.toString().padStart(2, '0')}/${persianDate.day.toString().padStart(2, '0')}`;
        setTime(formattedDate);
      }

      // Populate imamLetters with existing files
      const existingImamLetters = [];
      if (initialRequestData.imam_letter?.original) {
          existingImamLetters.push({
              id: initialRequestData.imam_letter.id, // Use original file ID for deletion API
              file: null, // No File object for existing files
              preview: initialRequestData.imam_letter.original,
              isExisting: true,
          });
      }
      if (initialRequestData.other_imam_letter && initialRequestData.other_imam_letter.length > 0) {
          initialRequestData.other_imam_letter.forEach(file => {
              existingImamLetters.push({
                  id: file.id, // Use original file ID
                  file: null,
                  preview: file.original,
                  isExisting: true,
              });
          });
      }
      setImamLetters(existingImamLetters);

      // Populate connectionLetters with existing files
      const existingConnectionLetters = [];
      if (initialRequestData.area_interface_letter?.original) {
          existingConnectionLetters.push({
              id: initialRequestData.area_interface_letter.id, // Use original file ID
              file: null,
              preview: initialRequestData.area_interface_letter.original,
              isExisting: true,
          });
      }
      if (initialRequestData.other_area_interface_letter && initialRequestData.other_area_interface_letter.length > 0) {
          initialRequestData.other_area_interface_letter.forEach(file => {
              existingConnectionLetters.push({
                  id: file.id, // Use original file ID
                  file: null,
                  preview: file.original,
                  isExisting: true,
              });
          });
      }
      setConnectionLetters(existingConnectionLetters);

      // Populate additionalAttachments with existing files (assuming they are in initialRequestData.images)
      const existingAdditionalAttachments = [];
      if (initialRequestData.images && initialRequestData.images.length > 0) {
        initialRequestData.images.forEach(file => {
          existingAdditionalAttachments.push({
            id: file.id, // Use original file ID
            file: null,
            preview: file.original,
            isExisting: true,
          });
        });
      }
      setAdditionalAttachments(existingAdditionalAttachments);

      // Initialize checkbox state
      setCheckBox(initialRequestData.confirm || false);
    }
  }, [initialRequestData]); // Depend on initialRequestData prop


  // 2. Fetch typeField (امام جماعت/مدیر) based on itemId
  useEffect(() => {
    if (!pathname) return;
    const pathSegments = pathname.split("/");
    const currentItemId = pathSegments[1];

    const fetchingTypeField = async () => {
      try {
        const response = await axios.get(`/api/show-item-dashboard?item_id=${currentItemId}&role=mosque_head_coach`);
        if (response.data) {
          if (response?.data?.data?.title === "مساجد") {
            setTypeField('امام جماعت');
          } else if (response?.data?.data?.title === "مدارس") {
            setTypeField('مدیر');
          }
        }
      } catch (error) {
        console.log("خطا در دریافت نوع فیلد:", error);
      }
    };
    fetchingTypeField();
  }, [pathname]);

  // 3. Set file requirement flags based on initialRequestData
  useEffect(() => {
    if (initialRequestData) { // Use initialRequestData prop to check requirements
      setIsImamLetterRequired(initialRequestData?.request_plan?.imam_letter === true);
      setIsAreaLetterRequired(initialRequestData?.request_plan?.area_interface_letter === true);
    }
  }, [initialRequestData]);

  // 4. Update cost in Persian words when cost changes
  useEffect(() => {
    if (cost) {
      setCostText(convertToPersianWords(parseInt(cost)));
    } else {
      setCostText("");
    }
  }, [cost]);

  // 5. Clean up Object URLs for newly added files on unmount or file removal
  useEffect(() => {
    return () => {
      imamLetters.forEach(file => !file.isExisting && URL.revokeObjectURL(file.preview));
      connectionLetters.forEach(file => !file.isExisting && URL.revokeObjectURL(file.preview));
      additionalAttachments.forEach(file => !file.isExisting && URL.revokeObjectURL(file.preview)); // Clean up additional attachments
    };
  }, [imamLetters, connectionLetters, additionalAttachments]); // Added dependencies to ensure proper cleanup

  // --- Validation Functions ---
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

  const validateImamLetter = (files) => {
    if (isImamLetterRequired && files.length === 0) {
      return `فایل نامه ${typeField || 'امام جماعت'} الزامی است`;
    }
    return "";
  };

  const validateConnectionLetter = (files) => {
    if (isAreaLetterRequired && files.length === 0) {
      return "فایل نامه رابط منطقه الزامی است";
    }
    return "";
  };

  // No specific validation for additionalAttachments, but will apply file type and count
  const validateAdditionalAttachments = (files) => {
    // If you want to enforce a minimum number or specific conditions for additional attachments, add them here.
    return "";
  };

  // --- Form Field Handlers ---
  const handleStudentChange = (event) => {
    const value = event.target.value;
    setStudent(value);
    setErrors(prevErrors => ({
      ...prevErrors,
      student: validateStudent(value),
    }));
    setTouched(prevTouched => ({ ...prevTouched, student: true }));
  };

  const handleCostChange = (event) => {
    const value = event.target.value;
    setCost(value);
    setErrors(prevErrors => ({
      ...prevErrors,
      cost: "", // Clear cost error on change, let full validation handle it
    }));
    setTouched(prevTouched => ({ ...prevTouched, cost: true }));
  };

  const handleTimeChange = (value) => {
    setTime(value);
    setErrors(prevErrors => ({
      ...prevErrors,
      time: validateTime(value),
    }));
    setTouched(prevTouched => ({ ...prevTouched, time: true }));
  };

  // --- Main Form Validation ---
  const validateForm = () => {
    let isValid = true;

    // Run all validations and update errors state
    const studentValidation = validateStudent(student);
    if (studentValidation) {
      setErrors(prev => ({ ...prev, student: studentValidation }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, student: "" }));
    }

    if (!cost) { // Basic check for cost, more complex validation can be added if needed
      setErrors(prev => ({ ...prev, cost: "هزینه کلی الزامی است." }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, cost: "" }));
    }

    const timeValidation = validateTime(time);
    if (timeValidation) {
      setErrors(prev => ({ ...prev, time: timeValidation }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, time: "" }));
    }

    const imamLetterValidation = validateImamLetter(imamLetters);
    if (imamLetterValidation) {
        setErrors(prev => ({ ...prev, imamLetter: imamLetterValidation }));
        isValid = false;
    } else {
        setErrors(prev => ({ ...prev, imamLetter: "" }));
    }

    const connectionLetterValidation = validateConnectionLetter(connectionLetters);
    if (connectionLetterValidation) {
        setErrors(prev => ({ ...prev, connectionLetter: connectionLetterValidation }));
        isValid = false;
    } else {
        setErrors(prev => ({ ...prev, connectionLetter: "" }));
    }

    // Validate additional attachments
    const additionalAttachmentsValidation = validateAdditionalAttachments(additionalAttachments);
    if (additionalAttachmentsValidation) {
      setErrors(prev => ({ ...prev, additionalAttachments: additionalAttachmentsValidation }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, additionalAttachments: "" }));
    }


    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      isValid = false;
    } else {
      setStatusCheckBox("");
    }

    return isValid;
  };

  // --- File Handling Functions ---

  // Handles adding new files to state (for imam, connection letters, and additional attachments)
  const handleFileChange = (event, setFiles, fieldName) => {
    setStatusSend(""); // Clear general form submission status

    const selectedFiles = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "application/pdf"];
    const newValidFiles = [];
    let hasInvalidType = false;

    selectedFiles.forEach(file => {
      if (allowedTypes.includes(file.type)) {
        newValidFiles.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file), isExisting: false });
      } else {
        hasInvalidType = true;
      }
    });

    setFiles((prevFiles) => {
      const combinedFiles = [...prevFiles, ...newValidFiles];
      if (combinedFiles.length > 10) {
        toast.error("حداکثر 10 فایل مجاز است");
        // Do not update state with excess files, just revoke their URLs
        newValidFiles.forEach(file => URL.revokeObjectURL(file.preview));
        // Set error for the field, but return previous state
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: "حداکثر 10 فایل مجاز است" }));
        return prevFiles;
      }

      // Update validation error based on new combined list length
      setErrors(prevErrors => ({ ...prevErrors, [fieldName]: hasInvalidType ? "فقط فایل‌های عکس مجاز هستند" : "" }));
      setTouched(prevTouched => ({ ...prevTouched, [fieldName]: true }));

      if (hasInvalidType) {
        toast.error("فقط فایل‌های عکس (JPEG, PNG, GIF, JPG) مجاز هستند.");
      } else {
        toast.success("فایل ها با موفقیت انتخاب شد اند.");
      }
      return combinedFiles;
    });
    event.target.value = ''; // Clear input for selecting same files again
  };

  // Handles removal of files (dispatches to delete existing via API or remove new from state)
  const removeFile = async (setFiles, fileIdToRemove, fieldName, isExisting) => {
    if (isExisting) {
      // If it's an existing file, call the API to delete it
      await handleDeleteExistingFile(fileIdToRemove, fieldName, setFiles);
    } else {
      // If it's a newly selected file (not yet uploaded), remove from state and revoke URL
      setFiles((prevFiles) => {
        const fileToRemove = prevFiles.find(file => file.id === fileIdToRemove);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.preview); // Revoke URL only for new files
        }
        const updatedFiles = prevFiles.filter((file) => file.id !== fileIdToRemove);

        // Re-validate if a required field becomes empty after removal
        if (fieldName === "imamLetter") {
          setErrors(prevErrors => ({ ...prevErrors, [fieldName]: validateImamLetter(updatedFiles) }));
        } else if (fieldName === "connectionLetter") {
          setErrors(prevErrors => ({ ...prevErrors, [fieldName]: validateConnectionLetter(updatedFiles) }));
        } else if (fieldName === "additionalAttachments") {
          setErrors(prevErrors => ({ ...prevErrors, [fieldName]: validateAdditionalAttachments(updatedFiles) }));
        }
        return updatedFiles;
      });
      toast.success("فایل با موفقیت حذف شد.");
    }
  };

  // Handles API call for deleting existing files
  const handleDeleteExistingFile = async (fileId, fieldName, setFiles) => {
    setLoading(true); // Set general loading state for API call
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `bearer ${Cookies.get("token")}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };

      // Ensure the correct itemId is used in the URL
      const response = await fetch(`https://arman.armaniran.org/api/v1/requests/remove-file/${fileId}?item_id=${itemId}&role=mosque_head_coach`, requestOptions);
      const result = await response.json();

      if (response.ok) { // Check response.ok for 2xx status codes
        toast.success("فایل قدیمی با موفقیت حذف شد.");
        setFiles((prevFiles) => {
          const updatedFiles = prevFiles.filter((file) => file.id !== fileId);
          // Re-validate after removal
          if (fieldName === "imamLetter") {
            setErrors(prevErrors => ({ ...prevErrors, [fieldName]: validateImamLetter(updatedFiles) }));
          } else if (fieldName === "connectionLetter") {
            setErrors(prevErrors => ({ ...prevErrors, [fieldName]: validateConnectionLetter(updatedFiles) }));
          } else if (fieldName === "additionalAttachments") {
            setErrors(prevErrors => ({ ...prevErrors, [fieldName]: validateAdditionalAttachments(updatedFiles) }));
          }
          return updatedFiles;
        });
      } else {
        toast.error(result.message || "خطا در حذف فایل قدیمی.");
      }
    } catch (error) {
      console.error("خطا در حذف فایل قدیمی:", error);
      toast.error("خطا در حذف فایل قدیمی. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false); // Reset general loading state
    }
  };

  // --- Form Submission Logic ---
  const hnadleForm = async () => {
    // Mark all fields as touched for immediate validation feedback
    setTouched({
      student: true,
      cost: true,
      time: true,
      imamLetter: true,
      connectionLetter: true,
      additionalAttachments: true, // Mark additional attachments as touched
    });

    // Run validation before submission
    if (!validateForm()) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else {
      setStatusSend("");
    }

    const newDate = time?.replaceAll("/", "-");

    const formDataToUpdate = new FormData();
    formDataToUpdate.append("students", Number(student));
    formDataToUpdate.append("amount", Number(cost));
    formDataToUpdate.append("body", des);
    formDataToUpdate.append("date", newDate);
    formDataToUpdate.append("request_plan_id", id);

    // Append ONLY newly selected files (isExisting: false)
    const newImamFiles = imamLetters.filter(f => !f.isExisting);
    if (newImamFiles.length > 0) {
      // The backend expects 'imam_letter' for the primary file and 'other_imam_letter[]' for additional
      // If there are multiple *new* files, the first one goes to 'imam_letter', others to 'other_imam_letter'
      // This assumes that if a new 'imam_letter' is provided, it *replaces* any previous one
      // If no new 'imam_letter' is provided, the old one remains unless explicitly deleted via API.
      formDataToUpdate.append("imam_letter", newImamFiles[0].file);
      for (let i = 1; i < newImamFiles.length; i++) {
        formDataToUpdate.append(`other_imam_letter[${i - 1}]`, newImamFiles[i].file);
      }
    }

    const newConnectionFiles = connectionLetters.filter(f => !f.isExisting);
    if (newConnectionFiles.length > 0) {
      formDataToUpdate.append("area_interface_letter", newConnectionFiles[0].file);
      for (let i = 1; i < newConnectionFiles.length; i++) {
        formDataToUpdate.append(`other_area_interface_letter[${i - 1}]`, newConnectionFiles[i].file);
      }
    }

    // Append additional attachments (newly selected files only)
    const newAdditionalAttachments = additionalAttachments.filter(f => !f.isExisting);
    if (newAdditionalAttachments.length > 0) {
      newAdditionalAttachments.forEach((fileObj, index) => {
        formDataToUpdate.append(`images[${index}]`, fileObj.file);
      });
    }


    setLoading(true); // Start loading animation for submission
    setIsUploading(true); // Indicate file upload is in progress (if any new files)

    try {
      // Send PATCH request to update existing request
      const submitForm = await axios.post(
        `https://arman.armaniran.org/api/v1/requests/${id}?_method=PATCH&item_id=${itemId}&role=mosque_head_coach`, // Use 'id' state for request ID
        formDataToUpdate,
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
        toast.success("عملیات با موفقیت انجام شد . به زودی به صفحه اصلی منتقل می شوید",{
          duration: 3000,
        });
        setTimeout(() => {
          router.push(`/${itemId}/kartabl-darkhast`);
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setStatusSend(error.response.data.error);
        toast.error(error.response.data.error);
      } else if (error.response && error.response.data.errors) {
        let errorMessages = Object.values(error.response.data.errors).flat().join("\n");
        setStatusSend(errorMessages);
        toast.error("خطا در ارسال اطلاعات: \n" + errorMessages);

        // Update specific field errors from backend validation
        if (error.response?.data?.errors?.students) {
          setErrors(prev => ({ ...prev, student: error.response.data.errors.students[0] }));
        }
        if (error.response?.data?.errors?.amount) {
          setErrors(prev => ({ ...prev, cost: error.response.data.errors.amount[0] }));
        }
        if (error.response?.data?.errors?.date) {
          setErrors(prev => ({ ...prev, time: error.response.data.errors.date[0] }));
        }
        if (error.response?.data?.errors?.imam_letter || error.response?.data?.errors?.other_imam_letter) {
            setErrors(prev => ({ ...prev, imamLetter: (error.response.data.errors.imam_letter || error.response.data.errors.other_imam_letter).join(', ') }));
        }
        if (error.response?.data?.errors?.area_interface_letter || error.response?.data?.errors?.other_area_interface_letter) {
            setErrors(prev => ({ ...prev, connectionLetter: (error.response.data.errors.area_interface_letter || error.response.data.errors.other_area_interface_letter).join(', ') }));
        }
        if (error.response?.data?.errors?.images) {
            setErrors(prev => ({ ...prev, additionalAttachments: error.response.data.errors.images.join(', ') }));
        }
      } else {
        setStatusSend("خطا در ارسال اطلاعات");
        toast.error("خطا در ارسال اطلاعات");
      }
    } finally {
      setLoading(false); // Reset loading state
      setIsUploading(false); // Reset upload progress indicator
      setUploadProgress(0);
    }
  };

  // --- UI Helper Functions ---

  // Helper for consistent border styling based on touched and errors states
  const getBorderStyle = (fieldName) => {
    if (!touched[fieldName]) return "border-[#DFDFDF]";
    return errors[fieldName] ? "border-red-500" : "border-green-500";
  };

  // Required field indicator component
  const RequiredStar = () => (
    <span className="text-red-500 mr-1" style={{ fontFamily: 'none' }}>*</span>
  );

  // Format number to currency
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
      <Toaster /> {/* React Hot Toast Toaster component */}

      <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
        <div className="mb-4">
          <label htmlFor="options" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
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
          <label htmlFor="hesab" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
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
          <label htmlFor="calendar" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
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
            آپلود فایل پیوست نامه {typeField || 'امام جماعت'}
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
            {/* Show different image based on whether any files are selected */}
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
              onChange={(event) => handleFileChange(event, setImamLetters, "imamLetter")}
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
                  <a href={file.preview} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={file.preview} alt={`پیش نمایش ${file.isExisting ? 'فایل موجود' : file.file?.name}`} className="w-full h-full object-cover" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeFile(setImamLetters, file.id, "imamLetter", file.isExisting)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none transition-opacity"
                    title="حذف فایل"
                    disabled={loading} // Disable during API call
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
              multiple
              className="hidden"
              onChange={(event) => handleFileChange(event, setConnectionLetters, "connectionLetter")}
              accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf"
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
                  <a href={file.preview} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={file.preview} alt={`پیش نمایش ${file.isExisting ? 'فایل موجود' : file.file?.name}`} className="w-full h-full object-cover" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeFile(setConnectionLetters, file.id, "connectionLetter", file.isExisting)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none transition-opacity"
                    title="حذف فایل"
                    disabled={loading}
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

        {/* New Field: Upload Additional Attachments */}
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
              onChange={(event) => handleFileChange(event, setAdditionalAttachments, "additionalAttachments")}
              accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf" // Specify accepted file types
            />
          </label>
          {touched.additionalAttachments && errors.additionalAttachments && (
            <div className="text-red-500 text-sm mt-1">{errors.additionalAttachments}</div>
          )}
          {additionalAttachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {additionalAttachments.map((file) => (
                <div key={file.id} className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden group">
                  <a href={file.preview} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={file.preview} alt={`پیش نمایش ${file.isExisting ? 'فایل موجود' : file.file?.name}`} className="w-full h-full object-cover" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeFile(setAdditionalAttachments, file.id, "additionalAttachments", file.isExisting)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none transition-opacity"
                    title="حذف فایل"
                    disabled={loading}
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
          checked={checkbox}
          onChange={(event) => setCheckBox(event.target.checked)}
          className={`min-w-5 h-5 appearance-none checked:bg-[#39A894] border rounded checked:ring-offset-2 checked:ring-1 ring-gray-300`}
        />
        <label
          htmlFor="checked-checkbox"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
        >
          تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در صورت عدم تطبیق مسئولیت آن
          را می پذیرم. <RequiredStar />
        </label>
        {statusCheckBox && <span className="p-2 text-red-600">{statusCheckBox}</span>}
      </div>
      <div className="flex justify-center w-full flex-col items-center">
        <button
          onClick={() => hnadleForm()}
          className="w-full h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white md:max-w-[214px]"
          disabled={loading}
        >
          {loading ? 'در حال ارسال...' : 'ثبت تغییرات'}
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
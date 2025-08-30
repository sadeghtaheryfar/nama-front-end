"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  const itemId = pathSegments[1]; // This is item_id for requests

  const [student, setStudent] = useState("");
  const [cost, setCost] = useState("");
  const [time, setTime] = useState("");
  const [des, setDes] = useState("");
  const [imamLetters, setImamLetters] = useState([]);
  const [connectionLetters, setConnectionLetters] = useState([]);
  const [additionalAttachments, setAdditionalAttachments] = useState([]);
  const [statusFile1, setStatusFile1] = useState("مقدار فایل وجود ندارد");
  const [statusFile2, setStatusFile2] = useState("مقدار فایل وجود ندارد");
  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false); // General loading for form submission/member fetch
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [programTitle, setProgramTitle] = useState("");
  const [programLocation, setProgramLocation] = useState("");

  const [isImamLetterRequired, setIsImamLetterRequired] = useState(false);
  const [isImagesRequired, setIsImagesRequired] = useState(false);
  const [isAreaLetterRequired, setIsAreaLetterRequired] = useState(false);
  const [isRingMemberRequired, setIsRingMemberRequired] = useState(false);

  const [typeField, setTypeField] = useState(null);

  // States for handling ring selection and its membersم
  const [selectedRingId, setSelectedRingId] = useState(null); // The ID of the currently selected ring
  const [availableRings, setAvailableRings] = useState({ data: [] }); // List of all available rings (from loop/index)
  const [loadingRings, setLoadingRings] = useState(false);

  const [selectedRingMembers, setSelectedRingMembers] = useState([]); // Members of the selected ring
  const [AllRingMembers, setAllRingMembers] = useState([]); // Members of the selected ring
  const [allCoachesForSelection, setAllCoachesForSelection] = useState({ data: [] }); // All coaches globally available for selection
  const [loadingCoachesForSelection, setLoadingCoachesForSelection] = useState(false); // Loading for all coaches
  const [isMembersDropdownOpen, setIsMembersDropdownOpen] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const membersDropdownRef = useRef(null);

  // 1. Fetch initial data (mosque/school type)
  useEffect(() => {
    if (!pathname) return;
    const currentItemId = pathSegments[1];

    const fetching = async () => {
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
        console.log("خطا در دریافت بنرها:", error);
      }
    };
    fetching();
  }, [pathname]);

  // Set required fields based on 'data' prop
  useEffect(() => {
    if (data) {
      setIsImamLetterRequired(data.imam_letter === true);
      setIsImagesRequired(data.images_required === true);
      setIsAreaLetterRequired(data.area_interface_letter === true);
      setIsRingMemberRequired(data.ring_member_required === true);
    }
  }, [data]);

  // 2. Fetch all available rings (from loop/index)
  useEffect(() => {
    const fetchAllRings = async () => {
      setLoadingRings(true);
      try {
        // Assuming /api/loop/index returns a list of rings with id and name
        const response = await axios.get(`/api/loop/index?item_id=${itemId}&role=mosque_head_coach`);
        if (response.data) {
          setAvailableRings(response.data);
        }
      } catch (error) {
        console.log("خطا در دریافت لیست حلقه‌ها:", error);
      } finally {
        setLoadingRings(false);
      }
    };

    fetchAllRings();
  }, [itemId]);

  // 3. Fetch all coaches that can be selected (from loop/index - if it returns coaches)
  // Or from another API if 'loop/index' only returns rings.
  // For now, assuming loop/index can return individual coaches too, or a similar endpoint.
  // If not, you might need a separate API for 'all coaches'.
  useEffect(() => {
    var type;
    if (itemId == 2) {
      type = "mosque";
    } else if (itemId == 3) {
      type = "school";
    } else if (itemId == 8) {
      type = "university";
    } else {
      type = "center";
    }

    const fetchAllCoachesForSelection = async () => {
      setLoadingCoachesForSelection(true);
      try {
        // This API call should ideally return all individual coaches globally
        // For demonstration, let's assume `api/loop/index` can also list coaches,
        // or you would replace this with your actual coaches API endpoint.
        const response = await axios.get(`/api/loop/index?item_id=${itemId}&role=mosque_head_coach&type=${type}`); // Added a hypothetical 'type=coaches'
        if (response.data && response.data.data) {
          // Filter out ring data and keep only coach data if mixed
          const coaches = response.data.data.filter(item => item.name && item.national_code); // Simple heuristic
          setAllCoachesForSelection({ data: coaches });
        }
      } catch (error) {
        console.log("خطا در دریافت لیست کلی مربیان:", error);
      } finally {
        setLoadingCoachesForSelection(false);
      }
    };
    fetchAllCoachesForSelection();
  }, [itemId]);


  // 4. Fetch members for the selected ring (triggered when selectedRingId changes)
  useEffect(() => {
    var type;
    if (itemId == 2) {
      type = "mosque";
    } else if (itemId == 3) {
      type = "school";
    } else if (itemId == 8) {
      type = "university";
    } else {
      type = "center";
    }

    const fetchMembersForSelectedRing = async () => {
      if (selectedRingId && itemId) {
        setLoading(true); // General loading for fetching members of specific ring
        try {
          const response = await axios.get(`/api/loop/show?item_id=${itemId}&id=${selectedRingId}&type=${type}`);
          if (response.data && response.data.data && response.data.data.members) {
            const initialMembers = response.data.data.members.map(member => ({
              id: member.id,
              name: member.name,
            }));
            
            setAllRingMembers(initialMembers); // Set initial members from the selected ring
          } else {
            setAllRingMembers([]); // Clear if no members found for this ring
          }
        } catch (error) {
          console.log("خطا در دریافت مربیان حلقه انتخاب شده:", error);
          setAllRingMembers([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAllRingMembers([]); // Clear members if no ring is selected
      }
    };

    fetchMembersForSelectedRing();
  }, [selectedRingId, itemId]);


  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imamLetters.forEach(file => URL.revokeObjectURL(file.preview));
      connectionLetters.forEach(file => URL.revokeObjectURL(file.preview));
      additionalAttachments.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, []);

  // Validation states
  const [errors, setErrors] = useState({
    student: "",
    cost: "",
    time: "",
    imamLetter: "",
    connectionLetter: "",
    additionalAttachments: "",
    selectedRingId: "",
    ringMember: "",
    programTitle: "",
    programLocation: "",
  });

  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    imamLetter: false,
    connectionLetter: false,
    additionalAttachments: false,
    selectedRingId: false,
    ringMember: false,
    programTitle: false,
    programLocation: false,
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
        newFiles.push({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file) });
      } else {
        hasInvalidType = true;
      }
    });

    setFiles((prevFiles) => {
      const combinedFiles = [...prevFiles, ...newFiles];
      if (combinedFiles.length > 10) {
        if (setStatus) setStatus("حداکثر 10 فایل مجاز است");
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "حداکثر 10 فایل مجاز است" }));
        newFiles.forEach(file => URL.revokeObjectURL(file.preview));
        return prevFiles;
      }
      if (setStatus) setStatus(newFiles.length > 0 ? "فایل(های) مورد نظر انتخاب شد" : "مقدار فایل وجود ندارد");
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: hasInvalidType ? "فقط فایل‌های عکس مجاز هستند" : "" }));
      setTouched((prevTouched) => ({ ...prevTouched, [fieldName]: true }));
      return combinedFiles;
    });
    event.target.value = '';
  };

  const removeFile = (setFiles, idToRemove, fieldName) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find(file => file.id === idToRemove);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      const updatedFiles = prevFiles.filter((file) => file.id !== idToRemove);
      if (fieldName === "imamLetter" && isImamLetterRequired && updatedFiles.length === 0) {
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: `فایل نامه الزامی است` }));
      } else if (fieldName === "additionalAttachments" && isImagesRequired && updatedFiles.length === 0) {
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "پیوست های بیشتر الزامی است" }));
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

  const validateSelectedRingId = (value) => {
    if (isRingMemberRequired && !value) {
      return "انتخاب حلقه الزامی است";
    }
    return "";
  };

  const validateRingMember = (selectedMembers) => {
    if (isRingMemberRequired && selectedRingId && selectedMembers.length === 0) {
      return "انتخاب حداقل یک مربی برای حلقه الزامی است";
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

  const handleRingSelection = (ringId) => {
    setSelectedRingId(ringId);
    setIsMembersDropdownOpen(false); // Close members dropdown when a new ring is selected
    setErrors(prevErrors => ({
      ...prevErrors,
      selectedRingId: validateSelectedRingId(ringId),
      ringMember: "", // Clear member error as new members will be loaded
    }));
    setTouched(prevTouched => ({ ...prevTouched, selectedRingId: true }));
    setMemberSearchTerm(""); // Clear search term when ring changes
  };

  const handleMemberSelection = (member) => {
    setTouched({ ...touched, ringMember: true });
    setSelectedRingMembers((prevSelected) => {
      const isSelected = prevSelected.some((m) => m.id === member.id);
      let newSelection;
      if (isSelected) {
        newSelection = prevSelected.filter((m) => m.id !== member.id);
      } else {
        newSelection = [...prevSelected, member];
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        ringMember: validateRingMember(newSelection),
      }));
      return newSelection;
    });
  };

  const removeMemberTag = (memberId) => {
    setSelectedRingMembers((prevSelected) => {
      const newSelection = prevSelected.filter((m) => m.id !== memberId);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ringMember: validateRingMember(newSelection),
      }));
      return newSelection;
    });
    setTouched({ ...touched, ringMember: true });
  };

  // Close members dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (membersDropdownRef.current && !membersDropdownRef.current.contains(event.target)) {
        setIsMembersDropdownOpen(false);
        setTouched((prevTouched) => ({ ...prevTouched, ringMember: true }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          ringMember: validateRingMember(selectedRingMembers),
        }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [membersDropdownRef, selectedRingMembers]);

  const validateImamLetter = (files) => {
    if (isImamLetterRequired && files.length === 0) {
      return `فایل نامه الزامی است`;
    }
    return "";
  };

  const validateImages = (files) => {
    if (isImagesRequired && files.length === 0) {
      return `پیوست‌های بیشتر الزامی است`;
    }
    return "";
  };

  const validateAreaLetter = (files) => {
    if (isAreaLetterRequired && files.length === 0) {
      return "فایل نامه رابط منطقه الزامی است";
    }
    return "";
  };

  const validateProgramTitle = (value) => {
    if (!value.trim()) {
        return "عنوان برنامه الزامی است";
    }
    return "";
  };

  const validateProgramLocation = (value) => {
    if (!value.trim()) {
        return "محل برگزاری الزامی است";
    }
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
    setTouched({
      student: true,
      cost: true,
      time: true,
      imamLetter: true,
      connectionLetter: true,
      additionalAttachments: true,
      selectedRingId: true,
      ringMember: true,
      programTitle: true,
      programLocation: true,
    });

    let newErrors = {
      time: validateTime(time),
      imamLetter: validateImamLetter(imamLetters),
      additionalAttachments: validateImages(additionalAttachments),
      connectionLetter: validateAreaLetter(connectionLetters),
      selectedRingId: validateSelectedRingId(selectedRingId),
      ringMember: validateRingMember(selectedRingMembers),
    };

    if (data?.type === "university") {
        newErrors = {
            ...newErrors,
            programTitle: validateProgramTitle(programTitle),
            programLocation: validateProgramLocation(programLocation),
        };
    } else {
        newErrors = {
            ...newErrors,
            student: validateStudent(student),
        };
    }

    setErrors(newErrors);

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
    if (data?.type === "university") {
      formDataToSend.append("title", programTitle);
      formDataToSend.append("location", programLocation);
    } else {
      formDataToSend.append("students", Number(student));
      formDataToSend.append("amount", Number(cost));
    }

    formDataToSend.append("body", des);
    formDataToSend.append("date", englishTime);
    formDataToSend.append("request_plan_id", id);
    if (selectedRingId) {
        formDataToSend.append("ring_id", selectedRingId);
    }

    if (data?.type !== "university") {
      if (imamLetters.length > 0) {
        formDataToSend.append("imam_letter", imamLetters[0].file);
        for (let i = 1; i < imamLetters.length; i++) {
          formDataToSend.append(`other_imam_letter[${i - 1}]`, imamLetters[i].file);
        }
      }

      if (connectionLetters.length > 0) {
        formDataToSend.append("area_interface_letter", connectionLetters[0].file);
        for (let i = 1; i < connectionLetters.length; i++) {
          formDataToSend.append(`other_area_interface_letter[${i - 1}]`, connectionLetters[i].file);
        }
      }
    }

    if (additionalAttachments.length > 0) {
      additionalAttachments.forEach((fileObj, index) => {
        formDataToSend.append(`images[${index}]`, fileObj.file);
      });
    }

    // Append selected ring members
    if (selectedRingMembers.length > 0) {
      selectedRingMembers.forEach((memberObj, index) => {
        formDataToSend.append(`members[${index}]`, memberObj.id);
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

  const combinedAndFilteredCoaches = Array.from(
    new Map(
      [...AllRingMembers, ...selectedRingMembers].map(item => [item['id'], item])
    ).values()
  ).filter(member => member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()));
  
  return (
    <div className="w-full bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-[auto,auto] md:gap-x-2 xl:grid-cols-3 xl:gap-x-6 2xl:gap-x-8">
        {data?.type == "university" ? (
            <>
              <div className="mb-4">
                <label htmlFor="programTitle" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
                  عنوان برنامه <RequiredStar />
                </label>
                <input
                  type="text"
                  id="programTitle"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  name="programTitle"
                  placeholder="به عنوان مثال همایش سالانه..."
                  className={`block w-full p-4 border rounded-lg text-gray-700`}
                />
                {touched.programTitle && errors.programTitle && (
                  <div className="text-red-500 text-sm mt-1">{errors.programTitle}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="programLocation" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
                  محل برگزاری <RequiredStar />
                </label>
                <input
                  type="text"
                  id="programLocation"
                  value={programLocation}
                  onChange={(e) => setProgramLocation(e.target.value)}
                  name="programLocation"
                  placeholder="به عنوان مثال تهران، دانشگاه شریف..."
                  className={`block w-full p-4 border rounded-lg text-gray-700`}
                />
                {touched.programLocation && errors.programLocation && (
                  <div className="text-red-500 text-sm mt-1">{errors.programLocation}</div>
                )}
              </div>
              <div className="mb-4">
                {(data?.designated_by_council) ? (
                  <p className="text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm mt-2">
                    هزینه توسط شورا تعیین میگردد .
                  </p>
                ) : (
                  <p className="text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm mt-2">
                    مبلغ ثابت : {formatToCurrency(Number(data?.staff_amount))}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="student"
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
                {data?.staff && (
                  <>
                    {(data?.designated_by_council) ? (
                      <small className="text-xs text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm mt-2">
                        هزینه توسط شورا تعیین میگردد .
                      </small>
                    ) : (
                      <small className="text-xs text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm mt-2">
                        مبلغ ثابت : {formatToCurrency(Number(data?.staff_amount))}
                      </small>
                    )}
                  </>
                )}
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
            </>
          )}

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
              // minDate={new Date()}
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

        {/* New Field: انتخاب حلقه (Ring Selection) */}
        {data?.show_ring_member && (
          <div className="mb-4">
            <label
              htmlFor="ringSelection"
              className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
            >
              انتخاب حلقه
              {isRingMemberRequired && <RequiredStar />}
            </label>
            <div className={`grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg ${getBorderStyle("selectedRingId")}`}>
              {loadingRings ? (
                <div className="col-span-2 text-center text-gray-500">در حال بارگذاری حلقه‌ها...</div>
              ) : availableRings.data && availableRings.data.length > 0 ? (
                availableRings.data.map((ring) => (
                  <div
                    key={ring.id}
                    className={`p-3 border rounded-lg cursor-pointer text-center
                      ${selectedRingId === ring.id
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                      }`}
                    onClick={() => handleRingSelection(ring.id)}
                  >
                    {ring.title || `حلقه ${ring.id}`} {/* Display ring name or ID */}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500">حلقه‌ای یافت نشد.</div>
              )}
            </div>
            {touched.selectedRingId && errors.selectedRingId && (
              <div className="text-red-500 text-sm mt-1">{errors.selectedRingId}</div>
            )}
          </div>
        )}

        {/* New Field: انتخاب مربیان حلقه (Members of Selected Ring) */}
        {data?.show_ring_member && selectedRingId && ( // Only show if a ring is selected
          <div className="mb-4 relative" ref={membersDropdownRef}>
            <label
              htmlFor="ringMembers"
              className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
            >
              انتخاب مربیان حلقه
              {isRingMemberRequired && <RequiredStar />}
            </label>
            <div
              className={`w-full p-4 border rounded-lg text-gray-700 cursor-pointer flex flex-wrap gap-2 items-center min-h-[56px] ${getBorderStyle(
                "ringMember"
              )}`}
              onClick={() => setIsMembersDropdownOpen(!isMembersDropdownOpen)}
            >
              {selectedRingMembers.length === 0 ? (
                <span className="text-gray-500">مربیان حلقه را انتخاب کنید...</span>
              ) : (
                selectedRingMembers.map((member) => (
                  <span
                    key={member.id}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded flex items-center gap-1"
                  >
                    {member.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMemberTag(member.id);
                      }}
                      className="ml-1 text-blue-800 hover:text-blue-600 focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
            </div>
            {isMembersDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="جستجوی مربی..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {loadingCoachesForSelection ? ( // Use loading state for all coaches
                  <div className="p-4 text-center text-gray-500">در حال بارگذاری مربیان...</div>
                ) : combinedAndFilteredCoaches.length > 0 ? (
                  combinedAndFilteredCoaches.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleMemberSelection(member)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRingMembers.some((m) => m.id === member.id)}
                        onChange={() => handleMemberSelection(member)}
                        className="ml-2"
                      />
                      <span>{member.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">مربی‌ای یافت نشد.</div>
                )}
              </div>
            )}
            {touched.ringMember && errors.ringMember && (
              <div className="text-red-500 text-sm mt-1">{errors.ringMember}</div>
            )}
          </div>
        )}
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
        {(data?.show_letter && data?.type !== "university") && (
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
                multiple
                className="hidden"
                onChange={(event) => handleFileChange(event, setImamLetters, setStatusFile1, "imamLetter")}
                accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf"
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
        )}

        {/* Upload Area Interface Letter Files */}
        {(data?.show_area_interface && data?.type !== "university") && (
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
                onChange={(event) => handleFileChange(event, setConnectionLetters, setStatusFile2, "connectionLetter")}
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
        )}

        {/* Upload Additional Attachments */}
        {data?.show_images && (
          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
              آپلود پیوست‌های بیشتر
              {isImagesRequired && <RequiredStar />}
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
                multiple
                className="hidden"
                onChange={(event) => handleFileChange(event, setAdditionalAttachments, null, "additionalAttachments")}
                accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf"
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
        )}
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
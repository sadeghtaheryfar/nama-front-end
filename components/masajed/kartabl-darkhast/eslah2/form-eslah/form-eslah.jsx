"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../../../../styles/form.css';
import toast, { Toaster } from 'react-hot-toast';

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
  return result.trim() + " ریال";
};

const FormEslah = ({ data: initialRequestData }) => {
  const router = useRouter();

  const [student, setStudent] = useState(initialRequestData?.students || "");
  const [id, setID] = useState(initialRequestData?.id || "");
  const [cost, setCost] = useState(initialRequestData?.amount || "");
  const [costText, setCostText] = useState("");
  const [time, setTime] = useState("");
  const [des, setDes] = useState(initialRequestData?.body || "");

  const [imamLetters, setImamLetters] = useState([]);
  const [connectionLetters, setConnectionLetters] = useState([]);
  const [additionalAttachments, setAdditionalAttachments] = useState([]);

  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const [isImamLetterRequired, setIsImamLetterRequired] = useState(false);
  const [isImagesRequired, setIsImagesRequired] = useState(false);
  const [isAreaLetterRequired, setIsAreaLetterRequired] = useState(false);
  const [isRingMemberRequired, setIsRingMemberRequired] = useState(false);
  const [typeField, setTypeField] = useState(null);

  // States for handling ring selection and its members
  const [selectedRingId, setSelectedRingId] = useState(initialRequestData?.ring_id || null);
  const [availableRings, setAvailableRings] = useState({ data: [] });
  const [loadingRings, setLoadingRings] = useState(false);

  const [selectedRingMembers, setSelectedRingMembers] = useState([]);
  // Adjusted to include ring_id for deletion API
  const [previouslySelectedMembers, setPreviouslySelectedMembers] = useState([]); 
  const [AllRingMembers, setAllRingMembers] = useState([]);
  const [allCoachesForSelection, setAllCoachesForSelection] = useState({ data: [] });
  const [loadingCoachesForSelection, setLoadingCoachesForSelection] = useState(false);
  const [isMembersDropdownOpen, setIsMembersDropdownOpen] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const membersDropdownRef = useRef(null);
  const [isDeletingMember, setIsDeletingMember] = useState(null);


  // --- Effects ---

  // 1. Initialize form fields and file states from initialRequestData prop
  useEffect(() => {
    if (initialRequestData) {
      setStudent(initialRequestData.students || "");
      setID(initialRequestData.id || "");
      setCost(initialRequestData.amount || "");
      setDes(initialRequestData.body || "");
      setSelectedRingId(initialRequestData.ring_id || null);

      if (initialRequestData.date) {
        const gregorianDate = new Date(initialRequestData.date);
        const persianDate = new DateObject({
          date: gregorianDate,
          calendar: persian
        });
        const formattedDate = `${persianDate.year}/${persianDate.month.number.toString().padStart(2, '0')}/${persianDate.day.toString().padStart(2, '0')}`;
        setTime(formattedDate);
      }

      const existingImamLetters = [];
      if (initialRequestData.imam_letter?.original) {
          existingImamLetters.push({
              id: initialRequestData.imam_letter.id,
              file: null,
              preview: initialRequestData.imam_letter.original,
              isExisting: true,
          });
      }
      if (initialRequestData.other_imam_letter && initialRequestData.other_imam_letter.length > 0) {
          initialRequestData.other_imam_letter.forEach(file => {
              existingImamLetters.push({
                  id: file.id,
                  file: null,
                  preview: file.original,
                  isExisting: true,
              });
          });
      }
      setImamLetters(existingImamLetters);

      const existingConnectionLetters = [];
      if (initialRequestData.area_interface_letter?.original) {
          existingConnectionLetters.push({
              id: initialRequestData.area_interface_letter.id,
              file: null,
              preview: initialRequestData.area_interface_letter.original,
              isExisting: true,
          });
      }
      if (initialRequestData.other_area_interface_letter && initialRequestData.other_area_interface_letter.length > 0) {
          initialRequestData.other_area_interface_letter.forEach(file => {
              existingConnectionLetters.push({
                  id: file.id,
                  file: null,
                  preview: file.original,
                  isExisting: true,
              });
          });
      }
      setConnectionLetters(existingConnectionLetters);

      const existingAdditionalAttachments = [];
      if (initialRequestData.images && initialRequestData.images.length > 0) {
        initialRequestData.images.forEach(file => {
          existingAdditionalAttachments.push({
            id: file.id,
            file: null,
            preview: file.original,
            isExisting: true,
          });
        });
      }
      setAdditionalAttachments(existingAdditionalAttachments);

      // Populate previouslySelectedMembers from initial data, including ring_id
      if (initialRequestData.members && initialRequestData.members.length > 0) {
        setPreviouslySelectedMembers(initialRequestData.members.map(member => ({
          id: member.id,
          name: member.name,
          ring_id: member.ring_id, // Ensure ring_id is stored
        })));
        // Initialize selectedRingMembers with existing members to allow them to be "unselected" if needed
        setSelectedRingMembers(initialRequestData.members.map(member => ({
          id: member.id,
          name: member.name,
          ring_id: member.ring_id,
        })));
      }

      setCheckBox(initialRequestData.confirm || false);
    }
  }, [initialRequestData]);

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
    if (initialRequestData) {
      setIsImamLetterRequired(initialRequestData?.request_plan?.imam_letter === true);
      setIsImagesRequired(initialRequestData?.request_plan?.images_required === true);
      setIsAreaLetterRequired(initialRequestData?.request_plan?.area_interface_letter === true);
      setIsRingMemberRequired(initialRequestData?.request_plan?.ring_member_required === true);
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
      additionalAttachments.forEach(file => !file.isExisting && URL.revokeObjectURL(file.preview));
    };
  }, [imamLetters, connectionLetters, additionalAttachments]);

  // 6. Fetch all available rings (from loop/index)
  useEffect(() => {
    const fetchAllRings = async () => {
      setLoadingRings(true);
      try {
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

  // 7. Fetch all coaches that can be selected (from loop/index - if it returns coaches)
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
        const response = await axios.get(`/api/loop/index?item_id=${itemId}&role=mosque_head_coach&type=${type}`);
        if (response.data && response.data.data) {
          const coaches = response.data.data.filter(item => item.name && item.national_code);
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


  // 8. Fetch members for the selected ring (triggered when selectedRingId changes)
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
        setLoading(true);
        try {
          const response = await axios.get(`/api/loop/show?item_id=${itemId}&id=${selectedRingId}&type=${type}`);
          if (response.data && response.data.data && response.data.data.members) {
            const initialMembers = response.data.data.members.map(member => ({
              id: member.id,
              name: member.name,
              ring_id: selectedRingId, // Assign current selected ring_id to these members
            }));

            setAllRingMembers(initialMembers);
          } else {
            setAllRingMembers([]);
          }
        } catch (error) {
          console.log("خطا در دریافت مربیان حلقه انتخاب شده:", error);
          setAllRingMembers([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAllRingMembers([]);
      }
    };

    fetchMembersForSelectedRing();
  }, [selectedRingId, itemId]);


  // 9. Close members dropdown when clicking outside
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


  // Validation errors states
  const [errors, setErrors] = useState({
    student: "",
    cost: "",
    time: "",
    imamLetter: "",
    connectionLetter: "",
    additionalAttachments: "",
    selectedRingId: "",
    ringMember: "",
  });

  // Touched states for input validation UI
  const [touched, setTouched] = useState({
    student: false,
    cost: false,
    time: false,
    imamLetter: false,
    connectionLetter: false,
    additionalAttachments: false,
    selectedRingId: false,
    ringMember: false,
  });


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

  const validateAdditionalAttachments = (files) => {
    if (isImagesRequired && files.length === 0) {
      return `پیوست‌های بیشتر الزامی است`;
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
      cost: "",
    }));
    setTouched(prevTouched => ({ ...prevTouched, cost: true }));
  };

  const handleTimeChange = (value) => {
    setTime(value);
    setErrors(prevErrors => ({
      ...prevErrors,
      time: validateTime(value),
    }));
    setTouched(prevTouched => ({ ...touched, time: true }));
  };

  const handleRingSelection = (ringId) => {
    setSelectedRingId(ringId);
    setIsMembersDropdownOpen(false);
    setErrors(prevErrors => ({
      ...prevErrors,
      selectedRingId: validateSelectedRingId(ringId),
      ringMember: "",
    }));
    setTouched(prevTouched => ({ ...prevTouched, selectedRingId: true }));
    setMemberSearchTerm("");
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


  // --- Main Form Validation ---
  const validateForm = () => {
    let isValid = true;

    const newErrors = {
      student: validateStudent(student),
      time: validateTime(time),
      imamLetter: validateImamLetter(imamLetters),
      additionalAttachments: validateAdditionalAttachments(additionalAttachments),
      connectionLetter: validateConnectionLetter(connectionLetters),
      selectedRingId: validateSelectedRingId(selectedRingId),
      ringMember: validateRingMember(selectedRingMembers),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      isValid = false;
    } else {
      setStatusCheckBox("");
    }

    if (hasErrors) {
        isValid = false;
    }

    return isValid;
  };

  // --- File Handling Functions ---
  const handleFileChange = (event, setFiles, fieldName) => {
    setStatusSend("");

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
        newValidFiles.forEach(file => URL.revokeObjectURL(file.preview));
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: "حداکثر 10 فایل مجاز است" }));
        return prevFiles;
      }

      setErrors(prevErrors => ({ ...prevErrors, [fieldName]: hasInvalidType ? "فقط فایل‌های عکس مجاز هستند" : "" }));
      setTouched(prevTouched => ({ ...prevTouched, [fieldName]: true }));

      if (hasInvalidType) {
        toast.error("فقط فایل‌های عکس (JPEG, PNG, GIF, JPG) و PDF مجاز هستند.");
      } else {
        toast.success("فایل ها با موفقیت انتخاب شد اند.");
      }
      return combinedFiles;
    });
    event.target.value = '';
  };

  const removeFile = async (setFiles, fileIdToRemove, fieldName, isExisting) => {
    if (isExisting) {
      await handleDeleteExistingFile(fileIdToRemove, fieldName, setFiles);
    } else {
      setFiles((prevFiles) => {
        const fileToRemove = prevFiles.find(file => file.id === fileIdToRemove);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        const updatedFiles = prevFiles.filter((file) => file.id !== fileIdToRemove);

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

  const handleDeleteExistingFile = async (fileId, fieldName, setFiles) => {
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `bearer ${Cookies.get("token")}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`https://arman.armaniran.org/api/v1/requests/remove-file/${fileId}?item_id=${itemId}&role=mosque_head_coach`, requestOptions);
      const result = await response.json();

      if (response.ok) {
        toast.success("فایل قدیمی با موفقیت حذف شد.");
        setFiles((prevFiles) => {
          const updatedFiles = prevFiles.filter((file) => file.id !== fileId);
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
      setLoading(false);
    }
  };

  // --- Handle Delete Previously Selected Member ---
  const handleDeletePreviousMember = async (memberId, ringIdOfMember) => { // Now accepts ringIdOfMember
    if (!ringIdOfMember) { // Check if ringId is available for the member
      toast.error("شناسه حلقه برای این مربی در دسترس نیست.");
      return;
    }
    setIsDeletingMember(memberId);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `bearer ${Cookies.get("token")}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };
      // Use ringIdOfMember for the API call
      const response = await fetch(`https://arman.armaniran.org/api/v1/rings/${ringIdOfMember}/${memberId}?item_id=${itemId}&role=mosque_head_coach`, requestOptions);
      const result = await response.json();

      if (response.ok) {
        toast.success("مربی با موفقیت حذف شد.");
        setPreviouslySelectedMembers(prev => prev.filter(m => m.id !== memberId));
        setSelectedRingMembers(prev => prev.filter(m => m.id !== memberId));
      } else {
        toast.error(result.message || "خطا در حذف مربی.");
      }
    } catch (error) {
      console.error("خطا در حذف مربی:", error);
      toast.error("خطا در حذف مربی. لطفا دوباره تلاش کنید.");
    } finally {
      setIsDeletingMember(null);
    }
  };


  // --- Form Submission Logic ---
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
    });

    if (!validateForm()) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else {
      setStatusSend("");
    }

    let newDate = time;
    if (typeof time === 'string') {
        newDate = time.replaceAll("/", "-");
    } else if (time instanceof DateObject) {
        newDate = time.format("YYYY-MM-DD");
    }

    const formDataToUpdate = new FormData();
    formDataToUpdate.append("students", Number(student));
    formDataToUpdate.append("amount", Number(cost));
    formDataToUpdate.append("body", des);
    formDataToUpdate.append("date", newDate);
    formDataToUpdate.append("request_plan_id", initialRequestData?.request_plan?.id);

    if (selectedRingId) {
        formDataToUpdate.append("ring_id", selectedRingId);
    }

    const newImamFiles = imamLetters.filter(f => !f.isExisting);
    if (newImamFiles.length > 0) {
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

    const newAdditionalAttachments = additionalAttachments.filter(f => !f.isExisting);
    if (newAdditionalAttachments.length > 0) {
      newAdditionalAttachments.forEach((fileObj, index) => {
        formDataToUpdate.append(`images[${index}]`, fileObj.file);
      });
    }

    // Append all currently selected ring members (both previously selected and newly added)
    if (selectedRingMembers.length > 0) {
      selectedRingMembers.forEach((memberObj, index) => {
        formDataToUpdate.append(`members[${index}]`, memberObj.id);
      });
    } else {
      // If no members are selected, ensure the 'members' field is explicitly handled
      // This is crucial for telling the API to remove all members if none are selected.
      // Depending on your API, you might need to send an empty array or a specific flag.
      // For FormData, appending an empty string might signal an empty array to some APIs
      // or simply omitting the field if the API knows to handle missing 'members' as no members.
      // For explicit removal of all members, you might need to send a specific value like:
      // formDataToUpdate.append("members", ""); // or some other explicit indicator if your API expects it
    }


    setLoading(true);
    setIsUploading(true);

    try {
      const submitForm = await axios.post(
        `https://arman.armaniran.org/api/v1/requests/${id}?_method=PATCH&item_id=${itemId}&role=mosque_head_coach`,
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
        if (error.response?.data?.errors?.ring_id) {
          setErrors(prev => ({ ...prev, selectedRingId: error.response.data.errors.ring_id[0] }));
        }
        if (error.response?.data?.errors?.members) {
          setErrors(prev => ({ ...prev, ringMember: error.response.data.errors.members[0] }));
        }
      } else {
        setStatusSend("خطا در ارسال اطلاعات");
        toast.error("خطا در ارسال اطلاعات");
      }
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // --- UI Helper Functions ---
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
      [...AllRingMembers, ...previouslySelectedMembers].map(item => [item['id'], item])
    ).values()
  ).filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-lg">
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
          {initialRequestData?.request_plan?.staff && (
            <small className="text-xs text-[#0a2fff] leading-5 flex items-center gap-2 lg:text-sm mt-2">
              مبلغ ثابت : {formatToCurrency(Number(initialRequestData?.request_plan?.staff_amount))}
            </small>
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
        {initialRequestData?.request_plan?.show_ring_member && (
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
                    {ring.title || `حلقه ${ring.id}`}
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
        {initialRequestData?.request_plan?.show_ring_member && selectedRingId && (
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
                        removeMemberTag(member.id); // Call removeMemberTag directly for any member
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
                {loadingCoachesForSelection ? (
                  <div className="p-4 text-center text-gray-500">در حال بارگذاری مربیان...</div>
                ) : combinedAndFilteredCoaches.length > 0 ? (
                  combinedAndFilteredCoaches.map((member) => {
                    const isMemberSelectedInCurrentList = selectedRingMembers.some(m => m.id === member.id);
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer`}
                        onClick={() => handleMemberSelection(member)}
                      >
                        <input
                          type="checkbox"
                          checked={isMemberSelectedInCurrentList}
                          onChange={() => handleMemberSelection(member)}
                          className="ml-2"
                        />
                        <span>
                          {member.name}
                          {previouslySelectedMembers.some(prevMember => prevMember.id === member.id) && (
                            <span className="text-gray-500 text-xs mr-1">(قبلاً انتخاب شده)</span>
                          )}
                        </span>
                      </div>
                    );
                  })
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
        {initialRequestData?.request_plan?.show_letter && (
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
                onChange={(event) => handleFileChange(event, setImamLetters, "imamLetter")}
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
                    <a href={file.preview} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      <img src={file.preview} alt={`پیش نمایش ${file.isExisting ? 'فایل موجود' : file.file?.name}`} className="w-full h-full object-cover" />
                    </a>
                    <button
                      type="button"
                      onClick={() => removeFile(setImamLetters, file.id, "imamLetter", file.isExisting)}
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
        )}

        {initialRequestData?.request_plan?.show_area_interface && (
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
        )}

        {initialRequestData?.request_plan?.show_images && (
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
                onChange={(event) => handleFileChange(event, setAdditionalAttachments, "additionalAttachments")}
                accept="image/jpeg,image/png,image/gif,image/jpg,application/pdf"
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
        )}
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
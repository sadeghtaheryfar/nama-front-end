"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatPrice  } from "../../../../../components/utils/formatPrice";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const MainGardeshMoshahede2 = ({ id }) => {
  const router = useRouter();

  const [student, setStudent] = useState("");
  const [time, setTime] = useState("");
  const [des, setDes] = useState("");
  const [imamLetter, setImamLetter] = useState(null);
  const [connectionLetter, setConntectionLetter] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  // console.log("/masajed/darkhast/sabt/sabt1");

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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

  const hnadleForm = async () => {
    setMessage({ text: "", type: "" });
    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      return;
    } else {
      setStatusCheckBox("");
    }

    if (!student || !time || images.length < 3 || images.length > 10) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else {
      setStatusSend("");
    }
    const englishTime = convertPersianToEnglish(String(time));

    // console.log(
    //   "student : ",
    //   student,
    //   "date : ",
    //   newDate,
    //   "body : ",
    //   des,
    //   "imam_letter : ",
    //   imamLetter[0],
    //   "area_interface_letter : ",
    //   connectionLetter[0],
    //   id
    // );

    // {
    //     request_plan_id: id,
    //     students: student,
    //     amount: cost,
    //     date: newDate,
    //     body: des,
    //     imam_letter: imamLetter[0],
    //     area_interface_letter: connectionLetter[0],
    //     sheba: null,
    //   },

    const formDataToSend = new FormData();
    formDataToSend.append("students", Number(student));
    formDataToSend.append("body", des);
    formDataToSend.append("date", englishTime);
    images.forEach((img, index) => {
      formDataToSend.append(`images[${index + 1}]`, img);
    });
    if (video) {
      formDataToSend.append("video", video);
    }
    
    setLoading(true);

    // console.log(formDataToSend.get("imam_letter"));

    try {
      const submitForm = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reports/${id}?item_id=${itemId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("token")}`,
            Accept: "application/json",
          },
        }
      );

      if (submitForm) {
        setMessage({ text: "فرم با موفقیت ارسال شد!", type: "success" });
      }
    } catch (error) {
      console.log(error);
      if(error.response.data.error)
      {
        setStatusSend(error.response.data.error);
      }
    } finally {
      setLoading(false);
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
            <label htmlFor="options" className="block text-base lg:text-lg text-[#3B3B3B] mb-2 ">
              تعداد دانش آموزان نوجوان{" "}
            </label>
            <div className="relative">
              <input
                type="number"
                id="student"
                value={student}
                onChange={(event) => setStudent(event.target.value)}
                name="student"
                placeholder="به عنوان مثال 25 عدد..."
                className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              />

              {/* <Image
                className="w-8 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
                alt="#"
                width={0}
                height={0}
                src={"/Images/masajed/darkhast/sabt/arrowDown.svg"}
              /> */}
              {/* <select
                id="options"
                name="options"
                className="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
              >
                <option value="">لطفا انتخاب کنید </option>
                <option value="option1">گزینه ۱</option>
                <option value="option2">گزینه ۲</option>
                <option value="option3">گزینه ۳</option>
              </select> */}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="calendar" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
              تاریخ برگزاری{" "}
            </label>
            <div className="relative w-full">
              <DatePicker
                value={time}
                onChange={setTime}
                calendar={persian}
                locale={persian_fa}
                inputClass="block w-full p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
                format="YYYY-MM-DD"
                placeholder="انتخاب تاریخ"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 mt-3">
          <label htmlFor="textarea" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            توضیحات تکمیلی{" "}
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
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">آپلود فایل تصویری حداقل ۳ عدد</h3>
            <label
              htmlFor="file-upload_1"
              className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
            >
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
              <Image className="w-7" alt="#" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
              <input id="file-upload_1" type="file" multiple className="hidden" onChange={handleImageUpload} />
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center" onClick={() => removeImage(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">آپلود فایل ویدئویی حداقل ۳۰ ثانیه (اختیاری)</h3>
            <label
              htmlFor="file-upload_2"
              className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
            >
              <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                برای آپلود فایل کلیک کنید
              </span>
              <Image className="w-7" alt="#" width={0} height={0} src="/Images/masajed/darkhast/sabt/Group.svg" />
              <input id="file-upload_2" type="file" className="hidden" onChange={handleVideoUpload} />
            </label>
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
            value={checkbox}
            onChange={(event) => setCheckBox(event.target.checked)}
            className="min-w-5 h-5 appearance-none checked:bg-[#D5B260] border border-gray-300 rounded  checked:ring-offset-2 checked:ring-1 ring-gray-300"
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
          >
            {loading ? 'صبر کنید ...' : 'تایید و ثبت اطلاعات'}
          </button>
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

export default MainGardeshMoshahede2;

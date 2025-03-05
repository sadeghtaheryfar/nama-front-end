"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const FormEslah = ({ data }) => {
  const router = useRouter();
  
  const [student, setStudent] = useState("");
  const [id, setID] = useState("");
  const [cost, setCost] = useState("");
  const [time, setTime] = useState("");
  const [des, setDes] = useState("");
  const [imamLetter, setImamLetter] = useState(null);
  const [connectionLetter, setConntectionLetter] = useState(null);
  const [statusFile1, setStatusFile1] = useState("فایلی انتخاب نشد");
  const [statusFile2, setStatusFile2] = useState("فایلی انتخاب نشد");
  const [statusSend, setStatusSend] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [statusCheckBox, setStatusCheckBox] = useState("");
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];
  // console.log("/masajed/darkhast/sabt/sabt1");

  useEffect(() => {
    if(data)
    {
      setStudent(data?.students);
      setID(data?.id);
      setCost(data?.amount);
      setDes(data?.body);
    }
  }, [data])

  const handleFile1 = (event) => {
    if (event.target.value === "") {
      setStatusFile1("فایلی انتخاب نشد");
      return;
    }
    if (
      true
      // event.target.files[0].type === "image/jpeg" ||
      // event.target.files[0].type === "image/png" ||
      // event.target.files[0].name.includes(".zip")
    ) {
      setImamLetter(event.target.files);
      setStatusFile1("فایل مورد نظر انتخاب شد");
    } else {
      setStatusFile1("فرمت فایل انتخابی مجاز نمی باشد");
    }
  };

  const handleFile2 = (event) => {
    setStatusSend("");

    if (event.target.value === "") {
      setStatusFile2("فایلی انتخاب نشد");
      return;
    }
    if (
      true
      // event.target.files[0].type === "image/jpeg" ||
      // event.target.files[0].type === "image/png" ||
      // event.target.files[0].name.includes(".zip")
    ) {
      setConntectionLetter(event.target.files);
      setStatusFile2("فایل مورد نظر انتخاب شد");
    } else {
      setStatusFile2("فرمت فایل انتخابی مجاز نمی باشد");
    }
  };

  const hnadleForm = async () => {
    if (!checkbox) {
      setStatusCheckBox("این گزینه الزامی است.");
      return;
    } else {
      setStatusCheckBox("");
    }

    if (!student || !cost || !time || !imamLetter || !connectionLetter) {
      setStatusSend("مقادیر فرم ناقص است.");
      return;
    } else {
      setStatusSend("");
    }

    const newDate = time.replaceAll("/", "-");

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
    formDataToSend.append("amount", Number(cost));
    formDataToSend.append("body", des);
    formDataToSend.append("date", newDate);
    formDataToSend.append("request_plan_id", id);
    formDataToSend.append("imam_letter", imamLetter[0]);
    formDataToSend.append("area_interface_letter", connectionLetter[0]);
    
    setLoading(true);

    // console.log(formDataToSend.get("imam_letter"));

    try {
      const submitForm = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/requests/${id}?_method=PATCH&item_id=${itemId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("token")}`,
            Accept: "application/json",
          },
        }
      );

      if (submitForm.data) {
        localStorage.setItem("submittedForm", JSON.stringify(submitForm.data));
        router.push(`/${itemId}/kartabl-darkhast`);
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
          <label htmlFor="hesab" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            هزینه کلی عملیات{" "}
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            min={1000}
            max={10000000000000}
            placeholder="از 1،000 تا 10،000،000،000،000"
            className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="calendar" className="block text-base lg:text-lg text-[#3B3B3B] mb-2">
            تاریخ برگزاری{" "}
          </label>
          <div className="relative">
            <Image
              className="w-9 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
              alt="#"
              width={0}
              height={0}
              src={"/Images/masajed/darkhast/sabt/calendar.svg"}
            />
            <input
              type="text"
              id="time"
              name="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              placeholder="۱۴۰۳/۰۹/۱۲"
              className="block w-full  p-4 border border-[#DFDFDF] rounded-lg text-gray-700"
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
          <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
            آپلود فایل پیوست نامه امام جماعت
          </h3>
          <label
            htmlFor="file-upload_1"
            className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
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
              src={"/Images/masajed/darkhast/sabt/Group.svg"}
            />
            <input
              id="file-upload_1"
              name="imamLetter"
              type="file"
              className="hidden"
              onChange={(event) => handleFile1(event)}
            />
            <span>{statusFile1}</span>
          </label>
        </div>

        <div className="mb-4">
          <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">آپلود فایل نامه رابط منطقه</h3>
          <label
            htmlFor="file-upload_2"
            className="flex items-center justify-between w-full h-14 p-4 border border-gray-300 rounded-lg cursor-pointer"
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
              src={"/Images/masajed/darkhast/sabt/Group.svg"}
            />
            <input
              id="file-upload_2"
              name="connectionLetter"
              type="file"
              className="hidden"
              onChange={(event) => handleFile2(event)}
            />
            <span>{statusFile2}</span>
          </label>
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
        <span className="p-2 text-red-600">{statusSend}</span>
      </div>
    </div>
  );
};

export default FormEslah;

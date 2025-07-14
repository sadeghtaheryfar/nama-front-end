"use client";
import Image from "next/image";
import HeaderMaktob from "../header-maktob/header-maktob";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

const MainMaktob = ({ token }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  const [formData, setFormData] = useState({
    title: "",
    reference_to: "executive_vice_president_mosques",
    letter: null,
    sign: null,
    body: "",
    checked: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [touched, setTouched] = useState({});

  const [fileNames, setFileNames] = useState({
    letter: "برای آپلود فایل کلیک کنید",
    sign: "برای آپلود فایل کلیک کنید",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const { name } = e.target;
      setFormData({ ...formData, [name]: file });
      setFileNames({ ...fileNames, [name]: file.name.slice(-20) });
      setTouched({ ...touched, [name]: true });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, checked: e.target.checked });
    setTouched({ ...touched, checked: true });
    setErrors({ ...errors, checked: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "عنوان درخواست الزامی است.";
    if (!formData.sign) newErrors.sign = "آپلود عکس امضا الزامی است.";
    if (!formData.body.trim()) newErrors.body = "متن نامه نباید خالی باشد.";
    if (!formData.checked) newErrors.checked = "تیک تأیید الزامی است.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFieldBorderStyle = (fieldName) => {
    if (!touched[fieldName]) return "border-[#DFDFDF]";
    if (errors[fieldName]) return "border-red-500";
    return formData[fieldName] ? "border-green-500" : "border-[#DFDFDF]";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("body", formData.body);
    formDataToSend.append("reference_to", formData.reference_to);
    if(formData.letter)
    {
      formDataToSend.append("letter", formData.letter);
    }
    formDataToSend.append("sign", formData.sign);

    try {
      const response = await axios.post(
        `https://arman.armaniran.org/api/v1/written-requests?item_id=${itemId}&role=mosque_head_coach`,
        formDataToSend,
        {
          headers: {
            Accept: "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      setMessage({ text: "فرم با موفقیت ارسال شد!", type: "success" });

      setFormData({
        title: "",
        reference_to: "executive_vice_president_mosques",
        letter: null,
        sign: null,
        body: "",
        checked: false
      });
      setFileNames({
        letter: "برای آپلود فایل کلیک کنید",
        sign: "برای آپلود فایل کلیک کنید",
      });
      setTouched({});
      document.getElementById("title").value = "";
      document.getElementById("textarea").value = "";
      document.getElementById("checked-checkbox").checked = false;
      document.getElementById("sign").value = null;
      document.getElementById("letter").value = null;
    } catch (error) {
      setMessage({ text: "ارسال فرم با خطا مواجه شد!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const translateRole = (role) => {
    if (role === "executive_vice_president_mosques") {
        return "معاونت اجرایی مساجد";
    } else if (role === "deputy_for_planning_and_programming") {
        return "معاونت طرح و برنامه";
    } else if (role === "arman_bus") {
        return "ریاست ستاد آرمان";
    } else {
        return "نامشخص";
    }
};

  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderMaktob />
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 pb-10 mb-10 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold leading-7 pb-1">درخواست های مکتوب</h2>
          <hr className="h-1 md:hidden" />
          <form className="w-full bg-white rounded-lg" onSubmit={handleSubmit}>
            <div className=" flex flex-col md:flex-row md:border-t md:gap-6 xl:gap-16">
              <div className="w-full min-w-fit md:pt-6 lg:pt-8">
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-base lg:text-lg text-[#3B3B3B] mb-2 "
                    >
                      عنوان درخواست <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="title"
                        name="title"
                        type="text"
                        onChange={handleInputChange}
                        onBlur={() => setTouched({ ...touched, title: true })}
                        placeholder="عنوان درخواست ..."
                        className={`block w-full p-4 border rounded-lg ${getFieldBorderStyle("title")}`}
                      />
                      {errors.title && touched.title && (
                        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="reference_to"
                      className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
                    >
                      ارجاع به
                    </label>
                    <div className="relative">
                      <Image
                        className="w-8 absolute bottom-1/2 translate-y-1/2 left-1 flex items-center pl-3 bg-white"
                        alt="#"
                        width={0}
                        height={0}
                        src={"/Images/masajed/darkhast/sabt/arrowDown.svg"}
                      />
                      <select
                        id="reference_to"
                        name="reference_to"
                        onChange={handleInputChange}
                        className="block w-full p-4 border border-[#DFDFDF] rounded-lg"
                      >
                        <option value="executive_vice_president_mosques">
                          معاونت اجرایی مساجد
                        </option>
                        <option value="deputy_for_planning_and_programming">
                          معاونت طرح و برنامه
                        </option>
                        <option value="arman_bus">
                          ریاست ستاد آرمان
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2 xl:gap-x-6 2xl:gap-x-8">
                  <div className="mb-4">
                    <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
                      آپلود عکس نامه
                    </h3>
                    <label
                      htmlFor="letter"
                      className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${getFieldBorderStyle("letter")}`}
                    >
                      <div className="flex items-center justify-between pt-5 pb-6">
                        <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                          {fileNames.letter}
                        </span>
                      </div>
                      <Image
                        className="w-7"
                        alt="#"
                        width={0}
                        height={0}
                        src={formData.letter ? "/Images/masajed/upload.svg" : "/Images/masajed/darkhast/sabt/Group.svg"}
                      />
                      <input
                        id="letter"
                        name="letter"
                        onChange={handleFileChange}
                        type="file"
                        className="hidden"
                      />
                    </label>
                    {errors.letter && touched.letter && (
                      <p className="text-red-500 text-xs mt-1">{errors.letter}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-base lg:text-lg text-[#3B3B3B] mb-2">
                      آپلود عکس امضا به همراه اسم <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
                    </h3>
                    <label
                      htmlFor="sign"
                      className={`flex items-center justify-between w-full h-14 p-4 border rounded-lg cursor-pointer gap-[0.3rem] ${getFieldBorderStyle("sign")}`}
                    >
                      <div className="flex items-center justify-between pt-5 pb-6">
                        <span className="text-sm text-[#959595] bg-[#959595]/15 pr-4 pl-6 py-1 rounded-lg">
                          {fileNames.sign}
                        </span>
                      </div>
                      <Image
                        className="w-7"
                        alt="#"
                        width={0}
                        height={0}
                        src={formData.sign ? "/Images/masajed/upload.svg" : "/Images/masajed/darkhast/sabt/Group.svg"}
                      />
                      <input
                        id="sign"
                        name="sign"
                        onChange={handleFileChange}
                        type="file"
                        className="hidden"
                      />
                    </label>
                    {errors.sign && touched.sign && (
                      <p className="text-red-500 text-xs mt-1">{errors.sign}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="textarea"
                    className="block text-base lg:text-lg text-[#3B3B3B] mb-2"
                  >
                    نوشتن متن نامه <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
                  </label>
                  <textarea
                    className={`block w-full p-4 border rounded-lg md:h-24 ${getFieldBorderStyle("body")}`}
                    id="textarea"
                    name="body"
                    rows="5"
                    cols="15"
                    onChange={handleInputChange}
                    onBlur={() => setTouched({ ...touched, body: true })}
                    placeholder={"در اینجا تایپ کنید …"}
                  />
                  {errors.body && touched.body && (
                    <p className="text-red-500 text-xs mt-1">{errors.body}</p>
                  )}
                </div>
              </div>
              <hr className="h-0.5 mb-4 md:hidden" />
              <div className="hidden w-1 bg-gray-300 md:block"></div>
              <div className="mb-4 flex flex-col gap-4 border rounded-xl p-4 pt-6 max-w-lg md:mt-9 md:mx-7 lg:mt-12 xl:mx-14 xl:p-6 xl:pt-8 min-w-[18rem]">
                <div className="flex items-center justify-center gap-3 pb-2">
                  <Image
                    className="w-7 xl:w-8"
                    alt="#"
                    width={0}
                    height={0}
                    src={"/Images/masajed/maktob/logo2.svg"}
                  />
                  <Image
                    className="w-28 xl:w-32"
                    alt="#"
                    width={0}
                    height={0}
                    src={"/Images/masajed/maktob/logo1.svg"}
                  />
                </div>
                <span className="text-sm text-[#3B3B3B] xl:text-base pb-4 text-center">
                  به نام خدا
                </span>
                <span className="text-sm text-[#3B3B3B] xl:text-base ">
                  عنوان: {formData?.title}
                </span>
                <span className="text-sm text-[#3B3B3B] xl:text-base ">ارجاع: {translateRole(formData?.reference_to)}</span>
                <p className="text-xs leading-6 xl:text-base xl:leading-9">
                  {formData?.body}
                </p>
                <div className="flex justify-end">
                  <Image
                    className="w-[52px] translate-y-4 -translate-x-4"
                    alt="#"
                    width={0}
                    height={0}
                    src={"/Images/masajed/maktob/nam.svg"}
                  />
                  <Image
                    className="w-[118px]"
                    alt="#"
                    width={0}
                    height={0}
                    src={"/Images/masajed/maktob/emza.svg"}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start mb-7 md:mt-4">
              <input
                id="checked-checkbox"
                type="checkbox"
                onChange={handleCheckboxChange}
                className={`min-w-5 h-5 appearance-none checked:bg-[#39A894] border rounded checked:ring-offset-2 checked:ring-1 ring-gray-300`}
              />
              <label
                htmlFor="checked-checkbox"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 leading-6"
              >
                تمامی اطلاعات فوق را بررسی کرده ام و صحت آن را تایید می کنم و در صورت عدم تطبیق
                مسئولیت آن را می پذیرم. <span className="text-red-500" style={{ fontFamily: 'none' }}>*</span>
              </label>
              {errors.checked && touched.checked && (
                <p className="text-red-500 text-xs mt-1 mr-2">{errors.checked}</p>
              )}
            </div>

            <div className="flex justify-center flex-col items-center">
              <button
                type="submit"
                className="w-[214px] h-12 text-white bg-[#39A894] text-base font-medium rounded-[10px] hover:border border-[#39A894] hover:text-[#39A894] hover:bg-white"
              >
                {loading ? "صبر کنید ..." : "تایید و ثبت اطلاعات"}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainMaktob;
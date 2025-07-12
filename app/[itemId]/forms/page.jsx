"use client";
import HeaderMasjed from "./../../../components/header-profile-loop/page";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const Masajed = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const [header, setHeader] = useState(null);
  const [loadingHeader, setLoadingHeader] = useState(true);

  const [data, setData] = useState();
  const [LoadingData, setLoadingData] = useState(false);
  const [hasUncompletedMandatoryForms, setHasUncompletedMandatoryForms] =
    useState(false);
  const [showMandatoryError, setShowMandatoryError] = useState(false);


  const params = useParams();
  const { itemId } = params;

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!itemId) {
      window.location = "/";
      return;
    }

    setLoadingData(true);
    const fetching = async () => {
      try {
        const request = await axios.get(
          `/api/forms/index?item_id=${itemId}&role=mosque_head_coach`
        );

        if (request.data && request.data.data) {
          const formsWithCompletionStatus = request.data.data.map((form) => ({
            ...form,
          }));
          setData(formsWithCompletionStatus);

          const uncompletedMandatory = formsWithCompletionStatus.some(
            (form) => form.required && !form.isCompleted
          );
          setHasUncompletedMandatoryForms(uncompletedMandatory);
        }

        if(!request.data.data.length > 0 )
        {
          window.location = `/${itemId}`;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingData(false);
      }
    };
    fetching();
  }, [itemId]);

  useEffect(() => {
    if (data) {
      const uncompletedMandatory = data.some(
        (form) => form.required && !form.isCompleted
      );
      setHasUncompletedMandatoryForms(uncompletedMandatory);
    }
  }, [data]);

  useEffect(() => {
    fetch("/Images/masajed/header-desktop-msj.svg")
      .then((response) => response.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

        const rectElements = svgDoc.querySelectorAll("rect");
        rectElements.forEach((rect) => {
          rect.setAttribute("fill", "#012B4F");
        });

        const serializer = new XMLSerializer();
        const modifiedSvgText = serializer.serializeToString(svgDoc);

        const svgBlob = new Blob([modifiedSvgText], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const headerElement = document.querySelector(
          ".lg\\:bg-header-masjed-desktop"
        );
        if (headerElement) {
          headerElement.style.backgroundImage = `url(${svgUrl})`;
        }
      })
      .catch((error) => {
        console.error("خطا در بارگذاری یا پردازش SVG:", error);
      });
  }, []);

  const lightenColor = (color, percent) => {
    const hex = color.startsWith("#") ? color.substring(1) : color;
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.min(255, Math.floor(r + ((255 - r) * percent) / 100));
    g = Math.min(255, Math.floor(g + ((255 - g) * percent) / 100));
    b = Math.min(255, Math.floor(b + ((255 - b) * percent) / 100));
    const newHex =
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");

    return `#${newHex}`;
  };

  const [lighterColor, setLighterColor] = useState();
  const [solighterColor, setSoLighterColor] = useState();

  useEffect(() => {
    setLighterColor(lightenColor("#012B4F", 15));
    setSoLighterColor(lightenColor("#012B4F", 30));
  }, []);

  const goBack = (e) => {
    if (e) {
      const newPath = pathname.split("/").slice(0, -1).join("/") || "/";
      router.push(newPath);
    } else {
      router.push("/");
    }
  };

  const handleSkipLater = () => {
    if (!hasUncompletedMandatoryForms) {
      localStorage.setItem("skip", "true");
      router.push(`/${itemId}`)
    } else {
      setShowMandatoryError(true);
    }
  };

  return (
    <>
      <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <header className="container mx-auto">
          <div className="grid grid-cols-3 items-center md:grid-cols-8 pt-10">
            <div className="flex items-end gap-3 leading-5 col-span-2 md:col-span-3 md:items-start md:translate-y-5 lg:translate-y-9 xl:translate-y-5 lg:gap-6 xl:gap-10 2xl:gap-12">
              <img
                className="w-10 md:w-16 lg:w-24 xl:w-32"
                alt="#"
                width={0}
                height={0}
                src={header?.data?.logo || "/Images/masajed/mosque.svg"}
              />
              <span className="text-[#D5B260] text-lg font-semibold flex items-center gap-1 md:text-2xl lg:text-3xl lg:pt-3 xl:text-4xl">
                افزودن حلقه
              </span>
            </div>
            <div className="flex gap-3 justify-self-end md:col-start-8 lg:gap-4 xl:gap-6">
              <img
                onClick={() => goBack()}
                className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                alt="#"
                width={0}
                height={0}
                src={"/Images/home/header/notification.svg"}
                style={{ backgroundColor: lighterColor }}
              />
              <img
                onClick={() => goBack(true)}
                className="w-10 lg:w-12 xl:w-16 p-2 lg:p-3 xl:p-5 cursor-pointer rounded-full hover:scale-[1.05] active:scale-[1] transition-[0.9s]"
                alt="#"
                width={0}
                height={0}
                src={"/Images/home/header/menu.svg"}
                style={{ backgroundColor: lighterColor }}
              />
            </div>
            <div
              style={{ backgroundColor: lighterColor }}
              className="flex items-center justify-evenly gap-0.5 p-2 rounded-full justify-self-stretch col-span-4 text-white my-6 md:mx-2 md:col-start-4 md:row-start-1 lg:justify-self-end lg:gap-2 lg:p-3 xl:gap-3 xl:p-4 relative z-[12]"
            >
              <HeaderMasjed bgRole={solighterColor} />
            </div>
          </div>
        </header>

        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 xl:px-12 xl:py-[53px]">
          {LoadingData ? (
            <section className="flex justify-center items-center flex-col w-full h-[20rem]">
              <div className="w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full animate-slide"></div>
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer"></div>
              </div>
            </section>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                برای ادامه مراحل نیاز است فرم‌های زیر را تکمیل کنید:
              </h2>
              {data && data.length > 0 ? (
                <div className="space-y-4">
                  {data.map((form, index) => (
                    <div
                      key={form.id}
                      className="border border-gray-200 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                          <span>{form.title} </span>
                          {form?.report?.message ? (
                            <p className="text-yellow-500 text-sm font-medium mr-2">
                              نیازمند اصلاح <span className="mx-2">|</span> {form?.report?.message}
                            </p>
                          ) : (
                            <></>
                          )}
                        </h3>
                        {form.required ? (
                          <span className="text-red-500 text-sm font-medium">
                            (اجباری)
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm font-medium">
                            (اختیاری)
                          </span>
                        )}
                        {form.isCompleted && (
                          <span className="text-green-500 text-sm font-medium ml-2">
                            (تکمیل شده)
                          </span>
                        )}
                      </div>
                      <Link href={`/${itemId}/forms/${form.id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                          تکمیل فرم
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">فرم‌ در دسترسی نیست.</p>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={handleSkipLater}
                  disabled={hasUncompletedMandatoryForms}
                  className={`py-3 px-8 rounded-full font-semibold transition duration-300
                    ${
                      !hasUncompletedMandatoryForms
                        ? "bg-gray-500 hover:bg-gray-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  بعدا
                </button>
                {showMandatoryError && hasUncompletedMandatoryForms && (
                  <p className="text-red-500 text-sm mt-2">
                    فرم‌های اختیاری را ابتدا تکمیل کنید.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Masajed;

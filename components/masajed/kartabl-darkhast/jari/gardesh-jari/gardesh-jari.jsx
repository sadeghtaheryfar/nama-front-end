"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const GardeshJari = ({data}) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  return (
    <div className="flex flex-col gap-4 lg:gap-6 xl:gap-9">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between items-center">
        <h2 className="text-base font-bold text-center lg:text-lg md:text-right xl:text-xl 2xl:text-[22px]">
          گردش کار درخواست شماره {data?.data?.id}
        </h2>
      </div>

      <div className="flex items-center flex-col justify-center font-[sans-serif] w-max lg:hidden">
        {/* تایید سر مربی  */}
        {data?.data?.step == 'approval_mosque_head_coach' ? (
          <>
            {data?.data?.status == 'in_progress' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#258CC7]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#258CC7]">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
                  <p>{data?.data?.data?.body}</p>
                </div>
              </div>
            ) : data?.data?.status == 'rejected' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#D32F2F]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#D32F2F]">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
                  <p>{data?.data?.data?.body}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#F6BB00]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#F6BB00]">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
                  <p>{data?.data?.data?.body}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#25C7AA]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#25C7AA]">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
              <p>{data?.data?.data?.body}</p>
            </div>
          </div>
        )}

        {/* تایید مسئول فرهنگی  */}
        {data?.data?.step == 'approval_mosque_cultural_officer' ? (
          <>
            {data?.data?.status == 'in_progress' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#258CC7]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#258CC7]">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>
                  <p>{data?.data?.data?.messages?.mosque_cultural_officer}</p>
                </div>
              </div>
            ) : data?.data?.status == 'rejected' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#D32F2F]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#D32F2F]">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>
                  <p>{data?.data?.data?.messages?.mosque_cultural_officer}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#F6BB00]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#F6BB00]">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>
                  <p>{data?.data?.data?.messages?.mosque_cultural_officer}</p>
                </div>
              </div>
            )}
          </>
        ) : data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#DFDFDF]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#959595]">
                تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }
              </span>
              <p>{data?.data?.data?.messages?.mosque_cultural_officer}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#25C7AA]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#25C7AA]">
                تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' } 
              </span>
              <p>{data?.data?.data?.messages?.mosque_cultural_officer}</p>
            </div>
          </div>
        )}

        {/* تایید  رابط منطقه */}
        {data?.data?.step == 'approval_area_interface' ? (
          <>
            {data?.data?.status == 'in_progress' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#258CC7]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#258CC7]">تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>
                  <p>{data?.data?.data?.messages?.area_interface}</p>
                </div>
              </div>
            ) : data?.data?.status == 'rejected' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#D32F2F]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#D32F2F]">تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>
                  <p>{data?.data?.data?.messages?.area_interface}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#F6BB00]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#F6BB00]">تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>
                  <p>{data?.data?.data?.messages?.area_interface}</p>
                </div>
              </div>
            )}
          </>
        ) : data?.data?.step == 'approval_mosque_cultural_officer' || data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#DFDFDF]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#959595]">
              تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' } 
              </span>
              <p>{data?.data?.data?.messages?.area_interface}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#25C7AA]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#25C7AA]">
                تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }
              </span>
              <p>{data?.data?.data?.messages?.area_interface}</p>
            </div>
          </div>
        )}

        {/* تایید معاونت اجرایی  */}
        {data?.data?.step == 'approval_executive_vice_president_mosques' ? (
          <>
            {data?.data?.status == 'in_progress' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#258CC7]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#258CC7]">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
                  <p>{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
                </div>
              </div>
            ) : data?.data?.status == 'rejected' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#D32F2F]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#D32F2F]">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
                  <p>{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#F6BB00]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#F6BB00]">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
                  <p>{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
                </div>
              </div>
            )}
          </>
        ) : data?.data?.step == 'approval_area_interface' || data?.data?.step == 'approval_mosque_cultural_officer' || data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#DFDFDF]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#959595]">
                تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' } 
              </span>
              <p>{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#25C7AA]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#25C7AA]">
                تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' } 
              </span>
              <p>{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
            </div>
          </div>
        )}

        {/* تایید معاونت طرح و برنامه */}
        {data?.data?.step == 'approval_deputy_for_planning_and_programming' ? (
          <>
            {data?.data?.status == 'in_progress' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#258CC7]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#258CC7]">تایید معاونت طرح و برنامه </span>
                  <p>{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
                </div>
              </div>
            ) : data?.data?.status == 'rejected' ? (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#D32F2F]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#D32F2F]">تایید معاونت طرح و برنامه </span>
                  <p>{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center flex-col relative">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="w-8"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                  />
                </div>

                <div className="w-0.5 h-[18px] border-r border-dashed border-[#F6BB00]"></div>
                
                <div className="absolute top-1 right-full mr-4 w-max">
                  <span className="text-sm text-[#F6BB00]">تایید معاونت طرح و برنامه </span>
                  <p>{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
                </div>
              </div>
            )}
          </>
        ) : data?.data?.step != 'finish' ? (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#DFDFDF]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#959595]">
                تایید معاونت طرح و برنامه 
              </span>
              <p>{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-col relative">
            <div className="flex items-center justify-center ">
              <Image
                width={0}
                height={0}
                className="w-8"
                alt="#"
                src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
              />
            </div>

            <div className="w-0.5 h-[18px] border-r border-dashed border-[#25C7AA]"></div>
            <div className="absolute top-1 right-full mr-4 w-max">
              <span className="text-sm text-[#25C7AA]">
                تایید معاونت طرح و برنامه 
              </span>
              <p>{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:flex items-end justify-between">
        {/* تایید سر مربی  */}
        {data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
              </>
            ) : data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
              </>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full">
              <div className="flex items-center justify-center ">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'سرمربی' : 'مسئول تشکل' }</span>
          </div>
        )}

        {/* تایید مسئول فرهنگی  */}
        {data?.data?.step == 'approval_mosque_cultural_officer' ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>
              </>
            ) : data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>
              </>
            )}
          </div>
        ) : data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full ">
              <div className="flex items-center justify-center ">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
            </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-40px]">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full ">
              <div className="flex items-center justify-center ">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-40px]">تایید {(itemId != 8) ? 'مسئول فرهنگی' : 'رابط دانشگاه' }</span>

          </div>
        )}
        
        {/* تایید  رابط منطقه */}
        {data?.data?.step == 'approval_area_interface' ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید  {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>
              </>
            ) : data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>
              </>
            )}
          </div>
        ) : data?.data?.step == 'approval_mosque_cultural_officer' || data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full ">
              <div className="flex items-center justify-center ">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
            </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px] min-w-fit 2xl:mr-[-10px]">تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>

          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full ">
              <div className="flex items-center justify-center ">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px] min-w-fit 2xl:mr-[-10px]">تایید {(itemId != 8) ? 'رابط منطقه' : 'ناظر' }</span>

          </div>
        )}

        {/* تایید معاونت اجرایی  */}
        {data?.data?.step == 'approval_executive_vice_president_mosques' ? (
          <div className="w-full flex flex-col items-start">
          {data?.data?.status == 'in_progress' ? (
            <>
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                  />
                </div>
                <div className="w-full h-[2px] border-b border-dashed border-[#258CC7]"></div>
              </div>
              <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
            </>
          ) : data?.data?.status == 'rejected' ? (
            <>
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                  />
                </div>
                <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
              </div>
              <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
            </>
          ) : (
            <>
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center ">
                  <Image
                    width={0}
                    height={0}
                    className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                    alt="#"
                    src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                  />
                </div>
                <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
              </div>
              <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
            </>
          )}
        </div>
        ) : data?.data?.step == 'approval_area_interface' || data?.data?.step == 'approval_mosque_cultural_officer' || data?.data?.step == 'approval_mosque_head_coach' ? (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full ">
              <div className="flex items-center justify-center">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#DFDFDF]"></div>
            </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-48px]">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            <div className="flex items-center w-full ">
              <div className="flex items-center justify-center">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
              <div className="w-full h-[2px] border-b border-dashed border-[#25C7AA]"></div>
            </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px] 2xl:mr-[-48px]">تایید {(itemId != 8) ? 'معاونت اجرایی' : 'معاونت داشنجویی' }</span>
          </div>
        )}

        {/* تایید معاونت طرح و برنامه */}
        {data?.data?.step == 'approval_deputy_for_planning_and_programming' ? (
          <div className="w-full flex flex-col items-start">
            {data?.data?.status == 'in_progress' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/jari/jari.svg"}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#258CC7] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : data?.data?.status == 'rejected' ? (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/rad/rad.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#D32F2F]"></div>
                </div>
                <span className="text-sm text-[#D32F2F] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            ) : (
              <>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center ">
                    <Image
                      width={0}
                      height={0}
                      className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                      alt="#"
                      src={"/Images/masajed/kartabl-darkhast/eslah/eslah1.svg"}
                    />
                  </div>
                  <div className="w-full h-[2px] border-b border-dashed border-[#F6BB00]"></div>
                </div>
                <span className="text-sm text-[#F6BB00] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit">تایید معاونت طرح و برنامه </span>
              </>
            )}
          </div>
        ) : data?.data?.step != 'finish' ? (
          <div className=" w-full flex flex-col max-w-fit items-start">
            <div className="flex items-center justify-center ml-14 2xl:ml-16">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik1.svg"}
                />
              </div>
            <span className="text-sm text-[#959595] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px]">تایید معاونت طرحی و برنامه</span>
          </div>
        ) : (
          <div className=" w-full flex flex-col max-w-fit items-start">
            <div className="flex items-center justify-center ml-14 2xl:ml-16">
                <Image
                  width={0}
                  height={0}
                  className="min-w-9 xl:min-w-10 2xl:min-w-[50px]"
                  alt="#"
                  src={"/Images/masajed/kartabl-darkhast/jari/tik.svg"}
                />
              </div>
            <span className="text-sm text-[#25C7AA] mt-4 xl:mt-6 xl:text-lg 2xl:mt-8 2xl:text-[22px]  min-w-fit mr-[-28px]">تایید معاونت طرح و برنامه</span>
          </div>
        )}
      </div>
      
      <div className="hidden lg:flex items-end justify-between">
        <div className="w-full flex flex-col items-start">
          <p>{data?.data?.data?.body}</p>
        </div>

        <div className="w-full flex flex-col items-start">
          <p>{data?.data?.data?.messages?.mosque_cultural_officer}</p>
        </div>

        <div className="w-full flex flex-col items-start">
          <p>{data?.data?.data?.messages?.area_interface}</p>
        </div>

        <div className="w-full flex flex-col items-start">
          <p>{data?.data?.data?.messages?.executive_vice_president_mosques}</p>
        </div>

        <div className="w-full flex flex-col items-start">
          <p>{data?.data?.data?.messages?.deputy_for_planning_and_programming}</p>
        </div>
      </div>
    </div>
  );
};

export default GardeshJari;
"use client";
import GardeshJari from "../gardesh-jari/gardesh-jari";
import HeaderJari from "../header-jari/header-jari";
import MainGardeshJari from "../main-gardesh-jari/main-gardesh-jari";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import MainGardeshMoshahede2 from "../../../../../components/masajed/kartabl-gozaresh/moshahede-gozaresh/main-gardesh-moshahede2/main-gardesh-moshahede2";
import MainGardeshMoshahede1 from "../../../../../components/masajed/kartabl-gozaresh/moshahede-gozaresh/main-gardesh-moshahede2/main-gardesh-moshahede1";
import MainGardeshMoshahede3 from "../../../../../components/masajed/kartabl-gozaresh/moshahede-gozaresh/main-gardesh-moshahede2/main-gardesh-moshahede3";
import MainGardeshMoshahede4 from "../../../../../components/masajed/kartabl-gozaresh/moshahede-gozaresh/main-gardesh-moshahede2/main-gardesh-moshahede4";

const MainJari = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [requestData, setRequsestData] = useState("");
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  useEffect(() => {
    const fetching = async () => {
      try {
        const id = params.get("id");
        const response = await axios.get(`/api/request/show?id=${id}&item_id=${itemId}`);
        
        if (response.data) {
          setRequsestData(response.data);
        }
      } catch (error) {
        console.log("خطا", error);
      } finally {
      }
    };
    fetching();
  }, []);

  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderJari/>
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-10 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
        <GardeshJari data={requestData}/>
      </div>
      <MainGardeshJari data={requestData}/>
      
      {requestData?.data?.step == "finish" && requestData?.data?.report == null ? (
        <MainGardeshMoshahede2 id={params.get("id")}/>
      ) : requestData?.data?.step == "finish" && requestData?.data?.report != null && requestData?.data?.report?.status == 'in_progress' || requestData?.data?.report?.status == 'done' ? (
        <MainGardeshMoshahede1 id={params.get("id")} data={requestData}/>
      ) : requestData?.data?.step == "finish" && requestData?.data?.report != null && requestData?.data?.report?.status == 'rejected' ? (
        <MainGardeshMoshahede3 id={params.get("id")} data={requestData}/>
      ) : requestData?.data?.step == "finish" && requestData?.data?.report != null && requestData?.data?.report?.status == 'action_needed' || requestData?.data?.report?.status == 'done' ? (
        <MainGardeshMoshahede4 id={params.get("id")} data={requestData}/>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainJari;

"use client";
import Carts from "../components/carts/page";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import { Suspense, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
export default function Home() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const fetching = async () => {
      const accessToken = Cookies.get("token");

      const token = params.get("jwt");

      if (token) {
        Cookies.set("token", token);
        window.history.replaceState(null, "", "/");
        return;
      }
      if (!accessToken) {
        try {
          const url = await axios.get("/api/url");
          if (url.data) {
            router.push(url.data.verify_url);
            Cookies.set("token", "redirect");
          }
        } catch (error) {
          console.log(error);
        }
        // router.push("/");
      } else {
        console.log("Token exists:", accessToken);
      }
    };
    fetching();
  }, []);

  return (
    <Suspense>
      <div className="bg-header bg-repeat-x bg-auto px-7">
        <div className="container mx-auto">
          <Header />
          <Carts />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}

"use client";
import Carts from "../components/carts/page";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import { Suspense, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
export default function Home() {
    return (
        <>
            <div
                className="bg-header !bg-repeat-x !bg-auto px-7"
                style={{
                    background:
                        "url(https://arman.armaniran.org/storage/HomeHeader.svg)",
                }}
            >
                <div className="container mx-auto">
                    <Header />
                    <Carts />
                </div>
            </div>
            <Footer />
        </>
    );
}

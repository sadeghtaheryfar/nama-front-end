'use client';

import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>صفحه یافت نشد 😢</h1>
            <p>متأسفیم، اما صفحه‌ای که دنبالش هستید وجود ندارد.</p>
            <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>بازگشت به صفحه اصلی</Link>
        </div>
    );
}  
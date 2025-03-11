"use client";
import Image from "next/image";
import Link from "next/link";
import ButtonSabt from "../button-sabt/button-sabt";
import CartsDarkhastFuture from "./carts-darkhast-future";

import { useEffect, useState } from "react";
import axios from "axios";
import CartsDarkhastActive from "./carts-darkhast-active";
import { usePathname } from "next/navigation";

const CartsDarkhast = () => {
  const [futureCarts, setFutureCarts] = useState([]);
  const [futureCartsLoading, setFutureCartsLoading] = useState(false);
  const [activeCartsLoading, setActiveCartsLoading] = useState(false);
  const [activeCarts, setActiveCarts] = useState([]);
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const itemId = pathSegments[1];

  useEffect(() => {
    const fetching = async () => {
      setFutureCartsLoading(true);
      setActiveCartsLoading(true);

      try {
        const carts = await axios.get(`/api/future?item_id=${itemId}&role=mosque_head_coach`);
        if (carts.data) {
          setFutureCarts(carts.data.data);
        }
      } catch (error) {
        console.log(error);
      }finally {
        setFutureCartsLoading(false);
      }

      try {
        const active = await axios.get(`/api/active?item_id=${itemId}&role=mosque_head_coach`);
        if (active.data) {
          setActiveCarts(active.data.data);
        }
      } catch (error) {
        console.log(error);
      }finally {
        setActiveCartsLoading(false);
      }
    };
    fetching();
  }, []);

  return (
    <>
      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 md:mt-9 lg:mt-11 xl:mt-12 gap-6 md:gap-7 lg:gap-9 2xl:gap-x-10">
        {futureCartsLoading && (
          <section className='flex justify-center items-center flex-col w-full h-[20rem]'>
            <div className='w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden'>
                <div className='absolute top-0 left-0 h-full w-full animate-slide'></div>
                <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer'></div>
            </div>
          </section>
        )}

        {activeCarts &&
          activeCarts.length >= 1 &&
          activeCarts.map((item, index) => {
            return <CartsDarkhastActive key={index} item={item} />;
          })}
        {/* <div className="flex flex-col justify-end gap-4 border rounded-xl p-4 group hover:border-[#39A894] transition-all duration-200">
          <div className="grid grid-cols-4 items-center gap-4 lg:grid-cols-5 lg:gap-5">
            <Image
              className="w-full max-w-28 lg:hidden"
              alt="#"
              width={0}
              height={0}
              src={"/Images/masajed/darkhast/cart2-darkhast.svg"}
            />
            <Image
              className="hidden lg:block w-full col-span-2 min-w-[167px] max-w-[167px] row-span-2"
              alt="#"
              width={0}
              height={0}
              src={"/Images/masajed/darkhast/cart12-darkhast.svg"}
            />
            <div className="flex flex-col gap-2 col-span-3 lg:mr-2">
              <h2 className="text-base font-bold group-hover:text-[#39A894] lg:text-lg">
                نام درخواست مربوطه
              </h2>
              <span className="text-xs font-medium lg:text-base">شماره: ۲۰۲ </span>
            </div>

            <ul className="flex flex-col justify-center gap-1.5 col-span-4 lg:col-span-3 lg:mr-2">
              <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
                <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
                سقف تعداد نفرات مورد حمایت: ۲۰
              </li>
              <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
                <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
                سرانه حمایتی هر نفر به مبلغ ۳ میلیون تومان میباشد.
              </li>
              <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
                <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
                محدود مهلت زمانی انتخاب این درخواست تا تاریخ ۱۴۰۳/۱۰/۱۲ میباشد.
              </li>
            </ul>
          </div>
          <Link href={"/masajed/darkhast/sabt"}>
            <ButtonSabt />
          </Link>
        </div>
        <div className="flex flex-col justify-end gap-4 border rounded-xl p-4 group hover:border-[#39A894] transition-all duration-200">
          <div className="grid grid-cols-4 items-center gap-4 lg:grid-cols-5 lg:gap-5">
            <Image
              className="w-full max-w-28 lg:hidden"
              alt="#"
              width={0}
              height={0}
              src={"/Images/masajed/darkhast/cart3-darkhast.svg"}
            />
            <Image
              className="hidden lg:block w-full col-span-2 min-w-[167px] max-w-[167px] row-span-2"
              alt="#"
              width={0}
              height={0}
              src={"/Images/masajed/darkhast/cart13-darkhast.svg"}
            />
            <div className="flex flex-col gap-2 col-span-3 lg:mr-2">
              <h2 className="text-base font-bold group-hover:text-[#39A894] lg:text-lg">
                نام درخواست مربوطه
              </h2>
              <span className="text-xs font-medium lg:text-base">شماره: ۲۰۲ </span>
            </div>

            <ul className="flex flex-col justify-center gap-1.5 col-span-4 lg:col-span-3 lg:mr-2">
              <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
                <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
                سقف تعداد نفرات مورد حمایت: ۲۰
              </li>
              <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
                <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
                سرانه حمایتی هر نفر به مبلغ ۳ میلیون تومان میباشد.
              </li>
              <li className="text-xs text-[#808393] leading-5 flex items-center gap-2 lg:text-sm">
                <div className="w-1 h-1 bg-[#808393] rounded-full p-1"></div>
                محدود مهلت زمانی انتخاب این درخواست تا تاریخ ۱۴۰۳/۱۰/۱۲ میباشد.
              </li>
            </ul>
          </div>
          <Link href={"/masajed/darkhast/sabt"}>
            <ButtonSabt />
          </Link>
        </div> */}
      </div>
      <div className="mt-8">
        <hr className="h-2 mb-5 xl:mt-12" />
        <h2 className="text-lg font-semibold md:my-4 lg:my-7 xl:my-9">درخواست های آینده</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7 lg:gap-9 2xl:gap-10">
          {futureCartsLoading && (
            <section className='flex justify-center items-center flex-col w-full h-[8rem]'>
              <div className='w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden'>
                  <div className='absolute top-0 left-0 h-full w-full animate-slide'></div>
                  <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer'></div>
              </div>
            </section>
          )}

          {futureCarts &&
            futureCarts.length >= 1 &&
            futureCarts.map((item, index) => {
              return (
                <CartsDarkhastFuture
                  key={index}
                  image={item.image}
                  title={item.title}
                  id={item.id}
                  body={item.body}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default CartsDarkhast;

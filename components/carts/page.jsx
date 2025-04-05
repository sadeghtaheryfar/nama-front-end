'use client';
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

const Carts = () => {
  const [Items, setItems] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await axios.get("/api/dashboard-items");
        if (response.data) {
          setItems(response.data.data.filter(item => ![5, 6, 7].includes(item.id)));
        }
      } catch (error) {
        console.log("خطا در دریافت بنرها:", error);
      } finally {
        setLoadingItems(false);
      }
    };
    fetching();
  }, []);

  useEffect(() => {
    const fetching = async () => {
        try {
            const response = await axios.get(`/api/profile`);
            if (response.data) {
                setProfile(response.data);
            }
        } catch (error) {
            console.log("خطا در دریافت بنرها:", error);
        }
    };
    fetching();
}, []);

console.log('>>>>>>>>>>>', profile)

  return (
    <div className="bg-white rounded-2xl flex flex-wrap justify-center gap-6 p-6 sm:p-9 lg:p-11 xl:p-12 text-white drop-drop-shadow-3xl sm:gap-8 md:gap-9 lg:gap-11 xl:gap-14">
      {loadingItems && (
        <section className='flex justify-center items-center flex-col w-72 max-w-96 md:max-w-80 h-72 max-h-96 md:max-h-80'>
          <div className='w-full relative h-full rounded-[0.5rem] bg-[#e0e0e0] overflow-hidden'>
              <div className='absolute top-0 left-0 h-full w-full animate-slide'></div>
              <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-[#b0b0b0] opacity-50 animate-shimmer'></div>
          </div>
        </section>
      )}

      {Items && Items?.map((item) => {
        const hasRoleWithItemId = profile?.data?.roles?.some(role => 
          role.item_id && role.item_id.id === item?.id
        );

        if(hasRoleWithItemId)
        {
          return (
            <Link href={(item?.id) ? `/${item?.id}` : '/default-link'} key={item?.id}>
              <div className="relative w-72 flex-auto max-w-96 md:max-w-80 h-72 max-h-96 md:max-h-80">
                <img
                  className="w-full h-full rounded-md object-cover"
                  alt={item?.title}
                  width={0}
                  height={0}
                  src={item?.image}
                />
                <div className="backdrop-blur bg-black bg-opacity-30 space-y-3 absolute bottom-5 right-5 left-5 rounded-xl p-3">
                  <h2 className="text-lg font-bold leading-6 lg:text-xl">{item?.title}</h2>
                  <p className="text-xs lg:text-sm font-medium leading-6">{item?.body}</p>
                </div>
              </div>
          </Link>
          )
        }else{
          return(
            <div key={item?.id}>
              <div className="relative w-72 flex-auto max-w-96 md:max-w-80 h-72 max-h-96 md:max-h-80">
                <img
                  className="w-full h-full rounded-md object-cover grayscale"
                  alt={item?.title}
                  width={0}
                  height={0}
                  src={item?.image}
                />
                <div className="backdrop-blur bg-black bg-opacity-30 space-y-3 absolute bottom-5 right-5 left-5 rounded-xl p-3">
                  <h2 className="text-lg font-bold leading-6 lg:text-xl">{item?.title}</h2>
                  <p className="text-xs lg:text-sm font-medium leading-6">شما دسترسی به این بخش را ندارید</p>
                </div>
              </div>
            </div>
          )
        }
      })}
    </div>
  );
};

export default Carts;

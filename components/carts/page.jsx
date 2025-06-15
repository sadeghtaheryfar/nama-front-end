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

  const getLinkForItem = (item) => {
    if (profile?.data?.roles && profile.data.roles.length > 0) {
      const mosqueHeadCoachRole = profile.data.roles.find(role => 
        role.role_en === 'mosque_head_coach' && 
        role?.item_id?.id === item?.id
      );
      
      if (mosqueHeadCoachRole) {
        return `/${item?.id}`;
      } else {
        const itemRole = profile.data.roles.find(role => role?.item_id?.id === item?.id);
        if (itemRole) {
          return `/role?role=${itemRole.role_en}&item_id=${item?.id}`;
        } else {
          const firstRole = profile.data.roles[0];
          return `/role?role=${firstRole.role_en}&item_id=${item?.id}`;
        }
      }
    }
    
    return '/default-link';
  };

  console.log(profile?.data?.roles?.some(role => role.ring == true));
  

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
            <Link href={getLinkForItem(item)} key={item?.id}>
              <div className="relative w-72 flex-auto max-w-96 md:max-w-80 h-72 max-h-96 md:max-h-80 hover:scale-[1.05] active:scale-[1] transition-[0.9s]">
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

      {profile?.data?.roles?.some(role => role.ring == true) && (
        <>
          <Link href={'/loop'}>
            <div className="relative w-72 flex-auto max-w-96 md:max-w-80 h-72 max-h-96 md:max-h-80 hover:scale-[1.05] active:scale-[1] transition-[0.9s]">
              <img
                className="w-full h-full rounded-md object-cover"
                alt={'افزودن حلقه ها'}
                width={0}
                src="https://arman.armaniran.org/storage/base/photo_2025-04-04_20-12-46.jpg"
                height={0}
              />
              <div className="backdrop-blur bg-black bg-opacity-30 space-y-3 absolute bottom-5 right-5 left-5 rounded-xl p-3">
                <h2 className="text-lg font-bold leading-6 lg:text-xl">افزودن حلقه ها</h2>
                <p className="text-xs lg:text-sm font-medium leading-6">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، متنوع با هدف بهبود کاربردی.</p>
              </div>
            </div>
          </Link>

          <div><div className="relative w-72 flex-auto max-w-96 md:max-w-80"></div></div>
          <div><div className="relative w-72 flex-auto max-w-96 md:max-w-80"></div></div>
        </>
      )}
    </div>
  );
};

export default Carts;

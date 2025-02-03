import DarkhasthaGozaresh from "../darkhastha-gozaresh/darkhastha-gozaresh";
import GozareshKartablGozaresh from "../gozaresh-kartabl-gozaresh/gozaresh-kartabl-gozaresh";
import HeaderGozaresh from "../header-gozaresh/header-gozaresh";

const MainGozaresh = () => {
  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderGozaresh />
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 lg:space-y-16 lg:py-28 xl:space-y-6 xl:px-12 xl:py-[53px]">
        <GozareshKartablGozaresh/>
        <hr className="h-2 my-6" />
        <DarkhasthaGozaresh />
      </div>
    </div>
  );
};

export default MainGozaresh;

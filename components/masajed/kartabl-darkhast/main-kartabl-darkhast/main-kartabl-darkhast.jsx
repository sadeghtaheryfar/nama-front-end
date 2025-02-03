import Darkhastha from "../darkhastha/darkhastha";
import GozareshKartabl from "../gozaresh-kartabl/gozaresh-kartabl";
import HeaderKartablDarkhast from "../header-kartabl-darkhast/header-kartabl-darkhast";

const MainKartablDarkhast = () => {
  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderKartablDarkhast />
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-16 lg:mt-2 container mx-auto md:p-9 lg:space-y-16 lg:py-28 xl:space-y-6 xl:px-12 xl:py-[53px]">
        <GozareshKartabl />
        <hr className="h-2 my-6" />
        <Darkhastha />
      </div>
    </div>
  );
};

export default MainKartablDarkhast;

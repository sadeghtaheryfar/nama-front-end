import Gardesh from "../gardesh/gardesh";
import HeaderTaeed from "../header-taeed/header-taeed";
import MainGardesh from "../main-gardesh/main-gardesh";

const MainTaeed = () => {
  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderTaeed />
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-11 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
        <Gardesh />
      </div>
      <MainGardesh />
    </div>
  );
};

export default MainTaeed;

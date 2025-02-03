import GardeshRad from "../gardesh-rad/gardesh-rad";
import HeaderRad from "../header-rad/header-rad";
import MainGardeshRad from "../main-gardesh-rad/main-gardesh-rad";

const MainRad = () => {
  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderRad/>
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-11 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
        <GardeshRad/>
      </div>
        <MainGardeshRad/>
    </div>
  );
};

export default MainRad;

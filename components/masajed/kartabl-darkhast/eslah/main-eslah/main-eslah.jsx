import GardeshEslah from "../gardesh-eslah/gardesh-eslah";
import HeaderEslah from "../header-eslah/header-eslah";
import MainGardesheslah from "../main-gardesh-eslah/main-gardesh-eslah";

const MainEslah = () => {
  return (
    <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
      <HeaderEslah/>
      <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-10 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
        <GardeshEslah/>
      </div>
        <MainGardesheslah/>
    </div>
  );
};

export default MainEslah;

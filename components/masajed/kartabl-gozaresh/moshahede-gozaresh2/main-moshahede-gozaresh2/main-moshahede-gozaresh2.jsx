import GardeshMoshahede2 from "../gardesh-moshahede2/gardesh-jmoshahede2";
import HeaderMoshahede2 from "../header-moshahede2/header-moshahede2";
import MainGardeshMoshahede2 from "../main-gardesh-moshahede2/main-gardesh-moshahede2";
import MainGardeshMoshahede22 from "../main-gardesh-moshahede22/main-gardesh-moshahede22";

const MainMoshahedeGozaresh2 = () => {
    return (
        <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <HeaderMoshahede2/>
        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-6 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
          <GardeshMoshahede2/>
        </div>
          <MainGardeshMoshahede2/>
          <MainGardeshMoshahede22/>
      </div>
    );
}

export default MainMoshahedeGozaresh2;
import GardeshMoshahede from "../gardesh-moshahede/gardesh-jmoshahede";
import HeaderMoshahede from "../header-moshahede/header-moshahede";
import MainGardeshMoshahede from "../main-gardesh-moshahede/main-gardesh-moshahede";
import MainGardeshMoshahede2 from "../main-gardesh-moshahede2/main-gardesh-moshahede2";

const MainMoshahedeGozaresh = () => {
    return (
        <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <HeaderMoshahede/>
        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-6 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
          <GardeshMoshahede/>
        </div>
          <MainGardeshMoshahede/>
          <MainGardeshMoshahede2/>
      </div>
    );
}

export default MainMoshahedeGozaresh;
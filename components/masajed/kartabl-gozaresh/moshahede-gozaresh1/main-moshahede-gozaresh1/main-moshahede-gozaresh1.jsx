import GardeshMoshahede1 from "../gardesh-moshahede1/gardesh-jmoshahede1";
import HeaderMoshahede1 from "../header-moshahede1/header-moshahede1";
import MainGardeshMoshahede1 from "../main-gardesh-moshahede1/main-gardesh-moshahede1";
import MainGardeshMoshahede21 from "../main-gardesh-moshahede21/main-gardesh-moshahede21";

const MainMoshahedeGozaresh1 = () => {
    return (
        <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <HeaderMoshahede1/>
        <div className="relative z-10 rounded-[20px] bg-white drop-shadow-3xl p-6 mb-6 lg:mt-2 container mx-auto lg:p-9 xl:px-12 xl:py-[53px]">
          <GardeshMoshahede1/>
        </div>
          <MainGardeshMoshahede1/>
          <MainGardeshMoshahede21/>
      </div>
    );
}

export default MainMoshahedeGozaresh1;
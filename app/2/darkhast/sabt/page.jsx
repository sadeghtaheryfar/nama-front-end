import HeaderSabt from "../../../../components/masajed/darkhast/sabt/header-sabt/header-sabt";
import MainSabt from "../../../../components/masajed/darkhast/sabt/main-sabt/main-sabt";
import FooterMasajed from "../../../../components/masajed/footer/footer-masjed";
import { Suspense } from "react";
const Sabt = () => {
  return (
    <Suspense>
      <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <HeaderSabt />
        <MainSabt />
      </div>
      <FooterMasajed />
    </Suspense>
  );
};

export default Sabt;
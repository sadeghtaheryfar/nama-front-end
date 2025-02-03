"use cleint";
import HeaderSabt1 from "../../../../../components/masajed/darkhast/sabt/sabt1/header-sabt1/header-sabt1";
import MainSabt1 from "../../../../../components/masajed/darkhast/sabt/sabt1/main-sabt1/main-sabt1";
import FooterMasajed from "../../../../../components/masajed/footer/footer-masjed";

import { Suspense } from "react";
const Sabt1 = () => {
  return (
    <Suspense>
      <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        <HeaderSabt1 />
        <MainSabt1 />
      </div>
      <FooterMasajed />
    </Suspense>
  );
};

export default Sabt1;

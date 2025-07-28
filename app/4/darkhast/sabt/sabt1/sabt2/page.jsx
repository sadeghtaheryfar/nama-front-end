"use client";
import HeaderSabt2 from "../../../../../../components/masajed/darkhast/sabt/sabt2/header-sabt2/header-sabt2";
import MainSabt2 from "../../../../../../components/masajed/darkhast/sabt/sabt2/main-sabt2/main-sabt2";
import FooterMasajed from "../../../../../../components/masajed/footer/footer-masjed";
import { Suspense } from "react";

const Sabt2 = () => {
  return (
    <Suspense>
      <div className="bg-header-masjed bg-repeat-x bg-auto lg:bg-header-masjed-desktop lg:bg-no-repeat lg:bg-contain px-7">
        {/* <HeaderSabt2 /> */}
        <MainSabt2 />
      </div>
      <FooterMasajed />
    </Suspense>
  );
};

export default Sabt2;
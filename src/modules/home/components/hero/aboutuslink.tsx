import React from 'react';
import Link from "next/link"
import { Button } from "@medusajs/ui"


interface AboutusLinkProps {
  countryCode: string;
}
const AboutUsLink: React.FC<AboutusLinkProps> = ({ countryCode }) => {
  const isLang = countryCode === "uz";
  return (
    <div className="cover p-14">
      <div
        className="relative w-full h-screen bg-cover bg-center h-30vh md:h-50vh flex items-center justify-center"
        style={{ backgroundImage: 'url(/aboutuslink.jpg)', height: '400px' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white max-w-3xl text-center">
          <h1 className="text-4xl max-md:text-2xl mb-6">
            {isLang ? "12 yillik ishonch va sifat" : "12 лет доверия и качества"}
          </h1>
          <p className="text-lg mb-8 px-4 max-md:text-base">
            {isLang
              ? "Nafis gilamlar yasash bo‘yicha sayohatimiz hamda sifat va innovatsiyalarga bo‘lgan sadoqatimiz bilan tanishing."
              : "Познакомьтесь с нашим путешествием по созданию изысканных ковров и нашей преданностью качеству и инновациям."}
          </p>
          <Link href="/about">
            <Button variant="secondary" className="bg-ui-fg-component bg-[#FF6A1A] hover:bg-[#e55d17] rounded-3xl py-4 px-8 text-bold border-0">
              {isLang ? "Biz haqimizda" : "О нас"}
            </Button> 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsLink;
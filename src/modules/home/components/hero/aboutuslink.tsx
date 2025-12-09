import React from 'react';
import Link from "next/link"
import { Button } from "@medusajs/ui"
import { t } from '@lib/util/translations'


interface AboutusLinkProps {
  countryCode: string;
}
const AboutUsLink: React.FC<AboutusLinkProps> = ({ countryCode }) => {
  const isLang = countryCode === "uz";
  return (
    <div className="mx-14 px-9 max-md:px-4 max-md:mx-4">
      <div
        className="relative w-full h-screen bg-cover bg-center h-30vh md:h-50vh flex items-center justify-center rounded-3xl overflow-hidden"
        style={{ backgroundImage: 'url(/aboutuslink.jpg)', height: '280px' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>
        <div className="relative z-10 text-white max-w-3xl text-center">
          <h1 className="text-3xl font-bold max-md:text-xl mb-4">
            {t({ uz: '12 yillik ishonch va sifat', ru: '12 лет доверия и качества', en: '12 years of trust and quality' }, countryCode)}
          </h1>
          <p className="text-base mb-6 px-4 max-md:text-sm">
            {t({ uz: 'Nafis gilamlar yasash boʼyicha sayohatimiz hamda sifat va innovatsiyalarga boʼlgan sadoqatimiz bilan tanishing.', ru: 'Познакомьтесь с нашим путешествием по созданию изысканных ковров и нашей преданностью качеству и инновациям.', en: 'Discover our journey in creating exquisite carpets and our commitment to quality and innovation.' }, countryCode)}
          </p>
          <Link href="/about">
            <Button variant="secondary" className="bg-ui-fg-component bg-[#A65A3A] text-white rounded-3xl py-3 px-6 text-md shadow-lg">
              {t({ uz: 'Biz haqimizda', ru: 'О нас', en: 'About us' }, countryCode)}
            </Button> 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsLink;
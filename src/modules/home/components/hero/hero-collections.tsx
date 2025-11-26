import React from 'react';
import { Button } from "@medusajs/ui"
import 'styles/styless.css'

interface HeroCollectionsProps {
  countryCode: string;
}
const HeroCollections: React.FC<HeroCollectionsProps> = ({ countryCode }) => {
  const isLang = countryCode === "uz";
  return (
    <section className="mx-14 px-9 max-md:px-4 max-md:mx-4">
      <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2 mt-4 coll-text">
        {isLang ? (
          <>
            Biz<span className="border-b-4 border-brand-peach inline-block">ning{' '}
            
              to'plam</span>lar
            
          </>
        ) : (
          <>
            На<span className="border-b-4 border-brand-peach inline-block">ши{' '}
            
              коллекц</span>ии
            
          </>
        )}
      </h2>

        <div className="flex justify-between text-white div-container">
          <div className="div1 flex justify-between flex-col w-1/2 h-41rem">
            <div className="bg-white div1-1 p-6 mb-1 group relative flex flex-col justify-end bg-opacity-50 rounded-2xl overflow-hidden" style={{ backgroundImage: 'url(/alawn.png)', height: '20rem', backgroundSize: "cover" }}>
                <a href= {countryCode + "/categories/gazon"} target="_blank" className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out absolute top-10 right-5">
                    <Button variant="secondary" className="bg-ui-fg-component liquid-glass-button-secondary rounded-3xl py-3 px-6 text-md shadow-lg">
                      {isLang ? "Ko'rish" : "Посмотреть"}
                    </Button>
                </a>
                <h3 className="text-xl font-semibold mt-4 inline-block">
                  <span className="border-b-0 border-transparent group-hover:border-b-4 group-hover:border-brand-peach transition-all duration-300 inline-block">
                  {isLang ? "Sun'iy gazon" : "Искусственный газон"}
                  </span>
                </h3>
                <p className="mt-2 text-white opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[100px] transition-all duration-500">
                  {isLang ? "Ichki va tashqi foydalanish uchun mo‘ljallangan sun’iy chim qoplamalar."
                    : "Искусственные покрытия для внутреннего и внешнего использования."}
                </p>
            </div>
            <div className="bg-white p-6 relative group relative flex flex-col justify-end rounded-2xl overflow-hidden" style={{ backgroundImage: 'url(/tufting.png)', height: '20rem', backgroundSize: "cover", backdropFilter: "contrast(0.5)" }}>
              <a href={countryCode + "/categories/tufting"} target="_blank" className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out absolute top-10 right-5">
                <Button variant="secondary" className="bg-ui-fg-component liquid-glass-button-secondary rounded-3xl py-3 px-6 text-md shadow-lg">
                  {isLang ? "Ko'rish" : "Посмотреть"}
                </Button>
              </a>
              <h3 className="text-xl font-semibold mt-4">
                <span className="border-b-0 border-transparent group-hover:border-b-4 group-hover:border-brand-peach transition-all duration-300 inline-block">
                  {isLang ? "Tafting" : "Туфтинг"}</span>
                </h3>
              <p className="mt-2 text-white opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[100px] transition-all duration-500">
               {isLang ? 
                  "Tufted texnologiyasi asosida ishlab chiqarilgan gilamlar"
                  : "Ковры, изготовленные по технологии тафтинга"}
              </p>
            </div>
          </div>
         
          <div className="div2 bg-white p-6 w-1/2 h-41rem group relative flex flex-col justify-end ml-2 rounded-2xl overflow-hidden"
           style={{ backgroundImage: 'url(/gilam-stock.png)', backgroundSize: "cover" }}>
              <a href={countryCode + "/categories/gilam"} target="_blank" className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out absolute top-10 right-5">
                <Button variant="secondary" className="bg-ui-fg-component liquid-glass-button-secondary rounded-3xl py-3 px-6 text-md shadow-lg">
                  {isLang ? "Ko'rish" : "Посмотреть"}
                </Button>
              </a>
            <h3 className="text-xl font-semibold mt-4">
              <span className="border-b-0 border-transparent group-hover:border-b-4 group-hover:border-brand-peach transition-all duration-300 inline-block">
                {isLang ? "Gilamlar" : "Ковры"}
              </span>
            </h3>
            <p className="mt-2 text-white opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[100px] transition-all duration-500">
              {isLang ? "An’anaviy tugun usuli hamda mashina to'qilgan zamonaviy dizayndagi gilamlar." : "Традиционные ковры ручной работы и современные машинные ковры."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCollections;
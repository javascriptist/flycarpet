import React from 'react';
import { t } from '@lib/util/translations';

interface AchievementsProps {
  countryCode?: string;
}
const Achievements = ({ countryCode }: AchievementsProps) => {
  const data = [
    { number: '10k+', text: t({ uz: "Baxtli mijozlar O'zbekiston bo'ylab", ru: 'довольных клиентов по всему Узбекистану', en: 'happy customers across Uzbekistan' }, countryCode) },
    { number: '99.9%', text: t({ uz: 'aniqlik va ishonch', ru: 'точность и надёжность сервиса', en: 'accuracy and reliability' }, countryCode) },
    { number: '800+', text: t({ uz: 'dizayn assortimentda — har bir did uchun', ru: 'дизайнов в ассортименте — на любой вкус', en: 'designs in assortment — for every taste' }, countryCode) },
    { number: '8', text: t({ uz: 'yillik tajriba', ru: 'лет опыта', en: 'years of experience' }, countryCode) },
  ]

  return (
    <div className='cover'>
      <div className=" mx-14 my-10 px-5 bg-[#F4E9DD] flex justify-between rounded-3xl max-md:flex-col" style={{ gap: '30px', padding: '20px' }}>
        {data.map((item, index) => (
          <div
            key={index}
            className="text-center p-6 flex flex-col w-1/4 max-md:w-full border-r border-brand-peach last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0"
          >
            <h2 className="text-4xl text-brand-peach">{item.number}</h2>
            <p className="text-gray-700 mt-2">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
      
  );
};

export default Achievements;
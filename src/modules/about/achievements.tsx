import React from 'react';

interface AchievementsProps {
  countryCode?: string;
}
const Achievements = ({ countryCode }: AchievementsProps) => {
  const isLang = countryCode === "uz";
  const data = [
    { number: '10k+', text: isLang ? 'Baxtli mijozlar O‘zbekiston bo‘ylab' : 'довольных клиентов по всему Узбекистану' },
    { number: '99.9%', text: isLang ? 'aniqlik va ishonch ' : 'точность и надёжность сервиса' },
    { number: '800+', text: isLang ? 'dizayn assortimentda — har bir did uchun' : 'дизайнов в ассортименте — на любой вкус' },
    { number: '8', text: isLang ? 'yillik tajriba' : 'лет опыта' },
  ]

  return (
    <div className='cover'>
      <div className=" mx-14 my-10 px-5 bg-gray-100 flex justify-between max-md:flex-col" style={{ gap: '30px', padding: '20px' }}>
        {data.map((item, index) => (
          <div
            key={index}
            className="text-center p-6 flex flex-col w-1/4 max-md:w-full"
          >
            <h2 className="text-4xl text-[#FF6A1A]">{item.number}</h2>
            <p className="text-gray-700 mt-2">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
      
  );
};

export default Achievements;
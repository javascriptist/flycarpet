import { count } from 'console';
import React from 'react';

interface WhyUsProps {
  countryCode?: string;
}
const WhyUs: React.FC = (whyUsProps: WhyUsProps) => {
  const isLang = whyUsProps.countryCode === "uz";


  const items = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFF" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
    </svg>
    ,
      title: isLang ? 'Tez yetkazib berish' : 'Быстрая доставка',
      description: isLang ? 'Oʻzbekiston boʻylab tez va ishonchli yetkazib berish xizmati bilan buyurtmalaringiz tezda eshigingizgacha yetadi.' : 'Быстрая и надежная доставка по Узбекистану, ваши заказы быстро доставляются к вашей двери.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFF" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
    ,
      title: isLang ? 'Profissional xizmatlar' : 'Профессиональные услуги',
      description: isLang ? 'Biz har bir mijozga alohida e’tibor va yuqori darajadagi xizmat ko‘rsatishni kafolatlaymiz.' : 'Мы гарантируем индивидуальный подход и высокий уровень обслуживания каждому клиенту.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFF" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
          ,
      title: isLang ? 'Ishonchli to\'lovlar' : 'Надежные платежи',
      description: isLang ? 'Barcha tranzaksiyalar zamonaviy xavfsizlik tizimi orqali amalga oshiriladi.' : 'Все транзакции осуществляются через современную систему безопасности.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFF" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
    ,
      title: isLang ? 'Sifat kafolati' : 'Гарантия качества',
      description: isLang ? 'Har bir gilam — bizning sha’nimiz. Sifat biz uchun doim ustuvor!' : 'Каждый ковер — это наша гордость. Качество для нас всегда на первом месте!',
    },
  ];

  return (
    <div className="cover">
      <div className="cover bg-gray-100 my-10 mx-14">
        <div style={{ gap: '20px', padding: '20px' }} className='flex justify-between max-md:flex-col'>

          {items.map((item, index) => (
            <div
              className='flex flex-col bg-white border border-transparent hover:border-[#FF6A1A] hover:shadow-md transition-all duration-200 rounded-md'
              key={index}
              style={{
                flex: '1',
                textAlign: 'left',  
                padding: '50px 25px',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }} className='bg-[#FF6A1A] rounded-full w-[40px] h-[40px] flex items-center justify-center'>
                {item.icon}</div>
              <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#555' }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
      
      
  );
};

export default WhyUs;
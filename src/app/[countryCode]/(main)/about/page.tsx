'use client';
import React from 'react';
import AboutHero from '@modules/about/hero';
import Story from '@modules/about/story';
import WhyUs from '@modules/about/whyus';
import { ST } from 'next/dist/shared/lib/utils';
import Achievements from '@modules/about/achievements';
import { usePathname } from 'next/navigation';

const AboutPage = () => {
  const pathname = usePathname();
  const countryCode = pathname.split('/')[1];

  const isLang = countryCode === "uz";
  return (
    <div>
      <AboutHero/>
      <Story 
      title={
          isLang ? (
            <span className="border-b-4 border-[#FF6A1A] inline-block">
              Biz haqimizda
            </span>
          ) : (
            <span className="border-b-4 border-[#FF6A1A] inline-block">
              О нас
            </span>
          )
        }
        description= {isLang ? "Fly Carpet — bu gilam san'atiga muhabbat bilan qurilgan brend. 2016-yildan beri biz Oʻzbekiston bo‘ylab mijozlarimizni noyob gilamlar bilan xursand qilmoqdamiz. Gilamlarimiz O‘zbekistonda ishlab chiqariladi hamda Eron, Rossiya va boshqa mintaqaviy hamkorlardan yetkaziladi. Har bir gilam — bu san’at, urf-odatlar va zamonaviy dizayn uyg‘unligidir. Biz nafaqat gilam sotamiz — biz har bir uyni o‘ziga xos, qadriyatli makonga aylantiramiz." : "Fly Carpet — это бренд, созданный с любовью к искусству ковроделия. С 2016 года мы радуем клиентов по всему Узбекистану уникальными коврами. Мы производим собственные изделия, а также сотрудничаем с мастерами из Ирана, России и других стран региона. Каждый ковер — это сочетание традиций, истории и современного дизайна. Мы не просто продаём ковры — мы создаём атмосферу в вашем доме."}
         imageUrl="/aboutpage1.jpg"/>
      <WhyUs countryCode={countryCode}/>
      <Story title={
          isLang ? (
            <span className="border-b-4 border-[#FF6A1A] inline-block">
              Bizning vazifamiz
            </span>
          ) : (
            <span className="border-b-4 border-[#FF6A1A] inline-block">
              Наша миссия
            </span>
          )
        }
        description= { isLang ? 'Fly Carpet’ning asosiy maqsadi — o‘zbek uylariga o‘ziga xoslik va an’anaviy go‘zallik olib kirish. Har bir gilamimizda tarix, madaniyat va zamonaviylik mujassam. Mahalliy va xalqaro ustalarning qo‘l mehnati orqali biz sizga sifatli, o‘ziga xos gilamlarni taqdim etamiz. Biz ishonamiz: gilam — bu shunchaki buyum emas, bu meros!' : 'Основная цель Fly Carpet — привнести уникальность и традиционную красоту в узбекские дома. Каждый наш ковер — это сочетание истории, культуры и современности. Мы предлагаем вам качественные, уникальные ковры, созданные руками местных и международных мастеров. Мы верим: ковер — это не просто вещь, это наследие!'}
         imageUrl="/aboutpage2.jpg"/>
      <Achievements countryCode={countryCode} />
    </div>
  );
};

export default AboutPage;
'use client';
import React from 'react';
import AboutHero from '@modules/about/hero';
import Story from '@modules/about/story';
import WhyUs from '@modules/about/whyus';
import { ST } from 'next/dist/shared/lib/utils';
import Achievements from '@modules/about/achievements';
import { usePathname } from 'next/navigation';
import { t } from '@lib/util/translations';

const AboutPage = () => {
  const pathname = usePathname();
  const countryCode = pathname.split('/')[1];
  return (
    <div>
      <AboutHero/>
      <Story 
      title={
            <span className="border-b-4 border-[#D9A676] inline-block">
              {t({ uz: "Biz haqimizda", ru: "О нас", en: "About Us" }, countryCode)}
            </span>
        }
        description={t({
          uz: "Premium Carpet — bu gilam san'atiga muhabbat bilan qurilgan brend. 2016-yildan beri biz Oʻzbekiston bo'ylab mijozlarimizni noyob gilamlar bilan xursand qilmoqdamiz. Gilamlarimiz O'zbekistonda ishlab chiqariladi hamda Eron, Rossiya va boshqa mintaqaviy hamkorlardan yetkaziladi. Har bir gilam — bu san'at, urf-odatlar va zamonaviy dizayn uyg'unligidir. Biz nafaqat gilam sotamiz — biz har bir uyni o'ziga xos, qadriyatli makonga aylantiramiz.",
          ru: "Premium Carpet — это бренд, созданный с любовью к искусству ковроделия. С 2016 года мы радуем клиентов по всему Узбекистану уникальными коврами. Мы производим собственные изделия, а также сотрудничаем с мастерами из Ирана, России и других стран региона. Каждый ковер — это сочетание традиций, истории и современного дизайна. Мы не просто продаём ковры — мы создаём атмосферу в вашем доме.",
          en: "Premium Carpet is a brand built with love for the art of rug-making. Since 2016, we have been delighting customers across Uzbekistan with unique rugs. Our rugs are produced in Uzbekistan and sourced from Iran, Russia, and other regional partners. Each rug is a harmony of art, traditions, and modern design. We don't just sell rugs — we transform every home into a unique, valuable space."
        }, countryCode)}
         imageUrl="/aboutpage1.jpg"/>
      <WhyUs countryCode={countryCode}/>
      <Story title={
            <span className="border-b-4 border-[#D9A676] inline-block">
              {t({ uz: "Bizning vazifamiz", ru: "Наша миссия", en: "Our Mission" }, countryCode)}
            </span>
        }
        description={t({
          uz: "Premium Carpet'ning asosiy maqsadi — o'zbek uylariga o'ziga xoslik va an'anaviy go'zallik olib kirish. Har bir gilamimizda tarix, madaniyat va zamonaviylik mujassam. Mahalliy va xalqaro ustalarning qo'l mehnati orqali biz sizga sifatli, o'ziga xos gilamlarni taqdim etamiz. Biz ishonamiz: gilam — bu shunchaki buyum emas, bu meros!",
          ru: "Основная цель Premium Carpet — привнести уникальность и традиционную красоту в узбекские дома. Каждый наш ковер — это сочетание истории, культуры и современности. Мы предлагаем вам качественные, уникальные ковры, созданные руками местных и международных мастеров. Мы верим: ковер — это не просто вещь, это наследие!",
          en: "Premium Carpet's main goal is to bring uniqueness and traditional beauty to Uzbek homes. Each of our rugs embodies history, culture, and modernity. Through the craftsmanship of local and international artisans, we offer you high-quality, unique rugs. We believe: a rug is not just an item, it's a heritage!"
        }, countryCode)}
         imageUrl="/aboutpage2.jpg"/>
      <Achievements countryCode={countryCode} />
    </div>
  );
};

export default AboutPage;
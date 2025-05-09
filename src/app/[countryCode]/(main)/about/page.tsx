import React from 'react';
import AboutHero from '@modules/about/hero';
import Story from '@modules/about/story';
import WhyUs from '@modules/about/whyus';
import { ST } from 'next/dist/shared/lib/utils';
import Achievements from '@modules/about/achievements';
const AboutPage = () => {
  return (
    <div>
      <AboutHero/>
      <Story title="Our Story" description="We are a small team of developers and designers who are passionate about creating the best e-commerce experiences. Our mission is to help you build the store of your dreams. we believe that furniture is more than just functional pieces; it’s an expression of your style and a reflection of your life. For over a decade, we have been dedicated to crafting high-quality, designer furniture that transforms houses into homes. Our journey began with a simple vision: to create elegant, timeless furniture that combines comfort and style." imageUrl="/gilam-stock.png"/>
      <WhyUs/>
      <Story title="Our Mission" description="Our mission is to help you build the store of your dreams. we believe that furniture is more than just functional pieces; it’s an expression of your style and a reflection of your life. For over a decade, we have been dedicated to crafting high-quality, designer furniture that transforms houses into homes. Our journey began with a simple vision: to create elegant, timeless furniture that combines comfort and style." imageUrl="/rug-hero.jpg"/>
      <Achievements/>
    </div>
  );
};

export default AboutPage;
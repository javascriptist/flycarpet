'use client'
import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
// use client
import Image from 'next/image'
import ProductList from "./products-list"
import Footer from "@modules/layout/templates/footer"
import { useTranslation } from "next-i18next"
import { useState, useEffect } from 'react'
import { t } from '@lib/util/translations'


interface HeroProps {
  countryCode: string;
}

const Hero: React.FC<HeroProps> = ({ countryCode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    '/rug-hero.jpg',
    '/heroimg1.jpg',
    '/heroimg2.jpg',
    '/heroimg3.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-screen border-b border-ui-border-base relative flex flex-col bg-[#191718]">
      <div className="img w-full h-[50vh] md:h-[55vh] relative overflow-hidden flex-shrink-0">
        {images.map((img, index) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <Image
              src={img}
              alt={`Hero Image ${index + 1}`}
              fill
              sizes="100vw"
              quality={100}
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="txt-and-btn w-full flex-1 flex items-center justify-center bg-[#191718]">
        <div className="flex flex-col w-full small:pr-16 pl-12 py-8 md:py-12 gap-3">
          <span>
          <Heading
              level="h1"
              className="text-2xl leading-8 text-ui-fg-component text-white font-bold mb-4"
            >
              {countryCode === 'uz' ? (
                <>
                <span className="border-b-4 border-brand-peach inline-block">
                  Premium Carpet 
                  </span>
                    {' '}gilamlari
                  
                </>
              ) : countryCode === 'gb' ? (
                <>
                  <span className="border-b-4 border-brand-peach inline-block">
                    Premium Carpet
                  </span>
                  {' '}
                </>
              ) : (
                <>
                  Ковры{' '}
                  <span className="border-b-4 border-brand-peach inline-block">
                    Premium Carpet
                  </span>
                </>
              )}
            </Heading>
            <Heading
              level="h2"
              className="text-xl leading- text-ui-fg-subtle text-white font-normal mt-2 mb-6"
            >
              {t({ uz: 'Uyga Sharq sehrini qo\u02bcshing va bo\u02bcshliq qanday tirik ekanligini his qiling.', ru: 'Добавьте магию Востока в свой дом и почувствуйте, как пространство оживает.', en: 'Add the magic of the East to your home and feel how the space comes alive.' }, countryCode)}
            </Heading>
          </span>
          <a
            href={`/${countryCode}/store`}
          >
            <Button variant="secondary" className="bg-ui-fg-component liquid-glass text-white rounded-3xl py-4 px-8 text-md bg-[#D9A676] hover:bg-[#A65A3A] hover:text-white transition-all duration-200">
              {t({ uz: 'Mahsulotlarni ko\u02bcrish', ru: 'Посмотреть продукты', en: 'View products' }, countryCode)}
            </Button>
          </a>
        </div>
      </div>
      {/* <ProductList
        sortBy={"price_asc" | "price_desc" | "created_at" }
        page={1}
        collectionId="pcol_01JNE5NZW1NFZSEMYG3F3R43J6"
        categoryId="pcat_01JN14ET834W4JJEBKXGQJXY41"
        countryCode="uz"
        productsIds={["prod_01JNE50A32D04HEWC82P52X4RD"]}
      /> */}
      {/* <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
           Welcome
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Powered by Medusa and Next.js
          </Heading>
        </span>
        <a
          href="https://github.com/medusajs/nextjs-starter-medusa"
          target="_blank"
        >
          <Button variant="secondary">
            View on GitHub
            <Github />
          </Button>
        </a>
      </div>
    </div> */}
    </div>
  )
}

export default Hero

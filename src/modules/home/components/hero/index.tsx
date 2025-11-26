'use client'
import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
// use client
import Image from 'next/image'
import ProductList from "./products-list"
import Footer from "@modules/layout/templates/footer"
import { useTranslation } from "next-i18next"
import { useState, useEffect } from 'react'


interface HeroProps {
  countryCode: string;
}

const Hero: React.FC<HeroProps> = ({ countryCode }) => {
  const isLang = countryCode === "uz";
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
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle justify-content-center items-center bg-black">
      <div className="img w-[100%] h-[40vh] relative overflow-hidden">
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
      <div className="txt-and-btn w-[100%]">
        <div className="flex flex-col small:pr-16 pl-12 pt-12 pb-12 gap-3 bg-black">
          <span>
          <Heading
              level="h1"
              className="text-2xl leading-8 text-ui-fg-component text-white font-bold mb-4"
            >
              {isLang ? (
                <>
                <span className="border-b-4 border-brand-peach inline-block">
                  Premium Carpet 
                  </span>
                    {' '}gilamlari
                  
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
              {isLang ? "Uyga Sharq sehrini qo‘shing va bo‘shliq qanday tirik ekanligini his qiling." : "Добавьте магию Востока в свой дом и почувствуйте, как пространство оживает."}
            </Heading>
          </span>
          <a
            href={`/${countryCode}/store`}
          >
            <Button variant="secondary" className="bg-ui-fg-component liquid-glass text-white rounded-3xl py-4 px-8 text-md bg-[#D9A676]">
              {isLang ? "Mahsulotlarni ko'rish" : "Посмотреть продукты"}
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

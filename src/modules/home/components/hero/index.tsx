'use client'
import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
// use client
import Image from 'next/image'
import ProductList from "./products-list"
import Footer from "@modules/layout/templates/footer"
import { useTranslation } from "next-i18next"


interface HeroProps {
  countryCode: string;
}

const Hero: React.FC<HeroProps> = ({ countryCode }) => {
  const isLang = countryCode === "uz";

  // const [emblaRef] = useEmblaCarousel({
  //   loop: true,
  //   align: 'center',
  //   skipSnaps: false,
  //   speed: 10,
  //   axis: 'y',

  //   });
  //  const images = [
  //   '/opengraph-image.jpg',
  //   '/opengraph-image.jpg',
  //   '/opengraph-image.jpg',
  //   '/opengraph-image.jpg',
  //   ];  
  return (
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle justify-content-center items-center bg-black">
      {/* <div className="embla__container" ref={emblaRef}>
        <div className="embla__slide">
          <Image
            src="/opengraph-image.jpg"
            alt="Picture of the author"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="h-[75vh] w-[50%] object-cover"
          />
        </div>
        <div className="embla__slide">
          <Image
            src="/opengraph-image.jpg"
            alt="Picture of the author"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="h-[75vh] w-[50%] object-cover"
          />
        </div>
        <div className="embla__slide">
          <Image
            src="/opengraph-image.jpg"
            alt="Picture of the author"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="h-[75vh] w-[50%] object-cover"
          />
        </div>
        <div className="embla__slide">
          <Image
            src="/opengraph-image.jpg"
            alt="Picture of the author"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="h-[75vh] w-[50%] object-cover"
          />
        </div>*/}
      <div className="img w-[100%] h-[50vh]">
        <Image
          src="/rug-hero.jpg"
          alt="Hero Image"
          objectFit="cover"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: '50vh' }}
          quality={100}
          className="object-cover"
        />
      </div>
      <div className="txt-and-btn w-[100%] h-[55vh]">
        <div className="flex flex-col small:pr-16 pl-12 pt-28 pb-28 gap-3 bg-black">
          <span>
          <Heading
              level="h1"
              className="text-3xl leading-10 text-ui-fg-component text-white font-normal mb-6"
            >
              {isLang ? (
                <>
                <span className="border-b-4 border-[#FF6A1A] inline-block">
                  Fly Carpet 
                  </span>
                    {' '}gilamlari
                  
                </>
              ) : (
                <>
                  Ковры{' '}
                  <span className="border-b-4 border-[#FF6A1A] inline-block">
                    Fly Carpet
                  </span>
                </>
              )}
            </Heading>
            <Heading
              level="h2"
              className="text-3xl leading-10 text-ui-fg-subtle text-white font-normal text-lg"
            >
              {isLang ? "Uyga Sharq sehrini qo‘shing va bo‘shliq qanday tirik ekanligini his qiling." : "Добавьте магию Востока в свой дом и почувствуйте, как пространство оживает."}
            </Heading>
          </span>
          <a
            href=""
            target="_blank"
          >
            <Button variant="secondary" className="bg-ui-fg-component bg-[#FF6A1A] hover:bg-[#e55d17] text-white rounded-3xl py-4 px-8 text-md">
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

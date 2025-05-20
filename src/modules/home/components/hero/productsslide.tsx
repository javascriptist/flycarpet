'use client';
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { count } from 'console';

interface ProductSlideProps {
  listOfProducts: Array<{ id: string; handle: string; title: string, img: string | null }>;
  // one more prop for countryCode
  countryCode?: string;
  // Adjust the type based on your data
}

const ProductSlide: React.FC<ProductSlideProps> = ({ listOfProducts, countryCode }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      768: {
        slidesToScroll: 2,
        align: 'start',
      },
      1024: {
        slidesToScroll: 3,
        align: 'start',
      },
      1280: {
        slidesToScroll: 4,
        align: 'start',
      },
    },
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const isLang = countryCode === "uz";
  // create a function that gives true if countryCode is kg else false
  return (
    <div className="relative mx-14 my-10 px-5 py-10 bg-gray-100">
      <div className="title-and-button" style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div className="title-text mb-10">
          <h2 className="text-4xl"> {isLang ? "Eng so'ngi mahsulotlar" : "Последние продукты"}</h2>
          <div className="w-100 h-[1.9px] bg-[#FF6A1A] mb-6 rounded-full"></div>
        </div>
        <div className="title-button flex">
          <button onClick={() => emblaApi?.scrollPrev()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#FF6A1A" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
          <button onClick={() => emblaApi?.scrollNext()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#FF6A1A" className="size-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
          </button>
        </div>
          
      </div>
              
      <div className={styles.carousel}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {listOfProducts.map((product, index) => (
              <a className={styles.slide} key={index} 
              href={`/products/${product.handle}`}
              // 3 slides per view
              >
                {/* Adjust the styles as needed */}
                <img
                  className={styles.image}
                  src={product.img}
                  alt={`Slide ${index}`}
                />
                <div className="product-card-text py-5 px-2 text-center" style={{ display: 'flex', justifyContent: 'center', width: '100%'} }>
                  <h2 className="text-lg text-center">{product.title}</h2>
                  <div className="text-center text-blue-500 underline opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out absolute left-[42%] top-[300px] text-black bg-white rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="size-6">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                  </svg>
                  </div>
                </div>
                  
                </a>
            ))}
          </div>
        </div>
        {/* <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === selectedIndex ? styles.active : ''}`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div> */}
        {/* Optional: Add navigation buttons */} 
        {/* Optional: Add autoplay functionality */}
        {/* useEffect(() => {
          const interval = setInterval(() => {
            emblaApi?.scrollNext();
          }, 3000);
          return () => clearInterval(interval);
        }, [emblaApi]); */}
      </div>
    </div>
  );
};

// CSS styles for the carousel
// add these to slide styles:style={{
              //   flexBasis: '25%',
              //   maxWidth: '25%',
              //   overflow: 'hidden',
              //   alignItems: 'center',
              //   flexDirection: 'column',
              // }}
const styles = {
  carousel: 'relative',
  viewport: 'overflow-hidden',
  container: 'flex',
  slide: 'flex-shrink-0 w-full h-100 rounded-sm mx-2 group relative flex basis-[25%] max-w-[25%] overflow-hidden items-center flex-col max-sm:basis-[65%] max-w-[35%] ',
  image: 'object-cover rounded-sm h-[350px] max-sm:h-[250px] min-h-[250px] w-full border border-transparent hover:border-[#FF6A1A] hover:shadow-md transition-all duration-200 rounded-md', 
  dots: 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2',
  dot: 'w-3 h-3 bg-gray-300 rounded-full cursor-pointer',
  active: 'bg-blue-500',
};
export default ProductSlide;
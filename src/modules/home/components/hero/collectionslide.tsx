'use client';
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import toCyrillic from '@lib/util/latintocrylic';

interface CollectionSlideProps {
  listOfCollections: Array<{ id: string; handle: string; title: string }>;
  countryCode?: string;
  // Adjust the type based on your data
}

const CollectionSlide: React.FC<CollectionSlideProps> = ({ listOfCollections, countryCode }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    slidesToScroll: 1
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
  return (
    <div className="relative mx-14 my-10 px-5 py-10 bg-gray-100 max-md: px-2 max-md:mx-2">
      <div className="title-and-button" style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div className="title-text">
          <h2 className="text-4xl text-left max-md:text-3xl"> 
            {isLang ? "Eng so'ngi kolleksiyalar" : "Последние коллекции"}
          </h2>
          <div className="w-100 h-[1.9px] bg-[#FF6A1A] mb-6 rounded-full"></div>
            {isLang ? "Bizning eng so'nggi kolleksiyalarimiz bilan tanishing" : "Познакомьтесь с нашими последними коллекциями"}
           <p className="text-center text-xl mb-4 mb-4 text-left"> 
          </p>
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
            {listOfCollections.map((collection, index) => (
              <div className={styles.slide} key={index} 
              // 3 slides per view
              >
                {/* Adjust the styles as needed */}
                <img
                  className={styles.image}
                  src={'/rugpic/randomrug' + index + '.png'}
                  alt={`Slide ${index}`}
                />
                <div className="collection-card-text py-5 px-2" style={{ display: 'flex', justifyContent: 'space-between', width: '100%'} }>
                  <h2 className="text-center text-xl font-bold">{
                    isLang ? collection.title : toCyrillic(collection.title)
                  }
                  </h2>
                  <a href={`/collections/${collection.handle}`} className="text-center text-blue-500 underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FF6A1A" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                </div>
                  
                </div>
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
const styles = {
  carousel: 'relative',
  viewport: 'overflow-hidden',
  container: 'flex',
  slide: 'flex-shrink-0 w-full h-100 rounded-sm mx-2 group relative flex basis-[25%] max-w-[25%] overflow-hidden items-center flex-col max-sm:basis-[65%] max-w-[35%]',
  image: 'w-full h-full object-cover rounded-sm min-h-[250px] border border-transparent hover:border-[#FF6A1A] hover:shadow-md transition-all duration-200 rounded-md',
  dots: 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2',
  dot: 'w-3 h-3 bg-gray-300 rounded-full cursor-pointer',
  active: 'bg-blue-500',
};
export default CollectionSlide;
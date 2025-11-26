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
    <div className="relative mx-14 px-9 py-12 bg-[#F4E9DD] rounded-3xl max-md:px-4 max-md:mx-4">
      <div className="title-and-button" style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div className="title-text">
          <h2 className="text-4xl font-bold text-left max-md:text-3xl"> 
            {isLang ? "Eng so'ngi kolleksiyalar" : "Последние коллекции"}
          </h2>
          <div className="w-100 h-[1.9px] bg-brand-peach mb-6 rounded-full"></div>
            {isLang ? "Bizning eng so'nggi kolleksiyalarimiz bilan tanishing" : "Познакомьтесь с нашими последними коллекциями"}
           <p className="text-center text-xl mb-4 mb-4 text-left"> 
          </p>
        </div>
        <div className="title-button flex gap-2">
          <button onClick={() => emblaApi?.scrollPrev()} className="hover:rounded-full transition-all duration-300 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#D9A676" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
          <button onClick={() => emblaApi?.scrollNext()} className="hover:rounded-full p-2 transition-all duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#D9A676" className="size-10">
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
                <div className="collection-card-text py-5 px-2" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '4px 15px'} }>
                  <h2 className="text-center text-xl font-bold">{
                    isLang ? collection.title : toCyrillic(collection.title)
                  }
                  </h2>
                  <a href={`/collections/${collection.handle}`} className="hover:bg-brand-peach/10 rounded-full transition-all duration-300 hover:scale-110 inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D9A676" className="size-6">
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
  container: 'flex px-2 py-4',
  slide: 'flex-shrink-0 w-full h-100 mx-2 group relative flex basis-[25%] max-w-[25%] items-center flex-col max-sm:basis-[65%] max-w-[35%] rounded-2xl',
  image: 'w-full h-full object-cover rounded-2xl min-h-[250px] border border-transparent hover:border-brand-peach hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
  dots: 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2',
  dot: 'w-3 h-3 bg-gray-300 rounded-full cursor-pointer',
  active: 'bg-blue-500',
};
export default CollectionSlide;
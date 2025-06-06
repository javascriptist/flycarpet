import React from 'react';
import Image from 'next/image';
interface AboutProps {
  title: string;
  description: string;
  imageUrl: string;
}

const About: React.FC<AboutProps> = ({ title, description, imageUrl }) => {
  return (
    <div style={{ gap: '20px' }} className='px-16 py-20 flex center justify-between items-center max-md:flex-col items-start'>
      <div className='flex flex-col w-1/2 pr-5 max-md:w-full'>
        <h1 style={{ margin: '0 0 10px 0' }} className='text-4xl md:text-3xl font-bold'>
          {title}
          </h1>
        <p style={{ margin: 0 }} className='text-lg md:text-xl text-gray-700'>
          {description}
        </p>
      </div>
      <div
            className=" relative w-[500px] h-[425px] max-md:w-[360px]"
          >
            <Image
              src={imageUrl}
              alt="Current Image"
              layout={'fill'}
              objectFit="cover"
              className="rounded-lg shadow-lg border-t-4 border-[#FF6A1A] bg-gray-100 border-r-4 max-md: w-full max-md:h-1/2"
            />
            
          </div>

    </div>
  );
};

export default About;
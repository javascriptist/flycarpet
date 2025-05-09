import React from 'react';
import Image from 'next/image';
interface AboutProps {
  title: string;
  description: string;
  imageUrl: string;
}

const About: React.FC<AboutProps> = ({ title, description, imageUrl }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }} className='px-16 py-20'>
      <div className='flex flex-col w-1/2 pr-5'>
        <h1 style={{ margin: '0 0 10px 0' }} className='text-4xl md:text-3xl font-bold'>
          {title}
          </h1>
        <p style={{ margin: 0 }} className='text-lg md:text-xl text-gray-700'>
          {description}
        </p>
      </div>
      <div
            style={{
              position: 'relative',
              width: '500px',
              height: '425px',
            }}
          >
            <Image
              src={imageUrl}
              alt="Current Image"
              layout={'fill'}
              objectFit="cover"
            />
          </div>

    </div>
  );
};

export default About;
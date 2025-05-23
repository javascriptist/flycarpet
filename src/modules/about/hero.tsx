import React from 'react';

const AboutHero = () => {
  return (
    <div style={{ textAlign: 'center' }} className='px-16 py-10 max-md:px-2 max-md:mx-2'>
      <div
        style={{
          width: '100%',
          height: '250px',
          backgroundImage: 'url("/aboutuslink.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div
        className='mt-5'
        style={{
          height: '200px',
          backgroundImage: 'url("/flycarpetlogo.png")',
          backgroundSize: 'contain',
          // no-repeat
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  );
};

export default AboutHero;
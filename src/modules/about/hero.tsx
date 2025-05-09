import React from 'react';

const AboutHero = () => {
  return (
    <div style={{ textAlign: 'center' }} className='px-16 py-10'>
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
          backgroundImage: 'url("/logoblackss.png")',
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
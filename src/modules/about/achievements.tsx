import React from 'react';

const Achievements = () => {
  const data = [
    { number: '10M+', text: 'Happy Customers Worldwide' },
    { number: '99.9%', text: 'Uptime Guarantee' },
    { number: '50+', text: 'Countries Served' },
    { number: '25 Years', text: 'Industry Experience' },
  ];

  return (
    <div className='cover'>
      <div className=" mx-14 my-10 px-5 bg-gray-100" style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', padding: '20px' }}>
        {data.map((item, index) => (
          <div
            key={index}
            className="text-center p-6 flex flex-col w-1/4"
          >
            <h2 className="text-4xl">{item.number}</h2>
            <p className="text-gray-700 mt-2">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
      
  );
};

export default Achievements;
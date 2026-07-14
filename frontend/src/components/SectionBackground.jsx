import React from 'react';

const SectionBackground = ({ imageUrl, children }) => {
  return (
    <section 
      className="section-bg relative"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* A lighter overlay to allow the animated background to show */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
};

export default SectionBackground;
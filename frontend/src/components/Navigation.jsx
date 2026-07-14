import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: 'hero', label: 'Dashboard' },
    { to: 'predictor', label: 'Predictor' },
    { to: 'features', label: 'Features' },
    { to: 'accuracy', label: 'Accuracy' },
    { to: 'future', label: 'Future' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <span className="octane-font text-2xl text-white">INSURANCE DASH</span>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              smooth={true}
              duration={800}
              className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-300 text-sm uppercase tracking-wider hover:scale-105 transform"
              activeClass="text-blue-400"
              spy={true}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
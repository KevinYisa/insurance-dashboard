import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.002;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Create a dynamic radial gradient
      const gradient = ctx.createRadialGradient(
        width * (0.5 + 0.4 * Math.sin(time * 0.5)),
        height * (0.5 + 0.4 * Math.cos(time * 0.7)),
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      
      // Evolving color palette
      gradient.addColorStop(0, `hsl(${230 + 20 * Math.sin(time * 0.3)}, 70%, 30%)`);
      gradient.addColorStop(0.5, `hsl(${260 + 20 * Math.sin(time * 0.5 + 1)}, 80%, 20%)`);
      gradient.addColorStop(1, `hsl(${280 + 20 * Math.sin(time * 0.7 + 2)}, 90%, 10%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default AnimatedBackground;
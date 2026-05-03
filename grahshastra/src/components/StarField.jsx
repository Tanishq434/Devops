import React, { useEffect, useRef, useMemo } from 'react';

export default function StarField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const stars = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.0003 + 0.0001,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: i % 12 === 0 ? '#f59e0b' : i % 8 === 0 ? '#a78bfa' : '#ffffff',
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      stars.forEach(star => {
        const opacity = 0.4 + 0.6 * Math.abs(Math.sin(t * star.twinkleSpeed + star.twinkleOffset));
        const x = (star.x + star.speed * t) % 1;
        const y = star.y;

        ctx.beginPath();
        ctx.arc(x * canvas.width, y * canvas.height, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Glow for brighter stars
        if (star.r > 1.4) {
          ctx.beginPath();
          ctx.arc(x * canvas.width, y * canvas.height, star.r * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            x * canvas.width, y * canvas.height, 0,
            x * canvas.width, y * canvas.height, star.r * 3
          );
          gradient.addColorStop(0, star.color + '66');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = opacity * 0.4;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

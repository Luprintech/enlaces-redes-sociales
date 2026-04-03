'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  opacityDelta: number;
  color: string;
}

interface Props {
  palette?: string[];
  count?: number;
}

export default function StarField({
  palette = ['255, 255, 255'],
  count = 120,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStar(): Star {
      return {
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: Math.random() * (canvas?.height ?? window.innerHeight),
        radius: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        opacity: Math.random(),
        opacityDelta: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        color: palette[Math.floor(Math.random() * palette.length)] ?? '255, 255, 255',
      };
    }

    function init() {
      resize();
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push(createStar());
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        // Move
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle
        star.opacity += star.opacityDelta;
        if (star.opacity <= 0.1) { star.opacity = 0.1; star.opacityDelta *= -1; }
        if (star.opacity >= 1) { star.opacity = 1; star.opacityDelta *= -1; }

        // Draw glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
        gradient.addColorStop(0, `rgba(${star.color}, ${star.opacity})`);
        gradient.addColorStop(1, `rgba(${star.color}, 0)`);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', init);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', init);
    };
  }, [palette, count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

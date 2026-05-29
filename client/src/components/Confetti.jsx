import React, { useEffect, useRef } from 'react';

const COLORS = ['#39ff14','#ffd700','#00bfff','#ff6b6b','#a855f7','#f97316'];

export default function Confetti({ active = true }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      vr: (Math.random() - 0.5) * 0.15,
    }));

    let alive = true;
    function draw() {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let anyVisible = false;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.07;
        if (p.y < canvas.height + 30) anyVisible = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (anyVisible) animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      alive = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 9999,
      }}
    />
  );
}

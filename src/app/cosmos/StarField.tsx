'use client';
import { useEffect, useRef } from 'react';
import { StarData } from './star-generator';

interface StarFieldProps {
  star: StarData;
  width?: number;
  height?: number;
}

export const StarField = ({ star, width = 400, height = 400 }: StarFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, width, height);
    
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.fillRect(x, y, 1, 1);
    }
    
    if (star.constellationPoints.length > 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(
        (star.constellationPoints[0].x / 100) * width,
        (star.constellationPoints[0].y / 100) * height
      );
      for (let i = 1; i < star.constellationPoints.length; i++) {
        ctx.lineTo(
          (star.constellationPoints[i].x / 100) * width,
          (star.constellationPoints[i].y / 100) * height
        );
      }
      ctx.stroke();
    }
    
    star.constellationPoints.forEach(point => {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.arc((point.x / 100) * width, (point.y / 100) * height, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = star.radius;
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, baseRadius * 3
    );
    gradient.addColorStop(0, star.color);
    gradient.addColorStop(0.4, star.color + '40');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
  }, [star, width, height]);
  
  return <canvas ref={canvasRef} width={width} height={height} className="rounded-lg shadow-2xl" />;
};
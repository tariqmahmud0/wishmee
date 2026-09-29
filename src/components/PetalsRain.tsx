import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  color: string;
}

export const PetalsRain: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const colors = ['#fbcfe8', '#f472b6', '#fda4af', '#fecdd3', '#fed7aa'];
    const interval = setInterval(() => {
      setPetals((prev) => {
        const newPetal: Petal = {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          size: Math.random() * 12 + 10,
          duration: Math.random() * 3 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        // Keep list bounded
        const updated = [...prev, newPetal];
        return updated.slice(-25);
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-particle absolute"
          style={{
            left: `${petal.left}vw`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: petal.color,
            borderRadius: '150% 0 150% 0',
            animationDuration: `${petal.duration}s`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}
        />
      ))}
    </div>
  );
};

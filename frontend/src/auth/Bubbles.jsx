import React, { useMemo } from 'react';
import './bubbles.css';

// Small seeded random, so the bubbles look the same on every visit
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function Bubbles({ count = 22 }) {
  const bubbles = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: count }, (_, i) => {
      const size = 10 + Math.round(rand() * 70);          // 10px - 80px
      const duration = 16 + rand() * 18;                   // 16s - 34s (slow and calm)
      return {
        id: i,
        left: `${Math.round(rand() * 100)}%`,
        size,
        duration,
        delay: -rand() * duration,                         // start mid-way, no empty screen
        sway: `${Math.round(10 + rand() * 30) * (rand() > 0.5 ? 1 : -1)}px`,
        swayDuration: 5 + rand() * 5,
        opacity: (0.35 + rand() * 0.45).toFixed(2),
      };
    });
  }, [count]);

  return (
    <div className="spda-bubbles" aria-hidden="true">
      {bubbles.map(b => (
        <span
          key={b.id}
          className="spda-bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s, ${b.swayDuration}s`,
            animationDelay: `${b.delay}s, ${b.delay / 3}s`,
            '--bubble-sway': b.sway,
            '--bubble-opacity': b.opacity,
          }}
        />
      ))}
    </div>
  );
}

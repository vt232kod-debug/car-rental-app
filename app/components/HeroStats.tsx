'use client';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  end: number;
  decimals?: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { end: 50, suffix: '+', label: 'Premium Cars' },
  { end: 1, suffix: 'k+', label: 'Happy Clients' },
  { end: 4.9, decimals: 1, suffix: '', label: 'Average Rating' },
];

function useCountUp(end: number, decimals = 0, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [active, end, decimals]);

  return value.toFixed(decimals);
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const display = useCountUp(stat.end, stat.decimals ?? 0, active);
  return (
    <div className='text-center'>
      <div className='text-2xl font-extrabold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] md:text-3xl'>
        {display}
        {stat.suffix}
      </div>
      <div className='mt-1 text-xs text-white/60'>{stat.label}</div>
    </div>
  );
}

export default function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className='animate-fade-up animation-delay-400 mt-16 grid grid-cols-3 gap-8 border-t border-white/20 pt-10 sm:gap-16'
    >
      {STATS.map(stat => (
        <StatItem key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  );
}

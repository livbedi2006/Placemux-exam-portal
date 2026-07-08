'use client';
import { useEffect, useRef, useState } from 'react';

interface Props { end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; }

export function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '', decimals = 0 }: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const startTime = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(parseFloat((eased * end).toFixed(decimals)));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, decimals]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

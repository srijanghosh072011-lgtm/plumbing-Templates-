'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * Scroll-entry reveal via IntersectionObserver.
 *
 * Deliberately not Framer Motion — this is the only animation on the site
 * that needs JS, and it is ~20 lines. A 40kB animation library to fade
 * things in would be the single largest script on a page whose whole job is
 * loading fast on a phone.
 *
 * The observer disconnects after firing, so there is no live observer per
 * element once the page has been read through.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div' as ElementType,
  className = '',
}: {
  children: ReactNode;
  /** Stagger in ms. Keep siblings ≤ 300ms apart or it reads as sluggish. */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect the OS setting without animating first and correcting after.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.shown = 'true';
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(() => {
          el.dataset.shown = 'true';
        }, delay);
        io.disconnect();
      },
      // Fire slightly before the element is fully on screen so the motion
      // has finished by the time it is centred and being read.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

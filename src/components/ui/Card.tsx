import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  /** Extra Tailwind classes, e.g. padding: "p-5 sm:p-6". */
  className?: string;
  /** Which HTML element to render. Defaults to <section>. */
  as?: 'section' | 'div';
}

/** The white rounded panel with a soft shadow that wraps each part of the page. */
export function Card({ children, className = '', as: Tag = 'section' }: CardProps) {
  return (
    <Tag
      className={`rounded-[28px] ${className}`}
      style={{ background: 'var(--surface)', boxShadow: 'var(--shadow)' }}
    >
      {children}
    </Tag>
  );
}

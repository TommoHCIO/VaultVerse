'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({ 
  href = '#main-content',
  children = 'Skip to main content'
}: SkipLinkProps) {
  return (
    <motion.a
      href={href}
      className={`
        absolute top-0 left-0 z-[9999] px-4 py-2 m-2
        bg-neon-green text-vaultor-dark font-semibold text-sm
        rounded-lg shadow-lg
        transform -translate-y-full opacity-0
        focus:translate-y-0 focus:opacity-100
        transition-all duration-200
        outline-none focus:outline-none
        ring-2 ring-neon-green ring-offset-2 ring-offset-vaultor-dark
      `}
      whileFocus={{
        scale: 1.05,
      }}
      onClick={(e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          (target as HTMLElement).focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      {children}
    </motion.a>
  );
}

export function SkipNavigation() {
  const skipLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' }
  ];

  return (
    <nav aria-label="Skip navigation links" className="sr-only focus-within:not-sr-only">
      <ul className="absolute top-2 left-2 z-[9999] space-y-1">
        {skipLinks.map((link, index) => (
          <li key={index}>
            <SkipLink href={link.href}>
              {link.label}
            </SkipLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
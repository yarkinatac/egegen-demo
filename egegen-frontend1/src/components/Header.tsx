'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Menü', href: '/#menu' },
  { label: 'Kategoriler', href: '/#category' },
  { label: 'Hakkımızda', href: '/#about' },
  { label: 'İletişim', href: '/#contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      id="header"
      className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-cream-dark/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="logo-link">
            <Coffee className="h-7 w-7 text-teal-dark transition-transform duration-300 group-hover:rotate-12" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-teal-dark">
                Coffee Shop
              </span>
              <span className="text-[10px] font-medium tracking-widest text-teal-dark/60 uppercase">
                TAZE VE SICAK
              </span>
            </div>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-teal-dark/70 transition-colors duration-200 hover:text-teal-dark after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-teal-dark after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Siparis butonu */}
          <div className="hidden md:block">
            <Link
              href="/#menu"
              id="order-now-btn"
              className="inline-flex items-center rounded-full bg-teal-dark px-6 py-2.5 text-sm font-semibold text-cream transition-all duration-300 hover:bg-teal-darker hover:shadow-lg hover:shadow-teal-dark/25 active:scale-[0.97]"
            >
              Sipariş Ver
            </Link>
          </div>

          {/* Mobil menu butonu */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 text-teal-dark"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menüyü aç / kapat"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobil menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="border-t border-cream-dark/30 bg-cream px-4 py-4 space-y-1" id="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-teal-dark/80 transition-colors hover:bg-teal-dark/5 hover:text-teal-dark"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#menu"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-full bg-teal-dark px-6 py-2.5 text-center text-sm font-semibold text-cream"
          >
            Sipariş Ver
          </Link>
        </nav>
      </div>
    </header>
  );
}

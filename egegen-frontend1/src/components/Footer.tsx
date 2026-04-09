import { Coffee, Globe, Mail, Send } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-cream/80" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Ust kisim */}
        <div className="grid gap-10 py-16 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Coffee className="h-7 w-7 text-gold" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-cream">Coffee Shop</span>
                <span className="text-[10px] font-medium tracking-widest text-cream/50 uppercase">
                  TAZE VE SICAK
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              En iyi yörelerden gelen özenle seçilmiş kahve çekirdekleri, sizin için taze taze demleniyor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Ana Sayfa', 'Menü', 'Hakkımızda', 'İletişim'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="transition-colors duration-200 hover:text-cream"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Bize Ulaşın
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>Kahve Cad. No: 123, İstanbul</li>
              <li>+90 (555) 123 45 67</li>
              <li>merhaba@coffeeshop.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Çalışma Saatleri
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>Hafta İçi: 07:00 – 21:00</li>
              <li>Cumartesi: 08:00 – 22:00</li>
              <li>Pazar: 09:00 – 20:00</li>
            </ul>
          </div>
        </div>

        {/* Alt kisim */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-6 md:flex-row">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Coffee Shop. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            {[Globe, Mail, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-full bg-cream/10 p-2 transition-colors duration-200 hover:bg-cream/20"
                aria-label="Sosyal medya"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

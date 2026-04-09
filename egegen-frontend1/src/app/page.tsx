import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProducts } from '@/lib/api';

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section
          id="hero"
          className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-teal-dark coffee-bean-pattern"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-dark via-teal-dark/95 to-teal-darker/80" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-8">
              {/* Sol kolon */}
              <div className="flex flex-col justify-center animate-fade-in-up">
                <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="text-xs font-medium tracking-wider text-cream/80 uppercase">
                    BirincI SInIf Kahve DeneyimI
                  </span>
                </div>

                <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-cream sm:text-5xl lg:text-6xl xl:text-7xl">
                  Taze
                  <br />
                  Çekilmiş{' '}
                  <span className="relative">
                    <span className="relative z-10">Kahve</span>
                    <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-gold/30 rounded-full" />
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/60 sm:text-lg">
                  Dünyanın en iyi yörelerinden özenle seçilen çekirdeklerle hazırladığımız taze kahvelerle güne güzel bir başlangıç yapın.
                </p>

                {/* Butonlar */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/#menu"
                    id="hero-menu-btn"
                    className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-teal-dark transition-all duration-300 hover:bg-cream-dark hover:shadow-xl hover:shadow-black/10 active:scale-[0.97]"
                  >
                    Menümüzü İncele
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/#contact"
                    id="hero-contact-btn"
                    className="inline-flex items-center rounded-full border-2 border-cream/40 px-7 py-3.5 text-sm font-semibold text-cream transition-all duration-300 hover:border-cream hover:bg-cream/10"
                  >
                    Bize Ulaşın
                  </Link>
                </div>

                {/* Istatistikler */}
                <div className="mt-12 flex items-center gap-8 border-t border-cream/10 pt-8">
                  {[
                    { value: '10B+', label: 'Mutlu Müşteri' },
                    { value: '50+', label: 'Kahve Çeşidi' },
                    { value: '4.9', label: 'Müşteri Puanı' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-cream">{stat.value}</p>
                      <p className="text-xs text-cream/50">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sag kolon - gorseller */}
              <div className="relative flex items-center justify-center lg:justify-end">
                {/* Arka plan glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[100px]" />

                {/* Kahve gorseli */}
                <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <Image
                    src="/hero-coffee-cup.png"
                    alt="Kahve bardagi"
                    width={480}
                    height={480}
                    className="relative z-10 drop-shadow-2xl"
                    priority
                  />

                  {/* Floating kart */}
                  <div
                    className="glass-card absolute -bottom-4 -left-8 z-20 flex items-center gap-3 px-4 py-3 animate-float sm:-left-16"
                    id="floating-card-product"
                  >
                    <Image
                      src="/cappuccino-thumbnail.png"
                      alt="Sabah kahvesi"
                      width={52}
                      height={52}
                      className="rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-cream">Sabah Kahvesi</p>
                      <p className="mt-0.5 max-w-[160px] text-[10px] leading-snug text-cream/50">
                        Güne zinde başlamanız için yumuşak içimli sabah kahvemiz.
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3"
                            fill={i < 5 ? '#c8a951' : 'transparent'}
                            stroke={i < 5 ? '#c8a951' : 'currentColor'}
                          />
                        ))}
                        <span className="ml-1 text-[10px] font-medium text-cream/60">
                          4.9 / 5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Degerlendirme karti */}
                  <div
                    className="glass-card absolute -right-4 top-1/4 z-20 max-w-[200px] px-4 py-3 animate-float-delayed sm:-right-12"
                    id="floating-card-rating"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5"
                          fill="#c8a951"
                          stroke="#c8a951"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-cream/60">
                      Tutkulu kahve severler tarafından yapılan değerlendirmelerde <span className="font-bold text-cream">4.9 / 5.0</span> yıldız ile tam not aldık.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urunler */}
        <section id="menu" className="bg-cream py-24 relative overflow-hidden">
          {/* Arka plan deseni */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')]" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-sm font-bold tracking-widest text-[#c8a951] uppercase">MENÜMÜZ</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-teal-dark sm:text-4xl">
                Özel Seçim Ürünlerimiz
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#c8a951]/60" />
            </div>

            {products.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, i) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.slug}`}
                    className="group relative flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-teal-dark/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-dark/10 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="mb-6 flex aspect-square items-center justify-center rounded-2xl bg-teal-dark/5">
                        <Package className="h-16 w-16 text-teal-dark/20 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-teal-dark line-clamp-2">
                          {product.name}
                        </h3>
                        <span className="shrink-0 rounded-full bg-teal-dark/5 px-2.5 py-1 text-sm font-semibold text-teal-dark">
                          {Number(product.price).toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                      
                      {product.origin && (
                        <p className="mt-2 text-sm text-teal-dark/60 font-medium">
                          {product.origin}
                        </p>
                      )}

                      <div className="mt-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          (product.variations?.reduce((acc, v) => acc + v.stock, 0) || 0) > 0 
                            ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}>
                          {(product.variations?.reduce((acc, v) => acc + v.stock, 0) || 0) > 0 
                            ? `Stok: ${product.variations?.reduce((acc, v) => acc + v.stock, 0)}` 
                            : 'Stokta Yok'}
                        </span>
                      </div>
                      
                      {product.description && (
                        <p className="mt-3 text-sm leading-relaxed text-teal-dark/50 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="mt-auto pt-6">
                        <div className="flex items-center text-sm font-bold text-[#c8a951] transition-colors group-hover:text-amber-500">
                          Ürünü İncele
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-teal-dark/5 shadow-sm">
                <Package className="h-12 w-12 mx-auto text-teal-dark/20 mb-4" />
                <h3 className="text-lg font-bold text-teal-dark">Henüz ürün eklenmemiş</h3>
                <p className="mt-2 text-sm text-teal-dark/50">Admin panel üzerinden yeni ürünler ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

# E-Ticaret Case Study

Laravel (backend API) + Next.js (frontend + admin panel) ile geliştirilmiş bir e-ticaret ürün yönetim sistemi.

*Frontend:** https://egegen-demo.vercel.app
*Admin Panel:** https://egegen-demo.vercel.app/admin
*API:** https://egegen-demo.onrender.com/api/products

## Kurulum

### Gereksinimler

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend (Laravel)

```bash
cd egegen
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan serve    # http://127.0.0.1:8000
```

### Frontend (Next.js)

```bash
cd egegen-frontend1
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

> `.env.local` dosyasındaki `NEXT_PUBLIC_API_URL` değişkeni Laravel API adresini göstermelidir. Varsayılan olarak `http://127.0.0.1:8000/api` şeklindedir.

Backend ve frontend ayrı terminallerde çalıştırılmalıdır.

### Admin Panel Kullanımı

Admin panele `/admin` adresinden ulaşılır. Burada:

- **Ürünler** — Ürün ekleme, düzenleme, silme (dinamik alan ve varyasyon desteğiyle)
- **Dinamik Alanlar** — Farklı tiplerde (input, select, checkbox, radio) özel alan tanımlama
- **Varyasyon Tipleri** — Varyasyon attribute tanımlama (örneğin öğütme tipi, paket boyutu)

## Yapı

```
egegen/                  # Laravel API
  app/
    Models/              # Product, ProductField, ProductVariation vs.
    Http/Controllers/
      Api/               # JSON dönen API controller'ları
      Admin/             # Blade admin controller'ları (eski, artık kullanılmıyor)
  routes/api.php         # API rotaları
  database/
    migrations/          # Tablo tanımları
    seeders/             # Örnek veri

egegen-frontend1/        # Next.js (frontend + admin)
  src/
    app/
      page.tsx           # Ana sayfa — ürün listesi
      product/[slug]/    # Ürün detay sayfası (SSR + SEO)
      admin/             # Admin panel sayfaları
    components/          # Paylaşılan bileşenler
    lib/
      api.ts             # Frontend API fonksiyonları
      admin-api.ts       # Admin CRUD fonksiyonları
      types.ts           # TypeScript tipleri
```

## Veritabanı Yapısı

- `products` — Sabit ürün alanları (isim, fiyat, slug, açıklama vs.)
- `product_fields` — Dinamik alan tanımları (label, tip, seçenekler)
- `product_field_values` — Ürün başına dinamik alan değerleri
- `variation_attributes` — Varyasyon tip tanımları (Öğütme Tipi, Paket Boyutu)
- `variation_attribute_values` — Her tipe ait değerler (Espresso, French Press, 250g vs.)
- `product_variations` — Ürün varyasyonları (SKU, fiyat, stok)
- `product_variation_attributes` — Varyasyon-attribute ilişkisi (pivot)

## Testler

```bash
cd egegen
php vendor/bin/phpunit --testdox
```

20 test, 54 assertion — ürün, dinamik alan ve varyasyon tipi API'leri için CRUD testleri yazıldı.

## Soru Yanıtları

**1. Hangi rendering yöntemini tercih ettiniz ve neden?**

Next.js App Router'da Server Component kullandım. Ürün detay sayfası sunucu tarafında render ediliyor, böylece arama motorları içeriği direkt görebiliyor. `generateMetadata` ile her ürün için dinamik title ve description oluşturdum. Kullanıcının etkileşime girdiği kısımlar (varyasyon seçimi, miktar) Client Component olarak ayrı tuttum. İlk yükleme hızlı, SEO sorunsuz, interaktif kısımlar da çalışıyor.

**2. Bu veri yapısını nasıl kurguladınız?**

Sabit ürün bilgileri (isim, fiyat, açıklama) `products` tablosunda tutuluyor. Dinamik alanlar için EAV benzeri bir yapı kurdum: `product_fields` tablosunda alan tanımları, `product_field_values` tablosunda değerler var. Yeni bir alan eklemek istediğimde veritabanı şemasını değiştirmeme gerek kalmıyor, admin panelden ekliyorum.

Varyasyonlarda da benzer bir yaklaşım izledim. `variation_attributes` ile tip tanımları (Öğütme Tipi gibi), `variation_attribute_values` ile değerleri (Espresso, French Press gibi) tutuluyor. Her varyasyonun kendi SKU, fiyat ve stok bilgisi var, hangi attribute değerlerine sahip olduğu pivot tabloyla bağlanıyor.

**3. Admin panel ve frontend arasında veri akışını nasıl yönettiniz?**

Laravel sadece API olarak çalışıyor, JSON dönüyor. Next.js hem frontend sayfalarını hem de admin paneli barındırıyor. İkisi de aynı API'ye fetch ile istek atıyor. `NEXT_PUBLIC_API_URL` environment variable'ı ile API adresi ayarlanıyor. Admin panelde bir ürün oluşturulduğunda veya güncellendiğinde API üzerinden veritabanına yazılıyor, frontend'de de aynı API'den güncel veri çekilmiş oluyor.

**4. API performansı düşük olursa nasıl bir çözüm düşünürsünüz?**

Önce N+1 sorgu problemlerini kontrol ederim. Zaten Eager Loading (`with()`) kullanıyorum ama büyüyen veri setlerinde gözden kaçabilir. Sonra sık kullanılan endpoint'lere Redis ile cache koyarım. Frontend tarafında Next.js'in revalidate parametresiyle ISR yaparım, böylece her istek API'ye gitmez. Ürün sayısı artarsa pagination eklerim.

**5. Projeyi production ortamına alırken neleri değiştirirsiniz?**

- SQLite yerine MySQL veya PostgreSQL kullanırım
- `APP_DEBUG=false` yapar, hata detaylarını gizlerim
- HTTPS zorunlu hale getiririm
- Ürün görsellerini S3 gibi bir storage servisine taşırım
- CORS ayarlarını sadece izin verilen domain'lere açarım
- `npm run build` ile production build alırım
- Queue ve job yapısı kurarak ağır işlemleri arka plana alırım

**6. Güvenlik açısından hangi önlemleri alırsınız?**

- Admin panel rotalarına authentication middleware eklerim (Sanctum veya Breeze ile)
- API'de rate limiting uygularım
- CORS'u sadece frontend domain'ine açarım (şimdilik `*` olarak bıraktım geliştirme kolaylığı için)
- Tüm form girdilerini Laravel validation'dan geçiriyorum (zaten aktif)
- SQL injection'a karşı Eloquent ORM kullanıyorum, raw query yok
- XSS için React'in otomatik escaping'ine güveniyorum

---

**Teknolojiler:** Laravel 11, Next.js 16 (App Router), Tailwind CSS, SQLite, Vercel, Render

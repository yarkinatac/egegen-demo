# E-Ticaret Case Study

Laravel (backend) + Next.js (frontend) ile geliştirilmiş bir e-ticaret ürün yönetim sistemi.

Backend tarafında admin panel üzerinden ürün, dinamik alan ve varyasyon yönetimi yapılabiliyor. Frontend tarafında ürünler API üzerinden çekilip listeleniyor ve detay sayfasında varyasyon seçimi yapılabiliyor.

**Demo:** https://egegen-case.vercel.app

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
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
npm run dev          # Vite asset build (ayri terminal)
php artisan serve    # http://127.0.0.1:8000
```

Admin panel: http://127.0.0.1:8000/admin/products

### Frontend (Next.js)

```bash
cd egegen-frontend1
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

> `.env.local` dosyasindaki `NEXT_PUBLIC_API_URL` degiskeni Laravel API adresini gostermelidir. Varsayilan olarak `http://127.0.0.1:8000/api` seklindedir.

**Not:** Backend ve frontend ayri terminallerde ayni anda calistirilmalidir.

## Soru Yanitlari

**1. Hangi rendering yontemini tercih ettiniz ve neden?**

Next.js App Router ile Server Component yapisini kullandim. Urun detay sayfasinin SEO icin sunucu tarafinda render olmasi gerekiyordu, `generateMetadata` ile dinamik meta tag'ler olusturdum. Kullanicinin etkilesime girdigi kisimlar (varyasyon secimi, miktar, sepete ekleme) ise Client Component olarak ayirdim. Boylece sayfa ilk yuklendiginde HTML hazir geliyor ama interaktif kisimlar da calisiyor.

**2. Bu veri yapisini nasil kurgulardiniz?**

Urunlerin sabit alanlari (isim, fiyat, aciklama vs.) `products` tablosunda tutuluyor. Dinamik alanlar icin `product_fields` tablosunda alan tanimlari, `product_field_values` tablosunda da her urune ait degerler saklaniyor. Bu sayede veritabani semasini degistirmeden yeni ozellikler eklenebiliyor.

Varyasyonlar icin `variation_attributes` tablosunda tip tanimlari (mesela "Ogutme Tipi", "Paket Boyutu"), `variation_attribute_values` tablosunda da bu tiplerin alabilecegi degerler tutuluyor. Her `product_variation` kaydi kendi fiyat ve stok bilgisine sahip, hangi attribute degerlerine sahip oldugu da pivot tablo ile iliskilendiriliyor.

**3. Admin panel ve frontend arasinda veri akisini nasil yonettiniz?**

Laravel tarafinda hem Blade ile admin panel hem de JSON donen API endpoint'leri var. Frontend, `.env.local` dosyasindaki `NEXT_PUBLIC_API_URL` degiskeni uzerinden Laravel API'ye fetch ile istek atiyor. Admin panelde yapilan degisiklikler API'den aninda frontend'e yansiyor.

**4. API performansi dusuk olursa nasil bir cozum dusunursunuz?**

Oncelikle Eager Loading'i kontrol ederim, N+1 sorgu problemleri varsa `with()` ile cozerim. Sonra sik erisilen endpoint'lere Redis veya Laravel'in cache mekanizmasiyla onbellek koyarim. Frontend tarafinda da Next.js'in `revalidate` parametresiyle belirli araliklarla cache'den okuma yapilabilir. Eger urun sayisi cok artarsa API'ye pagination eklerim.

**5. Projeyi production ortamina alirken neleri degistirirsiniz?**

- SQLite yerine MySQL veya PostgreSQL kullanirim
- `.env` dosyasinda `APP_DEBUG=false` yaparim
- HTTPS zorunlu hale getiririm
- Urun resimlerini S3 veya CDN'e tasirim
- Next.js Image component'inin domain ayarlarini yaparim
- `npm run build` ile production build alirim

**6. Guvenlik acisindan hangi onlemleri alirsiniz?**

- Admin panel rotalarina authentication middleware eklerim (Laravel Breeze veya Sanctum ile)
- API isteklerinde rate limiting uygularim
- CORS ayarlarini sadece frontend domain'ine acarim
- Tum form girdilerini Laravel validation'dan geciririm
- CSRF token kontrolu zaten Blade formlarinda aktif

---

**Teknolojiler:** Laravel 11, Next.js (App Router), Tailwind CSS, SQLite

# E-Ticaret Case Study

Laravel (backend) + Next.js (frontend) ile geliştirilmiş bir e-ticaret ürün yönetim sistemi.

Backend tarafında admin panel üzerinden ürün, dinamik alan ve varyasyon yönetimi yapılabiliyor. Frontend tarafında ürünler API üzerinden çekilip listeleniyor ve detay sayfasında varyasyon seçimi yapılabiliyor.

## Kurulum

### Backend (Laravel)

```bash
cd egegen
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
npm run dev   # Vite asset build
php artisan serve
```

### Frontend (Next.js)

```bash
cd egegen-frontend1
npm install
# .env.local dosyasında API_URL ayarlı olmalı
npm run dev
```

## Soru Yanıtları

**1. Hangi rendering yöntemini tercih ettiniz ve neden?**

Next.js App Router ile Server Component yapısını kullandım. Ürün detay sayfasının SEO için sunucu tarafında render olması gerekiyordu, `generateMetadata` ile dinamik meta tag'ler oluşturdum. Kullanıcının etkileşime girdiği kısımları (varyasyon seçimi, miktar, sepete ekleme) ise Client Component olarak ayırdım. Böylece sayfa ilk yüklendiğinde HTML hazır geliyor ama interaktif kısımlar da çalışıyor.

**2. Bu veri yapısını nasıl kurguladınız?**

Ürünlerin sabit alanları (isim, fiyat, açıklama vs.) `products` tablosunda tutuluyor. Dinamik alanlar için `product_fields` tablosunda alan tanımları, `product_field_values` tablosunda da her ürüne ait değerler saklanıyor. Bu sayede veritabanı şemasını değiştirmeden yeni özellikler eklenebiliyor.

Varyasyonlar için `variation_attributes` tablosunda tip tanımları (mesela "Öğütme Tipi", "Paket Boyutu"), `variation_attribute_values` tablosunda da bu tiplerin alabileceği değerler tutuluyor. Her `product_variation` kaydı kendi fiyat ve stok bilgisine sahip, hangi attribute değerlerine sahip olduğu da pivot tablo ile ilişkilendiriliyor.

**3. Admin panel ve frontend arasında veri akışını nasıl yönettiniz?**

Laravel tarafında hem Blade ile admin panel hem de JSON dönen API endpoint'leri var. Frontend, `.env.local` dosyasındaki `NEXT_PUBLIC_API_URL` değişkeni üzerinden Laravel API'ye fetch ile istek atıyor. Admin panelde yapılan değişiklikler API'den anında frontend'e yansıyor.

**4. API performansı düşük olursa nasıl bir çözüm düşünürsünüz?**

Öncelikle Eager Loading'i kontrol ederim, N+1 sorgu problemleri varsa `with()` ile çözerim. Sonra sık erişilen endpoint'lere Redis veya Laravel'in cache mekanizmasıyla önbellek koyarım. Frontend tarafında da Next.js'in `revalidate` parametresiyle belirli aralıklarla cache'den okuma yapılabilir. Eğer ürün sayısı çok artarsa API'ye pagination eklerim.

**5. Projeyi production ortamına alırken neleri değiştirirsiniz?**

- SQLite yerine MySQL veya PostgreSQL kullanırım
- `.env` dosyasında `APP_DEBUG=false` yaparım
- HTTPS zorunlu hale getiririm
- Ürün resimlerini S3 veya CDN'e taşırım
- Next.js Image component'inin domain ayarlarını yaparım
- `npm run build` ile production build alırım

**6. Güvenlik açısından hangi önlemleri alırsınız?**

- Admin panel rotalarına authentication middleware eklerim (Laravel Breeze veya Sanctum ile)
- API isteklerinde rate limiting uygularım
- CORS ayarlarını sadece frontend domain'ine açarım
- Tüm form girdilerini Laravel validation'dan geçiririm
- CSRF token kontrolü zaten Blade formlarında aktif

---

**Teknolojiler:** Laravel 11, Next.js (App Router), Tailwind CSS, SQLite

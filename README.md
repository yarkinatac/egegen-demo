# E-Ticaret Case Study

Egegen Full Stack Developer pozisyonu için Laravel (backend API) + Next.js (frontend + admin panel) ile geliştirilmiş bir e-ticaret ürün yönetim sistemi.

*Frontend:** https://egegen-demo.vercel.app
*Admin Panel:** https://egegen-demo.vercel.app/admin
*API:** https://egegen-demo.onrender.com/api/products
Öncelikle frontend kısmında estetik ve endüstriye uygun bir tasarım seçmek istedim çünkü her ne kadar backend önemli olsa da ilk bakışta göze estetik gelmesi de önem bulunduruyor. Bu sebepten tasarımları inceledim ve beğendiğim tasarımdan esinlenerek alıntılar yaparak bir kurgu oluşturdum. Uygulamayı deploy ederken render ile apiyi deploy ettim araştırma sonuçlarıma göre vercel ile php tabanlı projeleri deploy edemiyormuşuz. Bu sebepten render kullanmak doğru geldi. Fakat admin panel ve frontend kısmı NextJs ile olduğu için vercel ile deploy edebildim.

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

> `.env.local` dosyasındaki `NEXT_PUBLIC_API_URL` değişkeni Laravel API adresini göstermelidir. Varsayılan olarak `http://127.0.0.1:8000/api` şeklinde.

Backend ve frontend ayrı terminallerde çalıştırılmalıdır. Önce backend daha sonra frontend çalıştırılmalı ki veriler gelsin uygulama hata vermesin.

### Admin Panel Kullanımı

Admin panele `/admin` adresinden ulaşılır. Burada:

- **Ürünler** — Ürün ekleme, düzenleme, silme yani CRUD işlemleri 
- **Dinamik Alanlar** — Farklı tiplerde (input, select, checkbox, radio) üzerinde denemeler yaptım.
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
    seeders/             # Manuel olarak veri eklemek için

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

20 test, 54 assertion — ürün, dinamik alan ve varyasyon tipi API'leri için CRUD testlerini yazmaya çalıştım.

## Soru Yanıtları

**1. Hangi rendering yöntemini tercih ettiniz ve neden?**

Daha önceden hakim olduğum için Next.js App Router'da Server Component kullandım. Ürün detay sayfası sunucu tarafında render ediliyor, böylece arama motorları içeriği direkt görebiliyor. `generateMetadata` ile her ürün için dinamik title ve description oluşturdum. Kullanıcının etkileşime girdiği kısımlar (varyasyon seçimi, miktar) Client Component olarak ayrı tuttum. Böylece ilk yükleme hızlı olacak.

**2. Bu veri yapısını nasıl kurguladınız?**

Sabit ürün bilgileri (isim, fiyat, açıklama) `products` tablosunda tutuluyor. Dinamik alanlar için EAV benzeri bir yapı kurdum: `product_fields` tablosunda alan tanımları, `product_field_values` tablosunda değerler var. Yeni bir alan eklemek istediğimde veritabanı şemasını değiştirmeme gerek kalmıyor, admin panelden ekliyorum.

Varyasyonlarda da benzer bir yaklaşım izledim. `variation_attributes` ile tip tanımları (Öğütme Tipi gibi), `variation_attribute_values` ile değerleri (Espresso, French Press gibi) tutuluyor. Her varyasyonun kendi SKU, fiyat ve stok bilgisi var, hangi attribute değerlerine sahip olduğu pivot tabloyla bağlanıyor.

**3. Admin panel ve frontend arasında veri akışını nasıl yönettiniz?**

Laravel sadece API olarak çalışıyor, JSON dönüyor. Next.js hem frontend sayfalarını hem de admin paneli barındırıyor. İkisi de aynı API'ye fetch ile istek atıyor. `NEXT_PUBLIC_API_URL` environment variable'ı ile API adresi ayarlanıyor. Admin panelde bir ürün oluşturulduğunda veya güncellendiğinde API üzerinden veritabanına yazılıyor, frontend'de de aynı API'den güncel veri çekilmiş oluyor. Bu yapıya çok hakim olduğum için .net ağırlıklı bir bilgim olmasına rağmen laravel kısmında sadece syntax sorunu yaşadım. Fakat onu dabaşarılı bir şekilde üstesinden geldiğime inanıyorum.

**4. API performansı düşük olursa nasıl bir çözüm düşünürsünüz?**

Önce N+1 sorgu problemlerini kontrol ederim. Zaten Eager Loading (`with()`) kullanıyorum ama büyüyen veri setlerinde gözden kaçabilir. Sonra sık kullanılan endpoint'lere Redis ile cache koyarım. Frontend tarafında Next.js'in revalidate parametresiyle ISR yaparım, böylece her istek API'ye gitmez. Ürün sayısı artarsa pagination eklerim.

**5. Projeyi production ortamına alırken neleri değiştirirsiniz?**

Veritabanını kesinlikle değiştirirdim, SQLite geliştirme için pratik ama canlıda MySQL ya da PostgreSQL kullanmak lazım. APP_DEBUG=false yapardım ki kullanıcılar hata detaylarını görmesin. HTTPS kullanımı da gerekiyor. Görseller için de şu an URL olarak tutuyorum ama gerçek projede S3 veya benzeri bir yere yüklerim. Bir de CORS'u sadece kendi domain'ime açarım, şu an * bıraktım ama canlıda öyle bırakmam.

**6. Güvenlik açısından hangi önlemleri alırsınız?**

İlk önce admin panele auth koyarım, şu an herkes girebiliyor çünkü case için önceliği CRUD'a verdim. Sanctum ile token bazlı bir giriş yapardım. API tarafında rate limiting eklerim ki birisi sürekli istek atıp sistemi yormayı denemesin. CORS'u da * bırakmam canlıda, sadece kendi frontend domain'ime açarım. Bunların dışında Laravel'in validation'ını zaten her yerde kullanıyorum, form girdileri kontrol ediliyor. SQL injection konusunda Eloquent kullandığım için raw query yazmıyorum, o taraf güvenli. XSS için de React zaten her şeyi escape ediyor, o konuda ekstra bir şey yapmama gerek kalmadı.

---

**Teknolojiler:** Laravel 11, Next.js 16 (App Router), Tailwind CSS, SQLite, Vercel, Render
**Referanslar:** "https://dribbble.com/tags/coffee-shop", "Next.js & Laravel 11 Build a Modern Full-Stack Application", "https://www.youtube.com/watch?v=JNorzQLaCQc"

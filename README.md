# E-Ticaret Case Study

Laravel (backend API) + Next.js (frontend + admin panel) ile gelistirilmis bir e-ticaret urun yonetim sistemi.

**Frontend:** https://egegen-demo.vercel.app
**Admin Panel:** https://egegen-demo.vercel.app/admin
**API:** https://egegen-demo.onrender.com/api/products

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

> `.env.local` dosyasindaki `NEXT_PUBLIC_API_URL` degiskeni Laravel API adresini gostermelidir. Varsayilan olarak `http://127.0.0.1:8000/api` seklindedir.

Backend ve frontend ayri terminallerde calistirilmalidir.

### Admin Panel Kullanimi

Admin panele `/admin` adresinden ulasilir. Burada:

- **Urunler** - Urun ekleme, duzenleme, silme (dinamik alan ve varyasyon destegi ile)
- **Dinamik Alanlar** - Farkli tiplerde (input, select, checkbox, radio) ozel alan tanimlama
- **Varyasyon Tipleri** - Varyasyon attribute tanimlama (ornegin ogutme tipi, paket boyutu)

## Yapi

```
egegen/                  # Laravel API
  app/
    Models/              # Product, ProductField, ProductVariation vs.
    Http/Controllers/
      Api/               # JSON donen API controller'lari
      Admin/             # Blade admin controller'lari (eski, artik kullanilmiyor)
  routes/api.php         # API rotalari
  database/
    migrations/          # Tablo tanimlari
    seeders/             # Ornek veri

egegen-frontend1/        # Next.js (frontend + admin)
  src/
    app/
      page.tsx           # Ana sayfa - urun listesi
      product/[slug]/    # Urun detay sayfasi (SSR + SEO)
      admin/             # Admin panel sayfalari
    components/          # Paylasilan bilesenler
    lib/
      api.ts             # Frontend API fonksiyonlari
      admin-api.ts       # Admin CRUD fonksiyonlari
      types.ts           # TypeScript tipleri
```

## Veritabani Yapisi

- `products` - Sabit urun alanlari (isim, fiyat, slug, aciklama vs.)
- `product_fields` - Dinamik alan tanimlari (label, tip, secenekler)
- `product_field_values` - Urun basina dinamik alan degerleri
- `variation_attributes` - Varyasyon tip tanimlari (Ogutme Tipi, Paket Boyutu)
- `variation_attribute_values` - Tip baslarina degerler (Espresso, French Press, 250g vs.)
- `product_variations` - Urun varyasyonlari (SKU, fiyat, stok)
- `product_variation_attributes` - Varyasyon-attribute iliskisi (pivot)

## Soru Yanitlari

**1. Hangi rendering yontemini tercih ettiniz ve neden?**

Next.js App Router'da Server Component kullandim. Urun detay sayfasi sunucu tarafinda render ediliyor, bu sayede arama motorlari icerigi direkt gorebiliyor. `generateMetadata` ile her urun icin dinamik title ve description olusturdum. Kullanicinin etkilesime girdigi kisimlar (varyasyon secimi, miktar) Client Component olarak ayri tutuldu. Boylece ilk yukleme hizli oluyor, SEO sorunsuz calisiyor, interaktif kisimlar da bozulmuyor.

**2. Bu veri yapisini nasil kurgulardiniz?**

Sabit urun bilgileri (isim, fiyat, aciklama) `products` tablosunda. Dinamik alanlar icin EAV benzeri bir yapi kurdum: `product_fields` tablosunda alan tanimlari, `product_field_values` tablosunda degerler tutuluyor. Yeni bir alan eklenmek istendiginde veritabani semasini degistirmeye gerek kalmadan admin panelden ekleniyor.

Varyasyonlar icin de benzer bir yaklasim izledim. `variation_attributes` ile tip tanimlari (Ogutme Tipi gibi), `variation_attribute_values` ile degerleri (Espresso, French Press gibi) tutuluyor. Her varyasyonun kendi SKU, fiyat ve stok bilgisi var, hangi attribute degerlerine sahip oldugu pivot tabloyla baglaniyor.

**3. Admin panel ve frontend arasinda veri akisini nasil yonettiniz?**

Laravel sadece API olarak calisiyor ve JSON donuyor. Next.js hem frontend sayfalarini hem de admin paneli barindiriyor. Frontend ve admin ayni API'ye fetch ile istek atiyor. `NEXT_PUBLIC_API_URL` environment variable'i ile API adresi ayarlaniyor. Admin panelde bir urun olusturuldugunda veya guncellendiginde API uzerinden veritabanina yaziliyor, frontend tarafinda da ayni API'den guncel veri cekilmis oluyor.

**4. API performansi dusuk olursa nasil bir cozum dusunursunuz?**

Oncelikle N+1 sorgu problemlerini kontrol ederim. Zaten Eager Loading (`with()`) kullaniyorum ama buyuyen veri setlerinde gozden kacabilir. Sonra sik kullanilan endpoint'lere Redis ile cache koyarim. Frontend tarafinda Next.js'in revalidate parametresiyle ISR yaparim, boylece her istek API'ye gitmez. Urun sayisi artarsa pagination ekler, buyuk listelerde cursor-based pagination kullanirim.

**5. Projeyi production ortamina alirken neleri degistirirsiniz?**

- SQLite yerine MySQL veya PostgreSQL kullanirim
- `APP_DEBUG=false` yapar, hata detaylarini gizlerim
- HTTPS zorunlu hale getiririm
- Urun gorsellerini S3 veya benzeri bir storage servisine tasirim
- CORS ayarlarini sadece izin verilen domain'lere acarim
- `npm run build` ile production build alirim
- Queue ve job yapisi kurarak agir islemleri arka plana alirim

**6. Guvenlik acisindan hangi onlemleri alirsiniz?**

- Admin panel rotalarina authentication middleware eklerim (Sanctum veya Breeze ile)
- API'de rate limiting uygularim
- CORS'u sadece frontend domain'ine acarim (simdilik `*` olarak birakildi gelistirme kolayligi icin)
- Tum form girdilerini Laravel validation'dan geciririm (zaten aktif)
- SQL injection'a karsi Eloquent ORM kullaniyorum, raw query yok
- XSS icin React'in otomatik escaping'ine guveniyorum

---

**Teknolojiler:** Laravel 11, Next.js 16 (App Router), Tailwind CSS, SQLite, Vercel, Render

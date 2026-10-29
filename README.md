# Kitap Takibi

Okuduğun ve okuyacağın kitapları tek yerde takip etmek için geliştirilmiş, tarayıcıda çalışan bir CRUD uygulaması.

## Proje Hakkında

Kitap Takibi; kitap adı, yazar, sayfa sayısı, okuma durumu ve isteğe bağlı bir notla kayıt oluşturmanı sağlar. Kayıtlar tarayıcının LocalStorage alanında saklanır; sayfa yenilendiğinde korunur. Uygulama herhangi bir backend veya kullanıcı hesabı gerektirmez.

## Özellikler

- Kitap ekleme
- Sayfa sayısı bilgisi
- Kitapları listeleme
- Kitap bilgilerini düzenleme
- Onaylı kitap silme
- Zorunlu alan ve karakter sınırı doğrulaması
- Boş liste durumu
- İşlem sonucu bildirimleri
- LocalStorage ile veri kalıcılığı
- Farklı ekran genişliklerine uyumlu arayüz

## Teknolojiler

- React 19
- Vite 8
- Tailwind CSS 4
- LocalStorage

## Proje Yapısı

```text
src/
├─ components/   # BookForm ve BookList bileşenleri
├─ pages/        # BooksPage sayfası
├─ interfaces/   # Kitap modeli, durum sabitleri ve doğrulama
├─ utils/        # LocalStorage okuma/yazma
├─ App.jsx
└─ main.jsx
```

Bileşenler `components`, sayfa düzeni `pages`, veri sözleşmeleri ve durum tanımları `interfaces` klasöründe toplanmıştır.

## Veri Saklama

Kayıtlar tarayıcının LocalStorage alanında `kitap-takibi.books.v1` anahtarında JSON olarak tutulur. Harici API, backend veya veritabanı kullanılmaz. Bu yöntem proje yönergesinde izin verilen bir yaklaşımdır; veriler yalnızca aynı tarayıcıda bulunur.

## Kurulum

```bash
npm install
npm run dev
```

Geliştirme sunucusu varsayılan olarak `http://localhost:5173` adresinde açılır.

Üretim derlemesi:

```bash
npm run build
npm run preview
```

## Canlı Demo

https://samil07kocakavuk.github.io/kitap-takibi/

Uygulama GitHub Pages üzerinde yayımlanmıştır.

## GitHub Deposu

https://github.com/samil07kocakavuk/kitap-takibi

## Ekran Görüntüsü

![Kitap Takibi ekran görüntüsü](./docs/ekran-goruntusu.png)

Ekran görüntüsündeki kayıtlar tanıtım amaçlıdır; uygulama ilk açılışta boş bir listeyle başlar.

## Kısıtlamalar

- Veriler yalnızca kullanıldığı tarayıcının LocalStorage alanında saklanır.
- Farklı tarayıcı veya cihazlar arasında veri eşitlemesi yapılmaz.
- Tarayıcı verileri temizlenirse kayıtlar silinir.
- Proje kapsamında backend, veritabanı ve kullanıcı girişi bulunmaz.

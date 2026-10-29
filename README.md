# Kitap Takibi

Okuduğun ve okuyacağın kitapları tek yerde takip etmek için geliştirilmiş, tarayıcıda çalışan bir CRUD uygulaması.

## Proje Hakkında

Kitap Takibi; kitap adı, yazar, okuma durumu ve isteğe bağlı bir notla kayıt oluşturmanı sağlar. Kayıtlar tarayıcının LocalStorage alanında saklanır; sayfa yenilendiğinde korunur. Uygulama herhangi bir backend veya kullanıcı hesabı gerektirmez.

## Özellikler

- Kitap ekleme
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
- Pure CSS
- LocalStorage

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

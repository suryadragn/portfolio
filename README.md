# Portofolio — Adhimukti Surya Anindyajati

Situs portofolio statis (HTML, CSS, sedikit JavaScript — tanpa build) untuk **https://suryaism.my.id**, di-deploy lewat Vercel.

## Struktur

| Berkas | Isi |
|---|---|
| `index.html` | Seluruh konten: hero, layanan, proyek, keahlian, pengalaman, kontak |
| `assets/css/style.css` | Tampilan (tema gelap/terang, responsif) |
| `assets/js/script.js` | Bahasa (ID/EN), tema, menu ponsel, filter proyek, animasi, form → WhatsApp |
| `assets/js/i18n.js` | Terjemahan Inggris (kunci `kNNN` = atribut `data-i18n` di `index.html`) |
| `assets/img/` | Avatar, favicon, gambar pratinjau tautan (`og.png`) |
| `vercel.json` | Header keamanan (CSP dll.) dan cache aset |

## Menjalankan lokal

```
python -m http.server 8899
# buka http://127.0.0.1:8899
```

## Mengubah isi

- **Proyek baru:** salin satu blok `<article class="project" data-cat="...">` di `index.html`
  (`data-cat`: `kampus`, `bisnis`, `ai`, `tools`). Proyek kampus bersifat internal: tulis ringkas, tanpa
  URL/IP/nama basis data.
- **Angka ringkas:** atribut `data-count` di bagian `stats`.
- **Kontak:** nomor WhatsApp muncul di beberapa tautan `wa.me/...` dan di `assets/js/script.js`.

## Deploy

Push ke `master` → Vercel membangun dan menayangkan otomatis. Branch lain mendapat URL pratinjau.

Lisensi: lihat `LICENSE`.

## Bahasa (ID / EN)

Bahasa Indonesia adalah bawaan di HTML (itu yang dibaca mesin pencari). JavaScript memilih bahasa saat
halaman dibuka: `?lang=id|en` di URL, lalu pilihan yang tersimpan, lalu bahasa browser/OS (yang berawalan
`id` = Indonesia, selain itu = Inggris). Crawler selalu mendapat bahasa Indonesia. Tombol ID/EN ada di
sebelah kiri tombol tema.

Menambah teks baru: beri atribut `data-i18n="kNNN"` (nomor baru) pada elemennya, tulis teks Indonesia di
HTML, lalu tambahkan `kNNN: "English text"` di `assets/js/i18n.js`. Teks tanpa kunci terjemahan tetap
tampil apa adanya di kedua bahasa.

## SEO

- Judul, deskripsi, Open Graph, dan JSON-LD (`WebSite` + `Person`, nama alternatif **suryaism**) ada di `index.html`.
- `sitemap.xml` dan `robots.txt` sudah tersedia; kirim sitemap di Google Search Console.

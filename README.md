# Portofolio — Adhimukti Surya Anindyajati

Situs portofolio statis (HTML, CSS, sedikit JavaScript — tanpa build) untuk **https://suryaism.my.id**, di-deploy lewat Vercel.

## Struktur

| Berkas | Isi |
|---|---|
| `index.html` | Seluruh konten: hero, layanan, proyek, keahlian, pengalaman, kontak |
| `assets/css/style.css` | Tampilan (tema gelap/terang, responsif) |
| `assets/js/script.js` | Tema, menu ponsel, filter proyek, animasi, form → WhatsApp |
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

# Sekar Wedding Organizer (Nuxt 4)

Template landing page wedding organizer / event organizer. Dibuat oleh SyntaxHaus.

## Fitur
- Cek ketersediaan tanggal di hero (tersedia, sisa 1 slot, penuh dengan saran tanggal terdekat). Logika demo ada di fungsi `statusOf`, ganti dengan data kalender asli.
- Estimasi biaya 3 langkah: konsep dan jumlah tamu, pilihan layanan, hasil berupa rentang biaya dan rincian. Form lead dengan validasi, lalu tombol lanjut ke WhatsApp dengan ringkasan terisi otomatis.
- Portofolio dengan filter (Taman, Ballroom, Intimate), animasi tata ulang grid, dan lightbox.
- Paket yang langsung mengisi kalkulator estimasi saat diklik.
- Animasi: foto hero muncul bergantian, transisi antar langkah, section muncul saat discroll. Mati otomatis di reduced motion.

## Menjalankan
```bash
npm install
npm run dev       # http://localhost:3000
npm run generate  # hasil statis di .output/public
```

## Mengganti konten
- Harga konsep dan layanan di `app/app.vue` (`concepts`, `extras`).
- Foto dan keterangan portofolio di array `works`.
- Warna di `app/assets/main.css`.

## Foto

Foto di `public/images` adalah foto demo dari Unsplash (Unsplash License). Ganti dengan foto milik klien sebelum dipakai untuk produksi, dan jangan menjual foto tersebut secara terpisah.

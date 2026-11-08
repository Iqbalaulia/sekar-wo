export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['@fontsource-variable/fraunces/full.css', '@fontsource-variable/fraunces/full-italic.css', '@fontsource-variable/dm-sans', '~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Sekar Wedding Organizer | Yogyakarta',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Wedding organizer di Yogyakarta. Cek ketersediaan tanggal, hitung estimasi biaya, dan lihat portofolio pernikahan kami.' }
      ]
    }
  }
})

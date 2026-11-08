<script setup>
const WA = '6281200000000'
const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID')
const jt = (n) => (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt'

const concepts = {
  intimate: { name: 'Intimate', sub: 'sampai 150 tamu, rumah atau resto', base: 15e6, decor: 8e6, pax: 120000, img: '/images/paket-3.jpg', alt: 'Meja panjang di teras dengan bunga dan lampu gantung' },
  taman: { name: 'Taman', sub: 'outdoor, 150 sampai 400 tamu', base: 35e6, decor: 18e6, pax: 150000, img: '/images/paket-1.jpg', alt: 'Lengkungan bunga putih di atas rumput dengan deretan kursi' },
  ballroom: { name: 'Ballroom', sub: 'gedung atau hotel, 300 tamu ke atas', base: 55e6, decor: 30e6, pax: 185000, img: '/images/paket-2.jpg', alt: 'Kursi pelaminan di bawah gapura bunga sakura' }
}
const extras = [
  { id: 'decor', name: 'Dekorasi pelaminan dan venue', price: c => c.decor },
  { id: 'catering', name: 'Katering prasmanan', price: (c, g) => c.pax * g, note: 'dihitung per tamu' },
  { id: 'doc', name: 'Foto dan video sinematik', price: () => 12e6 },
  { id: 'mua', name: 'Rias dan busana pengantin', price: () => 9e6 },
  { id: 'music', name: 'Akustik atau band', price: () => 7e6 },
  { id: 'inv', name: 'Undangan digital dan RSVP', price: () => 1.5e6 }
]

// 1. Cek tanggal (demo: ketersediaan dihitung dari tanggal, supaya konsisten)
const today = new Date()
const minDate = new Date(today.getFullYear(), today.getMonth() + 2, 1).toISOString().slice(0, 10)
const check = reactive({ date: '', concept: 'taman' })
const checkRes = ref(null)
function fmt (d) { return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }
function statusOf (d) {
  const wd = d.getDay(); const n = d.getDate() + d.getMonth() * 3
  if (wd === 0 || wd === 6) return n % 3 === 0 ? 'full' : 'one'
  return 'open'
}
function runCheck () {
  if (!check.date) { checkRes.value = { kind: 'err', text: 'Pilih tanggal acaranya dulu.' }; return }
  const d = new Date(check.date + 'T00:00:00')
  const s = statusOf(d)
  if (s === 'full') {
    const alt = []
    for (let i = 1; alt.length < 2 && i < 30; i++) {
      for (const k of [i, -i]) {
        const x = new Date(d); x.setDate(d.getDate() + k)
        if ((x.getDay() === 0 || x.getDay() === 6) && statusOf(x) !== 'full' && x >= new Date(minDate) && alt.length < 2) alt.push(x)
      }
    }
    checkRes.value = { kind: 'full', text: `${fmt(d)} sudah penuh.`, alt: alt.map(fmt) }
  } else if (s === 'one') {
    checkRes.value = { kind: 'one', text: `${fmt(d)} masih ada 1 slot tim untuk konsep ${concepts[check.concept].name}.` }
  } else {
    checkRes.value = { kind: 'open', text: `${fmt(d)} tersedia untuk konsep ${concepts[check.concept].name}.` }
  }
}

// 2. Estimasi biaya 3 langkah
const step = ref(1)
const est = reactive({ concept: 'taman', guests: 300, picked: ['decor', 'catering', 'doc'], name: '', phone: '', date: '' })
const estErr = reactive({})
const estState = ref('idle')
const c = computed(() => concepts[est.concept])
const lines = computed(() => [
  { name: `Jasa WO dan koordinasi venue (${c.value.name})`, v: c.value.base },
  ...extras.filter(e => est.picked.includes(e.id)).map(e => ({ name: e.name, v: e.price(c.value, est.guests) }))
])
const total = computed(() => lines.value.reduce((a, b) => a + b.v, 0))
const waEst = computed(() => {
  const msg = `Halo Sekar, saya ${est.name || '...'}. Rencana ${c.value.name}, ${est.guests} tamu` + (est.date ? `, tanggal ${est.date}` : '') +
    `. Layanan: ${lines.value.slice(1).map(l => l.name).join(', ') || 'koordinasi saja'}. Estimasi ${jt(total.value * 0.9)} sampai ${jt(total.value * 1.1)}.`
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
})
function toggle (id) { est.picked = est.picked.includes(id) ? est.picked.filter(x => x !== id) : [...est.picked, id] }
function submitEst () {
  estErr.name = est.name.trim() ? '' : 'Isi nama kalian.'
  estErr.phone = /^(\+62|0)8\d{8,11}$/.test(est.phone.replace(/[\s-]/g, '')) ? '' : 'Nomor WhatsApp belum valid, contoh 0812 3456 7890.'
  if (estErr.name || estErr.phone) return
  estState.value = 'loading'
  setTimeout(() => { estState.value = 'done' }, 900)
}
function usePackage (k) {
  est.concept = k
  est.guests = k === 'intimate' ? 100 : k === 'taman' ? 300 : 600
  step.value = 1
  document.getElementById('estimasi')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

// 3. Portofolio
const works = [
  { src: '/images/o-1.jpg', type: 'taman', cap: 'Akad pagi di bukit, Kaliurang · 180 tamu', w: 900, h: 601 },
  { src: '/images/b-1.jpg', type: 'ballroom', cap: 'Resepsi adat di ballroom hotel · 800 tamu', w: 900, h: 600 },
  { src: '/images/i-1.jpg', type: 'intimate', cap: 'Makan malam keluarga di taman belakang · 60 tamu', w: 900, h: 1350 },
  { src: '/images/o-2.jpg', type: 'taman', cap: 'Gazebo bunga merah muda, Sleman · 250 tamu', w: 900, h: 1200 },
  { src: '/images/b-2.jpg', type: 'ballroom', cap: 'Lantai dansa dengan tirai kain, Semarang · 500 tamu', w: 900, h: 599 },
  { src: '/images/i-2.jpg', type: 'intimate', cap: 'Meja panjang bunga musim hujan · 80 tamu', w: 900, h: 601 },
  { src: '/images/o-3.jpg', type: 'taman', cap: 'Lorong bunga di halaman villa, Magelang · 300 tamu', w: 900, h: 601 },
  { src: '/images/b-3.jpg', type: 'ballroom', cap: 'Meja bundar putih dan lilin · 400 tamu', w: 900, h: 600 },
  { src: '/images/i-3.jpg', type: 'intimate', cap: 'Resepsi kecil di restoran · 50 tamu', w: 900, h: 600 }
]
const tab = ref('all')
const shown = computed(() => works.filter(w => tab.value === 'all' || w.type === tab.value))
const lb = ref(-1)
watch(lb, (v, o) => { if (v >= 0 && o < 0) nextTick(() => document.querySelector('.lb-bar button')?.focus()) })
function lbKey (e) {
  if (lb.value < 0) return
  const n = shown.value.length
  if (e.key === 'Escape') lb.value = -1
  if (e.key === 'ArrowRight') lb.value = (lb.value + 1) % n
  if (e.key === 'ArrowLeft') lb.value = (lb.value - 1 + n) % n
}

const menu = ref(false)
onMounted(() => {
  window.addEventListener('keydown', lbKey)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('reveal-on')
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el))
})
onBeforeUnmount(() => window.removeEventListener('keydown', lbKey))
</script>

<template>
  <a class="skip" href="#main">Lewati ke konten</a>
  <header class="top">
    <div class="wrap bar">
      <a href="#" class="logo">Sekar<span>wedding organizer</span></a>
      <button class="menu-btn" :aria-expanded="menu" aria-controls="nav" @click="menu = !menu">Menu</button>
      <nav id="nav" :class="{ open: menu }" aria-label="Navigasi utama">
        <a href="#portofolio" @click="menu = false">Portofolio</a>
        <a href="#estimasi" @click="menu = false">Estimasi biaya</a>
        <a href="#paket" @click="menu = false">Paket</a>
        <a href="#tanya" @click="menu = false">Tanya jawab</a>
        <a class="btn small" href="#cek" @click="menu = false">Cek tanggal</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="hero wrap">
      <div class="hero-copy">
        <p class="eyebrow-line">Wedding organizer di Yogyakarta, sejak 2015</p>
        <h1>Hari besar kalian, <em>tanpa kalian yang repot.</em></h1>
        <p class="lead">Kami mengurus vendor, rundown, dan semua hal kecil yang biasanya membuat calon pengantin begadang. Kalian cukup hadir dan menikmatinya.</p>
        <form id="cek" class="check-card" @submit.prevent="runCheck">
          <h2 class="card-title">Cek tanggal kalian</h2>
          <div class="check-row">
            <label>Tanggal acara<input v-model="check.date" type="date" :min="minDate"></label>
            <label>Konsep
              <select v-model="check.concept"><option v-for="(v, k) in concepts" :key="k" :value="k">{{ v.name }}</option></select>
            </label>
            <button class="btn" type="submit">Cek</button>
          </div>
          <Transition name="fade" mode="out-in">
            <div v-if="checkRes" :key="checkRes.text" class="check-res" :class="checkRes.kind" role="status">
              <p>{{ checkRes.text }}</p>
              <p v-if="checkRes.alt?.length" class="alt">Tanggal terdekat yang masih kosong: {{ checkRes.alt.join(' atau ') }}.</p>
              <a v-if="checkRes.kind !== 'err'" class="link" href="#estimasi">Lanjut hitung estimasi biaya</a>
            </div>
          </Transition>
        </form>
      </div>
      <div class="hero-art">
        <div class="arch"><img src="/images/hero.jpg" alt="Pengantin berjalan di bawah taburan bunga dari para tamu" width="1920" height="1280" fetchpriority="high"></div>
        <div class="arch small"><img src="/images/couple.jpg" alt="Pengantin berciuman di taman, tamu menaburkan kelopak bunga" width="1000" height="1500" loading="lazy"></div>
      </div>
    </section>

    <section id="estimasi" class="band">
      <div class="wrap section est">
        <div class="est-intro" data-reveal>
          <h2>Kira-kira butuh berapa?</h2>
          <p>Tiga langkah, kurang dari satu menit. Hasilnya rentang biaya yang jujur, bukan angka pancingan.</p>
          <ol class="progress" aria-label="Langkah estimasi">
            <li v-for="(s, i) in ['Konsep dan tamu', 'Layanan', 'Hasil']" :key="s" :class="{ on: step === i + 1, done: step > i + 1 }" :aria-current="step === i + 1 ? 'step' : undefined"><span>{{ i + 1 }}</span>{{ s }}</li>
          </ol>
        </div>
        <div class="est-card" data-reveal>
          <Transition name="step" mode="out-in">
            <div v-if="step === 1" key="1" class="est-step">
              <fieldset>
                <legend>Konsep acara</legend>
                <div class="concepts">
                  <label v-for="(v, k) in concepts" :key="k" class="concept" :class="{ on: est.concept === k }">
                    <input v-model="est.concept" type="radio" name="concept" :value="k" class="sr">
                    <strong>{{ v.name }}</strong><span>{{ v.sub }}</span>
                  </label>
                </div>
              </fieldset>
              <label class="guests">
                <span>Jumlah tamu <strong>{{ est.guests }} orang</strong></span>
                <input v-model.number="est.guests" type="range" min="50" max="1000" step="50">
              </label>
              <div class="nav-row"><span /><button class="btn" type="button" @click="step = 2">Lanjut pilih layanan</button></div>
            </div>
            <div v-else-if="step === 2" key="2" class="est-step">
              <fieldset>
                <legend>Yang ingin kalian serahkan ke kami</legend>
                <div class="extras">
                  <label v-for="e in extras" :key="e.id" class="extra" :class="{ on: est.picked.includes(e.id) }">
                    <input type="checkbox" :checked="est.picked.includes(e.id)" @change="toggle(e.id)">
                    <span class="x-name">{{ e.name }}<small v-if="e.note">{{ e.note }}</small></span>
                    <span class="x-price">{{ jt(e.price(c, est.guests)) }}</span>
                  </label>
                </div>
              </fieldset>
              <div class="nav-row"><button class="btn ghost" type="button" @click="step = 1">Kembali</button><button class="btn" type="button" @click="step = 3">Lihat estimasi</button></div>
            </div>
            <div v-else key="3" class="est-step">
              <div class="result" aria-live="polite">
                <p class="r-label">Perkiraan total untuk {{ c.name }}, {{ est.guests }} tamu</p>
                <p class="r-num">{{ jt(total * 0.9) }} <span>sampai</span> {{ jt(total * 1.1) }}</p>
                <ul class="r-lines"><li v-for="l in lines" :key="l.name"><span>{{ l.name }}</span><span>{{ rp(l.v) }}</span></li></ul>
              </div>
              <form v-if="estState !== 'done'" class="est-form" novalidate @submit.prevent="submitEst">
                <p class="f-title">Kirim ke konsultan, kami balas dengan rincian vendor yang cocok.</p>
                <div class="two">
                  <label>Nama kalian<input v-model="est.name" autocomplete="name" placeholder="Nama Anda" :aria-invalid="!!estErr.name"></label>
                  <label>Nomor WhatsApp<input v-model="est.phone" type="tel" autocomplete="tel" placeholder="0812 3456 7890" :aria-invalid="!!estErr.phone"></label>
                </div>
                <p v-if="estErr.name" class="err" role="alert">{{ estErr.name }}</p>
                <p v-if="estErr.phone" class="err" role="alert">{{ estErr.phone }}</p>
                <div class="nav-row"><button class="btn ghost" type="button" @click="step = 2">Ubah layanan</button><button class="btn" type="submit" :disabled="estState === 'loading'">{{ estState === 'loading' ? 'Mengirim...' : 'Kirim ke konsultan' }}</button></div>
              </form>
              <div v-else class="est-done" role="status">
                <p class="big">Terima kasih, {{ est.name }}.</p>
                <p>Konsultan kami menghubungi {{ est.phone }} hari ini. Mau mulai ngobrol sekarang?</p>
                <a class="btn" :href="waEst" rel="noopener" target="_blank">Lanjut di WhatsApp</a>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <section id="portofolio" class="wrap section">
      <div class="port-head" data-reveal>
        <h2>Pernikahan yang pernah kami pegang</h2>
        <div class="tabs" role="group" aria-label="Filter portofolio">
          <button v-for="t in [['all', 'Semua'], ['taman', 'Taman'], ['ballroom', 'Ballroom'], ['intimate', 'Intimate']]" :key="t[0]" type="button" :aria-pressed="tab === t[0]" :class="{ on: tab === t[0] }" @click="tab = t[0]">{{ t[1] }}</button>
        </div>
      </div>
      <TransitionGroup name="grid" tag="div" class="works">
        <figure v-for="(w, i) in shown" :key="w.src" class="work">
          <button type="button" :aria-label="`Perbesar: ${w.cap}`" @click="lb = i"><img :src="w.src" :alt="w.cap" :width="w.w" :height="w.h" loading="lazy"></button>
          <figcaption>{{ w.cap }}</figcaption>
        </figure>
      </TransitionGroup>
    </section>

    <section id="paket" class="pk-band">
      <div class="wrap section">
        <h2 data-reveal>Tiga cara kami bekerja</h2>
        <div class="packages">
          <article v-for="(v, k) in concepts" :key="k" class="pk" data-reveal>
            <div class="arch pk-img"><img :src="v.img" :alt="v.alt" width="1000" height="700" loading="lazy"></div>
            <div class="pk-body">
              <h3>{{ v.name }}</h3>
              <p class="pk-sub">{{ v.sub }}</p>
              <p>Jasa WO dan koordinasi mulai <strong>{{ jt(v.base) }}</strong>. Dekorasi, katering, dan dokumentasi bisa ditambah sesuai kebutuhan.</p>
              <button class="btn ghost light" type="button" @click="usePackage(k)">Hitung dengan konsep {{ v.name }}</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="wrap section">
      <h2 data-reveal>Dari obrolan pertama sampai tamu terakhir pulang</h2>
      <ol class="timeline">
        <li data-reveal><span class="t-when">H-12 bulan</span><h3>Ngobrol santai</h3><p>Cerita tentang kalian, keluarga, dan bayangan hari itu. Gratis, tanpa komitmen.</p></li>
        <li data-reveal><span class="t-when">H-10 bulan</span><h3>Konsep dan moodboard</h3><p>Palet warna, gaya dekor, dan rundown kasar yang disetujui kedua keluarga.</p></li>
        <li data-reveal><span class="t-when">H-8 bulan</span><h3>Kunci vendor</h3><p>Kami ajukan tiga pilihan per vendor, kalian yang memutuskan.</p></li>
        <li data-reveal><span class="t-when">H-7 hari</span><h3>Gladi bersih</h3><p>Semua pengisi acara, keluarga inti, dan tim kami berlatih di venue.</p></li>
        <li data-reveal><span class="t-when">Hari H</span><h3>Kalian tinggal hadir</h3><p>Tim 8 sampai 15 orang memegang rundown dari subuh sampai venue kosong.</p></li>
      </ol>
    </section>

    <section id="tanya" class="wrap section faq-wrap">
      <h2 data-reveal>Tanya jawab</h2>
      <div class="faq">
        <details data-reveal><summary>Berapa lama sebelum hari H sebaiknya booking?</summary><p>Idealnya 8 sampai 12 bulan untuk tanggal akhir pekan. Untuk konsep intimate, 4 bulan biasanya masih cukup.</p></details>
        <details data-reveal><summary>Boleh pakai vendor pilihan sendiri?</summary><p>Boleh. Kami tetap mengoordinasikan vendor dari kalian, termasuk rundown dan jadwal loading barang.</p></details>
        <details data-reveal><summary>Bagaimana sistem pembayarannya?</summary><p>DP 30% untuk mengunci tanggal, 40% setelah vendor dikunci, dan pelunasan paling lambat 14 hari sebelum acara.</p></details>
        <details data-reveal><summary>Melayani di luar Yogyakarta?</summary><p>Ya, untuk Jawa Tengah dan Bali. Biaya transportasi dan akomodasi tim ditambahkan di penawaran.</p></details>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap foot-in">
      <div><a href="#" class="logo">Sekar<span>wedding organizer</span></a><p>Jl. Kaliurang Km 7, Sleman, Yogyakarta</p></div>
      <div class="foot-links"><a :href="`https://wa.me/${WA}`" rel="noopener">WhatsApp konsultan</a><a href="mailto:halo@sekarwo.id">halo@sekarwo.id</a><a href="#cek">Cek tanggal</a></div>
      <p class="small">© 2026 Sekar Wedding Organizer</p>
    </div>
  </footer>

  <Transition name="fade">
    <div v-if="lb >= 0" class="overlay" role="dialog" aria-modal="true" aria-label="Foto portofolio" @click.self="lb = -1">
      <figure><img :src="shown[lb].src" :alt="shown[lb].cap" :width="shown[lb].w" :height="shown[lb].h"><figcaption>{{ shown[lb].cap }}</figcaption></figure>
      <div class="lb-bar">
        <button type="button" aria-label="Foto sebelumnya" @click="lb = (lb - 1 + shown.length) % shown.length">←</button>
        <span>{{ lb + 1 }} / {{ shown.length }}</span>
        <button type="button" aria-label="Foto berikutnya" @click="lb = (lb + 1) % shown.length">→</button>
        <button type="button" @click="lb = -1">Tutup</button>
      </div>
    </div>
  </Transition>
</template>

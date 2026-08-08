# Triaji Ibnu Hermawan — Portfolio

Personal portfolio single-page, dark-first, bilingual (ID/EN), dengan animasi
scroll-driven, custom cursor context-aware, objek 3D di hero, dan section
"IDE Mode" yang menampilkan profil seperti membaca kode.

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS v4 · Framer Motion ·
GSAP + ScrollTrigger · Lenis · React Three Fiber + drei · lucide-react

---

## Daftar isi

1. [Menjalankan di lokal](#1-menjalankan-di-lokal)
2. [Mengganti data & teks](#2-mengganti-data--teks)
3. [Mengisi foto, CV, screenshot, sertifikat](#3-mengisi-foto-cv-screenshot-sertifikat)
4. [Mengganti bahasa default](#4-mengganti-bahasa-default)
5. [Deploy ke Vercel](#5-deploy-ke-vercel)
6. [Deploy ke GitHub Pages](#6-deploy-ke-github-pages)
7. [Struktur folder](#7-struktur-folder)
8. [Catatan teknis](#8-catatan-teknis)

---

## 1. Menjalankan di lokal

Butuh **Node.js 20 atau lebih baru**.

```bash
npm install      # pasang dependensi (sekali saja)
npm run dev      # jalankan dev server → http://localhost:5173
```

Perintah lain:

```bash
npm run build    # build produksi ke folder dist/ (sekaligus cek TypeScript)
npm run preview  # jalankan hasil build di http://localhost:4173
npm run lint     # oxlint
```

---

## 2. Mengganti data & teks

> **Semua teks di website ini ada di satu file:** [`src/data/content.ts`](src/data/content.ts)

Tidak ada teks yang ditulis langsung di dalam komponen. Setiap teks berbentuk
objek dua bahasa:

```ts
{ id: 'Teks bahasa Indonesia', en: 'English text' }
```

Kalau teks ID dan EN memang sama persis (misalnya nama teknologi atau output
terminal), pakai helper `same()`:

```ts
same('  ✓ tests passed')   //  →  { id: '  ✓ tests passed', en: '  ✓ tests passed' }
```

### Yang bisa diubah di file itu

| Bagian | Isi |
| --- | --- |
| `name`, `email`, `location`, `socials` | Identitas & kontak |
| `roles` | Daftar peran yang berputar di hero |
| `tagline` | Kalimat utama di hero |
| `ticker` | Teks marquee di bawah hero |
| `heroStats` | Tiga angka statistik di hero |
| `ide.files` | Isi file tree + kode yang tampil di "IDE Mode" |
| `ide.terminal` | Urutan perintah & output terminal |
| `skills` | Grup skill beserta ikonnya |
| `projects` | Kartu projek (lihat catatan di bawah) |
| `about` | Bio + empat "pillar" |
| `timeline` | Riwayat pendidikan / pengalaman / sertifikasi |
| `ui` | Semua label antarmuka (nav, tombol, judul section, dll) |

### Menambah projek baru

Tambahkan satu objek ke array `projects`. Aturan tombolnya:

- Isi `demoUrl` → tombol **Demo langsung** muncul, dan seluruh kartu jadi bisa diklik.
- Isi `repoUrl` → tombol **Repository** muncul.
- Isi `screenshotUrl` → tombol **Lihat screenshot** muncul (membuka lightbox).
- **Tidak ada satupun link** → tombol tidak dipaksa muncul; yang tampil label
  "Sistem internal" atau "Segera hadir" sesuai `status`.

`status` menentukan badge di pojok kartu:
`'live'` (hijau berdenyut) · `'internal'` (gembok) · `'in-progress'` (kuning, "Sedang dikerjakan").

`span` mengatur ukuran kartu di grid 12 kolom:
`'wide'` (7) · `'tall'` (5, dua baris) · `'normal'` (4) · `'compact'` (3).

### Menambah ikon skill

Ikon dipetakan dari string di `content.ts` ke komponen
[lucide](https://lucide.dev) di dalam `ICONS` pada
[`src/components/Skills.tsx`](src/components/Skills.tsx). Tambahkan entri baru
di sana kalau butuh ikon lain.

---

## 3. Mengisi foto, CV, screenshot, sertifikat

Semua slot yang belum terisi ditandai `TODO` di `src/data/content.ts`.
Cari kata **`TODO`** untuk menemukannya.

| Yang mau diisi | Langkah |
| --- | --- |
| **Foto profil** | Taruh file di `public/photo.jpg`, lalu ubah `photoUrl: null` → `photoUrl: '/photo.jpg'`. Selama `null`, About memakai monogram "T" animasi. |
| **CV** | Taruh file di `public/cv.pdf`, lalu ubah `cvUrl: null` → `cvUrl: '/cv.pdf'`. Selama `null`, tombolnya tampil sebagai "CV menyusul". |
| **Screenshot projek** | Taruh gambar di `public/shots/<nama>.png`, lalu buka komentar baris `screenshotUrl: '/shots/<nama>.png'` di projek terkait. |
| **Sertifikat BNSP** | Taruh file di `public/certs/bnsp-network-admin.pdf`, lalu buka komentar baris `certificateUrl:` pada entri timeline `bnsp`. |
| **Link repo** | Tambahkan `repoUrl: 'https://github.com/...'` pada projek yang repositorinya boleh dipublikasikan. |
| **Gambar Open Graph** | Sekarang memakai `public/og.svg`. Untuk preview terbaik di WhatsApp/Twitter, buat versi PNG 1200×630 sebagai `public/og.png` lalu ubah dua tag `og:image` / `twitter:image` di `index.html`. |

Tidak ada yang perlu diubah di komponen — semua slot sudah menyesuaikan sendiri.

---

## 4. Mengganti bahasa default

Buka [`src/context/lang-context.ts`](src/context/lang-context.ts):

```ts
export const DEFAULT_LANG: Lang = 'id';        // ganti ke 'en' kalau mau default Inggris
export const AUTO_DETECT_BROWSER_LANG = false; // true = ikut bahasa browser pengunjung baru
```

Pilihan yang pernah dibuat pengunjung disimpan di `localStorage` dan selalu
menang atas nilai default. Untuk mengetes ulang, hapus key `triaji.lang` di
DevTools → Application → Local Storage.

---

## 5. Deploy ke Vercel

Zero config — Vercel mengenali Vite secara otomatis.

1. Push project ini ke sebuah repository GitHub.
2. Buka [vercel.com/new](https://vercel.com/new) → **Import Git Repository** →
   pilih repo tadi.
3. Biarkan semua setelan default:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Klik **Deploy**.

Setiap `git push` ke branch `main` akan otomatis deploy ulang.

> Setelah dapat domain, perbarui `<link rel="canonical">` dan `og:url` di
> [`index.html`](index.html) supaya preview link-nya benar.

---

## 6. Deploy ke GitHub Pages

Workflow-nya sudah disiapkan di
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. **Samakan nama repo.** Buka [`vite.config.ts`](vite.config.ts) dan ubah:

   ```ts
   const GITHUB_REPO_NAME = 'Porto'; // ← ganti sesuai nama repo GitHub kamu
   ```

   Ini hanya dipakai saat build GitHub Pages; Vercel dan `npm run dev` tetap
   memakai base `/`.

2. **Push ke branch `main`.**

3. **Aktifkan Pages.** Di repo GitHub: **Settings → Pages → Build and
   deployment → Source: GitHub Actions**.

4. Buka tab **Actions** dan tunggu workflow "Deploy to GitHub Pages" selesai.
   Situs akan tersedia di `https://<username>.github.io/<NAMA-REPO>/`.

Kalau repo-nya bernama `<username>.github.io`, situs berada di root — set
`GITHUB_REPO_NAME` jadi string kosong sehingga base-nya `/`.

---

## 7. Struktur folder

```
.
├─ .github/workflows/deploy.yml   # CI deploy ke GitHub Pages
├─ public/
│  ├─ favicon.svg                 # favicon monogram
│  ├─ og.svg                      # gambar Open Graph
│  └─ .nojekyll                   # supaya GitHub Pages tidak memproses via Jekyll
├─ index.html                     # meta SEO, Open Graph, JSON-LD
└─ src/
   ├─ main.tsx                    # entry: font, provider bahasa, mount React
   ├─ App.tsx                     # susunan section + preloader + smooth scroll
   ├─ index.css                   # palet CSS variables, tema Tailwind, utilities
   │
   ├─ data/
   │  └─ content.ts               # ★ SEMUA teks & data ({ id, en })
   │
   ├─ context/
   │  ├─ lang-context.ts          # context + hook useLang + DEFAULT_LANG
   │  └─ LangProvider.tsx         # provider bahasa (localStorage + <html lang>)
   │
   ├─ hooks/
   │  ├─ useCursor.ts             # state machine custom cursor
   │  ├─ useLenis.ts              # smooth scroll + scrollToId/scrollToTop/lock
   │  ├─ useMagnetic.ts           # efek magnetic pada tombol & link
   │  ├─ useReveal.ts             # reveal scroll-driven + parallax (GSAP)
   │  ├─ useInViewOnce.ts         # pemicu sekali-jalan via ScrollTrigger
   │  ├─ useTypewriter.ts         # typewriter kode + sequencer terminal
   │  └─ useReducedMotion.ts      # prefers-reduced-motion & deteksi pointer
   │
   ├─ lib/
   │  ├─ gsap.ts                  # registrasi plugin + easing signature
   │  ├─ highlight.ts             # syntax highlighter mini (TS/JSON/MD)
   │  └─ utils.ts                 # cn, lerp, clamp
   │
   └─ components/
      ├─ Cursor.tsx               # render custom cursor
      ├─ Preloader.tsx            # 000→100 lalu reveal hero
      ├─ Nav.tsx                  # nav sticky + toggle bahasa + menu mobile
      ├─ Hero.tsx                 # nama per-huruf, role berputar, ticker
      ├─ HeroCanvas.tsx           # objek 3D R3F (lazy-loaded)
      ├─ IdeMode.tsx              # section signature bergaya VS Code
      ├─ Skills.tsx               # grid tech stack
      ├─ Projects.tsx             # grid projek asimetris + lightbox
      ├─ About.tsx                # monogram, bio, pillars, timeline
      ├─ Contact.tsx              # CTA email, CV, sosial
      ├─ Footer.tsx               # jam WIB live + kredit
      ├─ ide/                     # FileTree, CodeEditor, Terminal
      └─ ui/                      # SectionHeading, Magnetic, Ticker,
                                  # Monogram, OrbFallback, ErrorBoundary
```

---

## 8. Catatan teknis

**Aksesibilitas & reduced motion.** Kalau pengunjung mengaktifkan
`prefers-reduced-motion: reduce`, situs otomatis: mematikan smooth scroll
(Lenis), mengganti objek 3D dengan versi SVG statis, menampilkan kode IDE
langsung utuh tanpa typewriter, mematikan trailing custom cursor dan efek
magnetic, serta mengubah semua reveal jadi tampil langsung.

**Custom cursor.** Hanya aktif di perangkat dengan pointer halus
(`hover: hover` dan `pointer: fine`); di layar sentuh cursor sistem tetap
normal. Elemen apa pun bisa mengubah bentuk cursor lewat atribut DOM:

```html
<div data-cursor="view" data-cursor-label="VIEW ↗">…</div>
<a   data-cursor="link">…</a>          <!-- ring membesar + magnetic -->
<div data-cursor="text">…</div>        <!-- caret, dipakai di area kode -->
```

**Performa.** Bundle three.js dipisah ke chunk sendiri dan di-`lazy()` sehingga
tidak memblokir first paint; hero menampilkan fallback SVG sampai canvas siap.
Font di-bundle lokal lewat `@fontsource` (tanpa request ke Google Fonts).
Kalau WebGL tidak tersedia atau canvas gagal, `ErrorBoundary` menampilkan
fallback statis tanpa menjatuhkan halaman.

**Palet.** Warna didefinisikan sebagai CSS variables di `:root`
(`--bg-900`, `--accent-violet`, dan seterusnya) lalu dipetakan ke token
Tailwind dengan nama yang lebih enak dibaca (`bg-base`, `text-ink`,
`text-violet`, `border-line`, …). Mengubah satu nilai di `:root` cukup untuk
mengganti tema seluruh situs.

---

designed & coded by Triaji · [triaji3ibnu.work@gmail.com](mailto:triaji3ibnu.work@gmail.com)

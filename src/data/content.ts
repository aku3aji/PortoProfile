/**
 * ============================================================================
 *  SATU-SATUNYA SUMBER KEBENARAN UNTUK SEMUA TEKS & DATA
 * ============================================================================
 *  Semua teks yang tampil di website ada di file ini, dalam bentuk { id, en }.
 *  - `id` = Bahasa Indonesia
 *  - `en` = English
 *
 *  Cari kata "TODO" di file ini untuk menemukan hal-hal yang masih perlu diisi
 *  (foto, CV, screenshot, dan sebagian link repo).
 * ============================================================================
 */

export type Lang = 'id' | 'en';

/** Teks bilingual. */
export type L = { id: string; en: string };

/** Helper: dipakai kalau teks ID & EN memang sama persis (nama teknis, output terminal, dll). */
const same = (s: string): L => ({ id: s, en: s });

/* -------------------------------------------------------------------------- */
/* Tipe data                                                                   */
/* -------------------------------------------------------------------------- */

export type ProjectStatus = 'live' | 'internal' | 'in-progress';

export interface Project {
  key: string;
  title: string;
  /** Sub-judul pendek, tampil di bawah judul kartu. */
  kicker: L;
  year: string;
  role: L;
  description: L;
  /** Poin-poin singkat yang tampil saat kartu di-hover / dibuka. */
  highlights: L[];
  tech: string[];
  status: ProjectStatus;
  /** Kosongkan (hapus barisnya) kalau link belum ada — tombolnya otomatis disembunyikan. */
  demoUrl?: string;
  repoUrl?: string;
  /** Path gambar di folder /public, contoh: '/shots/simotb.png' */
  screenshotUrl?: string;
  accent: 'violet' | 'teal' | 'amber' | 'green';
  /** Ukuran kartu di grid asimetris 12 kolom. */
  span: 'wide' | 'tall' | 'normal' | 'compact';
}

export interface SkillGroup {
  key: string;
  label: L;
  icon: string;
  items: { name: string; icon: string; note?: L }[];
}

export interface TimelineEntry {
  key: string;
  period: L;
  title: L;
  org: L;
  description: L;
  tag: L;
  state: 'done' | 'ongoing';
  /** Tampilkan badge sertifikat di entri ini? */
  showCertificate?: boolean;
  /** Slot file sertifikat (gambar/PDF di /public). Kosongkan kalau belum ada. */
  certificateUrl?: string;
}

export interface IdeFile {
  key: string;
  /** Nama file seperti di file tree. */
  name: string;
  /** Folder induk, kosong = root. */
  folder?: string;
  language: 'ts' | 'json' | 'md';
  icon: string;
  code: L;
}

export interface TerminalStep {
  cmd: string;
  output: L[];
}

/* -------------------------------------------------------------------------- */
/* Helper identitas bertipe                                                    */
/* -------------------------------------------------------------------------- */
/**
 * Membungkus array literal supaya tetap bertipe interface-nya (bukan tipe
 * literal yang menyempit), sambil tetap mendapat pengecekan properti asing.
 * Tanpa ini, item tanpa properti opsional membuat TypeScript menghilangkan
 * properti tersebut dari tipe gabungannya.
 */
const ideFiles = (v: IdeFile[]): IdeFile[] => v;
const terminalSteps = (v: TerminalStep[]): TerminalStep[] => v;
const skillGroups = (v: SkillGroup[]): SkillGroup[] => v;
const projectList = (v: Project[]): Project[] => v;
const timelineEntries = (v: TimelineEntry[]): TimelineEntry[] => v;

/* -------------------------------------------------------------------------- */
/* Identitas                                                                   */
/* -------------------------------------------------------------------------- */

export const content = {
  name: 'Triaji Ibnu Hermawan',
  shortName: 'Triaji',
  initials: 'T',
  logo: '</> triaji',

  email: 'triaji3ibnu.work@gmail.com',
  available: true,

  location: {
    id: 'Malang / Blitar, Jawa Timur',
    en: 'Malang / Blitar, East Java',
  } satisfies L,

  timezone: 'Asia/Jakarta',
  timezoneLabel: 'WIB',

  roles: [
    { id: 'Web Developer', en: 'Web Developer' },
    { id: 'Software Developer', en: 'Software Developer' },
    { id: 'Fullstack', en: 'Fullstack' },
    { id: 'Network Administrator Muda', en: 'Junior Network Administrator' },
  ] satisfies L[],

  tagline: {
    id: 'Fullstack web developer yang menerjemahkan kebutuhan bisnis jadi web yang rapi, teruji, dan siap jalan.',
    en: 'Fullstack web developer turning business needs into clean, tested, ship-ready web apps.',
  } satisfies L,

  socials: {
    github: 'https://github.com/aku3aji',
    linkedin: 'https://www.linkedin.com/in/triajibnhrmwn',
    instagram: 'https://instagram.com/triajibnhrmwn',
  },

  /**
   * TODO: taruh file CV di folder `public/cv.pdf`, lalu ganti nilai di bawah
   * jadi '/cv.pdf'. Selama masih null, tombol Download CV tampil dalam
   * keadaan disabled dengan label "segera hadir".
   */
  cvUrl: null as string | null,

  /**
   * TODO: taruh foto di `public/photo.jpg`, lalu ganti jadi '/photo.jpg'.
   * Selama masih null, About memakai monogram "T" animasi.
   */
  photoUrl: null as string | null,

  /** Ticker monospace di bawah hero. */
  ticker: [
    'PHP',
    'LARAVEL',
    'REACT',
    'TAILWIND',
    'MYSQL',
    'QA & TESTING',
    'NETWORK ADMIN',
    'D4 SIB POLINEMA',
  ],

  /* ------------------------------------------------------------------------ */
  /* Statistik singkat di hero                                                 */
  /* ------------------------------------------------------------------------ */

  heroStats: [
    { value: '4', label: { id: 'Projek dikerjakan', en: 'Projects shipped' } satisfies L },
    { value: '6', label: { id: 'Bulan magang QA', en: 'Months as QA intern' } satisfies L },
    { value: 'D4', label: { id: 'Sistem Informasi Bisnis', en: 'Business Info Systems' } satisfies L },
  ],

  /* ------------------------------------------------------------------------ */
  /* IDE MODE — file tree + isi editor                                         */
  /* ------------------------------------------------------------------------ */

  ide: {
    files: ideFiles([
      {
        key: 'about',
        name: 'about.ts',
        language: 'ts',
        icon: 'ts',
        code: {
          id: `// Profil singkat — data asli, bukan lorem ipsum.
const dev = {
  name: 'Triaji Ibnu Hermawan',
  role: 'Fullstack Web Developer',
  edu: 'D4 Sistem Informasi Bisnis — POLINEMA (2022–2026)',
  stack: ['Laravel', 'React', 'Tailwind', 'MySQL'],
  extras: ['QA & Testing', 'Network Admin (BNSP)'],
  base: 'Malang / Blitar, Jawa Timur',
  openToWork: true,
};

/**
 * Kenapa kombinasinya menarik?
 * Latar Sistem Informasi Bisnis bikin saya terbiasa membaca
 * proses bisnis dulu, baru menulis kode. Pengalaman jadi QA
 * bikin saya menguji punya sendiri sebelum orang lain yang nemu.
 */
export function pitch(): string {
  return \`\${dev.role} yang paham proses bisnis dan menguji sendiri hasilnya.\`;
}

export default dev;`,
          en: `// Short profile — real data, no lorem ipsum.
const dev = {
  name: 'Triaji Ibnu Hermawan',
  role: 'Fullstack Web Developer',
  edu: 'B.A.Sc. Business Information Systems — POLINEMA (2022–2026)',
  stack: ['Laravel', 'React', 'Tailwind', 'MySQL'],
  extras: ['QA & Testing', 'Network Admin (BNSP)'],
  base: 'Malang / Blitar, East Java',
  openToWork: true,
};

/**
 * Why is the mix interesting?
 * A Business Information Systems background trained me to read
 * the business process first and write code second. Working as
 * QA trained me to break my own build before anyone else does.
 */
export function pitch(): string {
  return \`\${dev.role} who reads the business process and tests his own work.\`;
}

export default dev;`,
        },
      },
      {
        key: 'skills',
        name: 'skills.json',
        language: 'json',
        icon: 'json',
        code: {
          id: `{
  "languages": ["PHP", "JavaScript", "SQL", "HTML", "CSS"],
  "frameworks": ["Laravel", "React", "Tailwind CSS", "Bootstrap", "Vite", "Node.js"],
  "tools": ["Git", "VS Code", "Figma", "MySQL", "Microsoft Office"],
  "analysis": ["ERD", "UML", "Business Process (BPMN)"],
  "qa": [
    "Black-box Testing",
    "Unit & Feature Testing (PHPUnit / Laravel)",
    "User Acceptance Testing (UAT)",
    "System Usability Scale (SUS)"
  ],
  "networking": {
    "sertifikasi": "BNSP Network Administrator Muda",
    "lembaga": "LSP Politeknik Negeri Malang",
    "status": "dalam proses"
  }
}`,
          en: `{
  "languages": ["PHP", "JavaScript", "SQL", "HTML", "CSS"],
  "frameworks": ["Laravel", "React", "Tailwind CSS", "Bootstrap", "Vite", "Node.js"],
  "tools": ["Git", "VS Code", "Figma", "MySQL", "Microsoft Office"],
  "analysis": ["ERD", "UML", "Business Process (BPMN)"],
  "qa": [
    "Black-box Testing",
    "Unit & Feature Testing (PHPUnit / Laravel)",
    "User Acceptance Testing (UAT)",
    "System Usability Scale (SUS)"
  ],
  "networking": {
    "certification": "BNSP Junior Network Administrator",
    "body": "LSP Politeknik Negeri Malang",
    "status": "in progress"
  }
}`,
        },
      },
      {
        key: 'ansthelabel',
        name: 'ansthelabel.ts',
        folder: 'projects',
        language: 'ts',
        icon: 'ts',
        code: {
          id: `export const ansthelabel = {
  type: 'E-commerce',
  domain: 'Fashion hijab & busana muslimah',
  stack: ['PHP', 'Laravel', 'MySQL'],
  myRole: 'Quality Assurance',
  context: 'Magang di PT Global Indo Multimedia (CashPlus)',
  live: 'https://ansthelabel.com/home',
  did: [
    'Menyusun skenario uji black-box untuk alur belanja',
    'Melacak & melaporkan bug sampai tuntas diperbaiki',
    'Uji regresi tiap rilis sebelum naik ke produksi',
  ],
};`,
          en: `export const ansthelabel = {
  type: 'E-commerce',
  domain: 'Hijab & modest fashion',
  stack: ['PHP', 'Laravel', 'MySQL'],
  myRole: 'Quality Assurance',
  context: 'Internship at PT Global Indo Multimedia (CashPlus)',
  live: 'https://ansthelabel.com/home',
  did: [
    'Wrote black-box test scenarios for the shopping flow',
    'Tracked and reported bugs through to verified fixes',
    'Ran regression passes before every production release',
  ],
};`,
        },
      },
      {
        key: 'simotb',
        name: 'simotb.ts',
        folder: 'projects',
        language: 'ts',
        icon: 'ts',
        code: {
          id: `export const simotb = {
  type: 'Sistem internal',
  domain: 'Manajemen operasional toko bangunan',
  stack: ['PHP', 'Laravel', 'MySQL', 'Tailwind', 'Vite', 'Node.js'],
  myRole: 'Fullstack Developer',
  access: 'internal', // tidak ada demo publik
  did: [
    'Merancang skema database & ERD dari proses bisnis toko',
    'Membangun modul stok, transaksi, dan laporan',
    'Menyusun UI operasional yang enak dipakai kasir & admin',
  ],
};`,
          en: `export const simotb = {
  type: 'Internal system',
  domain: 'Building-supply store operations',
  stack: ['PHP', 'Laravel', 'MySQL', 'Tailwind', 'Vite', 'Node.js'],
  myRole: 'Fullstack Developer',
  access: 'internal', // no public demo
  did: [
    'Designed the database schema & ERD from the store process',
    'Built the stock, transaction, and reporting modules',
    'Shaped an operational UI that cashiers and admins enjoy',
  ],
};`,
        },
      },
      {
        key: 'perkesmas',
        name: 'perkesmas.ts',
        folder: 'projects',
        language: 'ts',
        icon: 'ts',
        code: {
          id: `export const perkesmas = {
  type: 'Aplikasi web kuesioner',
  domain: 'Monitoring kesehatan pasien Puskesmas',
  stack: ['PHP native', 'MySQL'],
  myRole: 'Fullstack Developer',
  did: [
    'Membangun form kuesioner dinamis untuk petugas lapangan',
    'Menyimpan & merekap hasil monitoring per pasien',
    'Dibangun tanpa framework — murni PHP & SQL',
  ],
};`,
          en: `export const perkesmas = {
  type: 'Questionnaire web app',
  domain: 'Community health-centre patient monitoring',
  stack: ['Vanilla PHP', 'MySQL'],
  myRole: 'Fullstack Developer',
  did: [
    'Built dynamic questionnaire forms for field officers',
    'Stored and summarised monitoring results per patient',
    'Written without a framework — plain PHP & SQL',
  ],
};`,
        },
      },
      {
        key: 'kingkong',
        name: 'kingkong.ts',
        folder: 'projects',
        language: 'ts',
        icon: 'ts',
        code: {
          id: `export const kingkong = {
  status: 'in-progress', // masih dikerjakan
  type: 'Booking & katalog',
  domain: 'Jasa barber, mural graffiti, cat mural, merch kaos',
  stack: ['PHP', 'Laravel', 'MySQL'], // sisanya menyusul
  myRole: 'Fullstack Developer',
  planned: [
    'Booking jadwal barber & jasa mural',
    'Katalog produk cat mural dan merchandise kaos',
    'Dashboard admin untuk jadwal dan pesanan',
  ],
};`,
          en: `export const kingkong = {
  status: 'in-progress', // still being built
  type: 'Booking & catalogue',
  domain: 'Barber services, graffiti murals, mural paint, tee merch',
  stack: ['PHP', 'Laravel', 'MySQL'], // more to come
  myRole: 'Fullstack Developer',
  planned: [
    'Booking slots for barber and mural services',
    'Catalogue for mural paint and t-shirt merchandise',
    'Admin dashboard for schedules and orders',
  ],
};`,
        },
      },
      {
        key: 'readme',
        name: 'README.md',
        language: 'md',
        icon: 'md',
        code: {
          id: `# Triaji Ibnu Hermawan

Fullstack web developer, fresh graduate D4 Sistem Informasi Bisnis
Politeknik Negeri Malang.

## Yang saya kerjakan

- Membangun aplikasi web dengan **Laravel** di belakang dan
  **React / Tailwind** di depan.
- Merancang **database & ERD** dari proses bisnis, bukan dari tebakan.
- Menguji sendiri hasilnya: **black-box**, **unit & feature test**,
  **UAT**, sampai **SUS** untuk mengukur kenyamanan pemakai.

## Kenapa saya

> Saya bukan yang paling lama pengalamannya. Tapi saya terbiasa
> membaca kebutuhan, menuliskannya jadi kode, lalu mengujinya
> sebelum orang lain yang menemukan masalahnya.

## Status

- Terbuka untuk peluang kerja fulltime maupun freelance.
- Basis di Malang / Blitar, siap remote maupun on-site.

**Kontak:** triaji3ibnu.work@gmail.com`,
          en: `# Triaji Ibnu Hermawan

Fullstack web developer, fresh graduate in Business Information
Systems (D4) from State Polytechnic of Malang.

## What I do

- Build web apps with **Laravel** on the back and
  **React / Tailwind** on the front.
- Design **databases & ERDs** from the business process,
  not from guesswork.
- Test my own work: **black-box**, **unit & feature tests**,
  **UAT**, and **SUS** to measure real usability.

## Why me

> I am not the most experienced person in the room. But I am used
> to reading a requirement, turning it into code, and testing it
> before anyone else finds the problem.

## Status

- Open to full-time and freelance opportunities.
- Based in Malang / Blitar, happy to work remote or on-site.

**Contact:** triaji3ibnu.work@gmail.com`,
        },
      },
    ]),

    terminal: terminalSteps([
      {
        cmd: 'whoami',
        output: [
          same('triaji@polinema:~$ fullstack-web-developer'),
          {
            id: '→ Laravel · React · Tailwind · MySQL · pola pikir QA',
            en: '→ Laravel · React · Tailwind · MySQL · QA mindset',
          },
        ],
      },
      {
        cmd: 'php artisan test',
        output: [
          same('  PASS  Tests\\Feature\\AuthTest'),
          same('  ✓ user can log in'),
          same('  PASS  Tests\\Feature\\OrderTest'),
          same('  ✓ order total is calculated correctly'),
          same('  ✓ stock decreases after checkout'),
          same(''),
          same('  Tests:  5 passed (12 assertions)'),
          { id: '  ✓ tests passed', en: '  ✓ tests passed' },
        ],
      },
      {
        cmd: 'cat skills.json | jq .qa',
        output: [
          same('['),
          same('  "Black-box Testing",'),
          same('  "Unit & Feature Testing (PHPUnit / Laravel)",'),
          same('  "User Acceptance Testing (UAT)",'),
          same('  "System Usability Scale (SUS)"'),
          same(']'),
        ],
      },
      {
        cmd: 'echo $STATUS',
        output: [
          {
            id: 'AVAILABLE_FOR_WORK=true  # silakan scroll ke bawah untuk kontak',
            en: 'AVAILABLE_FOR_WORK=true  # scroll down to get in touch',
          },
        ],
      },
    ]),
  },

  /* ------------------------------------------------------------------------ */
  /* SKILLS                                                                    */
  /* ------------------------------------------------------------------------ */

  skills: skillGroups([
    {
      key: 'languages',
      label: { id: 'Bahasa Pemrograman', en: 'Languages' },
      icon: 'code',
      items: [
        { name: 'PHP', icon: 'php' },
        { name: 'JavaScript', icon: 'js' },
        { name: 'SQL', icon: 'db' },
        { name: 'HTML', icon: 'html' },
        { name: 'CSS', icon: 'css' },
      ],
    },
    {
      key: 'frameworks',
      label: { id: 'Framework & Library', en: 'Frameworks & Libraries' },
      icon: 'layers',
      items: [
        { name: 'Laravel', icon: 'laravel' },
        { name: 'React', icon: 'react' },
        { name: 'Tailwind CSS', icon: 'tailwind' },
        { name: 'Bootstrap', icon: 'bootstrap' },
        { name: 'Vite', icon: 'vite' },
        { name: 'Node.js', icon: 'node' },
      ],
    },
    {
      key: 'tools',
      label: { id: 'Tools', en: 'Tools' },
      icon: 'wrench',
      items: [
        { name: 'Git', icon: 'git' },
        { name: 'VS Code', icon: 'editor' },
        { name: 'Figma', icon: 'figma' },
        { name: 'MySQL', icon: 'db' },
        { name: 'Microsoft Office', icon: 'office' },
      ],
    },
    {
      key: 'analysis',
      label: { id: 'Analisis & QA', en: 'Analysis & QA' },
      icon: 'check',
      items: [
        {
          name: 'ERD',
          icon: 'erd',
          note: { id: 'Perancangan basis data', en: 'Database design' },
        },
        {
          name: 'UML',
          icon: 'uml',
          note: { id: 'Use case & activity diagram', en: 'Use case & activity diagrams' },
        },
        {
          name: 'Business Process (BPMN)',
          icon: 'flow',
          note: { id: 'Pemetaan proses bisnis', en: 'Business process mapping' },
        },
        {
          name: 'Black-box Testing',
          icon: 'bug',
          note: { id: 'Skenario uji dari sisi pengguna', en: 'Test scenarios from the user side' },
        },
        {
          name: 'Unit & Feature Testing',
          icon: 'test',
          note: { id: 'PHPUnit / Laravel', en: 'PHPUnit / Laravel' },
        },
        {
          name: 'UAT',
          icon: 'users',
          note: { id: 'User Acceptance Testing', en: 'User Acceptance Testing' },
        },
        {
          name: 'SUS',
          icon: 'gauge',
          note: { id: 'System Usability Scale', en: 'System Usability Scale' },
        },
      ],
    },
  ]),

  /* ------------------------------------------------------------------------ */
  /* PROJECTS                                                                  */
  /* ------------------------------------------------------------------------ */

  projects: projectList([
    {
      key: 'ansthelabel',
      title: 'Ansthelabel',
      kicker: { id: 'E-commerce fashion muslimah', en: 'Modest fashion e-commerce' },
      year: '2025',
      role: { id: 'Quality Assurance', en: 'Quality Assurance' },
      description: {
        id: 'Web e-commerce pakaian hijab & busana muslimah. Saya masuk sebagai QA saat magang di PT Global Indo Multimedia (CashPlus): menyusun skenario uji, mengejar bug sampai tuntas, dan memastikan alur belanja aman sebelum rilis.',
        en: 'A hijab and modest-fashion e-commerce site. I joined as QA during my internship at PT Global Indo Multimedia (CashPlus): writing test scenarios, chasing bugs to a verified fix, and clearing the shopping flow before every release.',
      },
      highlights: [
        { id: 'Skenario uji black-box untuk alur belanja & checkout', en: 'Black-box test scenarios for the browse-to-checkout flow' },
        { id: 'Pelaporan bug terstruktur sampai diverifikasi selesai', en: 'Structured bug reports tracked to verified closure' },
        { id: 'Uji regresi tiap rilis sebelum naik produksi', en: 'Regression passes before each production release' },
      ],
      tech: ['PHP', 'Laravel', 'MySQL'],
      status: 'live',
      demoUrl: 'https://ansthelabel.com/home',
      // TODO: isi `repoUrl` kalau repository-nya boleh dipublikasikan.
      accent: 'teal',
      span: 'wide',
    },
    {
      key: 'simotb',
      title: 'SIMOTB',
      kicker: { id: 'Sistem operasional toko bangunan', en: 'Building-supply store ops system' },
      year: '2025',
      role: { id: 'Fullstack Developer', en: 'Fullstack Developer' },
      description: {
        id: 'Web internal untuk mengelola operasional toko bangunan — stok, transaksi, dan laporan dalam satu tempat. Dibangun penuh dari perancangan database sampai antarmuka yang dipakai kasir dan admin setiap hari.',
        en: 'An internal web app that runs a building-supply store — stock, transactions, and reports in one place. Built end to end, from the database design to the interface cashiers and admins use daily.',
      },
      highlights: [
        { id: 'Perancangan ERD langsung dari proses bisnis toko', en: 'ERD designed straight from the store business process' },
        { id: 'Modul stok, transaksi, dan laporan operasional', en: 'Stock, transaction, and operational reporting modules' },
        { id: 'Frontend Tailwind + Vite di atas Laravel', en: 'Tailwind + Vite frontend on top of Laravel' },
      ],
      tech: ['PHP', 'Laravel', 'MySQL', 'Tailwind', 'Vite', 'Node.js'],
      status: 'internal',
      // TODO: isi `repoUrl` kalau repository-nya boleh dipublikasikan.
      // TODO: taruh screenshot di `public/shots/simotb.png` lalu buka baris di bawah.
      // screenshotUrl: '/shots/simotb.png',
      accent: 'violet',
      span: 'tall',
    },
    {
      key: 'perkesmas',
      title: 'Perkesmas',
      kicker: { id: 'Monitoring kesehatan Puskesmas', en: 'Community health monitoring' },
      year: '2024',
      role: { id: 'Fullstack Developer', en: 'Fullstack Developer' },
      description: {
        id: 'Web kuesioner untuk monitoring kesehatan pasien Puskesmas. Petugas mengisi kuesioner di lapangan, hasilnya langsung terekap per pasien. Dibangun dengan PHP native — tanpa framework, murni logika dan SQL.',
        en: 'A questionnaire web app for community health-centre patient monitoring. Officers fill it in the field and results are summarised per patient. Built in vanilla PHP — no framework, just logic and SQL.',
      },
      highlights: [
        { id: 'Form kuesioner dinamis untuk petugas lapangan', en: 'Dynamic questionnaire forms for field officers' },
        { id: 'Rekap hasil monitoring per pasien', en: 'Per-patient monitoring summaries' },
        { id: 'PHP native — memahami dasarnya tanpa framework', en: 'Vanilla PHP — the fundamentals without a framework' },
      ],
      tech: ['PHP native', 'MySQL'],
      status: 'internal',
      // TODO: isi `demoUrl` / `repoUrl` kalau tersedia.
      // TODO: taruh screenshot di `public/shots/perkesmas.png` lalu buka baris di bawah.
      // screenshotUrl: '/shots/perkesmas.png',
      accent: 'green',
      span: 'normal',
    },
    {
      key: 'kingkong',
      title: 'Kingkong',
      kicker: { id: 'Booking barber, mural & merch', en: 'Barber, mural & merch booking' },
      year: '2026',
      role: { id: 'Fullstack Developer', en: 'Fullstack Developer' },
      description: {
        id: 'Web booking jasa barber & mural graffiti, sekaligus katalog produk cat mural dan merchandise kaos. Sedang dikerjakan — fondasi Laravel dan skema database sudah jalan, sisanya menyusul.',
        en: 'A booking site for barber and graffiti-mural services, plus a catalogue for mural paint and t-shirt merch. Work in progress — the Laravel foundation and database schema are running, the rest is on the way.',
      },
      highlights: [
        { id: 'Booking jadwal barber & jasa mural', en: 'Booking slots for barber and mural services' },
        { id: 'Katalog cat mural dan merchandise kaos', en: 'Catalogue for mural paint and tee merchandise' },
        { id: 'Dashboard admin untuk jadwal dan pesanan', en: 'Admin dashboard for schedules and orders' },
      ],
      tech: ['PHP', 'Laravel', 'MySQL'],
      status: 'in-progress',
      // TODO: link demo & repo menyusul setelah projek rilis.
      accent: 'amber',
      span: 'compact',
    },
  ]),

  /* ------------------------------------------------------------------------ */
  /* ABOUT                                                                     */
  /* ------------------------------------------------------------------------ */

  about: {
    bio: {
      id: 'Saya Triaji, fresh graduate D4 Sistem Informasi Bisnis Politeknik Negeri Malang. Fokus saya di pengembangan web fullstack dengan Laravel, ditemani kebiasaan berpikir sebagai QA dan latar belakang bisnis yang membantu menerjemahkan kebutuhan jadi solusi yang benar-benar jalan.',
      en: "I'm Triaji, a fresh graduate in Business Information Systems (D4) from State Polytechnic of Malang. I focus on fullstack web development with Laravel, backed by a QA mindset and a business background that helps translate needs into solutions that actually work.",
    },
    bioSecondary: {
      id: 'Pengalaman jadi QA mengajari saya satu hal yang menempel: kode yang “sudah jalan di laptop saya” belum tentu jalan di tangan orang lain. Jadi saya menulis, lalu menguji, lalu memperbaiki — sebelum orang lain yang menemukannya. Sekarang saya terbuka untuk peluang kerja.',
      en: 'Working as QA taught me something that stuck: code that “works on my machine” is not the same as code that works in someone else’s hands. So I write, then test, then fix — before anyone else has to find it. I’m now open to opportunities.',
    },
    /** Kalimat-kalimat pendek yang jadi pembeda. */
    pillars: [
      {
        key: 'fullstack',
        icon: 'layers',
        title: { id: 'Fullstack, bukan setengah', en: 'Fullstack, not half' },
        text: {
          id: 'Dari skema database sampai komponen antarmuka, saya nyaman mengerjakan keduanya.',
          en: 'From the database schema to the interface components, I am comfortable on both ends.',
        },
      },
      {
        key: 'qa',
        icon: 'bug',
        title: { id: 'Mata seorang QA', en: 'A QA’s eye' },
        text: {
          id: 'Terbiasa mencari celah di alur sendiri sebelum sampai ke pengguna.',
          en: 'Trained to hunt the gaps in my own flow before a user ever meets them.',
        },
      },
      {
        key: 'network',
        icon: 'network',
        title: { id: 'Paham jaringan', en: 'Networking literate' },
        text: {
          id: 'Sertifikasi BNSP Network Administrator Muda — deploy dan troubleshoot bukan kotak hitam.',
          en: 'BNSP Junior Network Administrator — deployment and troubleshooting are not a black box.',
        },
      },
      {
        key: 'business',
        icon: 'briefcase',
        title: { id: 'Latar bisnis', en: 'Business background' },
        text: {
          id: 'D4 Sistem Informasi Bisnis: membaca proses dulu, menulis kode kemudian.',
          en: 'Business Information Systems: read the process first, write the code second.',
        },
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  /* TIMELINE                                                                  */
  /* ------------------------------------------------------------------------ */

  timeline: timelineEntries([
    {
      key: 'kuliah',
      period: { id: '2022 – 2026', en: '2022 – 2026' },
      title: { id: 'D4 Sistem Informasi Bisnis', en: 'B.A.Sc. Business Information Systems' },
      org: { id: 'Politeknik Negeri Malang', en: 'State Polytechnic of Malang' },
      description: {
        id: 'Empat tahun belajar menjembatani proses bisnis dan sistem: analisis kebutuhan, perancangan basis data, sampai membangun aplikasinya sendiri.',
        en: 'Four years learning to bridge business processes and systems: requirement analysis, database design, and building the applications themselves.',
      },
      tag: { id: 'Pendidikan', en: 'Education' },
      state: 'done',
    },
    {
      key: 'magang',
      period: { id: 'Jul 2025 – Des 2025', en: 'Jul 2025 – Dec 2025' },
      title: { id: 'Magang Quality Assurance', en: 'Quality Assurance Intern' },
      org: { id: 'PT Global Indo Multimedia (CashPlus)', en: 'PT Global Indo Multimedia (CashPlus)' },
      description: {
        id: 'Menguji Ansthelabel, web e-commerce pakaian muslimah. Menyusun skenario uji, melaporkan bug, dan mengawal perbaikannya sampai benar-benar beres.',
        en: 'Tested Ansthelabel, a modest-fashion e-commerce site. Wrote test scenarios, reported bugs, and shepherded the fixes until they genuinely held.',
      },
      tag: { id: 'Pengalaman', en: 'Experience' },
      state: 'done',
    },
    {
      key: 'freelance',
      period: { id: '2024 – sekarang', en: '2024 – present' },
      title: { id: 'Freelance Fullstack Web / Software Developer', en: 'Freelance Fullstack Web / Software Developer' },
      org: { id: 'Mandiri', en: 'Independent' },
      description: {
        id: 'Mengerjakan sistem internal dan aplikasi web dari nol: SIMOTB, Perkesmas, dan Kingkong. Bicara langsung dengan pemilik proses, lalu menerjemahkannya jadi aplikasi.',
        en: 'Building internal systems and web apps from scratch: SIMOTB, Perkesmas, and Kingkong. Talking directly to process owners, then turning that into an application.',
      },
      tag: { id: 'Pengalaman', en: 'Experience' },
      state: 'ongoing',
    },
    {
      key: 'bnsp',
      period: { id: '2026', en: '2026' },
      title: { id: 'Sertifikasi BNSP Network Administrator Muda', en: 'BNSP Junior Network Administrator Certification' },
      org: { id: 'LSP Politeknik Negeri Malang', en: 'LSP Politeknik Negeri Malang' },
      description: {
        id: 'Sertifikasi kompetensi administrasi jaringan — konfigurasi, keamanan dasar, dan troubleshooting. Sedang dalam proses.',
        en: 'A network administration competency certification — configuration, basic security, and troubleshooting. Currently in progress.',
      },
      tag: { id: 'Sertifikasi', en: 'Certification' },
      state: 'ongoing',
      showCertificate: true,
      // TODO: taruh file sertifikat di `public/certs/bnsp-network-admin.pdf`
      //       lalu buka baris di bawah supaya badge-nya jadi link.
      // certificateUrl: '/certs/bnsp-network-admin.pdf',
    },
  ]),

  /* ------------------------------------------------------------------------ */
  /* UI STRINGS                                                                */
  /* ------------------------------------------------------------------------ */

  ui: {
    nav: {
      work: { id: 'Projek', en: 'Work' },
      about: { id: 'Tentang', en: 'About' },
      contact: { id: 'Kontak', en: 'Contact' },
      available: { id: 'Terbuka untuk kerja', en: 'Available for work' },
      unavailable: { id: 'Sedang tidak tersedia', en: 'Not available' },
      menu: { id: 'Buka menu', en: 'Open menu' },
      close: { id: 'Tutup menu', en: 'Close menu' },
      switchLang: { id: 'Ganti bahasa ke English', en: 'Switch language to Bahasa Indonesia' },
      skipToContent: { id: 'Lompat ke konten utama', en: 'Skip to main content' },
    },

    preloader: {
      label: { id: 'Memuat', en: 'Loading' },
      hint: { id: 'menyiapkan workspace', en: 'preparing workspace' },
    },

    hero: {
      intro: { id: 'Fresh graduate — siap kerja', en: 'Fresh graduate — ready to work' },
      scroll: { id: 'Gulir', en: 'Scroll' },
      seeWork: { id: 'Lihat projek', en: 'See work' },
      contactMe: { id: 'Hubungi saya', en: 'Get in touch' },
      canvasFallback: {
        id: 'Visual 3D tidak didukung di perangkat ini.',
        en: '3D visual is not supported on this device.',
      },
    },

    ide: {
      index: '01',
      label: { id: 'IDE MODE', en: 'IDE MODE' },
      title: { id: 'Buka saja isinya', en: 'Just open it up' },
      subtitle: {
        id: 'Alih-alih paragraf panjang, silakan baca profil saya seperti membaca kode. Klik file di sebelah kiri.',
        en: 'Instead of long paragraphs, read my profile the way you read code. Click a file on the left.',
      },
      explorer: { id: 'EXPLORER', en: 'EXPLORER' },
      hint: { id: 'klik file untuk membuka', en: 'click a file to open' },
      terminalLabel: { id: 'TERMINAL', en: 'TERMINAL' },
      replay: { id: 'Ulangi animasi terminal', en: 'Replay terminal' },
      problems: { id: 'Tidak ada masalah', en: 'No problems' },
    },

    skills: {
      index: '02',
      label: { id: 'TECH STACK', en: 'TECH STACK' },
      title: { id: 'Yang saya pakai', en: 'What I work with' },
      subtitle: {
        id: 'Bukan daftar panjang demi terlihat ramai — ini yang benar-benar saya pakai untuk membangun dan menguji.',
        en: 'Not a long list for show — these are the tools I actually build and test with.',
      },
    },

    projects: {
      index: '03',
      label: { id: 'SELECTED WORK', en: 'SELECTED WORK' },
      title: { id: 'Yang sudah dibangun', en: 'What I have built' },
      subtitle: {
        id: 'Empat projek nyata: satu sebagai QA, tiga sebagai fullstack. Termasuk yang masih dikerjakan.',
        en: 'Four real projects: one as QA, three as fullstack. Including one still in progress.',
      },
      demo: { id: 'Demo langsung', en: 'Live demo' },
      repo: { id: 'Repository', en: 'Repository' },
      screenshot: { id: 'Lihat screenshot', en: 'View screenshot' },
      live: { id: 'Live', en: 'Live' },
      internal: { id: 'Sistem internal', en: 'Internal system' },
      comingSoon: { id: 'Segera hadir', en: 'Coming soon' },
      inProgress: { id: 'Sedang dikerjakan', en: 'In progress' },
      cursor: { id: 'LIHAT', en: 'VIEW' },
      role: { id: 'Peran', en: 'Role' },
      stack: { id: 'Stack', en: 'Stack' },
      closeShot: { id: 'Tutup screenshot', en: 'Close screenshot' },
    },

    about: {
      index: '04',
      label: { id: 'ABOUT', en: 'ABOUT' },
      title: { id: 'Orang di balik kodenya', en: 'The person behind the code' },
      monogramAlt: {
        id: 'Monogram huruf T untuk Triaji Ibnu Hermawan',
        en: 'Letter T monogram for Triaji Ibnu Hermawan',
      },
      photoAlt: {
        id: 'Foto Triaji Ibnu Hermawan',
        en: 'Photo of Triaji Ibnu Hermawan',
      },
      timelineTitle: { id: 'Perjalanan', en: 'Timeline' },
      certificate: { id: 'Lihat sertifikat', en: 'View certificate' },
      certificatePending: { id: 'Sertifikat menyusul', en: 'Certificate pending' },
      ongoing: { id: 'Berjalan', en: 'Ongoing' },
    },

    contact: {
      index: '05',
      label: { id: 'CONTACT', en: 'CONTACT' },
      title: { id: 'Ayo bangun sesuatu', en: "Let's build something" },
      subtitle: {
        id: 'Punya projek, lowongan, atau sekadar mau ngobrol soal Laravel? Kirim email — saya balas.',
        en: 'Got a project, a role, or just want to talk Laravel? Send an email — I reply.',
      },
      emailLabel: { id: 'Email', en: 'Email' },
      copy: { id: 'Salin email', en: 'Copy email' },
      copied: { id: 'Tersalin!', en: 'Copied!' },
      downloadCv: { id: 'Unduh CV', en: 'Download CV' },
      cvPending: { id: 'CV menyusul', en: 'CV coming soon' },
      locationLabel: { id: 'Lokasi', en: 'Location' },
      socialsLabel: { id: 'Sosial', en: 'Elsewhere' },
      sendEmail: { id: 'Kirim email', en: 'Send an email' },
    },

    footer: {
      credit: { id: 'designed & coded by Triaji', en: 'designed & coded by Triaji' },
      localTime: { id: 'waktu lokal', en: 'local time' },
      backToTop: { id: 'Kembali ke atas', en: 'Back to top' },
      builtWith: { id: 'dibangun dengan', en: 'built with' },
    },
  },
};

export type Content = typeof content;

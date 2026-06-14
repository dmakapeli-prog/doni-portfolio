"use client";

import { useState, useEffect, useRef, useMemo } from "react";

/* ==================================================================
   HOOKS
   ================================================================== */
function useStaggerFade() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(".fade-up");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.1 }
    );
    items.forEach((c) => io.observe(c));
    return () => items.forEach((c) => io.unobserve(c));
  }, []);
  return ref;
}

/* ==================================================================
   TYPING ANIMATION HOOK
   ================================================================== */
function useTypingAnimation(words, typingSpeed = 100, deletingSpeed = 50, pauseDelay = 2000) {
  const wordsRef = useRef(words);
  wordsRef.current = words;

  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = wordsRef.current[wordIndex];
    let timeout;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % wordsRef.current.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, typingSpeed, deletingSpeed, pauseDelay]);

  return text;
}

/* ==================================================================
   ANIMATED BACKGROUND BLOBS
   ================================================================== */
function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="blob blob-cyan w-[500px] h-[500px] top-[-10%] left-[-5%]" />
      <div className="blob blob-purple w-[600px] h-[600px] bottom-[-15%] right-[-10%]" />
      <div className="blob blob-cyan w-[400px] h-[400px] top-[40%] left-[30%] opacity-5" />
    </div>
  );
}

/* ==================================================================
   NAVBAR (Glassmorphism Pill)
   ================================================================== */
function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "pt-4" : "pt-6"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Kiri: Logo */}
        <div className="flex flex-col items-center md:items-start">
          <a href="#home" className="text-2xl font-bold tracking-tight text-white flex items-center gap-1 select-none">
            Doni
          </a>
          <span className="text-[10px] tracking-[0.25em] text-text-secondary mt-0.5">
            PERSONAL PORTFOLIO
          </span>
        </div>

        {/* Tengah/Kanan: Menu Pill */}
        <div className="nav-pill rounded-full px-2 py-1.5 hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setActive(l.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active === l.id
                  ? "nav-item-active"
                  : "text-text-secondary nav-item-hover"
                }`}
            >
              {l.label}
            </a>
          ))}
        </div>

      </div>
    </nav>
  );
}

/* ==================================================================
   ID CARD COMPONENT
   ================================================================== */
function IDCard() {
  return (
    <div className="id-card-wrapper flex flex-col items-center cursor-pointer select-none">

      {/* --- Lanyard Top Holes (Gesper) --- */}
      <div className="flex justify-between items-center w-8 h-4 bg-white/10 border border-white/20 rounded-t-sm px-1.5 relative z-10">
        <div className="w-2 h-2 rounded-full bg-gray-200 border border-gray-400" />
        <div className="w-2 h-2 rounded-full bg-gray-200 border border-gray-400" />
      </div>

      {/* --- Lanyard Strap --- */}
      <div className="w-[6px] h-[80px] bg-gradient-to-b from-accent-cyan to-accent-purple -mt-0.5 z-0" />

      {/* --- Card Body --- */}
      <div className="id-card-body w-[260px] h-[360px] rounded-2xl p-6 flex flex-col items-center relative z-20 -mt-1">

        {/* Foto Profil */}
        <div className="w-32 h-32 rounded-xl mb-5 flex items-center justify-center shadow-inner relative overflow-hidden">
          <img
            src="/foto-doni.jpeg"
            alt="Donie Makapeli"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>

        {/* Nama & Role */}
        <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">Doni</h3>
        <p className="text-accent-cyan text-[11px] font-medium tracking-widest uppercase">
          Web Developer | Data Analyst
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-white/15 my-4" />

        {/* Instansi */}
        <p className="text-text-secondary text-xs font-medium tracking-wide">
          Universitas Nusa Putra
        </p>
        <p className="text-text-secondary/70 text-[10px] mt-1 tracking-wider uppercase">
          S1 Teknik Informatika
        </p>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-b-2xl opacity-70" />
      </div>

    </div>
  );
}

/* ==================================================================
   HOME SECTION (Layout 2 Kolom)
   ================================================================== */
function HomeSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const stats = [
    { num: "2+", label: "Tahun Belajar Coding" },
    { num: "10+", label: "Project Dibuat" },
    { num: "1", label: "Pengalaman Magang" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-16 px-5 sm:px-8 z-10">
      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-[60%_40%] gap-12 lg:gap-8 items-center">

        {/* ====== KIRI (60%): Teks ====== */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">

          <p className="text-text-secondary text-xs tracking-wider mb-4 uppercase">
            Portfolio Website V1
          </p>

          <div className="badge-glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white mb-6">
            <span>✨</span> Mahasiswa S1 Teknik Informatika - Universitas Nusa Putra
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
            Donie Makapeli
          </h1>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl italic font-serif gradient-text mb-6">
            Web Developer + Data Analyst
          </h2>

          <TypingLine />

          <p className="gradient-text-animated text-lg sm:text-xl font-semibold mb-6 max-w-lg">
            Membangun Pengalaman Digital dari Kode hingga Data
          </p>

          <p className="text-text-secondary text-sm leading-relaxed max-w-xl mb-10">
            Saya mahasiswa S1 Teknik Informatika di Universitas Nusa Putra dengan minat pada
            pengembangan web modern dan analisis data. Berpengalaman magang sebagai Administrasi
            di PT Bank Rakyat Indonesia (BRI) Unit Cipanas, di mana saya juga mengerjakan project
            analisis data kunjungan nasabah menggunakan Python sebagai kontribusi sesuai bidang Informatika.
          </p>

          {/* Stat Row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-y-4 mb-10 w-full">
            {stats.map((s, i) => (
              <div key={i} className={`flex flex-col items-center md:items-start px-4 sm:px-6 ${i !== 0 ? 'border-l border-white/10' : 'pl-0'}`}>
                <p className="text-2xl sm:text-3xl font-bold text-white">{s.num}</p>
                <p className="text-text-secondary text-[11px] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <a href="#about" className="btn-gradient px-8 py-3 rounded-full text-sm">
              About Me 👋
            </a>
            <button onClick={handleCopy} className="btn-outline px-8 py-3 rounded-full text-sm">
              {copied ? "Tersalin! ✅" : "Copy Link 🔗"}
            </button>
          </div>

        </div>

        {/* ====== KANAN (40%): ID Card ====== */}
        <div className="flex justify-center md:justify-end order-1 md:order-2 pt-8 md:pt-0">
          <IDCard />
        </div>

      </div>
    </section>
  );
}

/* ==================================================================
   ABOUT SECTION
   ================================================================== */
function AboutSection() {
  const stagger = useStaggerFade();

  const cards = [
    { icon: "🌐", title: "Web Development", desc: "Next.js, React, Tailwind" },
    { icon: "📊", title: "Data Analysis", desc: "Python, Pandas, EDA" },
    { icon: "🎨", title: "UI/UX Design", desc: "Figma, Design System" },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 px-5 sm:px-8 z-10">
      <div ref={stagger} className="max-w-7xl mx-auto">
        <div className="fade-up text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-3">TENTANG SAYA</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Mengenal Lebih Dekat
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* KOLOM KIRI */}
          <div className="fade-up fade-delay-1 flex justify-center">
            <div className="glass-card w-full max-w-md p-6 sm:p-8 flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(0,217,255,0.2)] border border-accent-cyan/30">
                <img
                  src="/foto-doni.jpeg"
                  alt="Donie Makapeli"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-xl">📍</span>
                  <span className="text-text-secondary font-medium">Sukabumi, Jawa Barat</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-xl">🎓</span>
                  <span className="text-text-secondary font-medium">S1 Teknik Informatika</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-xl">💼</span>
                  <span className="text-text-secondary font-medium">Magang di PT BRI Unit Cipanas</span>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="flex flex-col gap-6">
            <p className="fade-up fade-delay-2 text-text-secondary leading-relaxed text-sm sm:text-base">
              Saya <span className="text-white font-medium">Donie Makapeli</span>, mahasiswa S1 Teknik
              Informatika di Universitas Nusa Putra dengan fokus pada pengembangan web modern menggunakan
              Next.js dan Tailwind CSS, serta analisis data menggunakan Python.
            </p>
            <p className="fade-up fade-delay-3 text-text-secondary leading-relaxed text-sm sm:text-base">
              Berpengalaman magang sebagai Administrasi di PT Bank Rakyat Indonesia (BRI) Unit Cipanas,
              di mana saya mengerjakan project analisis data kunjungan nasabah sebagai kontribusi sesuai
              bidang Informatika - mulai dari preprocessing data, exploratory data analysis, hingga penyusunan laporan.
            </p>
            <p className="fade-up fade-delay-4 text-text-secondary leading-relaxed text-sm sm:text-base">
              Selain itu, saya membangun <span className="text-accent-cyan font-medium">DTech</span>, sebuah
              website agency digital berisi 10+ halaman demo template (e-commerce, company profile, undangan
              digital, dan lainnya) untuk menunjukkan kemampuan dalam membangun layout, animasi, dan tampilan
              responsif menggunakan Next.js. Saya juga aktif di organisasi mahasiswa untuk mengasah kepemimpinan dan kerja tim.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-2">
              {cards.map((c, i) => (
                <div key={i} className={`fade-up fade-delay-${(i % 3) + 2} glass-card p-5 hover:-translate-y-1.5 transition-transform duration-300 hover:shadow-[0_10px_30px_rgba(0,217,255,0.15)] hover:border-accent-cyan/30`}>
                  <span className="text-2xl mb-3 block">{c.icon}</span>
                  <h4 className="text-white font-bold text-sm mb-1">{c.title}</h4>
                  <p className="text-text-secondary text-xs">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   CERTIFICATE GRID COMPONENT
   ================================================================== */
function CertificateGrid() {
  const [showAll, setShowAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const certs = [
    { src: '/certificates/sertif-icitacs.jpg', nama: 'ICITACS 2025 - International Conference on IT', penerbit: 'Nusa Putra University | Japan', tahun: '2025' },
    { src: '/certificates/sertif-icemac.jpg', nama: 'ICEMAC 2025 - International Conference on Economic', penerbit: 'Nusa Putra University | Japan', tahun: '2025' },
    { src: '/certificates/sertif-mikrotik.jpg', nama: 'MikroTik Certified Network Associate (MTCNA)', penerbit: 'MikroTik', tahun: '2026' },
    { src: '/certificates/sertif-databases.jpg', nama: 'IT Specialist - Databases', penerbit: 'Certiport x CertNexus x Pearson', tahun: '2026' },
    { src: '/certificates/sertif-myskill.jpg', nama: 'Pivot Table in Microsoft Excel', penerbit: 'MySkill Short Class', tahun: '2025' },
    { src: '/certificates/sertif-workshop-ti.jpg', nama: 'Workshop TI - Keamanan Jaringan & Proteksi Cyber', penerbit: 'Universitas Nusa Putra', tahun: '2024' },
    { src: '/certificates/sertif-workshop-si.jpg', nama: 'Workshop SI - From Data to Decisions: AI', penerbit: 'Universitas Nusa Putra', tahun: '2025' },
    { src: '/certificates/sertif-public-speaking.jpg', nama: 'Public Speaking - Novice Level (EPDC x MURI)', penerbit: 'The Energetic EPDC', tahun: '2026' },
  ];

  const visible = showAll ? certs : certs.slice(0, 4);

  return (
    <div>
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setModalOpen(false)}
            style={{
              position: 'absolute', top: 20, right: 30,
              color: 'white', fontSize: '2rem',
              background: 'none', border: 'none',
              cursor: 'pointer',
            }}
          >✕</button>
          <img
            src={modalImage}
            alt="Certificate Preview"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '12px',
            }}
          />
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginTop: '24px',
      }}>
        {visible.map((cert, i) => (
          <div
            key={i}
            onClick={() => { setModalImage(cert.src); setModalOpen(true); }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.borderColor = '#00D9FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
              <img
                src={cert.src}
                alt={cert.nama}
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x180/1a1a2e/00D9FF?text=Sertifikat';
                }}
              />
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(10,14,23,0.6)' }}>
              <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                {cert.nama}
              </h4>
              <p style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '6px' }}>
                {cert.penerbit}
              </p>
              <span style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: '999px',
                border: '1px solid #00D9FF',
                color: '#00D9FF',
                fontSize: '11px',
              }}>
                {cert.tahun}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            padding: '10px 28px',
            borderRadius: '999px',
            border: '1px solid #00D9FF',
            color: '#00D9FF',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {showAll ? 'Show Less ↑' : 'Show More ↓'}
        </button>
      </div>
    </div>
  );
}

/* ==================================================================
   EDUCATION SECTION
   ================================================================== */
function EducationSection() {
  const stagger = useStaggerFade();
  const [activeTab, setActiveTab] = useState("Academic");

  const tabs = [
    { id: "Academic", icon: "📚" },
    { id: "Experience", icon: "💼" },
    { id: "Achievement", icon: "🏆" },
    { id: "Certificate", icon: "📜" }
  ];

  const content = {
    Academic: [
      {
        period: "2023 - Sekarang",
        title: "S1 Teknik Informatika",
        sub: "Universitas Nusa Putra, Sukabumi",
        badge: "Semester 6",
      },
      {
        period: "2020 - 2023",
        title: "SMAN 1 Cibadak",
        sub: "Cibadak, Sukabumi",
        badge: "Lulus",
      }
    ],
    Experience: [
      {
        period: "Feb 2026 - Jun 2026",
        title: "Magang Administrasi & Data Science",
        sub: "PT Bank Rakyat Indonesia (BRI) Unit Cipanas",
        badge: "Magang",
        desc: "Mengerjakan analisis data kunjungan nasabah (AR/FR) menggunakan Python dan Google Colab"
      },
      {
        period: "2024 - Sekarang",
        title: "Anggota Himpunan Mahasiswa",
        sub: "Universitas Nusa Putra",
        badge: "Organisasi",
      }
    ],
    Achievement: [
      {
        period: "2026",
        title: "Menyelesaikan Project DTech",
        sub: "Website agency digital dengan 10+ halaman demo",
        badge: "Project",
      },
      {
        period: "2026",
        title: "Laporan Analisis Data Kunjungan Nasabah BRI",
        sub: "Preprocessing & EDA 5.956+ data transaksi menggunakan Python (Pandas) - format laporan IEEE",
        badge: "Data Analysis",
      }
    ]
  };

  return (
    <section id="education" className="relative py-24 sm:py-32 px-5 sm:px-8 z-10 bg-gradient-to-b from-transparent via-[rgba(26,18,53,0.4)] to-transparent">
      <div ref={stagger} className="max-w-5xl mx-auto">
        <div className="fade-up text-center mb-12">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-3">JOURNEY, EXPERIENCE & ACHIEVEMENT</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-10">
            Pendidikan & Pengalaman
          </h2>

          {/* Filter Tabs */}
          <div className="inline-flex flex-wrap justify-center gap-2 md:gap-3 p-1.5 rounded-full nav-pill mb-16">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${activeTab === t.id
                    ? "bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg"
                    : "text-text-secondary hover:text-white border border-transparent hover:border-white/10"
                  }`}
              >
                <span>{t.icon}</span> {t.id}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="relative fade-up fade-delay-2 transition-opacity duration-500 min-h-[300px]">
          {activeTab === "Certificate" ? (
            <div className="tab-fade-enter">
              <CertificateGrid />
            </div>
          ) : (
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/50 via-accent-purple/30 to-transparent transform md:-translate-x-1/2" />

              <div className="space-y-12">
                {content[activeTab]?.map((item, index) => {
                  const isLeft = index % 2 === 0;
                  return (
                    <div key={index} className={`w-full flex flex-col md:flex-row ${isLeft ? '' : 'md:flex-row-reverse'} relative fade-up`} style={{ transitionDelay: `${0.1 * (index + 1)}s` }}>

                      {/* Timeline Dot */}
                      <div className="absolute left-6 md:left-1/2 top-2 w-3.5 h-3.5 rounded-full bg-accent-cyan transform -translate-x-1/2 shadow-[0_0_10px_rgba(0,217,255,0.6)] border-2 border-[#1A1235] z-10" />

                      {/* Content Block */}
                      <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                        <span className="inline-block px-3 py-1 rounded-full border border-accent-cyan/30 text-accent-cyan text-[10px] font-bold tracking-wider mb-3 bg-accent-cyan/5">
                          {item.badge}
                        </span>
                        <p className="text-accent-purple text-xs font-bold mb-1 tracking-wider uppercase">{item.period}</p>
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-text-secondary text-sm font-medium mb-2">{item.sub}</p>
                        {item.desc && (
                          <div className={`inline-block w-full max-w-sm mt-2 ${isLeft ? 'md:ml-auto' : ''}`}>
                            <p className="text-text-secondary/80 text-xs leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5 text-left">
                              {item.desc}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Spacer Block */}
                      <div className="hidden md:block md:w-1/2" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

/* ==================================================================
   TYPING LINE COMPONENT (Home Section)
   ================================================================== */
function TypingLine() {
  const roles = useMemo(() => ["Development", "Data Analysis", "UI/UX Design"], []);
  const typedText = useTypingAnimation(roles, 100, 50, 2000);

  return (
    <p className="text-white text-base sm:text-lg mb-3">
      Beroperasi dibidang{" "}
      <span className="text-accent-cyan font-bold">{typedText}</span>
      <span className="typing-cursor" />
    </p>
  );
}

/* ==================================================================
   SKILLS SECTION
   ================================================================== */
function SkillsSection() {
  const stagger = useStaggerFade();
  const [activeTab, setActiveTab] = useState("Core");

  const tabs = ["Core", "Expertise", "Tools"];

  const coreSkills = [
    { icon: "🌐", title: "Web Development" },
    { icon: "📊", title: "Data Analyst" },
    { icon: "🎨", title: "UI/UX Design" },
  ];

  const expertiseSkills = [
    { icon: "⚛️", title: "React JS" },
    { icon: "▲", title: "Next JS" },
    { icon: "🎨", title: "Tailwind CSS" },
    { icon: "🟨", title: "JavaScript" },
    { icon: "🐍", title: "Python" },
    { icon: "🐼", title: "Pandas" },
    { icon: "🎯", title: "Figma" },
    { icon: "🌐", title: "HTML & CSS" },
    { icon: "🤖", title: "AI-Assisted Development" },
  ];

  const toolsSkills = [
    { icon: "🐙", title: "GitHub" },
    { icon: "▼", title: "Vercel" },
    { icon: "📓", title: "Google Colab" },
    { icon: "💻", title: "VS Code" },
    { icon: "📊", title: "Excel / Spreadsheet" },
    { icon: "🎨", title: "Canva" },
  ];

  return (
    <section id="skills" className="relative py-24 sm:py-32 px-5 sm:px-8 z-10 bg-gradient-to-b from-transparent via-[rgba(10,14,26,0.6)] to-transparent">
      <div ref={stagger} className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="fade-up text-center mb-12">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-3">WHAT I KNOW</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Skills & Tools
          </h2>
        </div>

        {/* Tab Filter */}
        <div className="fade-up fade-delay-1 flex justify-center mb-14">
          <div className="inline-flex gap-2 p-1.5 rounded-full nav-pill">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab
                    ? "bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg"
                    : "text-text-secondary hover:text-white border border-transparent hover:border-white/10"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="fade-up fade-delay-2 min-h-[320px]">

          {/* Core Tab */}
          {activeTab === "Core" && (
            <div className="tab-fade-enter">
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-6 text-center">EXPERTISE</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {coreSkills.map((s, i) => (
                  <div key={i} className="skill-card-lg p-8 sm:p-10 flex flex-col items-center text-center cursor-default">
                    <span className="text-4xl sm:text-5xl mb-4">{s.icon}</span>
                    <h4 className="text-white font-bold text-base sm:text-lg">{s.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expertise Tab */}
          {activeTab === "Expertise" && (
            <div className="tab-fade-enter">
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-6 text-center">LANGUAGE & FRAMEWORK</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {expertiseSkills.map((s, i) => (
                  <div key={i} className="skill-card p-5 sm:p-6 flex flex-col items-center text-center cursor-default">
                    <span className="text-2xl sm:text-3xl mb-3">{s.icon}</span>
                    <h4 className="text-white font-semibold text-sm">{s.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === "Tools" && (
            <div className="tab-fade-enter">
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-6 text-center">TOOLS & PLATFORM</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {toolsSkills.map((s, i) => (
                  <div key={i} className="skill-card p-5 sm:p-6 flex flex-col items-center text-center cursor-default">
                    <span className="text-2xl sm:text-3xl mb-3">{s.icon}</span>
                    <h4 className="text-white font-semibold text-sm">{s.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Archive Button */}
        <div className="flex justify-center mt-10">
          <button className="btn-outline px-6 py-2.5 rounded-full text-sm flex items-center gap-2">
            📦 View Archive
          </button>
        </div>

        {/* Footer Stats */}
        <p className="text-center text-text-secondary/60 text-xs mt-5">
          3 Core Expertise · 9 Languages & Frameworks · 6 Tools
        </p>

      </div>
    </section>
  );
}

/* ==================================================================
   PROJECTS SECTION (Carousel)
   ================================================================== */
function ProjectsSection() {
  const stagger = useStaggerFade();
  const [currentSlide, setCurrentSlide] = useState(0);

  const projects = [
    {
      icon: "🌐",
      title: "DTech - Website Agency Digital",
      badge: "Web App",
      badgeClass: "badge-cyan",
      desc: "Website agency digital dengan 10+ halaman demo template (e-commerce, company profile, undangan digital, dll) menggunakan Next.js dan Tailwind CSS",
      techStack: ["Next.js", "Tailwind CSS", "React", "Vercel"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dtech-website-pied.vercel.app",
    },
    {
      icon: "💌",
      title: "Minimalist Elegance - Undangan Digital",
      badge: "Demo Template",
      badgeClass: "badge-purple",
      desc: "Template undangan pernikahan digital dengan desain minimalis, countdown real-time, RSVP form, dan galeri foto",
      techStack: ["Next.js", "Tailwind CSS", "Animation"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dtech-website-pied.vercel.app/demo/minimalist-elegance",
    },
    {
      icon: "👑",
      title: "Royal Blossom - Undangan Digital",
      badge: "Demo Template",
      badgeClass: "badge-purple",
      desc: "Template undangan pernikahan digital tema mewah dengan animasi gerbang pembuka, parallax, partikel emas, dan galeri carousel interaktif",
      techStack: ["Next.js", "Tailwind CSS", "Animation"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dtech-website-pied.vercel.app/demo/royal-blossom",
    },
    {
      icon: "📊",
      title: "Analisis Data Kunjungan Nasabah BRI",
      badge: "Data Analysis",
      badgeClass: "badge-green",
      desc: "Preprocessing dan exploratory data analysis terhadap 5.956+ data transaksi nasabah menggunakan Python dan Pandas, disusun dalam laporan format IEEE",
      techStack: ["Python", "Pandas", "Google Colab", "EDA"],
      github: null,
      live: null,
    },
  ];

  const totalSlides = projects.length;

  const goTo = (index) => {
    if (index < 0) setCurrentSlide(totalSlides - 1);
    else if (index >= totalSlides) setCurrentSlide(0);
    else setCurrentSlide(index);
  };

  return (
    <section id="projects" className="relative py-24 sm:py-32 px-5 sm:px-8 z-10 bg-gradient-to-b from-transparent via-[rgba(26,18,53,0.4)] to-transparent">
      <div ref={stagger} className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="fade-up text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-3">MY WORK</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Projects
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center gap-3 sm:gap-5">

          {/* Prev Button */}
          <button
            onClick={() => goTo(currentSlide - 1)}
            className="carousel-nav-btn shrink-0"
            aria-label="Previous project"
          >
            ‹
          </button>

          {/* Active Slide */}
          <div className="flex-1 min-w-0">
            <div key={currentSlide} className="tab-fade-enter">
              <div className="project-card p-6 sm:p-8">

                {/* Preview Image */}
                <div
                  className="w-full aspect-video rounded-xl mb-6 flex items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #00D9FF, #A78BFA)" }}
                >
                  <span className="text-6xl sm:text-7xl relative z-10">{projects[currentSlide].icon}</span>
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                </div>

                {/* Title + Badge */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{projects[currentSlide].title}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${projects[currentSlide].badgeClass}`}>
                    {projects[currentSlide].badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-5">
                  {projects[currentSlide].desc}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {projects[currentSlide].techStack.map((tech, ti) => (
                    <span key={ti} className="tech-pill">{tech}</span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {projects[currentSlide].github && (
                    <a
                      href={projects[currentSlide].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-2"
                    >
                      GitHub 🐙
                    </a>
                  )}
                  {projects[currentSlide].live && (
                    <a
                      href={projects[currentSlide].live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-2"
                    >
                      Live Demo 🔗
                    </a>
                  )}
                  {!projects[currentSlide].github && !projects[currentSlide].live && (
                    <span className="badge-gray px-4 py-2 rounded-full text-xs font-medium">
                      📄 Laporan Internal
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => goTo(currentSlide + 1)}
            className="carousel-nav-btn shrink-0"
            aria-label="Next project"
          >
            ›
          </button>

        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`carousel-dot ${index === currentSlide ? "active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ==================================================================
   CONTACT SECTION
   ================================================================== */
function ContactSection() {
  const stagger = useStaggerFade();
  const [formData, setFormData] = useState({ nama: "", email: "", pesan: "" });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setFormData({ nama: "", email: "", pesan: "" });
    setTimeout(() => setShowToast(false), 3000);
  };

  const contactInfo = [
    { icon: "📧", label: "Email", value: "dmakapeli@gmail.com" },
    { icon: "💬", label: "WhatsApp", value: "+62 81996522114" },
    { icon: "📍", label: "Lokasi", value: "Sukabumi, Jawa Barat" },
  ];

  const socials = [
    { icon: "🐙", label: "GitHub", href: "https://github.com/dmakapeli-prog" },
    { icon: "💼", label: "LinkedIn", href: "#" },
    { icon: "📷", label: "Instagram", href: "#" },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-5 sm:px-8 z-10 bg-gradient-to-b from-transparent via-[rgba(10,14,26,0.5)] to-transparent">
      {/* Toast Notification */}
      <div
        className={`fixed top-6 right-6 z-[100] toast-glass px-5 py-3.5 rounded-xl text-sm text-white font-medium transition-all duration-500 ${showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        ✅ Pesan terkirim! <span className="text-text-secondary">(Demo - form belum terhubung ke backend)</span>
      </div>

      <div ref={stagger} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="fade-up text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-3">GET IN TOUCH</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Mari Terhubung
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            Tertarik untuk berkolaborasi atau punya pertanyaan? Jangan ragu untuk menghubungi saya.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT COLUMN - Contact Info */}
          <div className="fade-up fade-delay-1">
            <div className="glass-card p-6 sm:p-8 h-full flex flex-col">
              <h3 className="text-white font-bold text-lg mb-6">Informasi Kontak</h3>

              <div className="space-y-4 mb-8 flex-1">
                {contactInfo.map((item, i) => (
                  <div
                    key={i}
                    className="contact-info-card flex items-center gap-4 p-4 rounded-xl cursor-default"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="text-white text-sm font-medium mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div>
                <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-4">Temukan Saya</p>
                <div className="flex items-center gap-3">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="social-icon-btn w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Contact Form */}
          <div className="fade-up fade-delay-2">
            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-white font-bold text-lg mb-6">Kirim Pesan</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-nama" className="text-text-secondary text-xs font-medium uppercase tracking-wider block mb-2">Nama</label>
                  <input
                    id="contact-nama"
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    placeholder="Nama lengkap"
                    className="contact-input w-full px-4 py-3 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-text-secondary text-xs font-medium uppercase tracking-wider block mb-2">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@contoh.com"
                    className="contact-input w-full px-4 py-3 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-pesan" className="text-text-secondary text-xs font-medium uppercase tracking-wider block mb-2">Pesan</label>
                  <textarea
                    id="contact-pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tulis pesan Anda..."
                    className="contact-input w-full px-4 py-3 rounded-lg text-sm text-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gradient w-full py-3.5 rounded-full text-sm font-semibold"
                >
                  Kirim Pesan 📩
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   FOOTER
   ================================================================== */
function Footer() {
  return (
    <footer className="relative z-10 py-10 px-5 sm:px-8" style={{ background: "rgba(6,8,16,0.7)" }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        {/* Logo */}
        <a href="#home" className="text-xl font-bold text-white flex items-center gap-1 select-none">
          Doni<span className="footer-dot-pulse">.</span>
        </a>

        {/* Copyright */}
        <p className="text-text-secondary/60 text-xs text-center">
          © 2026 Donie Makapeli. Dibuat dengan Next.js & Tailwind CSS.
        </p>

        {/* Back to Top */}
        <a
          href="#home"
          className="text-text-secondary text-xs hover:text-accent-cyan transition-colors duration-300 mt-1"
        >
          Back to Top ↑
        </a>
      </div>
    </footer>
  );
}

/* ==================================================================
   MAIN PAGE
   ================================================================== */
export default function Home() {
  return (
    <>
      <BackgroundBlobs />
      <Navbar />
      <main>
        <HomeSection />
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

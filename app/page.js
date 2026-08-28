"use client";

import { useState, useEffect, useRef, useMemo } from "react";

/* ==================================================================
   HOOKS
   ================================================================== */
function useStaggerFade(deps = []) {
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
  }, deps);
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

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
        <p className="text-accent-cyan text-[11px] font-medium tracking-widest uppercase leading-relaxed text-center">
          Web Developer<br />& Data Analyst
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
    <section id="home" className="relative min-h-screen flex items-center pt-[100px] md:pt-32 pb-16 px-5 sm:px-8 z-10">
      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-[60%_40%] gap-12 lg:gap-8 items-center">

        {/* ====== KIRI (60%): Teks ====== */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">



          <div className="badge-glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white mb-6">
            <span>✨</span> Mahasiswa S1 Teknik Informatika - Universitas Nusa Putra
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
            Donie Makapeli
          </h1>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl italic font-serif gradient-text mb-6">
            Web Developer & Data Analyst
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
              <div className="w-full aspect-square rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(0,217,255,0.2)] border border-accent-cyan/30"
                style={{ maxWidth: '280px', margin: '0 auto', maxHeight: '320px' }}>
                <img
                  src="/foto-doni.jpeg"
                  alt="Donie Makapeli"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', borderRadius: '16px' }}
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
              Selain itu, saya membangun <span className="text-accent-cyan font-medium">DiCode</span>, sebuah
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
    { src: '/certificates/sertif-seminas-sismatik-SI.jpg', nama: 'Seminar Nasional SISMATIK 2026', penerbit: 'Universitas Nusa Putra', tahun: '2026' },
  ];

  useEffect(() => {
    // Preload gambar sertifikat
    certs.forEach(cert => {
      const img = new Image();
      img.src = cert.src;
    });
  }, []);

  const visible = showAll ? certs : certs.slice(0, 4);

  return (
    <div>
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.80)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '896px',
              width: '100%',
              maxHeight: '90vh',
              background: 'rgba(15, 18, 35, 0.95)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,217,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalScaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Header Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              flexShrink: 0,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                📜 Certificate Preview
              </span>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >✕</button>
            </div>

            {/* Image Area */}
            <div style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              minHeight: 0,
            }}>
              <img
                src={modalImage}
                alt="Certificate Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(90vh - 110px)',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  display: 'block',
                }}
              />
            </div>
          </div>

          <style>{`
            @keyframes modalScaleIn {
              from { opacity: 0; transform: scale(0.92); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 500 ? '1fr' : 'repeat(2, 1fr)',
        gap: '16px',
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
            <div style={{ width: '100%', height: '160px', overflow: 'hidden', backgroundColor: '#1a1a2e', display: 'block' }}>
              <img
                src={cert.src}
                alt={cert.nama}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block', willChange: 'auto' }}
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
  const [activeTab, setActiveTab] = useState("Academic");
  const stagger = useStaggerFade([activeTab]);

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
        period: "Agu 2026 - Jan 2027",
        title: "Web Developer Intern",
        sub: "PT MEDIA JURNAL SUKABUMI (WFH)",
        badge: "Magang",
        desc: "Bertanggung jawab dalam pengembangan \"Jurnal Vibes\", sebuah website portal utama yang akan mengintegrasikan berbagai sub-kanal aplikasi."
      },
      {
        period: "13 Jul 2026 - 13 Agu 2026",
        title: "Web Developer (Praktik Kerja Lapangan)",
        sub: "PT MEDIA JURNAL SUKABUMI (WFH)",
        badge: "PKL",
        desc: "Membangun dan menyelesaikan web aplikasi \"Halo Jurnal\" (halo-jurnal-app.vercel.app) yang difungsikan sebagai salah satu kanal untuk portal utama Jurnal Vibes."
      },
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
        title: "Menyelesaikan Web Aplikasi \"Halo Jurnal\"",
        sub: "Web App PKL - halo-jurnal-app.vercel.app · Kanal terintegrasi untuk portal utama Jurnal Vibes, diselesaikan sebagai output PKL di PT MEDIA JURNAL SUKABUMI",
        badge: "PKL Project",
      },
      {
        period: "2026",
        title: "Menyelesaikan Project DiCode",
        sub: "Website agency digital DiCode dengan 10+ halaman demo template",
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
    { icon: "🌐", title: "Web Development", desc: "Membangun aplikasi web modern yang responsif, interaktif, dan berkinerja tinggi dari frontend hingga integrasi backend." },
    { icon: "📊", title: "Data Analysis", desc: "Mengekstraksi, membersihkan, dan menganalisis data mentah menjadi wawasan terstruktur untuk mendukung keputusan." },
    { icon: "🎨", title: "UI/UX Design", desc: "Merancang antarmuka pengguna yang intuitif dipadukan dengan estetika visual yang kuat dan berpusat pada pengalaman." },
  ];

  const expertiseSkills = [
    {
      title: "React JS",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="2.139" fill="#61DAFB" />
          <path d="M12 6.5c3.9 0 7.5.9 10.2 2.4C24.9 10.5 26 12 26 13.5c0 1.5-1.1 3-3.8 4.6C19.5 19.6 15.9 20.5 12 20.5s-7.5-.9-10.2-2.4C-.9 16.5-2 15-2 13.5c0-1.5 1.1-3 3.8-4.6C4.5 7.4 8.1 6.5 12 6.5zm0-1c-4.1 0-7.9 1-10.8 2.7C-1.7 9.9-3 11.6-3 13.5s1.3 3.6 4.2 5.3C4.1 20.5 7.9 21.5 12 21.5s7.9-1 10.8-2.7c2.9-1.7 4.2-3.4 4.2-5.3s-1.3-3.6-4.2-5.3C19.9 6.5 16.1 5.5 12 5.5z" fill="none" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(120 12 12)" />
        </svg>
      ),
    },
    {
      title: "Next JS",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="white" />
          <path d="M19.07 20.624L8.432 7H7v10.001h1.432V8.955l9.793 12.207c.302-.173.595-.361.878-.563M16 7h1.432v10H16z" fill="black" />
        </svg>
      ),
    },
    {
      title: "Tailwind CSS",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6C9.33 6 7.67 7.33 7 10c1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.09 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-.99 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.15 14.51 6 12 6zM7 13c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.38 17.85 9.49 19 12 19c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.62 14.15 9.51 13 7 13z" fill="#38BDF8" />
        </svg>
      ),
    },
    {
      title: "JavaScript",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#F7DF1E" />
          <path d="M6.234 18.03c.353.576.957.96 1.86.96 1.02 0 1.68-.51 1.68-1.56V11.4h-1.62v5.94c0 .48-.18.66-.48.66-.3 0-.51-.18-.66-.45l-1.17.6-.01-.01zm5.01-.09c.45.72 1.29 1.17 2.43 1.17 1.29 0 2.19-.63 2.19-1.8 0-1.05-.6-1.56-1.71-2.04l-.36-.15c-.54-.24-.78-.39-.78-.78 0-.3.24-.54.6-.54.36 0 .6.15.81.54l1.11-.72c-.45-.78-1.08-1.08-1.92-1.08-1.2 0-1.98.75-1.98 1.8 0 1.05.6 1.59 1.56 1.98l.36.15c.6.27.93.42.93.84 0 .36-.33.63-.84.63-.6 0-.99-.3-1.26-.78l-1.14.72-.07.07z" fill="black" />
        </svg>
      ),
    },
    {
      title: "TypeScript",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#3178C6" />
          <path d="M13.37 14.571v1.714c.278.143.608.25.99.32.38.07.78.106 1.196.106.41 0 .797-.044 1.163-.13.366-.086.686-.225.96-.416.274-.19.49-.435.65-.733.16-.298.24-.657.24-1.078 0-.302-.044-.566-.133-.793a1.903 1.903 0 00-.39-.617 3.16 3.16 0 00-.627-.496 7.658 7.658 0 00-.846-.43 9.274 9.274 0 01-.55-.27 2.48 2.48 0 01-.38-.263.985.985 0 01-.217-.29.79.79 0 01-.07-.332c0-.112.022-.212.068-.3a.616.616 0 01.193-.22.9.9 0 01.302-.135 1.47 1.47 0 01.39-.047c.104 0 .213.008.328.024.115.016.23.042.345.078.116.036.228.083.337.14.11.057.21.124.303.201v-1.603a4.28 4.28 0 00-.882-.22 6.353 6.353 0 00-1.022-.077c-.404 0-.783.047-1.138.14a2.795 2.795 0 00-.933.43 2.083 2.083 0 00-.633.733c-.155.296-.232.645-.232 1.046 0 .518.147.96.441 1.326.294.366.74.676 1.336.93.198.083.384.165.558.248.174.082.325.17.453.263.128.093.23.196.303.31.074.113.11.242.11.387 0 .118-.023.225-.07.32a.64.64 0 01-.208.237 1.02 1.02 0 01-.337.15 1.79 1.79 0 01-.456.053c-.296 0-.59-.054-.882-.162a3.106 3.106 0 01-.812-.476zM9.8 11.03H12V9.6H6V11.03h2.196V18H9.8V11.03z" fill="white" />
        </svg>
      ),
    },
    {
      title: "Python",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.868s-.109-3.403 3.347-3.403h5.768s3.236.052 3.236-3.13V3.13S18.304 0 11.914 0zm-3.22 1.814a1.04 1.04 0 11-.001 2.08 1.04 1.04 0 010-2.08z" fill="#3673A5" />
          <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.12S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.868s.109 3.403-3.347 3.403H9.451s-3.236-.052-3.236 3.13V20.87S5.696 24 12.086 24zm3.22-1.814a1.04 1.04 0 110-2.08 1.04 1.04 0 010 2.08z" fill="#FDD048" />
        </svg>
      ),
    },
    {
      title: "Pandas",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Left column — top dark blue, bottom pink */}
          <rect x="3" y="1.5" width="3.2" height="8" rx="1.6" fill="#150458" />
          <rect x="3" y="14.5" width="3.2" height="8" rx="1.6" fill="#E70488" />
          {/* Right column — top dark blue, bottom pink */}
          <rect x="17.8" y="1.5" width="3.2" height="8" rx="1.6" fill="#150458" />
          <rect x="17.8" y="14.5" width="3.2" height="8" rx="1.6" fill="#E70488" />
          {/* Middle connector bars */}
          <rect x="7" y="7" width="10" height="3" rx="1.5" fill="#150458" />
          <rect x="7" y="14" width="10" height="3" rx="1.5" fill="#E70488" />
        </svg>
      ),
    },
    {
      title: "HTML & CSS",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Official HTML5 shield/badge shape */}
          <path d="M4.136 0l1.69 18.954L12 21l6.17-2.043L19.86 0z" fill="#E34F26" />
          <path d="M12 1.5v18.13l5.018-1.66 1.455-16.47H12z" fill="#EF652A" />
          {/* White 5 digit */}
          <path d="M12 7.3H7.895l.265 2.9H12v2.82H7.57l.35 3.92L12 18.03v-2.97l-2.06-.55-.14-1.51H12V7.3z" fill="white" />
          <path d="M12 7.3v2.9h3.75l-.355 4.47-3.395.89v2.97l4.14-1.15.465-5.19H12z" fill="white" opacity="0.9" />
        </svg>
      ),
    },
    {
      title: "Supabase",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.33 12.59.738 13.5 1.424 13.5H11.1a.5.5 0 01.5.5v9.465c.015.986 1.26 1.41 1.874.637l9.262-11.652c.435-.539.027-1.448-.659-1.448H12.4a.5.5 0 01-.5-.5V1.036z" fill="#3ECF8E" />
        </svg>
      ),
    },
    {
      title: "PostgreSQL",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Official PostgreSQL elephant head */}
          {/* Main head shape */}
          <path d="M17.5 3C16.2 1.7 14.5 1 12.7 1c-1.2 0-2.4.3-3.4.9C7.8 1.3 6.2 1.7 5 2.9 3.2 4.7 3 7.7 3 9.5c0 1.2.2 2.5.7 3.6.6 1.3 1.6 1.8 2.1 1.8.4 0 .7-.1 1-.3v2.2c0 2.1.7 3.8 2.5 4.6.5.2 1 .3 1.5.3 1 0 1.9-.3 2.7-.9.6-.4 1-.9 1.3-1.5.3.1.6.2 1 .2.9 0 1.9-.4 2.5-1.4.5-.8.7-1.8.7-2.9V15c.4-.5.7-1.1.8-1.7.3-1 .4-2.2.4-3.2C21 6.9 19.8 4.7 17.5 3z" fill="#336791" />
          {/* Ear */}
          <path d="M19 7.5c.8 0 1.5-.7 1.5-1.5S19.8 4.5 19 4.5c-.7 0-1.3.5-1.5 1.1L17 5.4c.3-.5.8-.9 1.5-.9.9 0 1.5.7 1.5 1.5S19.4 7.5 18.5 7.5" fill="#336791" />
          {/* Eye whites */}
          <ellipse cx="9.5" cy="8" rx="1.5" ry="1.7" fill="white" />
          <ellipse cx="14.5" cy="8" rx="1.5" ry="1.7" fill="white" />
          {/* Pupils */}
          <circle cx="9.8" cy="8.2" r="0.8" fill="#1a1a1a" />
          <circle cx="14.8" cy="8.2" r="0.8" fill="#1a1a1a" />
          {/* Nose / snout */}
          <path d="M10 11.5c0 1.1.9 2 2 2s2-.9 2-2" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          {/* Tusk */}
          <path d="M10.5 13.5c-.5.8-1.2 1.5-2 1.8" stroke="#C8A96E" strokeWidth="1" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "SQL",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="4" rx="1.5" fill="#60A5FA" />
          <rect x="2" y="8" width="20" height="4" rx="1.5" fill="#93C5FD" opacity="0.8" />
          <rect x="2" y="14" width="12" height="4" rx="1.5" fill="#BFDBFE" opacity="0.6" />
          <circle cx="19" cy="19" r="4" fill="#3B82F6" />
          <path d="M17.4 19h3.2M19 17.4v3.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const toolsSkills = [
    {
      title: "GitHub",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="white" />
        </svg>
      ),
    },
    {
      title: "Vercel",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 22.525H0l12-21.05 12 21.05z" fill="white" />
        </svg>
      ),
    },
    {
      title: "Google Colab",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Official Google Colab logo: orange circle with two overlapping play triangles */}
          <circle cx="12" cy="12" r="12" fill="#F9AB00" />
          {/* Left play triangle (white) */}
          <path d="M7.5 8.5l5.5 3.5-5.5 3.5V8.5z" fill="white" />
          {/* Right play triangle (overlapping, slightly offset, orange-tinted) */}
          <path d="M10.5 8.5l5.5 3.5-5.5 3.5V8.5z" fill="white" opacity="0.55" />
        </svg>
      ),
    },
    {
      title: "VS Code",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 20.06V3.939a1.5 1.5 0 00-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="#007ACC" />
        </svg>
      ),
    },
    {
      title: "Excel / Sheets",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Microsoft Excel official logo: green background with white X */}
          <rect width="24" height="24" rx="3" fill="#1D6F42" />
          {/* Document/page part right */}
          <rect x="13" y="3" width="8" height="18" rx="1" fill="#21A366" />
          {/* Horizontal lines in right pane */}
          <rect x="14" y="7" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          <rect x="14" y="10" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          <rect x="14" y="13" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          <rect x="14" y="16" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          {/* Green left fold/tab */}
          <path d="M3 4.5C3 3.67 3.67 3 4.5 3H13v18H4.5C3.67 21 3 20.33 3 19.5V4.5z" fill="#107C41" />
          {/* Bold white X on left */}
          <path d="M5.5 8l3.5 4-3.5 4h2.2l2.4-3 2.4 3H12.2L8.7 12l3.5-4H10l-2.4 3-2.4-3z" fill="white" />
        </svg>
      ),
    },
    {
      title: "Figma",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 24c2.209 0 4-1.791 4-4v-4H8c-2.209 0-4 1.791-4 4s1.791 4 4 4z" fill="#0ACF83" />
          <path d="M4 12c0-2.209 1.791-4 4-4h4v8H8c-2.209 0-4-1.791-4-4z" fill="#A259FF" />
          <path d="M4 4c0-2.209 1.791-4 4-4h4v8H8C5.791 8 4 6.209 4 4z" fill="#F24E1E" />
          <path d="M12 0h4c2.209 0 4 1.791 4 4s-1.791 4-4 4h-4V0z" fill="#FF7262" />
          <circle cx="16" cy="12" r="4" fill="#1ABCFE" />
        </svg>
      ),
    },
    {
      title: "Power BI",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="12" width="4" height="10" rx="1" fill="#F2C811" />
          <rect x="8" y="8" width="4" height="14" rx="1" fill="#F2C811" opacity="0.85" />
          <rect x="14" y="4" width="4" height="18" rx="1" fill="#F2C811" opacity="0.7" />
          <rect x="20" y="1" width="2" height="21" rx="1" fill="#F2C811" opacity="0.5" />
          <circle cx="4" cy="10" r="2" fill="#FFD700" />
          <path d="M4 10 C4 10 8 8 12 6 C16 4 20 2 20 2" stroke="#F2C811" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      ),
    },
    {
      title: "Postman",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Official Postman logo: orange background with astronaut/rocket figure */}
          <circle cx="12" cy="12" r="12" fill="#FF6C37" />
          {/* Postman 'P' letter - the official icon is a stylized P */}
          {/* Astronaut body */}
          <ellipse cx="11" cy="13" rx="3.5" ry="4.5" fill="white" opacity="0.95" />
          {/* Helmet (head) */}
          <circle cx="11" cy="9" r="3" fill="white" />
          <circle cx="11" cy="9" r="2" fill="#FF6C37" />
          {/* Visor highlight */}
          <circle cx="10.3" cy="8.3" r="0.6" fill="white" opacity="0.7" />
          {/* Arms */}
          <path d="M7.5 12.5c-1 0-1.5.8-1.5 1.5s.5 1.5 1.5 1.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M14.5 12.5c1 0 1.5.8 1.5 1.5s-.5 1.5-1.5 1.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Legs */}
          <path d="M9 17l-1.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M13 17l1.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          {/* Boots */}
          <ellipse cx="7.5" cy="19.8" rx="1.2" ry="0.7" fill="white" />
          <ellipse cx="14.5" cy="19.8" rx="1.2" ry="0.7" fill="white" />
          {/* Antenna */}
          <path d="M11 6l.5-2.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
          <circle cx="11.5" cy="3.3" r="0.7" fill="white" />
        </svg>
      ),
    },
    {
      title: "Antigravity IDE",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Rocket nose cone */}
          <path d="M12 1C12 1 7.5 5.5 7.5 12H16.5C16.5 5.5 12 1 12 1z" fill="#00D9FF" />
          {/* Rocket body */}
          <rect x="7.5" y="12" width="9" height="5" fill="#00B8D9" />
          {/* Left fin */}
          <path d="M7.5 13.5L4.5 18.5l3-1V13.5z" fill="#7C3AED" />
          {/* Right fin */}
          <path d="M16.5 13.5L19.5 18.5l-3-1V13.5z" fill="#7C3AED" />
          {/* Porthole window */}
          <circle cx="12" cy="11" r="2.2" fill="#0A0E1A" />
          <circle cx="12" cy="11" r="1.5" fill="#1a2a4a" />
          <circle cx="11.3" cy="10.3" r="0.45" fill="#00D9FF" opacity="0.8" />
          {/* Engine nozzle */}
          <path d="M9.5 17h5l.5 1h-6z" fill="#555" />
          {/* Flame */}
          <path d="M10.5 18.5C10.5 18.5 10 21 12 22.5C14 21 13.5 18.5 13.5 18.5H10.5z" fill="#FF6C37" opacity="0.9" />
          <path d="M11 19C11 19 11 21.5 12 22C13 21.5 13 19 13 19H11z" fill="#FFD700" opacity="0.8" />
          {/* Stars/sparkles */}
          <path d="M19 3l.4 1.2L20.6 4.6l-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4z" fill="#FFD700" />
          <path d="M4.5 6l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z" fill="#00D9FF" opacity="0.7" />
        </svg>
      ),
    },
    {
      title: "Stitch AI",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Magic wand stick */}
          <path d="M14.5 9.5L4.5 19.5" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" />
          {/* Wand tip star/sparkle — 4-point sharp star */}
          <path d="M14.5 2L15.5 5.5L19 6.5L15.5 7.5L14.5 11L13.5 7.5L10 6.5L13.5 5.5z" fill="#A78BFA" />
          {/* Large glow ring */}
          <circle cx="14.5" cy="6.5" r="3.5" stroke="#7C3AED" strokeWidth="0.5" opacity="0.4" fill="none" />
          {/* Scattered sparkles */}
          <path d="M20 2l.4 1.3 1.3.4-1.3.4-.4 1.3-.4-1.3-1.3-.4 1.3-.4z" fill="#E879F9" opacity="0.9" />
          <path d="M20 13l.3 1 1 .3-1 .3-.3 1-.3-1-1-.3 1-.3z" fill="#C4B5FD" opacity="0.7" />
          <path d="M6 3l.3 1 1 .3-1 .3-.3 1-.3-1-1-.3 1-.3z" fill="#A78BFA" opacity="0.6" />
          {/* Small dot sparkles on wand trail */}
          <circle cx="7.5" cy="16.5" r="0.8" fill="#C4B5FD" opacity="0.5" />
          <circle cx="11" cy="13" r="0.6" fill="#E879F9" opacity="0.4" />
        </svg>
      ),
    },
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
                    {s.desc && <p className="text-sm text-gray-400 text-center mt-3 px-4">{s.desc}</p>}
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
                    {s.svgIcon
                      ? <div className="w-8 h-8 mb-3 flex items-center justify-center">{s.svgIcon}</div>
                      : <span className="text-2xl sm:text-3xl mb-3">{s.icon}</span>
                    }
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
                    {s.svgIcon
                      ? <div className="w-8 h-8 mb-3 flex items-center justify-center">{s.svgIcon}</div>
                      : <span className="text-2xl sm:text-3xl mb-3">{s.icon}</span>
                    }
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
          3 Core Expertise · 11 Languages & Frameworks · 10 Tools
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
      icon: "🥚",
      title: "Ovara - Toko Telur Segar Online",
      badge: "Web App",
      badgeClass: "badge-orange",
      desc: "Website e-commerce telur ayam segar premium dengan fitur keranjang belanja, sistem stok realtime via Supabase, dan integrasi order WhatsApp otomatis. Dibangun untuk UMKM lokal Cibadak, Sukabumi.",
      techStack: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
      github: "https://github.com/dmakapeli-prog/ovara-website",
      live: "https://ovara-nine.vercel.app",
      image: "/project-ovara.png",
    },
    {
      icon: "🛍️",
      title: "ThriftIn - Preloved Fashion Marketplace",
      badge: "Web App",
      badgeClass: "badge-cyan",
      desc: "Platform marketplace fashion thrift dan preloved dengan fitur lengkap seperti real-time chat, sistem tawar harga, pelacakan pesanan, notifikasi real-time, rating & ulasan, wishlist, dan admin panel untuk manajemen produk dan transaksi.",
      techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"],
      github: "https://github.com/dmakapeli-prog/thriftin",
      live: "https://thriftin-alpha.vercel.app",
      image: "/project-thriftin.png",
    },
    {
      icon: "🌐",
      title: "DiCode - Website Agency Digital",
      badge: "Web App",
      badgeClass: "badge-cyan",
      desc: "Website agency digital DiCode dengan 10+ halaman demo template (e-commerce, company profile, undangan digital, dll) menggunakan Next.js dan Tailwind CSS",
      techStack: ["Next.js", "Tailwind CSS", "React", "Vercel"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dicode-website.vercel.app",
      image: "/project-dicode.png",
    },
    {
      icon: "🍽️",
      title: "DapurKu - Website Kuliner",
      badge: "Web App",
      badgeClass: "badge-orange",
      desc: "Website kuliner modern untuk DapurKu Gunung Walat dengan fitur menu interaktif, filter kategori, keranjang belanja, integrasi WhatsApp & GrabFood, peta lokasi, dan testimoni pelanggan.",
      techStack: ["Next.js", "Tailwind CSS", "Vercel", "WhatsApp API"],
      github: null,
      live: "https://dapurku-websiite.vercel.app",
      image: "/project-dapurku.png",
    },
    {
      icon: "💌",
      title: "Minimalist Elegance - Undangan Digital",
      badge: "Demo Template",
      badgeClass: "badge-purple",
      desc: "Template undangan pernikahan digital dengan desain minimalis, countdown real-time, RSVP form, dan galeri foto",
      techStack: ["Next.js", "Tailwind CSS", "Animation"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dicode-website.vercel.app/demo/minimalist-elegance",
      image: "/project-minimalist.png",
    },
    {
      icon: "👑",
      title: "Royal Blossom - Undangan Digital",
      badge: "Demo Template",
      badgeClass: "badge-purple",
      desc: "Template undangan pernikahan digital tema mewah dengan animasi gerbang pembuka, parallax, partikel emas, dan galeri carousel interaktif",
      techStack: ["Next.js", "Tailwind CSS", "Animation"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dicode-website.vercel.app/demo/royal-blossom",
      image: "/project-royalblossom.png",
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
      image: null,
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
                  className="w-full aspect-video rounded-xl mb-6 relative overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, #0a0e1a, #1a1235)" }}
                >
                  {projects[currentSlide].image ? (
                    <>
                      <img
                        src={projects[currentSlide].image}
                        alt={projects[currentSlide].title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          display: 'block',
                          transition: 'transform 0.5s ease',
                        }}
                        className="group-hover:scale-105"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {/* Overlay saat hover */}
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'rgba(0,0,0,0.45)' }}
                      >
                        {projects[currentSlide].live && (
                          <span className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm" style={{ background: 'rgba(0,217,255,0.2)', border: '1px solid rgba(0,217,255,0.5)', backdropFilter: 'blur(8px)' }}>
                            🔗 Lihat Website
                          </span>
                        )}
                      </div>
                      {/* Badge icon di pojok kiri atas */}
                      <div className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        {projects[currentSlide].icon}
                      </div>
                    </>
                  ) : (
                    /* Fallback: emoji besar untuk proyek tanpa gambar */
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00D9FF22, #A78BFA22)" }}>
                      <span className="text-6xl sm:text-7xl">{projects[currentSlide].icon}</span>
                      <div
                        className="absolute inset-0 opacity-15"
                        style={{
                          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                          backgroundSize: "14px 14px",
                        }}
                      />
                    </div>
                  )}
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

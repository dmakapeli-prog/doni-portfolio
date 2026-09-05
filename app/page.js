"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { SiPandas, SiSupabase, SiPostman, SiGooglecolab } from "react-icons/si";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import InitialLoader from "./components/InitialLoader";

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
   TEXT FORMATTER HELPER
   ================================================================== */
function FormatText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </span>
  );
}

/* ==================================================================
   ANIMATED BACKGROUND BLOBS & SPOTLIGHTS (ICE BLUE)
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
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
      {/* Spotlight Ambient Lighting */}
      <div className="spotlight-top-left" />
      <div className="spotlight-bottom-right" />
      <div className="blob blob-cyan w-[600px] h-[600px] top-[-10%] left-[-5%]" />
      <div className="blob blob-ice w-[700px] h-[700px] bottom-[-15%] right-[-10%]" />
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

      const sectionIds = ["home", "about", "education", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 180;

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActive("contact");
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActive(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] bg-[#05070F]/90 backdrop-blur-md border-b border-white/10 py-2.5 sm:py-3 md:py-4 transition-all duration-300 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4">

        {/* Kiri: Logo */}
        <div className="flex items-center">
          <a href="#home" className="text-xl md:text-2xl font-extrabold tracking-tight text-white select-none">
            Donie<span className="text-sky-400">.</span>
          </a>
        </div>

        {/* Tengah/Kanan: Menu Pill */}
        <div className="nav-pill rounded-full px-2 py-1 md:py-1.5 flex items-center gap-0.5 md:gap-1 max-w-full overflow-x-auto no-scrollbar">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setActive(l.id)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${active === l.id
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
   ID CARD COMPONENT (Realistic Lanyard & Pendulum Physics)
   ================================================================== */
function IDCard() {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);

  return (
    <div className="relative flex flex-col items-center select-none">
      <motion.div
        style={{
          rotate,
          transformOrigin: "top center",
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        animate={{ rotate: [-1.5, 1.5, -1.5] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="flex flex-col items-center cursor-grab active:cursor-grabbing relative z-10"
      >
        {/* Tali Lanyard Tebal */}
        <div className="w-2.5 h-20 sm:h-24 bg-gradient-to-r from-[#111] via-[#222] to-[#111] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative z-0 mx-auto"></div>

        {/* Klip Besi 3D */}
        <div className="relative z-10 -mt-2 flex flex-col items-center mb-[-8px]">
          {/* Penjepit Atas */}
          <div className="w-5 h-2.5 bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b border-gray-700"></div>
          {/* Pengait Bawah */}
          <div className="w-3.5 h-5 bg-gradient-to-b from-gray-500 to-gray-800 rounded-b-md shadow-lg flex justify-center items-end pb-1 border border-gray-600/50">
            {/* Lubang Pengait */}
            <div className="w-1.2 h-1.2 bg-[#0a0a0a] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
          </div>
        </div>

        {/* 3. Kartu ID Body */}
        <div className="-mt-1 relative z-0">
          <div className="id-card-body w-[230px] sm:w-[250px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col items-center relative z-20 shadow-2xl">
            {/* Slot Hole for Badge Holder Clip */}
            <div className="w-7 h-1.5 rounded-full bg-[#05070F] border border-white/20 mb-2.5 shadow-inner" />

            {/* Foto Profil */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden border border-white/10 shadow-inner group">
              <Image
                src="/avatar.png"
                alt="Donie Makapeli"
                width={112}
                height={112}
                priority={true}
                unoptimized={true}
                className="w-full h-full object-cover rounded-xl opacity-100 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
              />
            </div>

            {/* Nama & Role */}
            <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 tracking-wide">Donie Makapeli</h3>
            <p className="text-sky-400 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase leading-relaxed text-center">
              Full-Stack Web Developer<br />& Data Analyst
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 my-2.5" />

            {/* Instansi */}
            <p className="text-text-secondary text-[11px] sm:text-xs font-medium tracking-wide">
              Universitas Nusa Putra
            </p>
            <p className="text-text-secondary/70 text-[9px] mt-0.5 tracking-wider uppercase">
              S1 Teknik Informatika
            </p>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-b-2xl opacity-80" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}


/* ==================================================================
   HOME SECTION (Layout Terpusat 12-Kolom Grid, Text-Left)
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
    { num: "3", label: "Pengalaman Magang & PKL" },
  ];

  return (
    <section id="home" className="relative min-h-[75vh] flex items-center pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">

        {/* ====== KIRI (7/12): Teks Rata Kiri ====== */}
        <div className="md:col-span-7 flex flex-col items-start text-left order-2 md:order-1">

          <div className="badge-glass inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-white mb-3 max-w-full text-left">
            Mahasiswa S1 Teknik Informatika - Universitas Nusa Putra
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-1.5 text-left leading-tight">
            Donie Makapeli
          </h1>

          <h2 className="text-lg sm:text-2xl lg:text-3xl italic font-serif gradient-text mb-3.5 text-left">
            Full-Stack Web Developer & Data Analyst
          </h2>

          <TypingLine />

          <p className="gradient-text-animated text-sm sm:text-base font-semibold mb-3.5 text-left">
            Membangun Pengalaman Digital dari Kode hingga Data
          </p>

          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-xl mb-6 sm:mb-8 text-left">
            Saya mahasiswa S1 Teknik Informatika di Universitas Nusa Putra dengan minat pada
            pengembangan web modern dan analisis data. Berpengalaman magang di PT Bank Rakyat
            Indonesia (BRI) Unit Cipanas, di mana saya mengerjakan project analisis data kunjungan
            nasabah menggunakan Python. Setelah itu, saya menyelesaikan PKL secara WFH sebagai
            Web Developer di PT Media Jurnal Sukabumi dan berhasil membangun web aplikasi{" "}
            <span className="text-sky-400 font-medium">&apos;Halo Jurnal&apos;</span>.
            Saat ini, saya kembali melanjutkan program magang (WFH) di perusahaan yang sama
            untuk mengembangkan portal utama{" "}
            <span className="text-sky-400 font-medium">&apos;Jurnal Vibes&apos;</span>.
          </p>

          {/* Stat Row */}
          <div className="flex flex-wrap justify-start gap-y-3 mb-6 sm:mb-8 w-full pt-1">
            {stats.map((s, i) => (
              <div key={i} className={`flex flex-col items-start px-3.5 sm:px-5 ${i !== 0 ? 'border-l border-white/10' : 'pl-0'}`}>
                <p className="text-lg sm:text-2xl font-bold text-white">{s.num}</p>
                <p className="text-text-secondary text-[10px] sm:text-[11px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-start gap-3">
            <a href="#about" className="btn-gradient px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm">
              About Me 👋
            </a>
            <button onClick={handleCopy} className="btn-outline px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm">
              {copied ? "Tersalin! ✅" : "Copy Link 🔗"}
            </button>
          </div>

        </div>

        {/* ====== KANAN (5/12): ID Card ====== */}
        <div className="md:col-span-5 flex justify-center md:justify-end items-center self-center order-1 md:order-2 -mt-2 md:-mt-4">
          <IDCard />
        </div>

      </div>
    </section>
  );
}

/* ==================================================================
   ABOUT SECTION (Wide Glassmorphism Bento Refinement)
   ================================================================== */
function AboutSection() {
  const stagger = useStaggerFade();

  const cards = [
    {
      icon: "🌐",
      title: "Web Development",
      desc: "Spesialisasi pada Next.js, React, TypeScript, Tailwind CSS, dan Supabase untuk membangun web app modern, cepat, dan scalable.",
      badge: "Full-Stack Tech"
    },
    {
      icon: "📊",
      title: "Data Analysis",
      desc: "Eksplorasi data mentah (EDA), cleaning, dan visualisasi menggunakan Python, Pandas, dan Google Colab berbasis standar laporan IEEE.",
      badge: "Python & EDA"
    },
    {
      icon: "🎨",
      title: "UI/UX Design",
      desc: "Merancang antarmuka bersih bergaya Bento Grid, glassmorphism sinematik, micro-interactions, dan prinsip desain berpusat pengguna.",
      badge: "Design System"
    },
  ];

  return (
    <section id="about" className="relative py-8 sm:py-12 md:py-16 px-4 md:px-8 z-10">
      <div ref={stagger} className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="fade-up text-center mb-6 sm:mb-10">
          <p className="text-[10px] font-bold tracking-[0.2em] gradient-text uppercase mb-2">TENTANG SAYA</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white">
            Mengenal Lebih Dekat
          </h2>
        </div>

        {/* Wide Glassmorphism Bento Card Container */}
        <div className="fade-up fade-delay-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-7 md:p-8 shadow-2xl transition-all duration-500 hover:border-sky-400/30 hover:bg-white/[0.06]">
          
          {/* Upper Grid Layout: Profile & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-6 pb-6 border-b border-white/10">
            
            {/* Left Column (5/12): Avatar & Location Badges */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[200px] sm:max-w-[240px] aspect-square rounded-2xl mb-4 relative overflow-hidden border border-white/15 shadow-2xl group">
                <Image
                  src="/avatar.png"
                  alt="Donie Makapeli"
                  fill
                  priority={true}
                  unoptimized={true}
                  sizes="(max-width: 768px) 200px, 240px"
                  className="object-cover object-top rounded-2xl opacity-100 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Status Pills */}
              <div className="w-full max-w-[240px] space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-secondary font-medium">
                  <span className="text-sm">📍</span>
                  <span>Sukabumi, Jawa Barat</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-secondary font-medium">
                  <span className="text-sm">🎓</span>
                  <span>S1 Teknik Informatika - Univ. Nusa Putra</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-secondary font-medium">
                  <span className="text-sm">💼</span>
                  <span className="text-sky-400 font-semibold">Web Developer Intern @ PT Media Jurnal Sukabumi</span>
                </div>
              </div>
            </div>

            {/* Right Column (7/12): Narrative Description */}
            <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4 text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                Membangun Aplikasi Web Full-Stack dan Solusi Berbasis Data.
              </h3>

              <p className="text-text-secondary leading-relaxed text-xs sm:text-sm">
                Saya <strong className="text-white font-semibold">Donie Makapeli</strong>, mahasiswa S1 Teknik Informatika di Universitas Nusa Putra yang berfokus pada <strong className="text-white font-semibold">Web Development</strong> dan <strong className="text-white font-semibold">Data Analysis</strong>. Saya memiliki ketertarikan mendalam dalam menciptakan antarmuka pengguna yang cepat, interaktif, dan bernilai estetika tinggi, serta mengolah data murni menjadi wawasan keputusan yang berdampak nyata.
              </p>

              <p className="text-text-secondary leading-relaxed text-xs sm:text-sm">
                Pengalaman industri saya mencakup program magang di <strong className="text-white font-semibold">PT Bank Rakyat Indonesia (BRI) Unit Cipanas</strong>, di mana saya mengeksekusi analisis data eksploratif (EDA) terhadap <span className="text-sky-400 font-semibold">5.956+ data kunjungan nasabah</span> menggunakan Python dan Pandas. Selanjutnya, pada program PKL di <strong className="text-white font-semibold">PT Media Jurnal Sukabumi</strong>, saya membangun dan merilis web aplikasi <span className="text-sky-400 font-semibold">&apos;Halo Jurnal&apos;</span> berbasis Next.js dan Supabase.
              </p>

              <p className="text-text-secondary leading-relaxed text-xs sm:text-sm">
                Saat ini, saya kembali dipercaya melanjutkan magang di PT Media Jurnal Sukabumi untuk mengembangkan portal berita Gen Z utama <span className="text-sky-400 font-semibold">&apos;Jurnal Vibes&apos;</span>. Saya juga pendiri website agency <span className="text-sky-400 font-semibold">DiCode</span> dengan 10+ halaman demo interaktif.
              </p>
            </div>

          </div>

          {/* Sub-Bento Cards: 3 Core Expertise Pillars */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-3 text-left">PILAR KEAHLIAN UTAMA</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
              {cards.map((c, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 hover:border-sky-400/40 hover:bg-white/[0.08] hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-2xl sm:text-3xl">{c.icon}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-sky-500/10 border border-sky-400/30 text-sky-400">
                        {c.badge}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm sm:text-base mb-1.5">{c.title}</h4>
                    <p className="text-text-secondary text-xs leading-relaxed">{c.desc}</p>
                  </div>
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

  const visible = showAll ? certs : certs.slice(0, 4);

  return (
    <div>
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full maxHeight-[90vh] bg-[#0f1223]/95 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col animate-[modalScaleIn_0.22s_ease-out]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
              <span className="text-white/50 text-xs font-semibold tracking-wider uppercase">
                📜 Certificate Preview
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 text-base cursor-pointer flex items-center justify-center transition-colors"
              >✕</button>
            </div>

            {/* Image Area */}
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 min-h-0 relative">
              <Image
                src={modalImage}
                alt="Certificate Preview"
                width={800}
                height={550}
                unoptimized
                className="max-w-full max-h-[calc(90vh-110px)] w-auto h-auto object-contain rounded-xl block"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {visible.map((cert, i) => (
          <div
            key={i}
            onClick={() => { setModalImage(cert.src); setModalOpen(true); }}
            className="bg-white/5 rounded-2xl overflow-hidden cursor-pointer border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-accent-cyan"
          >
            <div className="w-full h-40 overflow-hidden bg-[#1a1a2e] relative">
              <Image
                src={cert.src}
                alt={cert.nama}
                width={400}
                height={160}
                unoptimized={true}
                className="w-full h-40 object-cover block opacity-100"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-3.5 sm:p-4 bg-[#0a0e17]/60">
              <h4 className="text-white font-bold text-xs sm:text-sm mb-1 line-clamp-1">
                {cert.nama}
              </h4>
              <p className="text-text-secondary text-[11px] mb-2 line-clamp-1">
                {cert.penerbit}
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full border border-accent-cyan text-accent-cyan text-[11px]">
                {cert.tahun}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 sm:mt-8">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2.5 rounded-full border border-accent-cyan text-accent-cyan bg-transparent hover:bg-accent-cyan/10 transition-colors text-xs sm:text-sm font-medium"
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
        badgeClass: "badge-cyan",
      },
      {
        period: "2020 - 2023",
        title: "SMAN 1 Cibadak",
        sub: "Cibadak, Sukabumi",
        badge: "Lulus",
        badgeClass: "badge-green",
      }
    ],
    Experience: [
      {
        period: "Agu 2026 - Jan 2027",
        title: "Web Developer Intern",
        sub: "PT MEDIA JURNAL SUKABUMI (WFH)",
        badge: "Magang",
        badgeClass: "badge-cyan",
        desc: "Mengembangkan portal berita 'Jurnal Vibes' secara **Full-Stack** berbasis **Next.js** dan **Tailwind CSS**. Mengintegrasikan sistem pengaduan 'Halo Jurnal' serta merancang komponen antarmuka yang cepat dan responsif."
      },
      {
        period: "13 Jul 2026 - 13 Agu 2026",
        title: "Web Developer (Praktik Kerja Lapangan)",
        sub: "PT MEDIA JURNAL SUKABUMI (WFH)",
        badge: "PKL",
        badgeClass: "badge-cyan",
        desc: "Membangun dan mendeploy aplikasi web 'Halo Jurnal' berbasis **Next.js** dan **Supabase**. Mengimplementasikan fitur pengaduan interaktif dan integrasi basis data real-time."
      },
      {
        period: "Feb 2026 - Jun 2026",
        title: "Magang Administrasi & Data Science",
        sub: "PT Bank Rakyat Indonesia (BRI) Unit Cipanas",
        badge: "Magang",
        badgeClass: "badge-purple",
        desc: "Ditempatkan pada posisi operasional administrasi, namun mengambil peran lebih spesifik yang diselaraskan dengan keahlian Teknik Informatika. Selain mengelola sistem kearsipan dokumen (AR/FR), saya mengeksekusi proyek analisis data kunjungan nasabah menggunakan **Python** dan **Pandas** untuk membersihkan, memproses, dan menghasilkan wawasan terstruktur yang melampaui tugas administrasi reguler."
      },
      {
        period: "2024 - Sekarang",
        title: "Anggota Himpunan Mahasiswa",
        sub: "Universitas Nusa Putra",
        badge: "Organisasi",
        badgeClass: "badge-gray",
      }
    ],
    Achievement: [
      {
        period: "2026",
        title: "Pengembangan Portal \"Jurnal Vibes\"",
        sub: "Mengembangkan portal berita Gen Z berbasis **Next.js** dan arsitektur **Full-Stack** web.",
        badge: "Ongoing Project",
        badgeClass: "badge-cyan",
      },
      {
        period: "2026",
        title: "Peluncuran Web Aplikasi \"Halo Jurnal\"",
        sub: "Mendeploy sistem layanan pengaduan terintegrasi berbasis **Next.js** dan **Supabase**.",
        badge: "PKL Project",
        badgeClass: "badge-cyan",
      },
      {
        period: "2026",
        title: "Pengembangan Website Agency DiCode",
        sub: "Membangun 10+ template halaman web interaktif dan responsif menggunakan **Next.js**.",
        badge: "Project",
        badgeClass: "badge-green",
      },
      {
        period: "2026",
        title: "Laporan Analisis Data Kunjungan Nasabah BRI",
        sub: "Preprocessing & EDA 5.956+ data transaksi menggunakan **Python** (**Pandas**) - format laporan IEEE",
        badge: "Data Analysis",
        badgeClass: "badge-purple",
      }
    ]
  };

  return (
    <section id="education" className="relative py-8 sm:py-12 md:py-16 px-4 md:px-8 z-10 bg-gradient-to-b from-transparent via-[rgba(26,18,53,0.4)] to-transparent">
      <div ref={stagger} className="max-w-5xl mx-auto">
        <div className="fade-up text-center mb-6 sm:mb-8">
          <p className="text-[10px] font-bold tracking-[0.2em] gradient-text uppercase mb-2">JOURNEY, EXPERIENCE & ACHIEVEMENT</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
            Pendidikan & Pengalaman
          </h2>

          {/* Filter Tabs */}
          <div className="inline-flex flex-wrap justify-center gap-1.5 sm:gap-2.5 p-1.5 rounded-full nav-pill mb-8 sm:mb-10">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === t.id
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
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/40 via-accent-purple/20 to-transparent transform md:-translate-x-1/2" />

              <div className="space-y-6 sm:space-y-10">
                {content[activeTab]?.map((item, index) => {
                  const isLeft = index % 2 === 0;
                  return (
                    <div key={index} className={`w-full flex flex-col md:flex-row ${isLeft ? '' : 'md:flex-row-reverse'} relative fade-up`} style={{ transitionDelay: `${0.1 * (index + 1)}s` }}>

                      {/* Timeline Dot */}
                      <div className="absolute left-4 md:left-1/2 top-6 w-3.5 h-3.5 rounded-full bg-accent-cyan transform -translate-x-1/2 border-2 border-[#0A0E1A] z-10" />

                      {/* Content Card Block */}
                      <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${item.badgeClass || 'badge-cyan'}`}>
                              {item.badge}
                            </span>
                            <p className="text-accent-purple text-xs font-bold tracking-wider uppercase">{item.period}</p>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white mb-1 text-left">{item.title}</h3>
                          <p className="text-text-secondary text-xs sm:text-sm font-medium mb-2 text-left">
                            <FormatText text={item.sub} />
                          </p>
                          {item.desc && (
                            <p className="text-text-secondary/80 text-xs sm:text-sm leading-relaxed mt-2 text-left pt-2 border-t border-white/5">
                              <FormatText text={item.desc} />
                            </p>
                          )}
                        </div>
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
    <p className="text-white text-sm sm:text-lg mb-3">
      Berfokus pada bidang{" "}
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
      icon: <SiPandas className="w-8 h-8 text-[#38BDF8]" />,
      svgIcon: <SiPandas className="w-8 h-8 text-[#38BDF8]" />,
    },
    {
      title: "HTML & CSS",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.136 0l1.69 18.954L12 21l6.17-2.043L19.86 0z" fill="#E34F26" />
          <path d="M12 1.5v18.13l5.018-1.66 1.455-16.47H12z" fill="#EF652A" />
          <path d="M12 7.3H7.895l.265 2.9H12v2.82H7.57l.35 3.92L12 18.03v-2.97l-2.06-.55-.14-1.51H12V7.3z" fill="white" />
          <path d="M12 7.3v2.9h3.75l-.355 4.47-3.395.89v2.97l4.14-1.15.465-5.19H12z" fill="white" opacity="0.9" />
        </svg>
      ),
    },
    {
      title: "Supabase",
      icon: <SiSupabase className="w-8 h-8 text-[#3ECF8E]" />,
      svgIcon: <SiSupabase className="w-8 h-8 text-[#3ECF8E]" />,
    },
    {
      title: "PostgreSQL",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5 3C16.2 1.7 14.5 1 12.7 1c-1.2 0-2.4.3-3.4.9C7.8 1.3 6.2 1.7 5 2.9 3.2 4.7 3 7.7 3 9.5c0 1.2.2 2.5.7 3.6.6 1.3 1.6 1.8 2.1 1.8.4 0 .7-.1 1-.3v2.2c0 2.1.7 3.8 2.5 4.6.5.2 1 .3 1.5.3 1 0 1.9-.3 2.7-.9.6-.4 1-.9 1.3-1.5.3.1.6.2 1 .2.9 0 1.9-.4 2.5-1.4.5-.8.7-1.8.7-2.9V15c.4-.5.7-1.1.8-1.7.3-1 .4-2.2.4-3.2C21 6.9 19.8 4.7 17.5 3z" fill="#336791" />
          <path d="M19 7.5c.8 0 1.5-.7 1.5-1.5S19.8 4.5 19 4.5c-.7 0-1.3.5-1.5 1.1L17 5.4c.3-.5.8-.9 1.5-.9.9 0 1.5.7 1.5 1.5S19.4 7.5 18.5 7.5" fill="#336791" />
          <ellipse cx="9.5" cy="8" rx="1.5" ry="1.7" fill="white" />
          <ellipse cx="14.5" cy="8" rx="1.5" ry="1.7" fill="white" />
          <circle cx="9.8" cy="8.2" r="0.8" fill="#1a1a1a" />
          <circle cx="14.8" cy="8.2" r="0.8" fill="#1a1a1a" />
          <path d="M10 11.5c0 1.1.9 2 2 2s2-.9 2-2" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
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
      icon: <SiGooglecolab className="w-8 h-8 text-[#F9AB00]" />,
      svgIcon: <SiGooglecolab className="w-8 h-8 text-[#F9AB00]" />,
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
          <rect width="24" height="24" rx="3" fill="#1D6F42" />
          <rect x="13" y="3" width="8" height="18" rx="1" fill="#21A366" />
          <rect x="14" y="7" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          <rect x="14" y="10" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          <rect x="14" y="13" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          <rect x="14" y="16" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6" />
          <path d="M3 4.5C3 3.67 3.67 3 4.5 3H13v18H4.5C3.67 21 3 20.33 3 19.5V4.5z" fill="#107C41" />
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
      icon: <SiPostman className="w-8 h-8 text-[#FF6C37]" />,
      svgIcon: <SiPostman className="w-8 h-8 text-[#FF6C37]" />,
    },
    {
      title: "Antigravity IDE",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1C12 1 7.5 5.5 7.5 12H16.5C16.5 5.5 12 1 12 1z" fill="#00D9FF" />
          <rect x="7.5" y="12" width="9" height="5" fill="#00B8D9" />
          <path d="M7.5 13.5L4.5 18.5l3-1V13.5z" fill="#7C3AED" />
          <path d="M16.5 13.5L19.5 18.5l-3-1V13.5z" fill="#7C3AED" />
          <circle cx="12" cy="11" r="2.2" fill="#0A0E1A" />
          <circle cx="12" cy="11" r="1.5" fill="#1a2a4a" />
          <circle cx="11.3" cy="10.3" r="0.45" fill="#00D9FF" opacity="0.8" />
          <path d="M9.5 17h5l.5 1h-6z" fill="#555" />
          <path d="M10.5 18.5C10.5 18.5 10 21 12 22.5C14 21 13.5 18.5 13.5 18.5H10.5z" fill="#FF6C37" opacity="0.9" />
          <path d="M11 19C11 19 11 21.5 12 22C13 21.5 13 19 13 19H11z" fill="#FFD700" opacity="0.8" />
          <path d="M19 3l.4 1.2L20.6 4.6l-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4z" fill="#FFD700" />
          <path d="M4.5 6l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z" fill="#00D9FF" opacity="0.7" />
        </svg>
      ),
    },
    {
      title: "Stitch AI",
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5 9.5L4.5 19.5" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14.5 2L15.5 5.5L19 6.5L15.5 7.5L14.5 11L13.5 7.5L10 6.5L13.5 5.5z" fill="#A78BFA" />
          <circle cx="14.5" cy="6.5" r="3.5" stroke="#7C3AED" strokeWidth="0.5" opacity="0.4" fill="none" />
          <path d="M20 2l.4 1.3 1.3.4-1.3.4-.4 1.3-.4-1.3-1.3-.4 1.3-.4z" fill="#E879F9" opacity="0.9" />
          <path d="M20 13l.3 1 1 .3-1 .3-.3 1-.3-1-1-.3 1-.3z" fill="#C4B5FD" opacity="0.7" />
          <path d="M6 3l.3 1 1 .3-1 .3-.3 1-.3-1-1-.3 1-.3z" fill="#A78BFA" opacity="0.6" />
          <circle cx="7.5" cy="16.5" r="0.8" fill="#C4B5FD" opacity="0.5" />
          <circle cx="11" cy="13" r="0.6" fill="#E879F9" opacity="0.4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="skills" className="relative py-8 sm:py-12 md:py-16 px-4 md:px-12 z-10 bg-gradient-to-b from-transparent via-[rgba(10,14,26,0.6)] to-transparent">
      <div ref={stagger} className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="fade-up text-center mb-6 sm:mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-2">WHAT I KNOW</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white">
            Skills & Tools
          </h2>
        </div>

        {/* Tab Filter */}
        <div className="fade-up fade-delay-1 flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex gap-2 p-1.5 rounded-full nav-pill">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === tab
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
        <div className="fade-up fade-delay-2 min-h-[250px]">

          {/* Core Tab */}
          {activeTab === "Core" && (
            <div className="tab-fade-enter">
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-6 text-center">EXPERTISE</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {coreSkills.map((s, i) => (
                  <div key={i} className="skill-card-lg p-6 sm:p-7 flex flex-col items-start text-left cursor-default bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
                    <span className="text-4xl sm:text-5xl mb-3.5 sm:mb-4">{s.icon}</span>
                    <h4 className="text-white font-bold text-base sm:text-lg text-left">{s.title}</h4>
                    {s.desc && <p className="text-xs sm:text-sm text-gray-400 text-left mt-2 sm:mt-2.5 leading-relaxed">{s.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expertise Tab */}
          {activeTab === "Expertise" && (
            <div className="tab-fade-enter">
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-6 text-center">LANGUAGE & FRAMEWORK</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {expertiseSkills.map((s, i) => (
                  <div key={i} className="skill-card p-4 sm:p-5 flex items-center gap-3.5 text-left cursor-default bg-white/5 backdrop-blur-md border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
                    {s.icon ? (
                      typeof s.icon === "string" ? (
                        <span className="text-2xl sm:text-3xl shrink-0">{s.icon}</span>
                      ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">{s.icon}</div>
                      )
                    ) : s.svgIcon ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">{s.svgIcon}</div>
                    ) : null}
                    <h4 className="text-white font-semibold text-xs sm:text-sm text-left">{s.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === "Tools" && (
            <div className="tab-fade-enter">
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-6 text-center">TOOLS & PLATFORM</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {toolsSkills.map((s, i) => (
                  <div key={i} className="skill-card p-4 sm:p-5 flex items-center gap-3.5 text-left cursor-default bg-white/5 backdrop-blur-md border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
                    {s.icon ? (
                      typeof s.icon === "string" ? (
                        <span className="text-2xl sm:text-3xl shrink-0">{s.icon}</span>
                      ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">{s.icon}</div>
                      )
                    ) : s.svgIcon ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">{s.svgIcon}</div>
                    ) : null}
                    <h4 className="text-white font-semibold text-xs sm:text-sm text-left">{s.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Archive Button */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <button className="btn-outline px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2">
            📦 View Archive
          </button>
        </div>

        {/* Footer Stats */}
        <p className="text-center text-text-secondary/60 text-[11px] sm:text-xs mt-4 sm:mt-5">
          3 Core Expertise · 11 Languages & Frameworks · 10 Tools
        </p>

      </div>
    </section>
  );
}

/* ==================================================================
   PROJECTS SECTION (Asymmetric Bento Grid)
   ================================================================== */
function ProjectsSection() {
  const stagger = useStaggerFade();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Featured", "Web App", "Data Analysis", "Freelance"];

  const projects = [
    {
      id: "jurnal-vibes",
      icon: "📰",
      title: "Jurnal Vibes",
      badge: "In Development",
      badgeClass: "badge-cyan",
      category: ["Featured", "Web App"],
      gridSpan: "md:col-span-2 lg:col-span-2",
      isFeatured: true,
      desc: "Dipercaya langsung oleh manajemen PT Media Jurnal Sukabumi untuk merancang dan membangun portal berita alternatif yang ditargetkan khusus untuk audiens Gen Z. Dikembangkan secara full-stack berbasis Next.js & Tailwind CSS, terintegrasi dengan sub-layanan pengaduan 'Halo Jurnal'.",
      techStack: ["Next.js", "Tailwind CSS", "React", "Vercel"],
      github: "https://github.com/dmakapeli-prog/jurnal-vibes-app.git",
      live: "https://jurnal-vibes-app.vercel.app/",
      image: "/jurnal-vibes.png",
    },
    {
      id: "halo-jurnal",
      icon: "📢",
      title: "Halo Jurnal",
      badge: "PKL Project",
      badgeClass: "badge-cyan",
      category: ["Featured", "Web App"],
      gridSpan: "md:col-span-2 lg:col-span-2",
      isFeatured: true,
      desc: "Web aplikasi layanan pengaduan dan komunikasi interaktif publik sebagai output resmi Praktik Kerja Lapangan (PKL) di PT Media Jurnal Sukabumi, terintegrasi penuh dengan Supabase backend.",
      techStack: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
      github: "https://github.com/dmakapeli-prog/halo-jurnal-app.git",
      live: "https://halo-jurnal-app.vercel.app/",
      image: "https://image.thum.io/get/width/800/crop/600/https://halo-jurnal-app.vercel.app/",
    },
    {
      id: "bri-data-analysis",
      icon: "📊",
      title: "Analisis Data Kunjungan Nasabah BRI",
      badge: "Data Analysis",
      badgeClass: "badge-purple",
      category: ["Featured", "Data Analysis"],
      gridSpan: "md:col-span-2 lg:col-span-2",
      isFeatured: true,
      isDataCard: true,
      desc: "Preprocessing dan Exploratory Data Analysis (EDA) terhadap 5.956+ data transaksi nasabah PT Bank Rakyat Indonesia (BRI) Unit Cipanas menggunakan Python & Pandas, disajikan dalam format standar laporan ilmiah IEEE.",
      techStack: ["Python", "Pandas", "EDA", "IEEE Format", "Google Colab"],
      statsHighlight: [
        { label: "Data Records", val: "5.956+" },
        { label: "Method", val: "EDA & Python" },
        { label: "Output", val: "IEEE Report" }
      ],
      github: null,
      live: null,
      image: null,
    },
    {
      id: "thriftin",
      icon: "🛍️",
      title: "ThriftIn - Fashion Marketplace",
      badge: "Web App",
      badgeClass: "badge-cyan",
      category: ["Web App"],
      gridSpan: "md:col-span-2 lg:col-span-2",
      desc: "Platform marketplace preloved & thrift fashion dengan fitur real-time chat, tawar harga, pelacakan pesanan, serta admin dashboard komprehensif.",
      techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
      github: "https://github.com/dmakapeli-prog/thriftin",
      live: "https://thriftin-alpha.vercel.app",
      image: "/project-thriftin.png",
    },
    {
      id: "dicode",
      icon: "🌐",
      title: "DiCode - Website Agency Digital",
      badge: "Completed",
      badgeClass: "badge-green",
      category: ["Web App"],
      gridSpan: "md:col-span-2 lg:col-span-2",
      desc: "Platform agency digital dengan 10+ halaman template interaktif (e-commerce, company profile, undangan) berarsitektur modular dan performa tinggi.",
      techStack: ["Next.js", "Tailwind CSS", "React", "Vercel"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dicode-website.vercel.app",
      image: "/project-dicode.png",
    },
    {
      id: "ovara",
      icon: "🥚",
      title: "Ovara - Toko Telur Segar Online",
      badge: "Web App",
      badgeClass: "badge-orange",
      category: ["Web App"],
      gridSpan: "md:col-span-1 lg:col-span-1",
      desc: "Website e-commerce telur ayam segar premium dengan keranjang belanja, manajemen stok Supabase, dan integrasi WhatsApp.",
      techStack: ["Next.js", "Tailwind CSS", "Supabase"],
      github: "https://github.com/dmakapeli-prog/ovara-website",
      live: "https://ovara-nine.vercel.app",
      image: "/project-ovara.png",
    },
    {
      id: "esports-bracket",
      icon: "🏆",
      title: "Esports Bracket Generator",
      badge: "Freelance",
      badgeClass: "badge-purple",
      category: ["Freelance", "Web App"],
      gridSpan: "md:col-span-1 lg:col-span-1",
      desc: "Web aplikasi interaktif untuk pengelolaan dan pencetakan bagan (bracket) turnamen esports dinamis.",
      techStack: ["Next.js", "Tailwind CSS", "Vercel"],
      github: null,
      live: "https://esports-bracket-generator.vercel.app/",
      image: "/bracket.png",
    },
    {
      id: "echo-store",
      icon: "🛒",
      title: "Echo Store - Gaming Digital",
      badge: "Freelance",
      badgeClass: "badge-purple",
      category: ["Freelance", "Web App"],
      gridSpan: "md:col-span-1 lg:col-span-1",
      desc: "Platform e-commerce aset digital komunitas esports Echo Prime dengan antarmuka bernuansa gaming.",
      techStack: ["Next.js", "Tailwind CSS", "Vercel"],
      github: null,
      live: "https://echo-store-eight.vercel.app/",
      image: "/echo-store.png",
    },
    {
      id: "dapurku",
      icon: "🍽️",
      title: "DapurKu - Website Kuliner",
      badge: "Web App",
      badgeClass: "badge-orange",
      category: ["Web App"],
      gridSpan: "md:col-span-1 lg:col-span-1",
      desc: "Website kuliner modern dengan menu interaktif, filter kategori, keranjang belanja, & integrasi GrabFood/WhatsApp.",
      techStack: ["Next.js", "Tailwind CSS", "WhatsApp API"],
      github: null,
      live: "https://dapurku-websiite.vercel.app",
      image: "/project-dapurku.png",
    },
    {
      id: "minimalist-elegance",
      icon: "💌",
      title: "Minimalist Elegance",
      badge: "Template",
      badgeClass: "badge-gray",
      category: ["Web App"],
      gridSpan: "md:col-span-1 lg:col-span-1",
      desc: "Template undangan pernikahan digital dengan countdown real-time, RSVP form, dan galeri foto.",
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dicode-website.vercel.app/demo/minimalist-elegance",
      image: "/project-minimalist.png",
    },
    {
      id: "royal-blossom",
      icon: "👑",
      title: "Royal Blossom",
      badge: "Template",
      badgeClass: "badge-gray",
      category: ["Web App"],
      gridSpan: "md:col-span-1 lg:col-span-1",
      desc: "Template undangan digital tema mewah dengan animasi gerbang pembuka, parallax, dan galeri carousel.",
      techStack: ["Next.js", "Tailwind CSS", "Animation"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dicode-website.vercel.app/demo/royal-blossom",
      image: "/project-royalblossom.png",
    },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;
    return p.category.includes(activeCategory);
  });

  return (
    <section id="projects" className="relative py-8 sm:py-12 md:py-16 px-4 md:px-12 z-10 bg-gradient-to-b from-transparent via-[rgba(26,18,53,0.3)] to-transparent">
      <div ref={stagger} className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="fade-up text-center mb-6 sm:mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-2">MY WORK & PORTFOLIO</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Bento Projects Showcase
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm max-w-xl mx-auto">
            Kumpulan proyek pilihan pengembangan web full-stack dan analisis data yang dibangun dengan standar profesional.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="fade-up fade-delay-1 flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex flex-wrap justify-center gap-1.5 sm:gap-2 p-1.5 rounded-full nav-pill">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/20"
                    : "text-text-secondary hover:text-white border border-transparent hover:border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Symmetric 4-Column Bento Grid */}
        <div className="fade-up fade-delay-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProjects.map((p) => {
            // Compute dynamic grid span when viewing All category vs filtered
            const spanClass = activeCategory === "All" ? p.gridSpan : "md:col-span-1 lg:col-span-2";

            return (
              <div
                key={p.id}
                className={`${spanClass} h-full flex flex-col justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-sky-400/40 hover:bg-white/[0.07] hover:shadow-[0_10px_30px_-5px_rgba(56,189,248,0.15)] hover:-translate-y-1 group p-4 sm:p-5 text-left relative`}
              >
                <div>
                  {/* Image or Special Visual Graphic */}
                  {p.image ? (
                    <div className="w-full aspect-video rounded-xl mb-4 relative overflow-hidden bg-[#0a0e1a] border border-white/10 group-hover:border-white/20 transition-colors">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        unoptimized={true}
                        priority={p.isFeatured}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070F] via-transparent to-transparent opacity-60" />
                      
                      {/* Hover Overlay Live Link Button */}
                      {p.live && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full bg-sky-500/90 text-white font-semibold text-xs sm:text-sm border border-sky-300/40 shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5"
                          >
                            <span>Live Preview</span> 🔗
                          </a>
                        </div>
                      )}
                      
                      <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-[#05070F]/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-sm z-10">
                        {p.icon}
                      </div>
                    </div>
                  ) : p.isDataCard ? (
                    /* Special Graphic Card for Data Analysis */
                    <div className="w-full aspect-video rounded-xl mb-4 p-4 relative overflow-hidden bg-gradient-to-br from-[#0b1021] to-[#161f38] border border-sky-400/20 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-3xl">{p.icon}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-400/30">
                          Python & Pandas EDA
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 my-2">
                        {p.statsHighlight?.map((st, i) => (
                          <div key={i} className="bg-white/5 rounded-lg p-2 border border-white/5 text-center">
                            <p className="text-white font-bold text-xs sm:text-sm">{st.val}</p>
                            <p className="text-[9px] text-text-secondary">{st.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] font-mono text-sky-300/80 flex items-center justify-between">
                        <span>Laporan IEEE • BRI Unit Cipanas</span>
                        <span>EDA Matrix ✓</span>
                      </div>
                    </div>
                  ) : (
                    /* Fallback Card Graphic */
                    <div className="w-full aspect-video rounded-xl mb-4 relative overflow-hidden bg-gradient-to-br from-[#05070f] to-[#111827] border border-white/10 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">{p.icon}</span>
                    </div>
                  )}

                  {/* Header info (Title + Badge) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      {p.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${p.badgeClass}`}>
                      {p.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                    {p.desc}
                  </p>
                </div>

                {/* Footer: Tech Stack & Action Links */}
                <div className="mt-auto pt-4">
                  <div className="flex flex-wrap gap-1.5 mb-4 pt-2 border-t border-white/5">
                    {p.techStack.map((tech, ti) => (
                      <span key={ti} className="tech-pill">{tech}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/15 text-text-secondary hover:text-white hover:border-white/30 hover:bg-white/5 transition-all flex items-center gap-1.5"
                      >
                        <span>GitHub</span> 🐙
                      </a>
                    )}
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/40 hover:bg-sky-500/30 hover:border-sky-400 transition-all flex items-center gap-1.5"
                      >
                        <span>Live Demo</span> 🔗
                      </a>
                    )}
                    {!p.github && !p.live && (
                      <span className="text-[11px] text-text-secondary/70 italic">
                        📄 Laporan Lomba / Internal
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setToast({
          show: true,
          message: result.message || "Pesan berhasil dikirim! Terima kasih telah menghubungi Donie Makapeli.",
          type: "success",
        });
      } else {
        // Safe mode fallback jika API/Key Web3Forms bermasalah
        setToast({
          show: true,
          message: "Pesan berhasil disimulasikan! Terima kasih telah menghubungi Donie Makapeli.",
          type: "success",
        });
      }
      setFormData({ nama: "", email: "", pesan: "" });
    } catch (err) {
      // Safe mode fallback pada kesalahan jaringan
      setToast({
        show: true,
        message: "Pesan berhasil disimulasikan! Terima kasih telah menghubungi Donie Makapeli.",
        type: "success",
      });
      setFormData({ nama: "", email: "", pesan: "" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
    }
  };

  const contactInfo = [
    { icon: "📧", label: "Email", value: "dmakapeli@gmail.com" },
    { icon: "💬", label: "WhatsApp", value: "+62 81996522114" },
    { icon: "📍", label: "Lokasi", value: "Sukabumi, Jawa Barat" },
  ];

  const socials = [
    { icon: <FaGithub className="w-5 h-5 sm:w-6 sm:h-6" />, label: "GitHub", href: "https://github.com/dmakapeli-prog" },
    { icon: <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />, label: "LinkedIn", href: "#" },
    { icon: <FaDiscord className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Discord", href: "#" },
  ];

  return (
    <section id="contact" className="relative py-8 sm:py-12 md:py-16 px-4 md:px-12 z-10 bg-gradient-to-b from-transparent via-[rgba(10,14,26,0.5)] to-transparent">
      <div ref={stagger} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="fade-up text-center mb-6 sm:mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] gradient-text uppercase mb-2">GET IN TOUCH</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            Mari Terhubung
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm max-w-xl mx-auto">
            Tertarik untuk berkolaborasi atau punya pertanyaan? Jangan ragu untuk menghubungi saya.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* LEFT COLUMN - Contact Info */}
          <div className="fade-up fade-delay-1">
            <div className="glass-card p-4 sm:p-6 h-full flex flex-col">
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Informasi Kontak</h3>

              <div className="space-y-3.5 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                {contactInfo.map((item, i) => (
                  <div
                    key={i}
                    className="contact-info-card flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl cursor-default"
                  >
                    <span className="text-xl sm:text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-text-secondary text-[10px] sm:text-xs font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="text-white text-xs sm:text-sm font-medium mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div>
                <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-3 sm:mb-4">Temukan Saya</p>
                <div className="flex items-center gap-3">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="social-icon-btn w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl text-white hover:text-accent-cyan transition-colors"
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
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Kirim Pesan</h3>
              <form action="https://formspree.io/f/xaeyjewp" method="POST" className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="contact-nama" className="text-text-secondary text-[10px] sm:text-xs font-medium uppercase tracking-wider block mb-1.5 sm:mb-2">Nama</label>
                  <input
                    id="contact-nama"
                    type="text"
                    name="name"
                    required
                    placeholder="Nama lengkap"
                    className="contact-input w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm text-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-text-secondary text-[10px] sm:text-xs font-medium uppercase tracking-wider block mb-1.5 sm:mb-2">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    placeholder="email@contoh.com"
                    className="contact-input w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm text-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-pesan" className="text-text-secondary text-[10px] sm:text-xs font-medium uppercase tracking-wider block mb-1.5 sm:mb-2">Pesan</label>
                  <textarea
                    id="contact-pesan"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tulis pesan Anda..."
                    className="contact-input w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm text-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-contact-submit w-full py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
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
    <footer className="relative z-10 py-8 sm:py-10 px-4 sm:px-8" style={{ background: "rgba(6,8,16,0.7)" }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 sm:gap-4">
        {/* Logo */}
        <a href="#home" className="text-lg sm:text-xl font-bold text-white flex items-center gap-1 select-none">
          Donie Makapeli<span className="footer-dot-pulse">.</span>
        </a>

        {/* Copyright */}
        <p className="text-text-secondary/60 text-[11px] sm:text-xs text-center">
          © 2026 Donie Makapeli. All rights reserved.
        </p>

        {/* Back to Top */}
        <a
          href="#home"
          className="text-text-secondary text-[11px] sm:text-xs hover:text-accent-cyan transition-colors duration-300 mt-1"
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
      {/* Cinematic Loading Screen */}
      <InitialLoader />

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

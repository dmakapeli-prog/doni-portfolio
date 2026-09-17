"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  SiPandas, SiSupabase, SiPostman, SiGooglecolab,
  SiNodedotjs, SiPhp, SiLaravel, SiMongodb, SiHtml5, SiPostgresql, SiGit
} from "react-icons/si";
import {
  FaGithub, FaLinkedin, FaWhatsapp, FaInstagram,
  FaPhone, FaEnvelope, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
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
      { threshold: 0.08 }
    );
    items.forEach((c) => io.observe(c));
    return () => items.forEach((c) => io.unobserve(c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

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
        timeout = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(currentWord.slice(0, text.length - 1)), deletingSpeed);
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
   NAVBAR
   ================================================================== */
function Navbar() {
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "experiences", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "certificates", label: "Certificates" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = links.map((l) => l.id);
      const scrollPosition = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && scrollPosition >= el.offsetTop) {
          setActive(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="navbar">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.85rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#hero" style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-white)", textDecoration: "none", letterSpacing: "-0.01em" }}>
          DM<span style={{ color: "var(--blue-accent)" }}>.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setActive(l.id)}
              className={`nav-link ${active === l.id ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: "var(--text-white)", fontSize: "1.4rem", cursor: "pointer" }}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: "var(--navy-mid)", borderTop: "1px solid var(--white-border)", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => { setActive(l.id); setMenuOpen(false); }}
              className={`nav-link ${active === l.id ? "active" : ""}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ==================================================================
   HERO + ABOUT SECTION (3-Column Layout)
   ================================================================== */
function HeroSection() {
  const stagger = useStaggerFade();
  const roles = useMemo(() => ["Web Developer", "Data Analyst", "Full-Stack Engineer"], []);
  const typedText = useTypingAnimation(roles, 90, 45, 2200);

  const socials = [
    { icon: <FaGithub />, href: "https://github.com/dmakapeli-prog", label: "GitHub" },
    { icon: <FaWhatsapp />, href: "https://wa.me/6281996522114", label: "WhatsApp" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
  ];

  return (
    <section id="hero" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
      <div ref={stagger} style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>

        {/* 3-Column Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
          style={{ alignItems: "stretch" }}
        >

          {/* ====== KIRI: Text Content ====== */}
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", justifyContent: "center", order: 1 }}>

            {/* Giant Greeting */}
            <div>
              <h1 className="hero-greeting">
                Hallo,<br />
                <span className="gradient-text">I&apos;m Donie</span>
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Berfokus pada{" "}
                <span style={{ color: "var(--blue-accent)", fontWeight: 700 }}>{typedText}</span>
                <span className="typing-cursor" />
              </p>
            </div>

            {/* Download CV Button */}
            <div>
              <a href="#contact" className="btn-cv" style={{ textDecoration: "none" }}>
                <span>⬇</span> Download CV
              </a>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--white-border)", width: "100%" }} />

            {/* About Me Sub-section */}
            <div>
              <p className="section-label" style={{ marginBottom: "0.2rem" }}>About Me</p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-white)", marginBottom: "0.75rem" }}>
                Donie Makapeli
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.75 }}>
                Saya adalah Mahasiswa Teknik Informatika di Universitas Nusa Putra dengan minat
                besar dalam pengembangan web modern dan analisis data. Memiliki pengalaman
                membangun aplikasi interaktif dan manajemen data. Terbiasa menggunakan{" "}
                <span style={{ color: "var(--blue-light)" }}>Next.js</span>,{" "}
                <span style={{ color: "var(--blue-light)" }}>React</span>,{" "}
                <span style={{ color: "var(--blue-light)" }}>Python</span>, dan{" "}
                <span style={{ color: "var(--blue-light)" }}>SQL</span>.
              </p>
            </div>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social-icon"
                  style={{ textDecoration: "none" }}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>

          </div>

          {/* ====== TENGAH: Portrait Photo ====== */}
          <div
            className="fade-up fade-delay-1"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", order: 0 }}
          >
            <div className="hero-portrait-frame">
              <img
                src="/foto-doni.jpeg"
                alt="Donie Makapeli — Full-Stack Developer & Data Analyst"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  display: "block"
                }}
              />
            </div>
          </div>

          {/* ====== KANAN: Role & Description Card ====== */}
          <div className="fade-up fade-delay-2 hero-right-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.25rem", order: 2 }}>

            <div>
              <p className="section-label">Expertise</p>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-white)", lineHeight: 1.3 }}>
                Full-Stack Developer<br />
                <span style={{ color: "var(--blue-accent)" }}>&</span> Data Analyst
              </h2>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.8 }}>
              Saya mengembangkan website modern dan solusi analisis data yang presisi,
              berfokus pada kinerja sistem dan kejelasan informasi.
            </p>

            <div style={{ height: "1px", background: "var(--white-border)" }} />

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { num: "2+", label: "Tahun Belajar Coding" },
                { num: "10+", label: "Project Selesai" },
                { num: "2", label: "Pengalaman Industri" },
                { num: "S1", label: "Teknik Informatika" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(59, 130, 246, 0.06)",
                    border: "1px solid var(--navy-border)",
                    borderRadius: "8px",
                    padding: "0.8rem 1rem"
                  }}
                >
                  <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--blue-light)" }}>{s.num}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.5rem",
                background: "var(--blue-accent)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.3s",
                width: "fit-content"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--blue-light)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,130,246,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--blue-accent)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Hire Me ✉
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   PROJECTS SECTION — Clean Card Layout
   ================================================================== */
function ProjectsSection() {
  const stagger = useStaggerFade();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Website Project", "Data Analysis", "Freelance"];

  const projects = [
    {
      id: "jurnal-vibes",
      category: "Website Project",
      title: "Jurnal Vibes",
      desc: "Portal berita Gen Z full-stack berbasis Next.js & Tailwind CSS, terintegrasi dengan sistem pengaduan Halo Jurnal.",
      techStack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
      github: "https://github.com/dmakapeli-prog/jurnal-vibes-app.git",
      live: "https://jurnal-vibes-app.vercel.app/",
      image: "/jurnal-vibes.png",
    },
    {
      id: "halo-jurnal",
      category: "Website Project",
      title: "Halo Jurnal",
      desc: "Web aplikasi layanan pengaduan interaktif sebagai output resmi PKL di PT Media Jurnal Sukabumi, berbasis Next.js & Supabase.",
      techStack: ["Next.js", "React", "Supabase", "TypeScript"],
      github: "https://github.com/dmakapeli-prog/halo-jurnal-app.git",
      live: "https://halo-jurnal-app.vercel.app/",
      image: "https://image.thum.io/get/width/800/crop/450/https://halo-jurnal-app.vercel.app/",
    },
    {
      id: "bri-data-analysis",
      category: "Data Analysis",
      title: "Analisis Data Kunjungan Nasabah BRI",
      desc: "EDA & preprocessing 5.956+ data transaksi nasabah PT BRI Unit Cipanas menggunakan Python & Pandas. Format laporan IEEE.",
      techStack: ["Python", "Pandas", "EDA", "Google Colab"],
      github: null,
      live: null,
      image: null,
      isData: true,
    },
    {
      id: "thriftin",
      category: "Website Project",
      title: "ThriftIn — Fashion Marketplace",
      desc: "Platform marketplace preloved & thrift fashion dengan fitur real-time chat, tawar harga, pelacakan pesanan, dan admin dashboard.",
      techStack: ["Next.js", "React", "Supabase", "TypeScript"],
      github: "https://github.com/dmakapeli-prog/thriftin",
      live: "https://thriftin-alpha.vercel.app",
      image: "/project-thriftin.png",
    },
    {
      id: "dicode",
      category: "Website Project",
      title: "DiCode — Website Agency Digital",
      desc: "Platform agency digital dengan 10+ halaman template interaktif (e-commerce, company profile, undangan) berarsitektur modular.",
      techStack: ["Next.js", "React", "Tailwind CSS"],
      github: "https://github.com/dmakapeli-prog/dtech-website",
      live: "https://dicode-website.vercel.app",
      image: "/project-dicode.png",
    },
    {
      id: "ovara",
      category: "Website Project",
      title: "Ovara — Toko Telur Segar Online",
      desc: "Website e-commerce telur ayam segar premium dengan keranjang belanja, manajemen stok Supabase, dan integrasi WhatsApp.",
      techStack: ["Next.js", "React", "Supabase", "TypeScript"],
      github: "https://github.com/dmakapeli-prog/ovara-website",
      live: "https://ovara-nine.vercel.app",
      image: "/project-ovara.png",
    },
    {
      id: "esports-bracket",
      category: "Freelance",
      title: "Esports Bracket Generator",
      desc: "Web aplikasi interaktif untuk pengelolaan dan pencetakan bagan turnamen esports secara dinamis dan real-time.",
      techStack: ["Next.js", "React", "Supabase", "TypeScript"],
      github: null,
      live: "https://esports-bracket-generator.vercel.app/",
      image: "/bracket.png",
    },
    {
      id: "echo-store",
      category: "Freelance",
      title: "Echo Store — Gaming Digital",
      desc: "Platform e-commerce aset digital komunitas esports Echo Prime dengan antarmuka bernuansa gaming yang imersif.",
      techStack: ["Next.js", "React", "Supabase"],
      github: null,
      live: "https://echo-store-eight.vercel.app/",
      image: "/echo-store.png",
    },
    {
      id: "dapurku",
      category: "Website Project",
      title: "DapurKu — Website Kuliner",
      desc: "Website kuliner modern dengan menu interaktif, filter kategori, keranjang belanja, dan integrasi GrabFood/WhatsApp.",
      techStack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
      github: null,
      live: "https://dapurku-websiite.vercel.app",
      image: "/project-dapurku.png",
    },
  ];

  const filtered = projects.filter((p) => {
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  });

  const categoryLabelColor = {
    "Website Project": "#3B82F6",
    "Data Analysis": "#818CF8",
    "Freelance": "#A78BFA",
  };

  return (
    <section id="projects" style={{ padding: "5rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div ref={stagger}>
          <div className="fade-up" style={{ marginBottom: "2.5rem" }}>
            <span className="section-label">My Work</span>
            <h2 className="section-title">Projects</h2>
          </div>

          {/* Category Filter */}
          <div className="fade-up fade-delay-1" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.45rem 1.1rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  border: activeCategory === cat
                    ? "1px solid rgba(59,130,246,0.6)"
                    : "1px solid var(--white-border)",
                  background: activeCategory === cat
                    ? "rgba(59,130,246,0.15)"
                    : "var(--navy-card)",
                  color: activeCategory === cat ? "var(--blue-light)" : "var(--text-muted)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div
            className="fade-up fade-delay-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem"
            }}
          >
            {filtered.map((p) => (
              <div key={p.id} className="project-card-new">
                {/* Cover Image */}
                <div className="card-cover" style={{ background: p.isData ? "linear-gradient(135deg, #0b1021, #161f38)" : undefined }}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                      background: "linear-gradient(135deg, #0b1021, #161f38)"
                    }}>
                      <span style={{ fontSize: "2.5rem" }}>📊</span>
                      <div style={{ textAlign: "center", padding: "0 1rem" }}>
                        <p style={{ color: "#60A5FA", fontSize: "0.72rem", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                          Python & Pandas EDA
                        </p>
                        <p style={{ color: "#94A3B8", fontSize: "0.65rem", marginTop: "0.25rem" }}>
                          5.956+ data records · IEEE Report
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Body — White Background */}
                <div className="card-body">
                  <p className="project-category-label" style={{ color: categoryLabelColor[p.category] || "#3B82F6" }}>
                    {p.category}
                  </p>
                  <h3 className="project-card-title">{p.title}</h3>
                  <p style={{ fontSize: "0.78rem", color: "#475569", marginTop: "0.5rem", lineHeight: 1.6 }}>
                    {p.desc}
                  </p>

                  {/* Tech Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.75rem" }}>
                    {p.techStack.map((t, i) => (
                      <span key={i} className="tech-tag">{t}</span>
                    ))}
                  </div>

                  {/* Links */}
                  {(p.github || p.live) && (
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem" }}>
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer"
                          style={{
                            fontSize: "0.75rem", fontWeight: 600, color: "#3B82F6",
                            textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem"
                          }}>
                          GitHub ↗
                        </a>
                      )}
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer"
                          style={{
                            fontSize: "0.75rem", fontWeight: 600, color: "#3B82F6",
                            textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem"
                          }}>
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ==================================================================
   EXPERIENCES SECTION — Vertical Timeline
   ================================================================== */
function ExperiencesSection() {
  const stagger = useStaggerFade();

  const experiences = [
    {
      period: "Agu 2026 — Sekarang",
      role: "Programmer / Web Developer",
      company: "PT Media Jurnal Sukabumi",
      type: "Magang",
      typeColor: "badge-blue",
      bullets: [
        "Mengembangkan web aplikasi Halo Jurnal dan portal berita Jurnal Vibes menggunakan Next.js & Supabase.",
        "Merancang arsitektur frontend full-stack yang responsif, cepat, dan scalable.",
        "Mengintegrasikan fitur pengaduan publik interaktif dengan sistem real-time Supabase.",
      ],
    },
    {
      period: "Feb 2026 — Jun 2026",
      role: "Data Administration Intern",
      company: "PT Bank Rakyat Indonesia (BRI) Unit Cipanas",
      type: "Magang",
      typeColor: "badge-purple",
      bullets: [
        "Melakukan administrasi data jaminan nasabah, digitalisasi dokumen AR/FR, dan manajemen arsip via sistem BRIMEN.",
        "Mengeksekusi Exploratory Data Analysis (EDA) terhadap 5.956+ data kunjungan nasabah menggunakan Python & Pandas.",
        "Menyusun laporan analisis data kunjungan nasabah berformat standar ilmiah IEEE.",
      ],
    },
  ];

  return (
    <section id="experiences" style={{ padding: "5rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>

        <div ref={stagger}>
          <div className="fade-up" style={{ marginBottom: "3rem" }}>
            <span className="section-label">Career Journey</span>
            <h2 className="section-title">Experiences</h2>
          </div>

          {/* Timeline Container */}
          <div style={{ position: "relative", paddingLeft: "48px" }}>
            {/* Vertical Line */}
            <div className="timeline-line" />

            {/* Timeline Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {experiences.map((exp, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{ position: "relative", transitionDelay: `${0.15 * i}s` }}
                >
                  {/* Dot */}
                  <div className="timeline-dot" style={{ top: "1.4rem" }} />

                  {/* Card */}
                  <div className="experience-card">
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-white)" }}>
                          {exp.role}
                        </h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--blue-light)", fontWeight: 600, marginTop: "0.15rem" }}>
                          {exp.company}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                        <span className={exp.typeColor}>{exp.type}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: 500 }}>{exp.period}</span>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "var(--white-border)", marginBottom: "0.85rem" }} />

                    <ul style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7, position: "relative" }}>
                          <span style={{ position: "absolute", left: "-1rem", color: "var(--blue-accent)", fontWeight: 700 }}>•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
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
   SKILLS SECTION
   ================================================================== */
function SkillsSection() {
  const stagger = useStaggerFade();
  const [activeTab, setActiveTab] = useState("Framework");

  const tabs = ["Framework", "Language", "Tools"];

  const frameworkSkills = [
    { name: "Next.js", desc: "Full-stack Framework", icon: "▲" },
    { name: "React JS", desc: "Frontend Library", icon: "⚛" },
    { name: "Tailwind CSS", desc: "CSS Framework", icon: "💨" },
    { name: "Supabase", desc: "Backend as a Service", icon: <SiSupabase className="text-[#3ECF8E]" /> },
    { name: "Node.js", desc: "JavaScript Runtime", icon: <SiNodedotjs className="text-[#339933]" /> },
    { name: "Laravel", desc: "PHP Framework", icon: <SiLaravel className="text-[#FF2D20]" /> },
  ];

  const languageSkills = [
    { name: "JavaScript", desc: "Programming Language", icon: "JS" },
    { name: "TypeScript", desc: "Typed JavaScript", icon: "TS" },
    { name: "Python", desc: "Data & Scripting", icon: "🐍" },
    { name: "PHP", desc: "Backend Language", icon: <SiPhp className="text-[#777BB4]" /> },
    { name: "SQL", desc: "Database Query Language", icon: "🗄" },
    { name: "HTML5 & CSS3", desc: "Frontend Core", icon: <SiHtml5 className="text-[#E34F26]" /> },
  ];

  const toolsSkills = [
    { name: "Git & GitHub", desc: "Version Control", icon: <SiGit className="text-[#F05032]" /> },
    { name: "PostgreSQL", desc: "Relational Database", icon: <SiPostgresql className="text-[#4169E1]" /> },
    { name: "Pandas", desc: "Data Analysis Library", icon: <SiPandas className="text-[#38BDF8]" /> },
    { name: "Google Colab", desc: "Data Science Workspace", icon: <SiGooglecolab className="text-[#F9AB00]" /> },
    { name: "MongoDB", desc: "NoSQL Database", icon: <SiMongodb className="text-[#47A248]" /> },
    { name: "Postman", desc: "API Testing", icon: <SiPostman className="text-[#FF6C37]" /> },
    { name: "Vercel", desc: "Cloud Deployment", icon: "▲" },
    { name: "Figma", desc: "UI/UX Design", icon: "🎨" },
  ];

  const allSkills = { Framework: frameworkSkills, Language: languageSkills, Tools: toolsSkills };

  return (
    <section id="skills" style={{ padding: "5rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={stagger}>
          <div className="fade-up" style={{ marginBottom: "2.5rem" }}>
            <span className="section-label">What I Know</span>
            <h2 className="section-title">Skills & Technologies</h2>
          </div>

          {/* Tabs */}
          <div className="fade-up fade-delay-1" style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.45rem 1.2rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  border: activeTab === tab ? "1px solid rgba(59,130,246,0.5)" : "1px solid var(--white-border)",
                  background: activeTab === tab ? "rgba(59,130,246,0.12)" : "var(--navy-card)",
                  color: activeTab === tab ? "var(--blue-light)" : "var(--text-muted)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Skill Grid */}
          <div
            className="fade-up fade-delay-2 tab-fade-enter"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.75rem"
            }}
          >
            {allSkills[activeTab].map((s, i) => (
              <div key={i} className="skill-item">
                <span style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", width: "28px", flexShrink: 0 }}>
                  {s.icon}
                </span>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-white)" }}>{s.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   CERTIFICATES SECTION — Horizontal Slider
   ================================================================== */
function CertificatesSection() {
  const stagger = useStaggerFade();
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const certs = [
    { src: "/certificates/sertif-icitacs.jpg", title: "ICITACS 2025 — International Conference on IT", issuer: "Nusa Putra University | Japan", year: "2025" },
    { src: "/certificates/sertif-icemac.jpg", title: "ICEMAC 2025 — International Conference on Economic", issuer: "Nusa Putra University | Japan", year: "2025" },
    { src: "/certificates/sertif-mikrotik.jpg", title: "MikroTik MTCNA — Certified Network Associate", issuer: "MikroTik", year: "2026" },
    { src: "/certificates/sertif-databases.jpg", title: "IT Specialist — Databases", issuer: "Certiport × CertNexus × Pearson", year: "2026" },
    { src: "/certificates/sertif-myskill.jpg", title: "Pivot Table in Microsoft Excel", issuer: "MySkill Short Class", year: "2025" },
    { src: "/certificates/sertif-workshop-ti.jpg", title: "Workshop TI — Keamanan Jaringan & Proteksi Cyber", issuer: "Universitas Nusa Putra", year: "2024" },
    { src: "/certificates/sertif-workshop-si.jpg", title: "Workshop SI — From Data to Decisions: AI", issuer: "Universitas Nusa Putra", year: "2025" },
    { src: "/certificates/sertif-public-speaking.jpg", title: "Public Speaking — Novice Level (EPDC × MURI)", issuer: "The Energetic EPDC", year: "2026" },
    { src: "/certificates/sertif-seminas-sismatik-SI.jpg", title: "Seminar Nasional SISMATIK 2026", issuer: "Universitas Nusa Putra", year: "2026" },
  ];

  const VISIBLE = 3;
  const maxIndex = Math.max(0, certs.length - VISIBLE);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  const openModal = (src, title) => {
    setModalImage(src);
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <section id="certificates" style={{ padding: "5rem 0" }}>
      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: "1px solid var(--white-border)" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                📜 Certificate Preview
              </p>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--white-border)", color: "var(--text-muted)", width: "32px", height: "32px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <img src={modalImage} alt={modalTitle} style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px" }} />
              <p style={{ fontSize: "0.85rem", color: "var(--text-white)", fontWeight: 600, textAlign: "center" }}>{modalTitle}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={stagger}>

          {/* Header */}
          <div className="fade-up" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-label" style={{ display: "block", textAlign: "center" }}>Credentials</span>
            <h2 className="section-title" style={{ textAlign: "center" }}>Certificates</h2>
          </div>

          {/* Slider Controls */}
          <div className="fade-up fade-delay-1">
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <button className="cert-nav-btn" onClick={prev} disabled={current === 0} aria-label="Previous">
                <FaChevronLeft />
              </button>
              <button className="cert-nav-btn" onClick={next} disabled={current >= maxIndex} aria-label="Next">
                <FaChevronRight />
              </button>
            </div>

            {/* Slider Track Wrapper */}
            <div className="cert-slider-wrapper">
              <div
                className="cert-slider-track"
                style={{ transform: `translateX(calc(-${current} * (100% / ${VISIBLE} + 1.25rem / ${VISIBLE} * (${VISIBLE} - 1) / ${VISIBLE - 1})))` }}
              >
                {certs.map((cert, i) => (
                  <div
                    key={i}
                    className="cert-card"
                    onClick={() => openModal(cert.src, cert.title)}
                    style={{ flex: `0 0 calc(${100 / VISIBLE}% - ${(1.25 * (VISIBLE - 1)) / VISIBLE}rem)` }}
                  >
                    <img src={cert.src} alt={cert.title} />
                    <div className="cert-info">
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-white)", lineHeight: 1.4, marginBottom: "0.3rem" }}>
                        {cert.title}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{cert.issuer}</p>
                      <span className="badge-blue" style={{ marginTop: "0.5rem", display: "inline-block" }}>{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "1.5rem" }}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: current === i ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: current === i ? "var(--blue-accent)" : "rgba(255,255,255,0.2)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   CONTACT SECTION — 2-Column Layout
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
        setToast({ show: true, message: result.message || "Pesan berhasil dikirim! Terima kasih.", type: "success" });
      } else {
        setToast({ show: true, message: "Pesan berhasil dikirim! Terima kasih telah menghubungi Donie.", type: "success" });
      }
      setFormData({ nama: "", email: "", pesan: "" });
    } catch {
      setToast({ show: true, message: "Pesan berhasil dikirim! Terima kasih telah menghubungi Donie.", type: "success" });
      setFormData({ nama: "", email: "", pesan: "" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4500);
    }
  };

  const contactBoxes = [
    { icon: <FaPhone style={{ color: "var(--blue-accent)" }} />, label: "Phone", value: "+62 819 9652 2114" },
    { icon: <FaEnvelope style={{ color: "var(--blue-accent)" }} />, label: "Email", value: "dmakapeli@gmail.com" },
    { icon: <FaGithub style={{ color: "var(--blue-accent)" }} />, label: "GitHub", value: "dmakapeli-prog", href: "https://github.com/dmakapeli-prog" },
    { icon: <FaLinkedin style={{ color: "var(--blue-accent)" }} />, label: "LinkedIn", value: "Donie Makapeli", href: "#" },
  ];

  return (
    <section id="contact" style={{ padding: "5rem 0" }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999,
          background: "var(--navy-mid)", border: "1px solid rgba(59,130,246,0.4)",
          borderRadius: "10px", padding: "1rem 1.5rem", maxWidth: "340px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "modalFadeIn 0.25s ease"
        }}>
          <p style={{ color: "var(--text-white)", fontSize: "0.875rem", fontWeight: 600 }}>✅ {toast.message}</p>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={stagger}>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: "3rem" }}>
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Contact</h2>
          </div>

          {/* 2-Column Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}
            className="grid-cols-1 md:grid-cols-2"
          >

            {/* LEFT — Info */}
            <div className="fade-up fade-delay-1">
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-white)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                Hire Me to Unlock<br />My Full Potential!
              </h3>

              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                Terbuka untuk peluang kerja <strong style={{ color: "var(--text-white)" }}>full-time</strong>,{" "}
                <strong style={{ color: "var(--text-white)" }}>magang</strong>, maupun{" "}
                <strong style={{ color: "var(--text-white)" }}>kolaborasi proyek freelance</strong> di bidang
                Web Development dan Data Analysis. Mari wujudkan ide Anda menjadi solusi digital yang nyata.
              </p>

              {/* Contact Boxes */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {contactBoxes.map((box, i) => (
                  box.href ? (
                    <a
                      key={i}
                      href={box.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-info-box"
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{box.icon}</span>
                      <div>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{box.label}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-white)", fontWeight: 600, marginTop: "0.1rem" }}>{box.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div key={i} className="contact-info-box">
                      <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{box.icon}</span>
                      <div>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{box.label}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-white)", fontWeight: 600, marginTop: "0.1rem" }}>{box.value}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="fade-up fade-delay-2">
              <div className="contact-form-wrapper">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-white)", marginBottom: "1.5rem" }}>
                  Kirim Pesan
                </h3>
                <form action="https://formspree.io/f/xaeyjewp" method="POST" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div>
                    <label htmlFor="contact-nama" className="form-label">Nama</label>
                    <input
                      id="contact-nama"
                      type="text"
                      name="name"
                      required
                      placeholder="Nama lengkap Anda"
                      className="form-input"
                      value={formData.nama}
                      onChange={(e) => setFormData((p) => ({ ...p, nama: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="form-label">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      placeholder="email@contoh.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-pesan" className="form-label">Pesan</label>
                    <textarea
                      id="contact-pesan"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tulis pesan Anda di sini..."
                      className="form-input"
                      style={{ resize: "none" }}
                      value={formData.pesan}
                      onChange={(e) => setFormData((p) => ({ ...p, pesan: e.target.value }))}
                    />
                  </div>
                  <div>
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? "Mengirim..." : "Kirim Pesan ✉"}
                    </button>
                  </div>
                </form>
              </div>
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
    <footer style={{
      borderTop: "1px solid var(--white-border)",
      padding: "2.5rem 2rem",
      background: "rgba(5,10,24,0.6)"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <a href="#hero" style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-white)", textDecoration: "none" }}>
          Donie Makapeli<span className="footer-dot">.</span>
        </a>
        <p style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
          © 2026 Donie Makapeli. All rights reserved.
        </p>
        <a href="#hero" style={{ fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--blue-accent)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
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
      <InitialLoader />
      <Navbar />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <ExperiencesSection />
        <div className="section-divider" />
        <SkillsSection />
        <div className="section-divider" />
        <CertificatesSection />
        <div className="section-divider" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

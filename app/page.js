"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaGithub, FaLinkedin, FaWhatsapp, FaInstagram,
  FaPhone, FaEnvelope, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import InitialLoader from "./components/InitialLoader";

/* ==============================================================
   INTERSECTION OBSERVER HOOK
   ============================================================== */
function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(".fade-up");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.07 }
    );
    items.forEach((c) => io.observe(c));
    return () => items.forEach((c) => io.unobserve(c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ==============================================================
   NAVBAR
   ============================================================== */
function Navbar() {
  const [active, setActive] = useState("about");

  const links = [
    { id: "about",        label: "About" },
    { id: "projects",     label: "Projects" },
    { id: "experiences",  label: "Experiences" },
    { id: "certificates", label: "Certificates" },
    { id: "contact",      label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY + 120;
      for (let i = links.length - 1; i >= 0; i--) {
        const el = document.getElementById(links[i].id);
        if (el && scroll >= el.offsetTop) { setActive(links[i].id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner max-w-7xl mx-auto w-full px-6 lg:px-12">
        <a href="#about" className="nav-logo-pill">Portofolio.</a>
        <div className="nav-links">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setActive(l.id)}
              className={`nav-link ${active === l.id ? "active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ==============================================================
   HERO SECTION — Responsive: Mobile Stacked to PC Absolute
   ============================================================== */
function HeroSection() {
  const ref = useReveal();

  return (
    <section id="hero" className="hero-section">
      <div
        ref={ref}
        className="relative w-full min-h-[100vh] lg:min-h-[115vh] max-w-7xl mx-auto px-6 lg:px-12"
      >

        {/* KIRI — Greeting + CV Button */}
        <div className="absolute left-6 lg:left-12 top-[35%] lg:top-[40%] -translate-y-1/2 flex flex-col items-start z-10 max-w-lg hero-left">
          <div className="fade-up flex flex-col items-start">
            <h1 className="hero-greeting text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-tight lg:leading-none tracking-tight">
              Hallo,<br />I&apos;m Donie
            </h1>
            <div className="hero-greeting-underline w-20 lg:w-28 h-1 lg:h-1.5" />
          </div>
          <div className="fade-up fd1">
            <a href="/cv-donie-makapeli.pdf" download className="btn-cv">
              ⬇&nbsp; Download CV
            </a>
          </div>
        </div>

        {/* KANAN — Role & Description */}
        <div className="absolute right-6 lg:right-12 xl:right-16 bottom-[25%] lg:bottom-[30%] flex flex-col items-start z-10 max-w-sm hero-right fade-up fd3">
          <h2 className="hero-role text-2xl lg:text-3xl">
            Full-Stack Developer<br className="hidden lg:block" />&amp; Data Analyst
          </h2>
          <p className="hero-desc">
            Saya mengembangkan website modern dan solusi analisis data
            yang presisi, berfokus pada kinerja sistem dan kejelasan informasi.
          </p>
        </div>

        {/* TENGAH — Portrait Photo */}
        <img
          src="/donie-profile.png"
          alt="Donie Makapeli — Full-Stack Developer & Data Analyst"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] md:w-[65%] lg:w-[55%] max-w-[900px] h-auto object-contain object-bottom grayscale drop-shadow-2xl z-0 pointer-events-none [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
        />

      </div>
    </section>
  );
}

/* ==============================================================
   ABOUT ME SECTION — 2 Kolom Strict
   ============================================================== */
function AboutSection() {
  const ref = useReveal();

  const socials = [
    { icon: <FaGithub />,    href: "https://github.com/dmakapeli-prog",      label: "GitHub" },
    { icon: <FaWhatsapp />,  href: "https://wa.me/6281996522114",             label: "WhatsApp" },
    { icon: <FaInstagram />, href: "#",                                        label: "Instagram" },
    { icon: <FaLinkedin />,  href: "#",                                        label: "LinkedIn" },
  ];

  return (
    <section id="about" className="about-section">
      <div className="section-wrap">
        <div ref={ref} className="about-grid">

          {/* KIRI — Teks */}
          <div>
            <p className="fade-up about-subtitle">About Me</p>
            <h2 className="fade-up fd1 about-name">Donie Makapeli</h2>
            <div className="fade-up fd1 about-underline" />
            <p className="fade-up fd2 about-desc">
              Saya adalah Mahasiswa Teknik Informatika di Universitas Nusa Putra
              dengan minat besar dalam pengembangan web modern dan analisis data.
              Memiliki pengalaman dalam pengembangan aplikasi berbasis web melalui
              proyek akademik maupun pengalaman magang. Terbiasa menggunakan{" "}
              <strong style={{ color: "#60A5FA" }}>Next.js</strong>,{" "}
              <strong style={{ color: "#60A5FA" }}>React</strong>,{" "}
              <strong style={{ color: "#60A5FA" }}>Supabase</strong>,{" "}
              <strong style={{ color: "#60A5FA" }}>Python</strong>, dan{" "}
              <strong style={{ color: "#60A5FA" }}>SQL</strong>.
            </p>
            <div className="fade-up fd3 social-row">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social-icon"
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* KANAN — Foto */}
          <div className="fade-up fd2">
            <img
              src="/donie-profile.png"
              alt="Donie Makapeli"
              className="w-full h-auto object-cover rounded-xl grayscale border border-gray-700"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ==============================================================
   PROJECTS SECTION — Grid Cards (image top, navy bottom)
   ============================================================== */
function ProjectsSection() {
  const ref = useReveal();
  const [active, setActive] = useState("All");

  const cats = ["All", "Website Project", "Data Analysis", "Freelance"];

  const projects = [
    {
      id: "jurnal-vibes",
      cat: "Website Project",
      title: "Jurnal Vibes",
      image: "/jurnal-vibes.png",
      live: "https://jurnal-vibes-app.vercel.app/",
    },
    {
      id: "halo-jurnal",
      cat: "Website Project",
      title: "Halo Jurnal",
      image: "https://image.thum.io/get/width/800/crop/450/https://halo-jurnal-app.vercel.app/",
      live: "https://halo-jurnal-app.vercel.app/",
    },
    {
      id: "bri-data",
      cat: "Data Analysis",
      title: "Analisis Data Kunjungan Nasabah BRI",
      image: null,
      live: null,
    },
    {
      id: "thriftin",
      cat: "Website Project",
      title: "ThriftIn — Fashion Marketplace",
      image: "/project-thriftin.png",
      live: "https://thriftin-alpha.vercel.app",
    },
    {
      id: "dicode",
      cat: "Website Project",
      title: "DiCode — Website Agency Digital",
      image: "/project-dicode.png",
      live: "https://dicode-website.vercel.app",
    },
    {
      id: "ovara",
      cat: "Website Project",
      title: "Ovara — Toko Telur Segar Online",
      image: "/project-ovara.png",
      live: "https://ovara-nine.vercel.app",
    },
    {
      id: "esports",
      cat: "Freelance",
      title: "Esports Bracket Generator",
      image: "/bracket.png",
      live: "https://esports-bracket-generator.vercel.app/",
    },
    {
      id: "echo-store",
      cat: "Freelance",
      title: "Echo Store — Gaming Digital",
      image: "/echo-store.png",
      live: "https://echo-store-eight.vercel.app/",
    },
    {
      id: "dapurku",
      cat: "Website Project",
      title: "DapurKu — Website Kuliner",
      image: "/project-dapurku.png",
      live: "https://dapurku-websiite.vercel.app",
    },
  ];

  const filtered = active === "All" ? projects : projects.filter((p) => p.cat === active);

  return (
    <section id="projects" className="projects-section">
      <div className="section-wrap">
        <div ref={ref}>
          <h2 className="fade-up section-title-center">Projects</h2>

          {/* Filter Tabs */}
          <div
            className="fade-up fd1"
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem" }}
          >
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: active === c ? "1px solid rgba(59,130,246,0.6)" : "1px solid rgba(255,255,255,0.1)",
                  background: active === c ? "rgba(37,99,235,0.15)" : "transparent",
                  color: active === c ? "#60A5FA" : "#94A3B8",
                  transition: "all 0.2s",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="fade-up fd2 projects-grid">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="project-card"
                onClick={() => p.live && window.open(p.live, "_blank")}
                style={{ cursor: p.live ? "pointer" : "default" }}
              >
                {/* Cover */}
                <div className="project-cover">
                  {p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: "0.5rem",
                      background: "linear-gradient(135deg, #0b1122, #101e3a)"
                    }}>
                      <span style={{ fontSize: "2.5rem" }}>📊</span>
                      <span style={{ fontSize: "0.72rem", color: "#60A5FA", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                        Python & Pandas EDA
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#64748B" }}>5.956+ data records</span>
                    </div>
                  )}
                </div>
                {/* Body */}
                <div className="project-body">
                  <p className="project-cat-label">{p.cat}</p>
                  <h3 className="project-title">{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==============================================================
   EXPERIENCES SECTION — Vertical Timeline
   ============================================================== */
function ExperiencesSection() {
  const ref = useReveal();

  const exps = [
    {
      date: "Agustus 2026 — Sekarang",
      role: "Programmer / Web Developer",
      company: "PT Media Jurnal Sukabumi · Sukabumi (WFH)",
      bullets: [
        "Mengembangkan web aplikasi Halo Jurnal dan portal berita Jurnal Vibes menggunakan Next.js & Supabase.",
        "Merancang dan mengimplementasikan arsitektur frontend full-stack yang responsif dan scalable.",
        "Mengintegrasikan sistem pengaduan publik interaktif dengan backend real-time Supabase.",
        "Melakukan code review dan optimasi performa halaman untuk meningkatkan user experience.",
      ],
    },
    {
      date: "Februari 2026 — Juni 2026",
      role: "Data Administration Intern",
      company: "PT Bank Rakyat Indonesia (BRI) Unit Cipanas · Cipanas",
      bullets: [
        "Melakukan administrasi data jaminan nasabah, digitalisasi dokumen AR/FR, dan manajemen arsip via sistem BRIMEN.",
        "Mengeksekusi Exploratory Data Analysis (EDA) terhadap 5.956+ data kunjungan nasabah menggunakan Python & Pandas.",
        "Menyusun laporan analisis data kunjungan nasabah berformat standar ilmiah IEEE.",
        "Mengelola dan memverifikasi keakuratan data transaksi harian serta arsip fisik dokumen.",
      ],
    },
  ];

  return (
    <section id="experiences" className="experiences-section">
      <div className="section-wrap">
        <div ref={ref}>
          <h2 className="fade-up section-title-center">Experiences</h2>

          <div className="timeline-container">
            <div className="timeline-line" />

            {exps.map((exp, i) => (
              <div key={i} className={`timeline-item fade-up fd${i + 1}`}>
                <div className="timeline-dot" />
                <div className="exp-card">
                  <p className="exp-date">{exp.date}</p>
                  <h3 className="exp-role">{exp.role}</h3>
                  <p className="exp-company">{exp.company}</p>
                  <div className="exp-divider" />
                  <ul className="exp-bullets">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==============================================================
   CERTIFICATES SECTION — Horizontal Carousel
   ============================================================== */
function CertificatesSection() {
  const ref = useReveal();
  const [idx, setIdx] = useState(0);
  const [modal, setModal] = useState(null);

  const certs = [
    { src: "/certificates/sertif-icitacs.jpg",           name: "ICITACS 2025 — International Conference on IT",           issuer: "Nusa Putra University | Japan",       year: "2025" },
    { src: "/certificates/sertif-icemac.jpg",            name: "ICEMAC 2025 — International Conference on Economic",      issuer: "Nusa Putra University | Japan",       year: "2025" },
    { src: "/certificates/sertif-mikrotik.jpg",          name: "MikroTik MTCNA — Certified Network Associate",            issuer: "MikroTik",                            year: "2026" },
    { src: "/certificates/sertif-databases.jpg",         name: "IT Specialist — Databases",                               issuer: "Certiport × CertNexus × Pearson",     year: "2026" },
    { src: "/certificates/sertif-myskill.jpg",           name: "Pivot Table in Microsoft Excel",                          issuer: "MySkill Short Class",                 year: "2025" },
    { src: "/certificates/sertif-workshop-ti.jpg",       name: "Workshop TI — Keamanan Jaringan & Proteksi Cyber",        issuer: "Universitas Nusa Putra",              year: "2024" },
    { src: "/certificates/sertif-workshop-si.jpg",       name: "Workshop SI — From Data to Decisions: AI",                issuer: "Universitas Nusa Putra",              year: "2025" },
    { src: "/certificates/sertif-public-speaking.jpg",   name: "Public Speaking — Novice Level (EPDC × MURI)",           issuer: "The Energetic EPDC",                  year: "2026" },
    { src: "/certificates/sertif-seminas-sismatik-SI.jpg", name: "Seminar Nasional SISMATIK 2026",                        issuer: "Universitas Nusa Putra",              year: "2026" },
  ];

  const VISIBLE = 2;
  const maxIdx = certs.length - VISIBLE;

  return (
    <section id="certificates" className="certificates-section">
      {/* Modal */}
      {modal !== null && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f1729", border: "1px solid rgba(37,99,235,0.3)",
              borderRadius: "14px", overflow: "hidden",
              maxWidth: "820px", width: "100%",
              animation: "toastIn 0.22s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em" }}>Certificate Preview</span>
              <button onClick={() => setModal(null)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", width: "30px", height: "30px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <img src={certs[modal].src} alt={certs[modal].name} style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px" }} />
              <p style={{ textAlign: "center", color: "#F8FAFC", fontWeight: 700, marginTop: "0.75rem", fontSize: "0.88rem" }}>{certs[modal].name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="section-wrap">
        <div ref={ref}>
          <h2 className="fade-up section-title-center">Certificates</h2>

          <div className="fade-up fd1">
            <div className="cert-carousel">
              {/* Prev Arrow */}
              <button
                className="cert-arrow"
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                aria-label="Previous"
              >
                <FaChevronLeft />
              </button>

              {/* Track */}
              <div className="cert-track-wrap">
                <div
                  className="cert-track"
                  style={{ transform: `translateX(calc(-${idx} * (50% + 0.75rem)))` }}
                >
                  {certs.map((c, i) => (
                    <div key={i} className="cert-card" onClick={() => setModal(i)}>
                      <img src={c.src} alt={c.name} />
                      <div className="cert-card-body">
                        <p className="cert-name">{c.name}</p>
                        <p className="cert-issuer">{c.issuer}</p>
                        <span className="cert-year">{c.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Arrow */}
              <button
                className="cert-arrow"
                onClick={() => setIdx((i) => Math.min(maxIdx, i + 1))}
                disabled={idx >= maxIdx}
                aria-label="Next"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Dots */}
            <div className="cert-dots">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`cert-dot ${idx === i ? "active" : ""}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==============================================================
   CONTACT SECTION — 2 Kolom Strict
   ============================================================== */
function ContactSection() {
  const ref = useReveal();
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* silent fail */ }
    finally {
      setSending(false);
      setForm({ nama: "", email: "", pesan: "" });
      showToast();
    }
  };

  const contactCards = [
    { icon: <FaPhone />,    label: "PHONE",    value: "+62 819 9652 2114",  href: "tel:+6281996522114" },
    { icon: <FaEnvelope />, label: "EMAIL",    value: "dmakapeli@gmail.com", href: "mailto:dmakapeli@gmail.com" },
    { icon: <FaGithub />,   label: "GITHUB",   value: "dmakapeli-prog",      href: "https://github.com/dmakapeli-prog" },
    { icon: <FaLinkedin />, label: "LINKEDIN", value: "Donie Makapeli",      href: "#" },
  ];

  return (
    <section id="contact" className="contact-section">
      {toast && (
        <div className="toast">
          <p style={{ color: "#F8FAFC", fontWeight: 600, fontSize: "0.875rem" }}>
            ✅ Pesan berhasil dikirim! Terima kasih telah menghubungi Donie.
          </p>
        </div>
      )}

      <div className="section-wrap">
        <div ref={ref}>
          <h2 className="fade-up section-title-center">Contact</h2>

          <div className="contact-grid">

            {/* KIRI — Info */}
            <div className="fade-up fd1">
              <h3 className="contact-title">
                Hire Me to Unlock<br />My Full Potential!
              </h3>
              <p className="contact-desc">
                Terbuka untuk peluang kerja <strong style={{ color: "#F8FAFC" }}>full-time</strong>,{" "}
                <strong style={{ color: "#F8FAFC" }}>magang</strong>, maupun{" "}
                <strong style={{ color: "#F8FAFC" }}>kolaborasi proyek freelance</strong> di bidang
                Web Development dan Data Analysis. Mari wujudkan ide Anda menjadi solusi digital yang nyata.
              </p>

              {/* 4 Floating Contact Cards */}
              <div className="contact-cards-grid">
                {contactCards.map((c, i) => (
                  <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="contact-card">
                    <div className="contact-card-icon">{c.icon}</div>
                    <div>
                      <p className="contact-card-label">{c.label}</p>
                      <p className="contact-card-value">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* KANAN — Form */}
            <div className="fade-up fd2">
              <div className="contact-form-box">
                <form action="https://formspree.io/f/xaeyjewp" method="POST">
                  <div className="form-group">
                    <label htmlFor="f-nama" className="form-label">Nama</label>
                    <input
                      id="f-nama"
                      type="text"
                      name="name"
                      required
                      placeholder="Nama lengkap kamu"
                      className="form-input"
                      value={form.nama}
                      onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="f-email" className="form-label">Email</label>
                    <input
                      id="f-email"
                      type="email"
                      name="email"
                      required
                      placeholder="email@gmail.com"
                      className="form-input"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="f-pesan" className="form-label">Pesan</label>
                    <textarea
                      id="f-pesan"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tulis pesan kamu disini..."
                      className="form-input"
                      style={{ resize: "none" }}
                      value={form.pesan}
                      onChange={(e) => setForm((p) => ({ ...p, pesan: e.target.value }))}
                    />
                  </div>
                  <button type="submit" className="btn-submit" disabled={sending}>
                    {sending ? "Mengirim..." : "Kirim Pesan"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ==============================================================
   FOOTER
   ============================================================== */
function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-text">© 2026 Donie Makapeli. All rights reserved.</p>
    </footer>
  );
}

/* ==============================================================
   MAIN PAGE
   ============================================================== */
export default function Home() {
  return (
    <>
      <InitialLoader />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperiencesSection />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

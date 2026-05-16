import { useState } from "react";
import { storageUrl } from "../../utils/portfolioDataMapper";

const MinimalProfessionalTemplate = ({ data }) => {
  const [filePreview, setFilePreview] = useState(null);

  return (
    <section className="mx-auto mb-20 w-full max-w-[1240px] px-4 text-white">
      <div className="overflow-hidden rounded-[42px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_28%),linear-gradient(135deg,#10131a,#050609)] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.55)] md:p-8">
        <div className="overflow-hidden rounded-[34px] border-[8px] border-black bg-white text-[#111827] shadow-2xl">
          <Header data={data} />
          <Hero data={data} />
          <About data={data} />
          <SkillsAndTools data={data} />
          <Projects data={data} />
          <Journey data={data} onOpenFile={setFilePreview} />
          <Contact data={data} />

          {filePreview && (
            <FilePreviewModal
              file={filePreview}
              onClose={() => setFilePreview(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const Header = ({ data }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-5 px-6 py-5 md:px-10">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#111827] text-lg font-black text-white">
            {initial(data.name)}
          </span>

          <div>
            <strong className="block text-lg font-black leading-none">
              {data.name || "Portfolio"}
            </strong>

            <span className="mt-1 block text-xs font-semibold text-black/45">
              {data.profession || "Professional"}
            </span>
          </div>
        </a>

        <nav className="hidden flex-wrap items-center gap-5 text-sm font-bold text-black/55 lg:flex">
          <a href="#about" className="hover:text-black">
            Tentang
          </a>
          <a href="#skills" className="hover:text-black">
            Keahlian
          </a>
          <a href="#projects" className="hover:text-black">
            Karya
          </a>
          <a href="#journey" className="hover:text-black">
            Rekam Jejak
          </a>
          <a href="#contact" className="hover:text-black">
            Kontak
          </a>
        </nav>
      </div>
    </header>
  );
};

const Hero = ({ data }) => {
  return (
    <section
      id="home"
      className="grid min-h-[620px] scroll-mt-28 items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-[1fr_0.85fr]"
    >
      <div>
        <h1 className="max-w-4xl text-[clamp(52px,8vw,104px)] font-black leading-[0.88] tracking-[-0.085em]">
          Halo, saya {data.name || "Nama Portfolio"}.
        </h1>

        <p className="mt-5 text-[clamp(24px,3vw,38px)] font-black tracking-[-0.04em] text-black/70">
          {data.profession || "Professional"}
        </p>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-black/60">
          {data.about}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-full !bg-[#111827] px-6 font-black !text-white shadow-[0_14px_34px_rgba(17,24,39,0.18)] transition hover:!bg-[#2563eb] hover:!text-white focus:!bg-[#2563eb] focus:!text-white active:!bg-[#1d4ed8] active:!text-white"
          >
            Lihat Karya
          </a>

          <a
            href={emailLink(data.email)}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 !bg-white px-6 font-black !text-[#111827] shadow-sm transition hover:!bg-[#111827] hover:!text-white focus:!bg-[#111827] focus:!text-white active:!bg-[#111827] active:!text-white"
          >
            Hubungi Saya
          </a>
        </div>
      </div>

      <div className="relative grid min-h-[420px] place-items-center">
        <div className="absolute h-[360px] w-[360px] rounded-full border border-dashed border-black/20" />
        <div className="absolute h-[285px] w-[285px] rounded-full border border-dashed border-black/20" />
        <div className="absolute h-[210px] w-[210px] rounded-full border border-dashed border-black/20" />

        <div className="relative z-10 h-64 w-64 overflow-hidden rounded-full bg-black shadow-[0_28px_80px_rgba(0,0,0,0.25)]">
          {data.photo ? (
            <img
              src={data.photo}
              alt={data.name || "Foto Profil"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-7xl font-black text-white">
              {initial(data.name)}
            </div>
          )}
        </div>

        <FloatingBadge className="left-4 top-10 bg-sky-200">
          Professional
        </FloatingBadge>

        <FloatingBadge className="right-4 top-8 bg-purple-200">
          Reliable
        </FloatingBadge>

        <FloatingBadge className="bottom-16 left-10 bg-lime-200">
          Organized
        </FloatingBadge>

        <FloatingBadge className="bottom-12 right-0 bg-amber-200">
          Growth Mindset
        </FloatingBadge>
      </div>
    </section>
  );
};

const About = ({ data }) => {
  return (
    <section
      id="about"
      className="scroll-mt-28 border-t border-black/10 bg-[#f6f1e7] px-6 py-16 md:px-10 lg:px-14"
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-10 max-w-3xl">
          <span className="inline-flex rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#111827] shadow-sm">
            Tentang Saya
          </span>

          <h2 className="mt-6 text-[clamp(40px,5vw,72px)] font-black leading-[0.95] tracking-[-0.06em] text-[#111827]">
            Profil profesional yang ringkas, terarah, dan mudah dipercaya.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#4b5563]">
            Saya membangun profil ini untuk memperkenalkan kemampuan,
            pengalaman, dan nilai kerja secara jelas kepada pihak yang ingin
            mengenal saya lebih jauh.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:p-10">
            <p className="text-[19px] leading-9 text-[#374151]">
              {data.about}
            </p>

            <div className="mt-8 rounded-[26px] bg-[#111827] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
                Prinsip Kerja
              </p>

              <p className="mt-4 text-base leading-8 text-white/75">
                Saya mengutamakan komunikasi yang jelas, proses kerja yang
                tertata, serta hasil yang dapat dipahami dan digunakan dengan
                baik.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <ProfilePoint
              number="01"
              title="Terorganisir"
              text="Menyusun pekerjaan dengan alur yang rapi agar setiap proses lebih mudah diikuti."
            />

            <ProfilePoint
              number="02"
              title="Komunikatif"
              text="Menyampaikan ide, progres, dan kebutuhan dengan jelas dalam proses kerja."
            />

            <ProfilePoint
              number="03"
              title="Bertanggung Jawab"
              text="Berusaha menyelesaikan tugas dengan konsisten, teliti, dan sesuai tujuan."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const ProfilePoint = ({ number, title, text }) => {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#111827] text-sm font-black text-white">
          {number}
        </span>

        <div>
          <h3 className="text-2xl font-black tracking-[-0.04em] text-[#111827]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-7 text-[#6b7280]">{text}</p>
        </div>
      </div>
    </div>
  );
};

const SkillsAndTools = ({ data }) => {
  return (
    <section id="skills" className="scroll-mt-28 px-6 py-16 md:px-10 lg:px-14">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
            Keahlian
          </span>

          <h2 className="mt-6 text-[clamp(42px,5vw,76px)] font-black leading-[0.9] tracking-[-0.075em]">
            Kemampuan dan tools.
          </h2>
        </div>

        <p className="max-w-md leading-7 text-black/55">
          Kemampuan utama yang mendukung cara kerja profesional, mulai dari
          komunikasi, organisasi, sampai penyelesaian tugas.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] bg-[#111827] p-7 text-white">
          <h3 className="text-3xl font-black tracking-[-0.04em]">
            Keahlian Utama
          </h3>

          <div className="mt-7 grid gap-5">
            {(data.skills || []).map((skill, index) => (
              <SkillRow key={index} skill={skill} />
            ))}
          </div>
        </div>

        <div className="rounded-[30px] bg-[#eef0f4] p-7">
          <h3 className="text-3xl font-black tracking-[-0.04em]">Tools</h3>

          <div className="mt-7 flex flex-wrap gap-3">
            {(data.tools || []).map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-black text-black shadow-sm"
              >
                {tool}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] bg-white p-5">
            <p className="text-sm leading-7 text-black/55">
              Tools digunakan untuk membantu proses kerja, pengelolaan dokumen,
              desain sederhana, komunikasi, dan dokumentasi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = ({ data }) => {
  return (
    <section
      id="projects"
      className="scroll-mt-28 border-t border-black/10 bg-[#111827] px-6 py-16 text-white md:px-10 lg:px-14"
    >
      <div className="mb-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/55">
          Karya Pilihan
        </p>

        <div className="mt-4 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <h2 className="max-w-[620px] text-[clamp(34px,4.6vw,58px)] font-black leading-[0.95] tracking-[-0.055em]">
            Karya pilihan yang disusun secara rapi dan profesional.
          </h2>

          <p className="max-w-[520px] text-base leading-8 text-white/70 lg:justify-self-end">
            Beberapa karya berikut menggambarkan kemampuan dalam menyusun
            informasi, membuat tampilan yang tertata, dan menghadirkan presentasi
            visual yang mudah dipahami.
          </p>
        </div>
      </div>

      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(data.projects || []).slice(0, 3).map((project, index) => (
          <article
            key={index}
            className="flex h-full min-h-[640px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div className="h-[230px] shrink-0 overflow-hidden border-b border-white/10 bg-[#f8f6ef]">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title || "Project"}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f3efe5] text-[#111827]">
                  <span className="text-5xl font-black tracking-[-0.06em]">
                    {project.imageLabel || "PR"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/85">
                {project.category || "Project"}
              </span>

              <h3 className="mt-4 min-h-[76px] text-[30px] font-black leading-[1.05] tracking-[-0.04em] text-white">
                {project.title}
              </h3>

              <p className="mt-4 min-h-[168px] leading-8 text-white/75">
                {project.description}
              </p>

              <div className="mt-auto flex min-h-[72px] flex-wrap content-start gap-2 pt-6">
                {(project.tech || []).map((tech, techIndex) => (
                  <span
                    key={`${tech}-${techIndex}`}
                    className="h-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {project.link && project.link !== "#" && (
                <a
                  href={externalLink(project.link)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 w-fit items-center justify-center rounded-2xl !bg-[#fff1e8] px-5 text-sm font-black !text-[#111827] shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition hover:!bg-white hover:!text-[#111827] focus:!bg-white focus:!text-[#111827] active:!bg-[#f3efe5] active:!text-[#111827]"
                >
                  Lihat Detail
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const Journey = ({ data, onOpenFile }) => {
  return (
    <section
      id="journey"
      className="scroll-mt-28 bg-[#eef0f4] px-6 py-16 md:px-10 lg:px-14"
    >
      <div className="mb-10">
        <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black/55">
          Perjalanan
        </span>

        <h2 className="mt-6 max-w-4xl text-[clamp(42px,5vw,76px)] font-black leading-[0.9] tracking-[-0.075em]">
          Pendidikan, pengalaman, sertifikat, dan pencapaian.
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TimelinePanel
          title="Pendidikan"
          items={data.educations || []}
          onOpenFile={onOpenFile}
        />

        <TimelinePanel
          title="Pengalaman"
          items={data.experiences || []}
          onOpenFile={onOpenFile}
        />

        <TimelinePanel
          title="Sertifikat"
          items={data.certificates || []}
          onOpenFile={onOpenFile}
        />

        <TimelinePanel
          title="Pencapaian"
          items={data.achievements || []}
          onOpenFile={onOpenFile}
        />
      </div>
    </section>
  );
};

const Contact = ({ data }) => {
  return (
    <section id="contact" className="scroll-mt-28 px-6 py-16 md:px-10 lg:px-14">
      <div className="rounded-[34px] bg-black p-8 text-white">
        <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black">
          Kontak
        </span>

        <h2 className="mt-6 max-w-3xl text-[clamp(42px,6vw,88px)] font-black leading-[0.86] tracking-[-0.085em]">
          Mari terhubung secara profesional.
        </h2>

        <p className="mt-5 max-w-2xl leading-7 text-white/60">
          Saya terbuka untuk diskusi, kolaborasi, maupun peluang profesional
          lainnya. Silakan hubungi melalui salah satu kontak berikut.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ContactButton
            label="Email"
            value={data.email}
            href={emailLink(data.email)}
          />

          <ContactButton
            label="WhatsApp"
            value={data.phone}
            href={waLink(data.phone)}
          />

          <ContactButton
            label="Instagram"
            value={data.instagram}
            href={instagramLink(data.instagram)}
          />

          <ContactButton
            label="LinkedIn"
            value={data.linkedin}
            href={externalLink(data.linkedin)}
          />

          <ContactButton
            label="GitHub"
            value={data.github}
            href={externalLink(data.github)}
          />

          <ContactButton
            label="Website"
            value={data.website}
            href={externalLink(data.website)}
          />
        </div>
      </div>
    </section>
  );
};

const SkillRow = ({ skill }) => {
  const name = typeof skill === "string" ? skill : skill.name;
  const level = typeof skill === "string" ? "Mahir" : skill.level || "Mahir";
  const percent = typeof skill === "string" ? 80 : skill.percent || 80;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <strong>{name}</strong>

        <span className="text-sm font-bold text-white/60">
          {level} • {percent}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const TimelinePanel = ({ title, items, onOpenFile }) => {
  return (
    <div className="rounded-[30px] bg-white p-7">
      <h3 className="text-3xl font-black tracking-[-0.04em]">{title}</h3>

      <div className="mt-7 grid gap-4">
        {(items || []).map((item, index) => {
          const file =
            item.file ||
            item.file_sertifikat ||
            item.sertifikat_file ||
            item.file_certificate ||
            item.certificate_file ||
            item.file_path ||
            null;

          const url = storageUrl(file);
          const isPdf = url?.toLowerCase().includes(".pdf");

          return (
            <article key={index} className="rounded-3xl bg-[#eef0f4] p-5">
              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-sm font-black text-white">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-black">
                    {item.title || "Data Portfolio"}
                  </h4>

                  {item.subtitle && (
                    <p className="mt-1 text-sm leading-6 text-black/55">
                      {item.subtitle}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-black/55">
                      {item.description}
                    </p>
                  )}

                  {url && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenFile({
                            url,
                            title: item.title || "File Sertifikat",
                          })
                        }
                        className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black text-white hover:bg-black/80"
                      >
                        Lihat File
                      </button>

                      {!isPdf && (
                        <img
                          src={url}
                          alt={item.title || "Sertifikat"}
                          className="mt-3 max-h-52 w-full rounded-2xl object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

const ContactButton = ({ label, value, href }) => {
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/15"
    >
      <div className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/45 transition group-hover:text-white/60">
          {label}
        </span>

        <strong className="mt-1 block break-all text-white transition group-hover:text-white">
          {value || "-"}
        </strong>
      </div>

      <span className="shrink-0 text-2xl text-white transition group-hover:translate-x-1">
        →
      </span>
    </a>
  );
};

const FilePreviewModal = ({ file, onClose }) => {
  const isPdf = file.url?.toLowerCase().includes(".pdf");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white p-5 text-[#111827] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/50">
              Preview File
            </p>

            <h3 className="mt-1 text-2xl font-black text-[#111827]">
              {file.title || "File Sertifikat"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-black/5 text-xl font-black text-black hover:bg-black/10"
          >
            ×
          </button>
        </div>

        <div className="max-h-[72vh] overflow-auto rounded-2xl border border-black/10 bg-[#eef0f4] p-3">
          {isPdf ? (
            <iframe
              src={file.url}
              title={file.title || "File Sertifikat"}
              className="h-[68vh] w-full rounded-xl bg-white"
            />
          ) : (
            <img
              src={file.url}
              alt={file.title || "File Sertifikat"}
              className="mx-auto max-h-[68vh] w-auto max-w-full rounded-xl object-contain"
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/5 px-5 text-sm font-black text-black hover:bg-black/10"
          >
            Buka di Tab Baru
          </a>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-black px-5 text-sm font-black text-white hover:bg-black/80"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const FloatingBadge = ({ children, className = "" }) => {
  return (
    <span
      className={`absolute rounded-full px-4 py-2 text-xs font-black text-black shadow-sm ${className}`}
    >
      {children}
    </span>
  );
};

const initial = (name = "") => {
  return name.trim().charAt(0).toUpperCase() || "P";
};

const emailLink = (email) => {
  return email ? `mailto:${email}` : "#";
};

const waLink = (phone) => {
  if (!phone) return "#";

  const cleaned = phone.replace(/\D/g, "");
  const number = cleaned.startsWith("0") ? `62${cleaned.slice(1)}` : cleaned;

  return `https://wa.me/${number}`;
};

const instagramLink = (instagram) => {
  if (!instagram) return "#";

  if (instagram.startsWith("http")) {
    return instagram;
  }

  const username = instagram.replace("@", "");

  return `https://instagram.com/${username}`;
};

const externalLink = (url) => {
  if (!url) return "#";
  if (url.startsWith("http")) return url;

  return `https://${url}`;
};

export default MinimalProfessionalTemplate;
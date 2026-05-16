import { useState } from "react";
import { storageUrl } from "../../utils/portfolioDataMapper";

const DeveloperSparkTemplate = ({ data }) => {
  const [filePreview, setFilePreview] = useState(null);

  return (
    <section className="mx-auto mb-20 w-full max-w-[1240px] px-4 text-white">
      <div className="overflow-hidden rounded-[42px] border border-white/10 bg-[#070b1f] shadow-[0_35px_100px_rgba(0,0,0,0.55)]">
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
    </section>
  );
};

const Header = ({ data }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070b1f]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-5 px-7 py-5 md:px-10">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#38bdf8] to-[#a855f7] text-lg font-black text-white">
            {initial(data.name)}
          </span>

          <div>
            <strong className="block text-lg font-black leading-none">
              {data.name || "Portfolio"}
            </strong>
            <span className="mt-1 block text-xs font-semibold text-white/45">
              {data.profession || "Web Developer"}
            </span>
          </div>
        </a>

        <nav className="hidden flex-wrap items-center gap-5 text-sm font-bold text-white/65 lg:flex">
          <a href="#about" className="hover:text-white">
            Tentang
          </a>
          <a href="#skills" className="hover:text-white">
            Keahlian
          </a>
          <a href="#projects" className="hover:text-white">
            Karya
          </a>
          <a href="#journey" className="hover:text-white">
            Rekam Jejak
          </a>
          <a href="#contact" className="hover:text-white">
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
      className="relative grid min-h-[720px] scroll-mt-28 items-center gap-12 px-7 py-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr]"
    >
      <div className="pointer-events-none absolute left-[-170px] top-16 h-[440px] w-[440px] rounded-full bg-[#38bdf8]/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-130px] h-[460px] w-[460px] rounded-full bg-[#a855f7]/24 blur-[110px]" />

      <div className="relative z-10">
        <h1 className="max-w-4xl text-[clamp(52px,8vw,108px)] font-black leading-[0.88] tracking-[-0.08em]">
          Halo, saya {data.name || "Nama Portfolio"}.
          <span className="block text-[#7dd3fc]">
            {data.profession || "Web Developer"}
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#a7adca]">
          {data.about}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#38bdf8] px-6 font-black text-[#07111f] transition hover:bg-[#7dd3fc]"
          >
            Lihat Project
          </a>

          <a
            href={emailLink(data.email)}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-6 font-black text-white transition hover:bg-white/15"
          >
            Hubungi Saya
          </a>
        </div>

        <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
          <HeroStat value={`${data.projects?.length || 0}+`} label="Project" />
          <HeroStat value={`${data.skills?.length || 0}+`} label="Keahlian" />
          <HeroStat value="100%" label="Siap Kerja" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="relative mx-auto max-w-[500px]">
          <div className="absolute -left-5 -top-5 h-full w-full rotate-[-4deg] rounded-[42px] bg-[#38bdf8]" />
          <div className="absolute -right-5 top-6 h-full w-full rotate-[5deg] rounded-[42px] bg-[#a855f7]" />

          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[radial-gradient(circle_at_80%_12%,rgba(56,189,248,0.30),transparent_30%),linear-gradient(145deg,#202845,#0d1024)] p-8 shadow-2xl">
            <div className="mb-8 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>

            <div className="mx-auto h-56 w-56 overflow-hidden rounded-[44px] border-[8px] border-white/10 bg-[#fff1e8] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              {storageUrl(data.photo) ? (
                <img
                  src={storageUrl(data.photo)}
                  alt={data.name || "Foto Profil"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-7xl font-black text-[#101827]">
                  {initial(data.name)}
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-4xl font-black tracking-[-0.05em]">
                {data.name || "Nama Portfolio"}
              </h2>

              <p className="mt-2 font-bold text-[#7dd3fc]">
                {data.profession || "Web Developer"}
              </p>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-7 text-[#a7adca]">
                Membangun tampilan website yang rapi, responsif, dan mudah
                digunakan dengan pendekatan modern.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-6 left-6 rounded-3xl bg-white px-5 py-4 text-[#111827] shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
            <span className="block text-xs font-black uppercase tracking-[0.16em] text-black/40">
              Fokus
            </span>
            <strong className="mt-1 block">Web Development</strong>
          </div>

          <div className="absolute -bottom-9 right-7 rounded-3xl bg-[#38bdf8] px-5 py-4 text-[#07111f] shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
            <span className="block text-xs font-black uppercase tracking-[0.16em] text-black/45">
              Status
            </span>
            <strong className="mt-1 block">Open Project</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = ({ data }) => {
  return (
    <section
      id="about"
      className="relative scroll-mt-28 overflow-hidden border-t border-white/10 px-7 py-16 md:px-10"
    >
      <div className="pointer-events-none absolute left-[-120px] top-10 h-[260px] w-[260px] rounded-full bg-[#38bdf8]/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-100px] h-[260px] w-[260px] rounded-full bg-[#a855f7]/10 blur-[90px]" />

      <div className="relative z-10 mb-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#38bdf8]">
          Tentang Saya
        </p>

        <h2 className="mt-4 max-w-4xl text-[clamp(42px,5vw,76px)] font-black leading-[0.9] tracking-[-0.07em]">
          Membangun solusi digital dengan tampilan rapi, modern, dan
          terstruktur.
        </h2>
      </div>

      <div className="relative z-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,#131a33,#0d1226)] p-7">
          <div className="flex items-start gap-5">
            <div className="h-24 w-24 overflow-hidden rounded-[28px] border border-white/10 bg-white/10">
              {storageUrl(data.photo) ? (
                <img
                  src={storageUrl(data.photo)}
                  alt={data.name || "Foto Profil"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-3xl font-black text-white">
                  {initial(data.name)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-black tracking-[-0.04em] text-white">
                {data.name || "Nama Portfolio"}
              </h3>

              <p className="mt-2 font-bold text-[#7dd3fc]">
                {data.profession || "Web Developer"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                  Developer
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                  Responsive UI
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                  Web App
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <InfoBox title="Fokus" text="Website & Antarmuka" />
            <InfoBox title="Teknologi" text="React / Laravel" />
            <InfoBox title="Workflow" text="API, UI, Testing" />
            <InfoBox title="Tujuan" text="Produk siap digunakan" />
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/5 p-7">
          <p className="text-lg leading-9 text-white/85">{data.about}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoBox title="Fokus Utama" text="Frontend" />
            <InfoBox title="Gaya Kerja" text="Rapi" />
            <InfoBox title="Prioritas" text="User Friendly" />
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#0c1328] p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#38bdf8]">
              Ringkasan Singkat
            </p>

            <p className="mt-3 leading-8 text-[#a7adca]">
              Terbiasa membangun tampilan website yang bersih, responsif, dan
              mudah digunakan. Fokus utama saya adalah menciptakan pengalaman
              pengguna yang nyaman dengan struktur tampilan yang profesional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillsAndTools = ({ data }) => {
  return (
    <section
      id="skills"
      className="scroll-mt-28 border-t border-white/10 px-7 py-16 md:px-10"
    >
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#38bdf8]">
            Keahlian & Tools
          </p>

          <h2 className="mt-4 text-[clamp(42px,5vw,76px)] font-black leading-[0.9] tracking-[-0.07em]">
            Kemampuan teknis.
          </h2>
        </div>

        <p className="max-w-md leading-7 text-[#a7adca]">
          Keahlian yang mendukung proses pembuatan website, mulai dari
          penyusunan tampilan, pengelolaan data, sampai integrasi API.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-7">
          <h3 className="text-3xl font-black tracking-[-0.04em]">Keahlian</h3>

          <div className="mt-7 grid gap-5">
            {(data.skills || []).map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/5 p-7">
          <h3 className="text-3xl font-black tracking-[-0.04em]">
            Tools yang Digunakan
          </h3>

          <div className="mt-7 flex flex-wrap gap-3">
            {(data.tools || []).map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="rounded-full bg-[#e0f2fe] px-4 py-2 text-sm font-black text-[#0f172a]"
              >
                {tool}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-7 text-[#a7adca]">
              Tools digunakan untuk membantu proses desain, pengembangan,
              testing API, dan pengelolaan project.
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
      className="scroll-mt-28 border-t border-white/10 px-7 py-16 md:px-10"
    >
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#38bdf8]">
            Project Pilihan
          </p>

          <h2 className="mt-4 text-[clamp(42px,5vw,76px)] font-black leading-[0.9] tracking-[-0.07em]">
            Beberapa karya terbaik.
          </h2>

          <p className="mt-5 leading-7 text-[#a7adca]">
            Kumpulan project yang menunjukkan kemampuan dalam membangun website,
            dashboard, dan antarmuka digital yang modern, rapi, serta
            responsif.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
          <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#7dd3fc]">
            Total Project
          </span>
          <strong className="mt-2 block text-3xl font-black text-white">
            {data.projects?.length || 0}
          </strong>
        </div>
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {(data.projects || []).map((project, index) => (
          <article
            key={index}
            className="group flex h-full flex-col overflow-hidden rounded-[34px] border border-white/10 bg-[#12182f] transition duration-300 hover:-translate-y-1 hover:border-[#38bdf8]/30 hover:bg-[#151c35]"
          >
            <div className="relative h-64 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#111827,#0f172a)]">
              <div className="absolute left-4 top-4 z-10">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#0f172a] shadow">
                  {project.category || "Project"}
                </span>
              </div>

              <div className="absolute right-4 top-4 z-10">
                <span className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold text-white/90 backdrop-blur">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </div>

              {storageUrl(project.image) ? (
                <img
                  src={storageUrl(project.image)}
                  alt={project.title || "Project"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.7),transparent_20%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.7),transparent_25%),linear-gradient(135deg,#1d2646,#0d1121)]">
                  <span className="text-6xl font-black tracking-[-0.06em] text-white/90">
                    {project.imageLabel || "PR"}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-bold text-white/75">
                <span>Developer Portfolio</span>
                <span>Preview Project</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="min-h-[64px] text-[30px] font-black leading-[1.05] tracking-[-0.04em] text-white">
                {project.title}
              </h3>

              <p className="mt-4 min-h-[120px] leading-7 text-[#a7adca]">
                {project.description}
              </p>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {(project.tech || []).map((tech, techIndex) => (
                    <span
                      key={`${tech}-${techIndex}`}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white/85"
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
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#38bdf8] px-5 text-sm font-black text-[#07111f] hover:bg-[#7dd3fc]"
                  >
                    Lihat Project
                  </a>
                )}
              </div>
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
      className="scroll-mt-28 border-t border-white/10 px-7 py-16 md:px-10"
    >
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#38bdf8]">
          Rekam Jejak
        </p>

        <h2 className="mt-4 text-[clamp(42px,5vw,76px)] font-black leading-[0.9] tracking-[-0.07em]">
          Pendidikan, pengalaman, dan pencapaian.
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TimelineCard
          title="Pendidikan"
          items={data.educations || []}
          onOpenFile={onOpenFile}
        />
        <TimelineCard
          title="Pengalaman"
          items={data.experiences || []}
          onOpenFile={onOpenFile}
        />
        <TimelineCard
          title="Sertifikat"
          items={data.certificates || []}
          onOpenFile={onOpenFile}
        />
        <TimelineCard
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
    <section
      id="contact"
      className="scroll-mt-28 border-t border-white/10 px-7 py-16 md:px-10"
    >
      <div className="rounded-[38px] bg-[#e0f2fe] p-8 text-[#0f172a]">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0284c7]">
          Kontak
        </p>

        <h2 className="mt-4 text-[clamp(42px,6vw,88px)] font-black leading-[0.85] tracking-[-0.08em]">
          Mari terhubung.
        </h2>

        <p className="mt-5 max-w-2xl leading-7 text-[#334155]">
          Hubungi melalui salah satu kontak berikut untuk kerja sama, diskusi
          project, atau kebutuhan profesional lainnya.
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

const SkillBar = ({ skill }) => {
  const name = typeof skill === "string" ? skill : skill.name;
  const level = typeof skill === "string" ? "Mahir" : skill.level || "Mahir";
  const percent = typeof skill === "string" ? 80 : skill.percent || 80;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <strong>{name}</strong>

        <span className="text-sm font-bold text-[#7dd3fc]">
          {level} • {percent}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const TimelineCard = ({ title, items, onOpenFile }) => {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/5 p-7">
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
            <article
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#38bdf8] text-sm font-black text-[#07111f]">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-black">
                    {item.title || "Data Portfolio"}
                  </h4>

                  {item.subtitle && (
                    <p className="mt-1 leading-7 text-[#a7adca]">
                      {item.subtitle}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-white/55">
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
                        className="inline-flex rounded-xl bg-white/10 px-3 py-2 text-xs font-black text-white hover:bg-white/15"
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
      className="group flex items-center justify-between gap-4 rounded-2xl bg-[#0f172a] px-5 py-4 text-white transition hover:-translate-y-1 hover:bg-[#0284c7]"
    >
      <div className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/45 transition group-hover:text-white/75">
          {label}
        </span>

        <strong className="mt-1 block break-all text-white transition group-hover:text-white">
          {value || "-"}
        </strong>
      </div>

      <span className="shrink-0 text-2xl text-white transition group-hover:translate-x-1 group-hover:text-white">
        →
      </span>
    </a>
  );
};

const HeroStat = ({ value, label }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <strong className="block text-2xl font-black">{value}</strong>
      <span className="mt-1 block text-xs text-[#a7adca]">{label}</span>
    </div>
  );
};

const InfoBox = ({ title, text }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <strong className="block">{title}</strong>
      <span className="mt-1 block text-sm text-[#a7adca]">{text}</span>
    </div>
  );
};

const FilePreviewModal = ({ file, onClose }) => {
  const isPdf = file.url?.toLowerCase().includes(".pdf");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-[#202238] p-5 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#38bdf8]">
              Preview File
            </p>

            <h3 className="mt-1 text-2xl font-black text-white">
              {file.title || "File Sertifikat"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-xl font-black text-white hover:bg-white/15"
          >
            ×
          </button>
        </div>

        <div className="max-h-[72vh] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-3">
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
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-black text-white hover:bg-white/15"
          >
            Buka di Tab Baru
          </a>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#38bdf8] px-5 text-sm font-black text-[#07111f] hover:bg-[#7dd3fc]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
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

export default DeveloperSparkTemplate;
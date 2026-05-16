import { useState } from "react";
import { storageUrl } from "../../utils/portfolioDataMapper";

const CreativeEditorialTemplate = ({ data }) => {
  const [filePreview, setFilePreview] = useState(null);

  return (
    <section className="mx-auto mb-20 w-full max-w-[1240px] px-4">
      <div className="overflow-hidden rounded-[42px] border border-white/10 bg-[#22118f] text-[#d9f241] shadow-[0_35px_100px_rgba(0,0,0,0.55)]">
        <Header data={data} />
        <Hero data={data} />
        <BrandStrip />
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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#22118f]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-5 px-7 py-5 md:px-10">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d9f241] text-lg font-black text-[#22118f]">
            {initial(data.name)}
          </span>

          <div>
            <strong className="block text-lg font-black leading-none text-[#d9f241]">
              {data.name || "Portfolio"}
            </strong>

            <span className="mt-1 block text-xs font-semibold text-white/55">
              {data.profession || "Creative Professional"}
            </span>
          </div>
        </a>

        <nav className="hidden flex-wrap items-center gap-5 text-sm font-bold text-white/75 lg:flex">
          <a href="#about" className="hover:text-[#d9f241]">
            Tentang
          </a>
          <a href="#skills" className="hover:text-[#d9f241]">
            Keahlian
          </a>
          <a href="#projects" className="hover:text-[#d9f241]">
            Karya
          </a>
          <a href="#journey" className="hover:text-[#d9f241]">
            Rekam Jejak
          </a>
          <a href="#contact" className="hover:text-[#d9f241]">
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
      className="relative grid min-h-[760px] scroll-mt-28 items-center gap-12 px-7 py-16 md:px-10 lg:grid-cols-[1.08fr_0.92fr]"
    >
      <div className="pointer-events-none absolute left-[-160px] top-10 h-[420px] w-[420px] rounded-full bg-[#a855f7]/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#38bdf8]/16 blur-[120px]" />

      <div className="relative z-10">
        <h1 className="mt-5 max-w-[820px] text-[clamp(54px,8vw,108px)] font-black leading-[0.88] tracking-[-0.07em] text-[#d9f241]">
          IDENTITAS
          <span className="block text-white">VISUAL</span>
          <span className="block text-[#d9f241]">YANG KUAT.</span>
        </h1>

        <p className="mt-6 max-w-[640px] text-lg leading-8 text-white/80">
          Portfolio kreatif yang menampilkan identitas visual, kemampuan desain,
          karya digital, dan karakter profesional secara terarah.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-full !bg-[#d9f241] px-7 text-base font-black !text-[#22118f] shadow-[0_16px_36px_rgba(217,242,65,0.22)] transition hover:scale-[1.02] hover:!bg-[#e7ff58] hover:!text-[#22118f] focus:!bg-[#e7ff58] focus:!text-[#22118f] active:!bg-[#cde82f] active:!text-[#22118f]"
          >
            Lihat Karya
          </a>

          <a
            href={emailLink(data.email)}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 !bg-white/10 px-7 text-base font-black !text-white shadow-[0_16px_36px_rgba(0,0,0,0.12)] transition hover:!bg-white hover:!text-[#22118f] focus:!bg-white focus:!text-[#22118f] active:!bg-white active:!text-[#22118f]"
          >
            Hubungi Saya
          </a>
        </div>
      </div>

      <div className="relative z-10 flex justify-center lg:justify-end">
        <div className="relative w-full max-w-[410px]">
          <div className="absolute -left-5 top-10 h-[88%] w-[88%] rounded-[42px] bg-[#ff6b8a]" />
          <div className="absolute right-0 top-0 h-[88%] w-[88%] rounded-[42px] bg-[#7ee7c7]" />

          <div className="relative ml-auto overflow-hidden rounded-[38px] border-[6px] border-[#d9f241] bg-[#f7f0df] shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
            <div className="h-[460px] overflow-hidden">
              {storageUrl(data.photo) ? (
                <img
                  src={storageUrl(data.photo)}
                  alt={data.name || "Foto Profil"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-[#f7f0df] text-[72px] font-black text-[#1b1253]">
                  {initial(data.name)}
                </div>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1b1253] via-[#1b1253]/80 to-transparent px-6 pb-6 pt-16">
              <h2 className="text-4xl font-black text-white">
                {data.name || "Nama Portfolio"}
              </h2>

              <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-[#d9f241]">
                {data.profession || "Creative Professional"}
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 left-3 rounded-[28px] bg-[#d9f241] px-6 py-4 text-[#1b1253] shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-[#1b1253]/60">
              Fokus
            </span>

            <strong className="mt-1 block text-xl font-black">
              Creative Direction
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
};

const BrandStrip = () => {
  return (
    <section className="grid grid-cols-2 gap-0 border-y border-[#22118f] bg-[#d9f241] py-5 text-center text-sm font-black uppercase tracking-[0.16em] text-[#22118f] md:grid-cols-5">
      <span>Design</span>
      <span>Creative</span>
      <span>Branding</span>
      <span>Digital</span>
      <span>Visual</span>
    </section>
  );
};

const About = ({ data }) => {
  return (
    <section
      id="about"
      className="scroll-mt-28 border-t border-black/10 bg-[#d9f241] px-7 py-16 text-[#1b1253] md:px-10"
    >
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1b1253]/70">
          Tentang Saya
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <h2 className="max-w-[700px] text-[clamp(48px,7vw,96px)] font-black leading-[0.9] tracking-[-0.06em]">
            PROFIL
            <span className="block">KREATIF</span>
            <span className="block">YANG TERARAH.</span>
          </h2>

          <p className="mt-6 max-w-[620px] text-lg leading-8 text-[#1b1253]/78">
            Pendekatan visual yang kuat membantu karya terlihat konsisten,
            mudah dikenali, dan mampu menyampaikan pesan secara jelas.
          </p>
        </div>

        <div className="rounded-[34px] bg-[#3a20a6] p-7 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <p className="text-[22px] leading-[1.6] text-white/95">
            {data.about}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <CreativePoint
              title="Creative Direction"
              text="Menyusun arah visual yang konsisten, kuat, dan mudah dikenali."
            />
            <CreativePoint
              title="Visual Storytelling"
              text="Mengolah ide menjadi visual yang komunikatif dan berkarakter."
            />
            <CreativePoint
              title="Branding"
              text="Membangun identitas visual yang relevan untuk kebutuhan digital."
            />
            <CreativePoint
              title="Content Design"
              text="Menata konten visual agar tampil menarik, rapi, dan efektif."
            />
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
      className="grid scroll-mt-28 gap-10 px-7 py-20 md:px-10 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d9f241]">
          Keahlian Creative
        </p>

        <h2 className="mt-4 text-[clamp(48px,7vw,96px)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
          Skillset
          <span className="block">Kreatif.</span>
        </h2>

        <p className="mt-7 max-w-md text-base leading-7 text-white/75">
          Keahlian yang mendukung proses kreatif, mulai dari penyusunan konsep,
          desain visual, branding, hingga produksi konten digital.
        </p>
      </div>

      <div className="grid gap-5">
        <NeonPanel title="Keahlian">
          <div className="grid gap-4">
            {(data.skills || []).map((skill, index) => (
              <SkillItem key={index} skill={skill} />
            ))}
          </div>
        </NeonPanel>

        <NeonPanel title="Tools">
          <div className="flex flex-wrap gap-3">
            {(data.tools || []).map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="rounded-full bg-[#d9f241] px-4 py-2 text-sm font-black text-[#22118f]"
              >
                {tool}
              </span>
            ))}
          </div>
        </NeonPanel>
      </div>
    </section>
  );
};

const Projects = ({ data }) => {
  return (
    <section
      id="projects"
      className="scroll-mt-28 border-t border-black/10 bg-[#d9f241] px-7 py-16 text-[#1b1253] md:px-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1b1253]/70">
            Karya Pilihan
          </p>

          <h2 className="mt-4 max-w-[760px] text-[clamp(50px,7vw,96px)] font-black leading-[0.88] tracking-[-0.06em]">
            CREATIVE
            <span className="block">WORKS</span>
          </h2>
        </div>

        <p className="max-w-[520px] text-lg leading-8 text-[#1b1253]/80 lg:justify-self-end">
          Kumpulan karya visual dan digital yang menampilkan eksplorasi desain,
          identitas, layout, serta penyampaian pesan secara kreatif dan
          terstruktur.
        </p>
      </div>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
        {(data.projects || []).slice(0, 3).map((project, index) => (
          <article
            key={index}
            className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-[34px] bg-[#3a20a6] text-white shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
          >
            <div className="relative h-[250px] shrink-0 overflow-hidden bg-[#f6ecd7]">
              {storageUrl(project.image) ? (
                <img
                  src={storageUrl(project.image)}
                  alt={project.title || "Project"}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-6xl font-black text-[#1b1253]">
                  {project.imageLabel || "CR"}
                </div>
              )}

              <div className="absolute left-4 top-4 rounded-full bg-[#d9f241] px-4 py-2 text-xs font-black text-[#1b1253]">
                {project.category || "Creative"}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="min-h-[78px] text-[32px] font-black leading-[1.02] tracking-[-0.04em]">
                {project.title}
              </h3>

              <p className="mt-4 min-h-[136px] text-base leading-8 text-white/82">
                {project.description}
              </p>

              <div className="mt-auto pt-5">
                <div className="flex min-h-[70px] flex-wrap content-start gap-2">
                  {(project.tech || []).map((tech, techIndex) => (
                    <span
                      key={`${tech}-${techIndex}`}
                      className="h-fit rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white"
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
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#d9f241] px-5 text-sm font-black text-[#1b1253]"
                  >
                    Lihat Detail
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
    <section id="journey" className="scroll-mt-28 px-7 py-20 md:px-10">
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d9f241]">
          Rekam Jejak
        </p>

        <h2 className="mt-4 max-w-4xl text-[clamp(40px,6vw,78px)] font-black uppercase leading-[0.86] tracking-[-0.07em]">
          Pendidikan, pengalaman, dan pencapaian.
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ListPanel
          title="Pendidikan"
          items={data.educations || []}
          onOpenFile={onOpenFile}
        />

        <ListPanel
          title="Pengalaman"
          items={data.experiences || []}
          onOpenFile={onOpenFile}
        />

        <ListPanel
          title="Sertifikat"
          items={data.certificates || []}
          onOpenFile={onOpenFile}
        />

        <ListPanel
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
    <section id="contact" className="scroll-mt-28 px-7 py-20 md:px-10">
      <div className="rounded-[38px] bg-[#d9f241] p-8 text-[#22118f]">
        <p className="text-xs font-black uppercase tracking-[0.24em]">
          Kontak
        </p>

        <h2 className="mt-4 text-[clamp(44px,6vw,84px)] font-black uppercase leading-[0.88] tracking-[-0.07em]">
          Mari buat sesuatu yang berani.
        </h2>

        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8">
          Saya terbuka untuk kerja sama kreatif, diskusi visual, dan peluang
          kolaborasi profesional lainnya.
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

const CreativePoint = ({ title, text }) => {
  return (
    <div className="rounded-[26px] bg-[#d9f241] p-5 text-[#1b1253]">
      <h3 className="text-[23px] font-black leading-[1.05]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#1b1253]/75">{text}</p>
    </div>
  );
};

const NeonPanel = ({ title, children }) => {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/10 p-7">
      <h3 className="text-4xl font-black tracking-[-0.06em]">{title}</h3>
      <div className="mt-6">{children}</div>
    </div>
  );
};

const SkillItem = ({ skill }) => {
  const name = typeof skill === "string" ? skill : skill.name;
  const level = typeof skill === "string" ? "Mahir" : skill.level || "Mahir";
  const percent = typeof skill === "string" ? 80 : skill.percent || 80;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <strong>{name}</strong>
        <span className="text-sm font-black text-[#d9f241]">
          {level} • {percent}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-[#d9f241]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const ListPanel = ({ title, items, onOpenFile }) => {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/10 p-7">
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
              className="rounded-3xl border border-white/10 bg-[#d9f241] p-5 text-[#22118f]"
            >
              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22118f] text-sm font-black text-[#d9f241]">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-black">
                    {item.title || "Data Portfolio"}
                  </h4>

                  {item.subtitle && (
                    <p className="mt-1 text-sm font-semibold text-[#22118f]/70">
                      {item.subtitle}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-[#22118f]/70">
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
                        className="inline-flex rounded-full bg-[#22118f] px-4 py-2 text-xs font-black text-[#d9f241] hover:bg-[#150c61]"
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
      className="group flex items-center justify-between gap-4 rounded-2xl bg-[#22118f] px-5 py-4 text-white transition hover:-translate-y-1 hover:bg-[#ff4fa3]"
    >
      <div className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/50 transition group-hover:text-white/75">
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

const FilePreviewModal = ({ file, onClose }) => {
  const isPdf = file.url?.toLowerCase().includes(".pdf");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-[#22118f] p-5 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d9f241]">
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
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#d9f241] px-5 text-sm font-black text-[#22118f] hover:bg-[#e7ff58]"
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

export default CreativeEditorialTemplate;
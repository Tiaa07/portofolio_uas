import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { isLoggedIn, getAuthRole } from "../../utils/auth";
import { buildPortfolioData } from "../../utils/portfolioDataMapper";
import { showErrorAlert } from "../../utils/sweetAlert";

import DeveloperSparkTemplate from "../../components/portfolio-templates/DeveloperSparkTemplate";
import CreativeEditorialTemplate from "../../components/portfolio-templates/CreativeEditorialTemplate";
import MinimalProfessionalTemplate from "../../components/portfolio-templates/MinimalProfessionalTemplate";

const TemplateDetailPage = () => {
  const { id } = useParams();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loggedIn = isLoggedIn();
  const role = getAuthRole();

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(`/templates/${id}`);

      setTemplate(response.data.data || response.data);
      setMessage(response.data.message || "Detail template berhasil diambil.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil detail template.";

      setMessage(errorMessage);

      await showErrorAlert("Gagal Memuat Detail Template", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const packages = [
    {
      key: "basic",
      name: "Basic",
      price: template?.harga_basic ?? 0,
      desc: "Cocok untuk portfolio sederhana. Berisi data utama, kontak, dan sosial media dasar.",
      features: ["Hero profile", "Contact", "Social media", "Link public"],
    },
    {
      key: "standard",
      name: "Standard",
      price: template?.harga_standard ?? 0,
      desc: "Cocok untuk portfolio personal yang lebih lengkap dan profesional.",
      features: ["Semua fitur Basic", "About Me", "Skills", "Tools"],
    },
    {
      key: "premium",
      name: "Premium",
      price: template?.harga_premium ?? 0,
      desc: "Cocok untuk portfolio lengkap dengan data personal branding penuh.",
      features: [
        "Semua fitur Standard",
        "Projects",
        "Education",
        "Experience",
        "Certificate",
        "Achievement",
      ],
    },
  ];

  if (loading) {
    return (
      <main className="px-4 py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="h-[320px] animate-pulse rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="h-5 w-40 rounded-full bg-[#f1f5f9]" />
            <div className="mt-6 h-14 w-3/4 rounded-2xl bg-[#f1f5f9]" />
            <div className="mt-5 h-4 w-full rounded-full bg-[#f1f5f9]" />
            <div className="mt-3 h-4 w-4/5 rounded-full bg-[#f1f5f9]" />
            <div className="mt-8 h-12 w-44 rounded-full bg-[#f1f5f9]" />
          </div>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="px-4 py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600">
            {message || "Template tidak ditemukan."}
          </div>
        </div>
      </main>
    );
  }

  const templateInfo = getTemplateInfo(template);

  return (
    <main className="overflow-hidden text-[#111827]">
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f97316]">
              Template Detail
            </p>

            <h1 className="mt-4 max-w-4xl text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em] text-[#111827]">
              {template.nama_template}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#64748b] md:text-base">
              {template.deskripsi}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#eff6ff] px-4 py-2 text-xs font-black text-[#2563eb]">
                {template.kategori}
              </span>

              <span className="rounded-full bg-[#fff7ed] px-4 py-2 text-xs font-black text-[#f97316]">
                Desain tetap
              </span>

              <span className="rounded-full bg-[#f8fafc] px-4 py-2 text-xs font-black text-[#0f172a]">
                Data sesuai paket
              </span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <DetailInfoItem label="Cocok untuk" value={templateInfo.suitable} />
              <DetailInfoItem label="Gaya desain" value={templateInfo.style} />
              <DetailInfoItem label="Kebutuhan" value={templateInfo.purpose} />
              <DetailInfoItem label="Isi utama" value={templateInfo.sections} />
            </div>

            {!loggedIn && (
              <div className="mt-8 rounded-[26px] border border-[#fed7aa] bg-[#fff7ed] p-5">
                <h3 className="text-lg font-black text-[#111827]">
                  Login dulu untuk mulai order.
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#64748b]">
                  Kamu bisa melihat preview template tanpa login, tapi untuk
                  memilih paket dan membuat order, kamu perlu login sebagai
                  user.
                </p>

                <Link
                  to="/login"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
                >
                  Login Sekarang
                </Link>
              </div>
            )}

            {loggedIn && role === "admin" && (
              <div className="mt-8 rounded-[26px] border border-red-200 bg-red-50 p-5">
                <h3 className="text-lg font-black text-red-600">
                  Admin tidak bisa membuat order.
                </h3>

                <p className="mt-2 text-sm leading-7 text-red-500">
                  Gunakan akun user untuk memilih paket dan membuat order
                  portfolio.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[34px] border border-[#e5e7eb] bg-white p-5 shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
            <div className="rounded-[28px] bg-[#f8fafc] p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f97316]">
                    Template Summary
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                    Tentang template ini
                  </h2>
                </div>

                <span className="rounded-full bg-[#0f172a] px-4 py-2 text-xs font-black text-white">
                  Aktif
                </span>
              </div>

              <p className="text-sm leading-7 text-[#64748b]">
                {templateInfo.longDesc}
              </p>

              <div className="mt-5 grid gap-3">
                <InfoBox
                  label="Mulai dari"
                  value={formatRupiah(template.harga_basic)}
                />
                <InfoBox label="Paket tersedia" value="Basic, Standard, Premium" />
                <InfoBox label="Link final" value="Bisa dibuka tanpa login" />
              </div>

              <a
                href="#preview-template"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
              >
                Lihat Preview Template
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="preview-template" className="px-4 pb-14 md:pb-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f97316]">
                Full Preview
              </p>

              <h2 className="mt-3 max-w-3xl text-[clamp(30px,4vw,48px)] font-black leading-[1.05] tracking-[-0.04em]">
                Preview template sebelum kamu memilih paket.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#64748b] md:text-base">
                Ini adalah tampilan contoh dari template. Data final portfolio
                akan menyesuaikan data yang kamu isi saat order dan paket yang
                kamu pilih.
              </p>
            </div>

            <Link
              to="/templates"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 text-sm font-black text-[#111827] shadow-sm transition hover:bg-[#f8fafc]"
            >
              Kembali ke Template
            </Link>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-[#e5e7eb] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
            <TemplateFullPreview template={template} />
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-8 max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f97316]">
              Pilih Paket
            </p>

            <h2 className="mt-3 text-[clamp(30px,4vw,48px)] font-black leading-[1.05] tracking-[-0.04em]">
              Mulai order sesuai kebutuhan portfolio kamu.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#64748b] md:text-base">
              Setiap paket menentukan data apa saja yang bisa dimasukkan ke
              dalam portfolio final.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {packages.map((item, index) => {
              const canOrder = loggedIn && role === "user";

              return (
                <article
                  key={item.key}
                  className={`flex min-h-[470px] flex-col rounded-[30px] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)] ${
                    index === 2
                      ? "border-[#bfdbfe] bg-[#eff6ff]"
                      : "border-[#e5e7eb] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f97316]">
                      Paket
                    </p>

                    {index === 2 && (
                      <span className="rounded-full bg-[#2563eb] px-4 py-2 text-[11px] font-black text-white">
                        Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                    {item.name}
                  </h3>

                  <strong className="mt-4 block text-4xl font-black tracking-[-0.05em]">
                    {formatRupiah(item.price)}
                  </strong>

                  <p className="mt-4 text-sm leading-7 text-[#64748b]">
                    {item.desc}
                  </p>

                  <ul className="mt-5 grid gap-3 text-sm text-[#111827]">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#eff6ff] text-[11px] font-black text-[#2563eb]">
                          ✓
                        </span>
                        <span className="font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    {canOrder ? (
                      <Link
                        to={`/user/templates/${template.id}/order/${item.key}`}
                        className="flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
                      >
                        Pilih {item.name}
                      </Link>
                    ) : loggedIn && role === "admin" ? (
                      <button
                        type="button"
                        disabled
                        className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#e5e7eb] px-5 text-sm font-black text-[#94a3b8]"
                      >
                        Admin tidak bisa order
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="flex min-h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
                      >
                        Login untuk Order
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

const TemplateFullPreview = ({ template }) => {
  const previewId = getTemplateId(template);
  const previewData = buildPreviewData(template, previewId);

  return (
    <div className="h-[720px] overflow-y-auto overflow-x-hidden overscroll-contain rounded-[28px] bg-[#0f172a]">
      <div
        className="mx-auto"
        style={{
          width: "1180px",
          zoom: 0.62,
        }}
      >
        {previewId === 1 && <DeveloperSparkTemplate data={previewData} />}
        {previewId === 2 && <CreativeEditorialTemplate data={previewData} />}
        {previewId === 3 && <MinimalProfessionalTemplate data={previewData} />}
      </div>
    </div>
  );
};

const buildPreviewData = (template, templateId) => {
  const name = template.nama_template?.toLowerCase() || "";

  const profession = name.includes("developer")
    ? "Fullstack Developer"
    : name.includes("creative")
    ? "Creative Designer"
    : "Professional Profile";

  const previewName = name.includes("developer")
    ? "Nama Developer"
    : name.includes("creative")
    ? "Nama Creative"
    : "Nama Portfolio";

  const orderPreview = {
    id: template.id,
    paket: "premium",
    template_id: templateId,
    template: {
      id: templateId,
      nama_template: template.nama_template,
      kategori: template.kategori,
    },
    user: {
      name: previewName,
      email: "email@example.com",
    },
    portfolio_profile: {
      nama_lengkap: previewName,
      profesi: profession,
      email: "email@example.com",
      nomor_hp: "081234567890",
      instagram: "@portfolio",
      linkedin: "linkedin.com/in/portfolio",
      github: "github.com/portfolio",
      website: "portfolio.com",
      foto_profil: null,
    },
  };

  return buildPortfolioData(orderPreview);
};

const getTemplateId = (template) => {
  const name = template.nama_template?.toLowerCase() || "";
  const category = template.kategori?.toLowerCase() || "";

  if (name.includes("developer") || category.includes("developer")) {
    return 1;
  }

  if (name.includes("creative") || category.includes("creative")) {
    return 2;
  }

  if (
    name.includes("minimal") ||
    name.includes("professional") ||
    category.includes("professional")
  ) {
    return 3;
  }

  return Number(template.id || 1);
};

const getTemplateInfo = (template) => {
  const name = template?.nama_template?.toLowerCase() || "";
  const category = template?.kategori?.toLowerCase() || "";

  if (name.includes("developer") || category.includes("developer")) {
    return {
      suitable: "Programmer, web developer, mahasiswa IT, freelancer digital",
      style: "Bold, colorful, modern, dan energetic",
      purpose:
        "Menonjolkan skill teknis, project, tools, dan pengalaman development",
      sections:
        "Hero profile, skills, tools, projects, experience, contact",
      longDesc:
        "Developer Spark Portfolio adalah template yang dibuat untuk menampilkan personal branding seorang developer secara lebih kuat. Desainnya bold, modern, dan penuh warna sehingga cocok untuk menonjolkan kemampuan teknis, project, pengalaman, serta kontak profesional dalam satu halaman portfolio.",
    };
  }

  if (name.includes("creative") || category.includes("creative")) {
    return {
      suitable:
        "UI/UX designer, graphic designer, content creator, creative freelancer",
      style: "Editorial, visual, stylish, dan expressive",
      purpose:
        "Menampilkan identitas visual, karya kreatif, project, dan personal style",
      sections:
        "Hero visual, about, karya/project, skills kreatif, contact",
      longDesc:
        "Creative Editorial Portfolio adalah template untuk user yang ingin menampilkan karya secara lebih visual dan ekspresif. Template ini cocok untuk bidang kreatif karena tampilannya editorial, stylish, dan memberi ruang besar untuk menonjolkan identitas visual serta portfolio karya.",
    };
  }

  if (
    name.includes("minimal") ||
    name.includes("professional") ||
    category.includes("professional")
  ) {
    return {
      suitable:
        "Mahasiswa, fresh graduate, job seeker, pelamar magang, profesional umum",
      style: "Clean, minimal, rapi, dan profesional",
      purpose:
        "Membuat profil profesional yang mudah dibaca oleh HRD, dosen, atau klien",
      sections:
        "Hero profile, about, education, experience, skills, contact",
      longDesc:
        "Minimal Professional Portfolio adalah template dengan tampilan yang bersih dan profesional. Cocok untuk user yang ingin portfolio terlihat rapi, mudah dibaca, dan tidak terlalu ramai, terutama untuk kebutuhan melamar kerja, magang, personal branding, atau presentasi profil profesional.",
    };
  }

  return {
    suitable: "User yang membutuhkan website portfolio online",
    style: "Clean dan profesional",
    purpose: "Menampilkan data portfolio dalam satu link public",
    sections: "Profile, portfolio data, contact, dan link final",
    longDesc:
      "Template ini digunakan untuk membuat website portfolio yang bisa dibagikan secara public. Isi data yang tampil akan menyesuaikan paket yang dipilih user.",
  };
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <span className="block text-xs font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        {label}
      </span>

      <strong className="mt-1 block text-sm text-[#111827]">{value}</strong>
    </div>
  );
};

const DetailInfoItem = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
      <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
        {label}
      </span>

      <strong className="mt-1 block text-sm leading-6 text-[#111827]">
        {value}
      </strong>
    </div>
  );
};

const formatRupiah = (value) => {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
};

export default TemplateDetailPage;
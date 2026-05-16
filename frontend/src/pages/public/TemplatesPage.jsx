import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { buildPortfolioData } from "../../utils/portfolioDataMapper";
import { showErrorAlert } from "../../utils/sweetAlert";

import DeveloperSparkTemplate from "../../components/portfolio-templates/DeveloperSparkTemplate";
import CreativeEditorialTemplate from "../../components/portfolio-templates/CreativeEditorialTemplate";
import MinimalProfessionalTemplate from "../../components/portfolio-templates/MinimalProfessionalTemplate";

const TemplatesPage = () => {
  const location = useLocation();

  const detailBasePath = location.pathname.startsWith("/user")
    ? "/user/templates"
    : "/templates";

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get("/templates");

      setTemplates(response.data.data || []);
      setMessage(response.data.message || "Template berhasil diambil.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil data template.";

      setMessage(errorMessage);

      await showErrorAlert("Gagal Memuat Template", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return templates;

    const keyword = search.toLowerCase();

    return templates.filter((template) => {
      return (
        template.nama_template?.toLowerCase().includes(keyword) ||
        template.kategori?.toLowerCase().includes(keyword) ||
        template.deskripsi?.toLowerCase().includes(keyword)
      );
    });
  }, [templates, search]);

  return (
    <main className="overflow-hidden text-[#111827]">
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f97316]">
                Templates
              </p>

              <h1 className="mt-4 max-w-4xl text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em] text-[#111827]">
                Pilih template portfolio yang sesuai.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-[#64748b] md:text-base">
                Lihat tampilan awal dari setiap template. Kalau sudah cocok,
                klik detail untuk melihat preview lengkap dan memilih paket.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <div className="grid gap-3 sm:grid-cols-3">
                <StatBox value={templates.length} label="Template" />
                <StatBox value="3" label="Paket" />
                <StatBox value="24/7" label="Public Link" />
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari template, kategori, atau deskripsi..."
                  className="min-h-11 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[560px] animate-pulse rounded-[30px] border border-[#e5e7eb] bg-white p-5 shadow-sm"
                >
                  <div className="h-[285px] rounded-[24px] bg-[#f1f5f9]" />
                  <div className="mt-5 h-5 w-1/2 rounded-full bg-[#f1f5f9]" />
                  <div className="mt-4 h-4 w-full rounded-full bg-[#f1f5f9]" />
                  <div className="mt-3 h-4 w-4/5 rounded-full bg-[#f1f5f9]" />
                  <div className="mt-8 h-12 rounded-2xl bg-[#f1f5f9]" />
                </div>
              ))}
            </div>
          )}

          {!loading && message && (
            <div className="mt-8 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold text-[#2563eb]">
              {message}
            </div>
          )}

          {!loading && filteredTemplates.length === 0 && (
            <div className="mt-10 rounded-[30px] border border-[#e5e7eb] bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f97316]">
                Template tidak ditemukan
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#111827]">
                Belum ada template yang cocok.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#64748b]">
                Coba gunakan kata kunci lain atau hapus pencarian untuk melihat
                semua template yang tersedia.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
              >
                Reset Pencarian
              </button>
            </div>
          )}

          {!loading && filteredTemplates.length > 0 && (
            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <article
                  key={template.id}
                  className="group flex min-h-[540px] flex-col overflow-hidden rounded-[30px] border border-[#e5e7eb] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                >
                  <div className="relative h-[245px] overflow-hidden bg-[#f8fafc]">
                    <TemplateRealPreview template={template} />

                    <div className="absolute left-4 bottom-4 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-[#111827] shadow-sm backdrop-blur">
                      {template.kategori}
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-[#0f172a] px-4 py-2 text-xs font-black text-white shadow-sm">
                      Aktif
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl font-black leading-tight tracking-[-0.035em] text-[#111827]">
                      {template.nama_template}
                    </h3>

                    <p className="mt-3 line-clamp-4 flex-1 text-sm leading-7 text-[#64748b]">
                      {template.deskripsi}
                    </p>

                    <div className="mt-6 grid gap-3">
                      <PriceRow
                        label="Basic"
                        price={template.harga_basic}
                        active
                      />

                      <PriceRow
                        label="Standard"
                        price={template.harga_standard}
                      />

                      <PriceRow
                        label="Premium"
                        price={template.harga_premium}
                      />
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#e5e7eb] pt-5">
                      <div>
                        <span className="block text-xs font-black uppercase tracking-[0.12em] text-[#94a3b8]">
                          Mulai dari
                        </span>

                        <strong className="mt-1 block text-lg font-black text-[#111827]">
                          {formatRupiah(template.harga_basic)}
                        </strong>
                      </div>

                      <Link
                        to={`${detailBasePath}/${template.id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const TemplateRealPreview = ({ template }) => {
  const previewId = getTemplateId(template);
  const previewData = buildPreviewData(template, previewId);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#f8fafc]">
      <div
        className="origin-top-left"
        style={{
          width: "1440px",
          transform: "scale(0.24)",
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
    ? "Creative Name"
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
      email: "tiaa@example.com",
    },
    portfolio_profile: {
      nama_lengkap: previewName,
      profesi: profession,
      email: "tiaa@example.com",
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

const StatBox = ({ value, label }) => {
  return (
    <div className="rounded-2xl bg-[#f8fafc] px-4 py-3">
      <strong className="block text-xl font-black tracking-[-0.04em] text-[#111827]">
        {value}
      </strong>

      <span className="mt-1 block text-xs font-bold text-[#64748b]">
        {label}
      </span>
    </div>
  );
};

const PriceRow = ({ label, price, active = false }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${
        active
          ? "bg-[#eff6ff] text-[#2563eb]"
          : "bg-[#f8fafc] text-[#64748b]"
      }`}
    >
      <span className="font-black">{label}</span>

      <strong className="font-black text-[#111827]">
        {formatRupiah(price)}
      </strong>
    </div>
  );
};

const formatRupiah = (value) => {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
};

export default TemplatesPage;
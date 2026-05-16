import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { buildPortfolioData } from "../../utils/portfolioDataMapper";
import { showErrorAlert }from "../../utils/sweetAlert";

import DeveloperSparkTemplate from "../../components/portfolio-templates/DeveloperSparkTemplate";
import CreativeEditorialTemplate from "../../components/portfolio-templates/CreativeEditorialTemplate";
import MinimalProfessionalTemplate from "../../components/portfolio-templates/MinimalProfessionalTemplate";

const UserPortfolioPreviewPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(`/user/orders/${id}`);

      setOrder(response.data?.data || response.data);
      setMessage(response.data?.message || "");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Gagal mengambil data preview portfolio.";

      setMessage(errorMessage);

      await showErrorAlert("Gagal Memuat Preview", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const finalData = useMemo(() => {
    if (!order) return null;
    return buildPortfolioData(order);
  }, [order]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="h-[340px] animate-pulse rounded-[34px] bg-white shadow-sm" />
          <div className="mt-6 h-[620px] animate-pulse rounded-[34px] bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (!order || !finalData) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <section className="rounded-[30px] border border-red-200 bg-red-50 p-7 text-red-600 shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em]">
              Preview Error
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em]">
              Data preview tidak ditemukan.
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7">
              {message ||
                "Data order atau data portfolio belum tersedia untuk ditampilkan."}
            </p>

            <Link
              to="/user/orders"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-black text-white transition hover:bg-red-700"
            >
              Kembali ke Order Saya
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const orderStatus = normalizeStatus(order.status_pesanan);
  const paymentStatus = normalizeStatus(
    order.status_pembayaran || order.payment?.status
  );

  const canPreview =
    paymentStatus === "lunas" &&
    (orderStatus === "diproses" || orderStatus === "selesai");

  const portfolioFinalUrl = getPortfolioFinalUrl(order);

  if (!canPreview || orderStatus === "ditolak") {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <section className="overflow-hidden rounded-[34px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                  Preview Belum Tersedia
                </p>

                <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em]">
                  Portfolio belum bisa dipreview.
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                  Preview portfolio hanya bisa dilihat setelah pembayaran lunas
                  dan order sedang diproses oleh admin.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to={`/user/orders/${order.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition hover:bg-[#1d4ed8]"
                  >
                    Kembali ke Detail Order
                  </Link>

                  <Link
                    to="/user/orders"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                  >
                    Order Saya
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <HeroInfo label="Kode Order" value={order.kode_order || `ORDER-${id}`} />
                  <HeroInfo label="Template" value={finalData.templateName} />
                  <HeroInfo label="Pembayaran" value={formatStatus(paymentStatus)} />
                  <HeroInfo label="Pesanan" value={formatStatus(orderStatus)} />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[30px] border border-[#fed7aa] bg-[#fff7ed] p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#111827]">
              Kenapa belum muncul?
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#64748b]">
              Status pembayaran saat ini adalah{" "}
              <strong className="text-[#f97316]">
                {formatStatus(paymentStatus)}
              </strong>{" "}
              dan status pesanan adalah{" "}
              <strong className="text-[#f97316]">
                {formatStatus(orderStatus)}
              </strong>
              . Preview akan aktif jika pembayaran sudah lunas dan pesanan
              sedang diproses atau sudah selesai.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <section className="mx-auto w-full max-w-[1180px] px-4 py-8 md:py-10">
        <div className="overflow-hidden rounded-[34px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                User Preview
              </p>

              <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em]">
                Preview Portfolio Kamu.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Ini adalah tampilan sementara portfolio kamu berdasarkan data
                order. Jika ada bagian yang belum sesuai, admin bisa
                menyesuaikan saat proses final.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/user/orders/${id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition hover:bg-[#1d4ed8]"
                >
                  Kembali ke Detail Order
                </Link>

                <Link
                  to="/user/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Order Saya
                </Link>

                {portfolioFinalUrl && (
                  <a
                    href={portfolioFinalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/15 px-6 text-sm font-black text-emerald-100 transition hover:bg-emerald-400/20"
                  >
                    Buka Portfolio Final
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroInfo label="Template" value={finalData.templateName} />
                <HeroInfo label="Paket" value={formatPackage(finalData.paket)} />
                <HeroInfo label="Pembayaran" value={formatStatus(paymentStatus)} />
                <HeroInfo label="Pesanan" value={formatStatus(orderStatus)} />
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold text-[#2563eb]">
            {message}
          </div>
        )}
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto w-full max-w-[1320px] rounded-[38px] bg-[#0f172a] px-2 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:px-4">
          <PortfolioTemplate data={finalData} />
        </div>
      </section>
    </main>
  );
};

const PortfolioTemplate = ({ data }) => {
  const templateNumber = Number(data.templateId || 1);

  if (templateNumber === 1) {
    return <DeveloperSparkTemplate data={data} />;
  }

  if (templateNumber === 2) {
    return <CreativeEditorialTemplate data={data} />;
  }

  if (templateNumber === 3) {
    return <MinimalProfessionalTemplate data={data} />;
  }

  return <DeveloperSparkTemplate data={data} />;
};

const HeroInfo = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>

      <strong className="mt-1 block break-words text-sm text-white">
        {value || "-"}
      </strong>
    </div>
  );
};

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
};

const formatStatus = (status) => {
  const normalized = normalizeStatus(status);

  const labels = {
    pending: "Pending",
    belum_bayar: "Belum Bayar",
    menunggu_verifikasi: "Menunggu Verifikasi",
    lunas: "Lunas",
    ditolak: "Ditolak",
    diproses: "Diproses",
    selesai: "Selesai",
  };

  return labels[normalized] || status || "-";
};

const formatPackage = (paket) => {
  if (!paket) return "-";
  return String(paket).charAt(0).toUpperCase() + String(paket).slice(1);
};

const getPortfolioFinalUrl = (order) => {
  const link = order?.portfolio_link || order?.portfolioLink;

  if (!link) return "";

  if (!link.is_active && !link.url_final && !link.slug) {
    return "";
  }

  if (link.slug) {
    return `/portfolio/${link.slug}`;
  }

  const rawUrl = link.url_final || link.public_url || link.url || "";

  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);
    const slug = url.pathname.replace("/portfolio/", "").replace("/", "");

    return slug ? `/portfolio/${slug}` : rawUrl;
  } catch {
    if (rawUrl.includes("/portfolio/")) {
      const slug = rawUrl.split("/portfolio/")[1];
      return slug ? `/portfolio/${slug}` : "";
    }

    return rawUrl;
  }
};

export default UserPortfolioPreviewPage;
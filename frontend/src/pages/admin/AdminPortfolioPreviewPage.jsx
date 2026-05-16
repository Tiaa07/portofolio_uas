import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { buildPortfolioData } from "../../utils/portfolioDataMapper";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/sweetAlert";

import DeveloperSparkTemplate from "../../components/portfolio-templates/DeveloperSparkTemplate";
import CreativeEditorialTemplate from "../../components/portfolio-templates/CreativeEditorialTemplate";
import MinimalProfessionalTemplate from "../../components/portfolio-templates/MinimalProfessionalTemplate";

const AdminPortfolioPreviewPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(`/admin/orders/${id}`);

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

  const handleActivatePortfolioLink = async () => {
    const confirmActivate = await showConfirmAlert({
      title: "Selesaikan order?",
      text: "Order akan ditandai selesai dan link portfolio final akan diaktifkan.",
      confirmButtonText: "Ya, selesaikan",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmActivate.isConfirmed) return;

    try {
      setActionLoading(true);
      setMessage("");

      const response = await axiosInstance.patch(
        `/admin/orders/${id}/activate-portfolio-link`
      );

      const successMessage =
        response.data?.message ||
        "Order berhasil diselesaikan dan link portfolio final berhasil diaktifkan.";

      setMessage(successMessage);

      await showSuccessAlert("Portfolio Final Aktif", successMessage);

      await fetchOrder();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Gagal menyelesaikan order dan mengaktifkan link portfolio.";

      setMessage(errorMessage);

      await showErrorAlert("Gagal Mengaktifkan Portfolio", errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="h-[340px] animate-pulse rounded-[34px] bg-white shadow-sm" />
          <div className="mt-6 h-[760px] animate-pulse rounded-[34px] bg-white shadow-sm" />
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
              to="/admin/orders"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-black text-white transition hover:bg-red-700"
            >
              Kembali ke Order Masuk
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const paymentStatus = normalizeStatus(
    order.status_pembayaran || order.payment?.status
  );

  const orderStatus = normalizeStatus(order.status_pesanan);

  const canEdit = paymentStatus === "lunas" && orderStatus === "diproses";

  const canActivatePortfolioLink =
    paymentStatus === "lunas" && orderStatus === "diproses";

  const portfolioFinalUrl = getPortfolioFinalUrl(order);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <section className="mx-auto w-full max-w-[1180px] px-4 py-8 md:py-10">
        <div className="overflow-hidden rounded-[38px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Admin Preview
              </p>

              <h1 className="mt-4 text-[clamp(36px,5vw,68px)] font-black leading-[1] tracking-[-0.06em]">
                Preview portfolio.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Cek tampilan akhir portfolio sebelum order diselesaikan. Kalau
                masih ada data yang perlu dirapikan, kembali ke halaman edit.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/admin/orders/${id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Detail Order
                </Link>

                <Link
                  to={`/admin/orders/${id}/edit-portfolio`}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-black transition ${
                    canEdit
                      ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                      : "cursor-not-allowed border border-white/10 bg-white/10 text-white/50"
                  }`}
                  onClick={(event) => {
                    if (!canEdit) event.preventDefault();
                  }}
                >
                  Edit Data Lagi
                </Link>

                {canActivatePortfolioLink && (
                  <button
                    type="button"
                    onClick={handleActivatePortfolioLink}
                    disabled={actionLoading}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {actionLoading ? "Memproses..." : "Selesaikan Order"}
                  </button>
                )}

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

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroBox label="Kode Order" value={order.kode_order || `ORDER-${id}`} />
                <HeroBox label="Template" value={finalData.templateName} />
                <HeroBox label="Paket" value={formatPackage(finalData.paket)} />
                <HeroBox label="Pembayaran" value={formatStatus(paymentStatus)} />
                <HeroBox label="Pesanan" value={formatStatus(orderStatus)} />
                <HeroBox label="User" value={order.user?.name || order.user?.email || "-"} />
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold leading-7 text-[#2563eb]">
            {message}
          </div>
        )}

        {orderStatus !== "diproses" && orderStatus !== "selesai" && (
          <div className="mt-6 rounded-[28px] border border-[#fed7aa] bg-[#fff7ed] p-5 text-[#f97316]">
            <p className="text-sm font-black uppercase tracking-[0.16em]">
              Preview Mode
            </p>

            <p className="mt-2 text-sm font-semibold leading-7">
              Preview bisa ditampilkan, tapi tombol edit/finalisasi idealnya
              digunakan saat pembayaran sudah <strong>lunas</strong> dan order
              berstatus <strong>diproses</strong>.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={paymentStatus}>
                Pembayaran: {formatStatus(paymentStatus)}
              </StatusBadge>

              <StatusBadge status={orderStatus}>
                Pesanan: {formatStatus(orderStatus)}
              </StatusBadge>
            </div>
          </div>
        )}

        {orderStatus === "selesai" && portfolioFinalUrl && (
          <div className="mt-6 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-600">
            <p className="text-sm font-black uppercase tracking-[0.16em]">
              Portfolio Sudah Aktif
            </p>

            <p className="mt-2 break-all text-sm font-semibold leading-7">
              Link final: {portfolioFinalUrl}
            </p>
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

const HeroBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>

      <strong className="mt-2 block break-words text-sm font-black leading-6 text-white">
        {value || "-"}
      </strong>
    </div>
  );
};

const StatusBadge = ({ status, children }) => {
  const statusData = getStatusData(status);

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-black ${statusData.className}`}
    >
      {children}
    </span>
  );
};

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
};

const getStatusData = (status) => {
  const normalized = normalizeStatus(status);

  const statusMap = {
    pending: {
      label: "Pending",
      className: "bg-[#fff7ed] text-[#f97316]",
    },
    belum_bayar: {
      label: "Belum Bayar",
      className: "bg-[#fff7ed] text-[#f97316]",
    },
    menunggu_verifikasi: {
      label: "Verifikasi",
      className: "bg-[#eff6ff] text-[#2563eb]",
    },
    lunas: {
      label: "Lunas",
      className: "bg-emerald-50 text-emerald-600",
    },
    diproses: {
      label: "Diproses",
      className: "bg-[#f8fafc] text-[#0f172a]",
    },
    selesai: {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-600",
    },
    ditolak: {
      label: "Ditolak",
      className: "bg-red-50 text-red-600",
    },
  };

  return (
    statusMap[normalized] || {
      label: status || "-",
      className: "bg-[#f8fafc] text-[#64748b]",
    }
  );
};

const formatStatus = (status) => {
  return getStatusData(status).label;
};

const formatPackage = (paket) => {
  if (!paket) return "-";
  return String(paket).charAt(0).toUpperCase() + String(paket).slice(1);
};

const getPortfolioFinalUrl = (order) => {
  const link = order?.portfolio_link || order?.portfolioLink;

  if (!link) return "";

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

export default AdminPortfolioPreviewPage;
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showErrorAlert } from "../../utils/sweetAlert";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get("/user/orders");
      const data = normalizeArrayResponse(response.data);

      setOrders(data);
      setMessage(response.data?.message || "");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil data order.";

      setMessage(errorMessage);

      await showErrorAlert("Gagal Memuat Order", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      verifikasi: orders.filter(
        (order) => getPaymentStatus(order) === "menunggu_verifikasi"
      ).length,
      lunas: orders.filter((order) => getPaymentStatus(order) === "lunas")
        .length,
      diproses: orders.filter((order) => getOrderStatus(order) === "diproses")
        .length,
      selesai: orders.filter((order) => getOrderStatus(order) === "selesai")
        .length,
      ditolak: orders.filter(
        (order) =>
          getOrderStatus(order) === "ditolak" ||
          getPaymentStatus(order) === "ditolak"
      ).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filter !== "semua") {
      result = result.filter((order) => {
        const orderStatus = getOrderStatus(order);
        const paymentStatus = getPaymentStatus(order);

        if (filter === "verifikasi") {
          return paymentStatus === "menunggu_verifikasi";
        }

        if (filter === "lunas") {
          return paymentStatus === "lunas";
        }

        if (filter === "diproses") {
          return orderStatus === "diproses";
        }

        if (filter === "selesai") {
          return orderStatus === "selesai";
        }

        if (filter === "ditolak") {
          return orderStatus === "ditolak" || paymentStatus === "ditolak";
        }

        return true;
      });
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((order) => {
        return (
          getTemplateName(order).toLowerCase().includes(keyword) ||
          String(order.kode_order || "").toLowerCase().includes(keyword) ||
          String(order.paket || "").toLowerCase().includes(keyword) ||
          getOrderStatus(order).toLowerCase().includes(keyword) ||
          getPaymentStatus(order).toLowerCase().includes(keyword)
        );
      });
    }

    return result.sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }, [orders, search, filter]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="overflow-hidden rounded-[34px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                My Orders
              </p>

              <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em]">
                Order Portfolio Saya.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Pantau status pembayaran, proses pengerjaan, catatan admin, dan
                akses link portfolio final jika sudah aktif.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/user/templates"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition hover:bg-[#1d4ed8]"
                >
                  Pilih Template
                </Link>

                <Link
                  to="/user/dashboard"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroStat label="Total Order" value={stats.total} />
                <HeroStat label="Verifikasi" value={stats.verifikasi} />
                <HeroStat label="Lunas" value={stats.lunas} />
                <HeroStat label="Selesai" value={stats.selesai} />
              </div>
            </div>
          </div>
        </section>

        {message && !loading && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold text-[#2563eb]">
            {message}
          </div>
        )}

        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Order"
            value={stats.total}
            desc="Semua order portfolio"
            color="blue"
          />

          <StatCard
            title="Verifikasi"
            value={stats.verifikasi}
            desc="Pembayaran menunggu dicek admin"
            color="orange"
          />

          <StatCard
            title="Lunas"
            value={stats.lunas}
            desc="Pembayaran sudah disetujui"
            color="green"
          />

          <StatCard
            title="Diproses"
            value={stats.diproses}
            desc="Portfolio sedang dikerjakan"
            color="dark"
          />
        </section>

        <section className="mt-6 rounded-[30px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                Filter Order
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                Cari dan cek status order.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_0.75fr]">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kode order, template, paket..."
                className="min-h-11 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
              />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="min-h-11 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-black text-[#111827] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
              >
                <option value="semua">Semua Status</option>
                <option value="verifikasi">Verifikasi</option>
                <option value="lunas">Lunas</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>
        </section>

        {loading && (
          <section className="mt-6 grid gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[250px] animate-pulse rounded-[30px] border border-[#e5e7eb] bg-white shadow-sm"
              />
            ))}
          </section>
        )}

        {!loading && orders.length === 0 && (
          <section className="mt-6 rounded-[32px] border border-dashed border-[#cbd5e1] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eff6ff] text-2xl font-black text-[#2563eb]">
              BP
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em]">
              Belum ada order.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#64748b] md:text-base">
              Kamu belum memiliki order portfolio. Pilih template terlebih
              dahulu untuk mulai membuat portfolio.
            </p>

            <Link
              to="/user/templates"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
            >
              Lihat Template
            </Link>
          </section>
        )}

        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <section className="mt-6 rounded-[32px] border border-[#e5e7eb] bg-white p-8 text-center shadow-sm">
            <h2 className="text-3xl font-black tracking-[-0.04em]">
              Order tidak ditemukan.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#64748b]">
              Coba gunakan kata kunci lain atau ubah filter status.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("semua");
              }}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
            >
              Reset Filter
            </button>
          </section>
        )}

        {!loading && filteredOrders.length > 0 && (
          <section className="mt-6 grid gap-5">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

const OrderCard = ({ order }) => {
  const orderStatus = getOrderStatus(order);
  const paymentStatus = getPaymentStatus(order);
  const displayStatus = getDisplayStatus(order);
  const progress = getProgressByOrder(order);
  const portfolioFinalUrl = getPortfolioFinalUrl(order);
  const canUploadAgain =
    paymentStatus === "ditolak" && orderStatus !== "ditolak";
  const canOpenPortfolio = Boolean(portfolioFinalUrl);

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
      <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
        <div className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                {order.kode_order || `ORDER-${order.id}`}
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] md:text-3xl">
                {getTemplateName(order)}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#64748b]">
                Dibuat pada {formatDate(order.created_at)} • Paket{" "}
                <strong className="text-[#111827]">
                  {formatPackage(order.paket)}
                </strong>
              </p>
            </div>

            <StatusBadge status={displayStatus} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoBox label="Harga Paket" value={formatRupiah(order.harga_paket)} />
            <InfoBox label="Pembayaran" value={formatStatus(paymentStatus)} />
            <InfoBox label="Pesanan" value={formatStatus(orderStatus)} />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">
              <span>Progress Order</span>
              <span>{progress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[#2563eb]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {order.catatan_admin && (
            <div className="mt-5 rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-4">
              <strong className="block text-sm font-black text-[#111827]">
                Catatan Admin
              </strong>

              <span className="mt-1 block text-sm leading-7 text-[#64748b]">
                {order.catatan_admin}
              </span>
            </div>
          )}

          {paymentStatus === "ditolak" && getPaymentRejectReason(order) && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <strong className="block text-sm font-black text-red-600">
                Alasan Pembayaran Ditolak
              </strong>

              <span className="mt-1 block text-sm leading-7 text-red-500">
                {getPaymentRejectReason(order)}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[#e5e7eb] bg-[#f8fafc] p-6 lg:border-l lg:border-t-0">
          <div className="grid h-full content-between gap-5">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Action
              </p>

              <div className="mt-4 grid gap-3">
                <Link
                  to={`/user/orders/${order.id}`}
                  className="flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
                >
                  Detail Order
                </Link>

                {canUploadAgain && (
                  <Link
                    to={`/user/orders/${order.id}/upload-payment-proof`}
                    className="flex min-h-12 items-center justify-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-5 text-center text-sm font-black text-[#f97316] transition hover:bg-[#ffedd5]"
                  >
                    Upload Ulang Bukti
                  </Link>
                )}

                {canOpenPortfolio && (
                  <a
                    href={portfolioFinalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 text-center text-sm font-black text-emerald-600 transition hover:bg-emerald-100"
                  >
                    Buka Portfolio
                  </a>
                )}

                {(orderStatus === "diproses" || orderStatus === "selesai") && (
                  <Link
                    to={`/user/orders/${order.id}/preview-portfolio`}
                    className="flex min-h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-center text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
                  >
                    Preview Portfolio
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Status Ringkas
              </span>

              <p className="mt-2 text-sm font-bold leading-6 text-[#64748b]">
                {getShortStatusText(order)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const HeroStat = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-4">
      <strong className="block text-3xl font-black tracking-[-0.04em]">
        {value}
      </strong>

      <span className="mt-1 block text-xs font-bold text-white/60">
        {label}
      </span>
    </div>
  );
};

const StatCard = ({ title, value, desc, color }) => {
  const colorMap = {
    blue: "bg-[#eff6ff] text-[#2563eb]",
    orange: "bg-[#fff7ed] text-[#f97316]",
    dark: "bg-[#f8fafc] text-[#0f172a]",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <article className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div
        className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl text-lg font-black ${
          colorMap[color] || colorMap.blue
        }`}
      >
        {value}
      </div>

      <h3 className="text-lg font-black text-[#111827]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#64748b]">{desc}</p>
    </article>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-[#f8fafc] px-4 py-3">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
        {label}
      </span>

      <strong className="mt-1 block text-sm text-[#111827]">{value}</strong>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusData = getStatusData(status);

  return (
    <span
      className={`inline-flex w-max items-center rounded-full px-4 py-2 text-xs font-black ${statusData.className}`}
    >
      {statusData.label}
    </span>
  );
};

const normalizeArrayResponse = (responseData) => {
  const data = responseData?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(responseData)) return responseData;

  return [];
};

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
};

const getPaymentStatus = (order) => {
  return normalizeStatus(
    order?.status_pembayaran ||
      order?.payment?.status ||
      order?.pembayaran?.status ||
      "menunggu_verifikasi"
  );
};

const getOrderStatus = (order) => {
  return normalizeStatus(order?.status_pesanan || "pending");
};

const getDisplayStatus = (order) => {
  const orderStatus = getOrderStatus(order);
  const paymentStatus = getPaymentStatus(order);

  if (orderStatus === "selesai") return "selesai";
  if (orderStatus === "diproses") return "diproses";
  if (orderStatus === "ditolak") return "ditolak";

  if (paymentStatus === "lunas") return "lunas";
  if (paymentStatus === "ditolak") return "pembayaran_ditolak";
  if (paymentStatus === "belum_bayar") return "belum_bayar";
  if (paymentStatus === "menunggu_verifikasi") return "menunggu_verifikasi";

  return "pending";
};

const getProgressByOrder = (order) => {
  const orderStatus = getOrderStatus(order);
  const paymentStatus = getPaymentStatus(order);

  if (orderStatus === "selesai") return 100;
  if (orderStatus === "diproses") return 80;
  if (orderStatus === "ditolak") return 35;

  if (paymentStatus === "lunas") return 60;
  if (paymentStatus === "menunggu_verifikasi") return 40;
  if (paymentStatus === "ditolak") return 30;
  if (paymentStatus === "belum_bayar") return 20;

  return 20;
};

const getStatusData = (status) => {
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
    pembayaran_ditolak: {
      label: "Pembayaran Ditolak",
      className: "bg-red-50 text-red-600",
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
    statusMap[status] || {
      label: status || "Pending",
      className: "bg-[#f8fafc] text-[#64748b]",
    }
  );
};

const formatStatus = (status) => {
  return getStatusData(status).label;
};

const getTemplateName = (order) => {
  return (
    order?.template?.nama_template ||
    order?.template_name ||
    order?.nama_template ||
    "Template Portfolio"
  );
};

const formatPackage = (paket) => {
  if (!paket) return "-";
  return String(paket).charAt(0).toUpperCase() + String(paket).slice(1);
};

const getPaymentRejectReason = (order) => {
  return (
    order?.payment?.alasan_penolakan ||
    order?.pembayaran?.alasan_penolakan ||
    order?.alasan_penolakan ||
    ""
  );
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

const getShortStatusText = (order) => {
  const orderStatus = getOrderStatus(order);
  const paymentStatus = getPaymentStatus(order);

  if (orderStatus === "selesai") {
    return "Portfolio sudah selesai. Link final dapat dibuka jika sudah aktif.";
  }

  if (orderStatus === "diproses") {
    return "Pembayaran sudah aman dan portfolio sedang diproses admin.";
  }

  if (orderStatus === "ditolak") {
    return "Order ditolak. Cek catatan admin untuk mengetahui alasannya.";
  }

  if (paymentStatus === "lunas") {
    return "Pembayaran sudah lunas. Menunggu admin memproses portfolio.";
  }

  if (paymentStatus === "ditolak") {
    return "Pembayaran ditolak. Upload ulang bukti pembayaran yang benar.";
  }

  if (paymentStatus === "menunggu_verifikasi") {
    return "Bukti pembayaran sudah dikirim dan sedang menunggu verifikasi admin.";
  }

  return "Order sudah dibuat dan sedang menunggu proses berikutnya.";
};

const formatRupiah = (value) => {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default UserOrdersPage;
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showErrorAlert } from "../../utils/sweetAlert";

const AdminOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getFiltersFromParams = () => ({
    search: searchParams.get("search") || "",
    status_pesanan: searchParams.get("status_pesanan") || "",
    status_pembayaran: searchParams.get("status_pembayaran") || "",
    paket: searchParams.get("paket") || "",
  });

  const [filters, setFilters] = useState(getFiltersFromParams);
  const [appliedFilters, setAppliedFilters] = useState(getFiltersFromParams);
 
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get("/admin/orders");
      const payload = response.data?.data || response.data || [];

      const normalizedOrders = Array.isArray(payload)
        ? payload
        : payload.data || [];

      setOrders(normalizedOrders);
      setMessage(response.data?.message || "");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil data order masuk.";

      setMessage(errorMessage);
      await showErrorAlert("Gagal Memuat Order", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const nextFilters = {
      search: searchParams.get("search") || "",
      status_pesanan: searchParams.get("status_pesanan") || "",
      status_pembayaran: searchParams.get("status_pembayaran") || "",
      paket: searchParams.get("paket") || "",
    };

    setFilters(nextFilters);
      setAppliedFilters(nextFilters);
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = appliedFilters.search.toLowerCase().trim();

      const searchableText = [
        order.kode_order,
        order.user?.name,
        order.user?.email,
        getTemplateName(order),
        order.paket,
        getOrderStatus(order),
        getPaymentStatus(order),
        order.payment?.nama_pengirim,
        order.payment?.metode_pembayaran,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch = searchText
        ? searchableText.includes(searchText)
        : true;

      const matchStatusPesanan = appliedFilters.status_pesanan
        ? getOrderStatus(order) === appliedFilters.status_pesanan
        : true;

      const matchStatusPembayaran = appliedFilters.status_pembayaran
        ? getPaymentStatus(order) === appliedFilters.status_pembayaran
        : true;

      const matchPaket = appliedFilters.paket
        ? normalizeText(order.paket) === appliedFilters.paket
        : true;

      return (
        matchSearch &&
        matchStatusPesanan &&
        matchStatusPembayaran &&
        matchPaket
      );
    });
  }, [orders, appliedFilters]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0);
      const dateB = new Date(b.updated_at || b.created_at || 0);

      return dateB - dateA;
    });
  }, [filteredOrders]);

  const summary = useMemo(() => {
    return {
      total: orders.length,
      filtered: filteredOrders.length,
      menungguVerifikasi: orders.filter(
        (order) => getPaymentStatus(order) === "menunggu_verifikasi"
      ).length,
      lunas: orders.filter((order) => getPaymentStatus(order) === "lunas")
        .length,
      pembayaranDitolak: orders.filter(
        (order) => getPaymentStatus(order) === "ditolak"
      ).length,
      pending: orders.filter((order) => getOrderStatus(order) === "pending")
        .length,
      diproses: orders.filter((order) => getOrderStatus(order) === "diproses")
        .length,
      selesai: orders.filter((order) => getOrderStatus(order) === "selesai")
        .length,
      ditolak: orders.filter((order) => getOrderStatus(order) === "ditolak")
        .length,
    };
  }, [orders, filteredOrders]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilter = (event) => {
    event.preventDefault();

    const nextParams = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        nextParams[key] = value;
      }
    });

    setAppliedFilters(filters);
    setSearchParams(nextParams);
  };

  const handleResetFilter = () => {
    const emptyFilters = {
      search: "",
      status_pesanan: "",
      status_pembayaran: "",
      paket: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearchParams({});
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="overflow-hidden rounded-[38px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Admin Orders
              </p>

              <h1 className="mt-4 text-[clamp(36px,5vw,68px)] font-black leading-[1] tracking-[-0.06em]">
                Kelola order masuk.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Cek semua order user, pantau status pembayaran, lihat paket
                yang dipilih, dan lanjutkan proses verifikasi sampai portfolio
                final selesai.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <QuickFilterLink to="/admin/orders" label="Semua Order" />
                <QuickFilterLink
                  to="/admin/orders?status_pembayaran=menunggu_verifikasi"
                  label="Perlu Verifikasi"
                />
                <QuickFilterLink
                  to="/admin/orders?status_pesanan=diproses"
                  label="Diproses"
                />
                <QuickFilterLink
                  to="/admin/orders?status_pesanan=selesai"
                  label="Selesai"
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroBox label="Total Order" value={summary.total} />
                <HeroBox label="Hasil Filter" value={summary.filtered} />
                <HeroBox
                  label="Perlu Verifikasi"
                  value={summary.menungguVerifikasi}
                />
                <HeroBox label="Selesai" value={summary.selesai} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <SummaryCard label="Total Order" value={summary.total} color="dark" />
          <SummaryCard
            label="Hasil Filter"
            value={summary.filtered}
            color="blue"
          />
          <SummaryCard
            label="Verifikasi"
            value={summary.menungguVerifikasi}
            color="orange"
          />
          <SummaryCard label="Diproses" value={summary.diproses} color="blue" />
          <SummaryCard label="Selesai" value={summary.selesai} color="green" />
        </section>

        <section className="mt-6 rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                Filter Order
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                Cari dan saring data.
              </h2>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-5 text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memuat..." : "Refresh Data"}
            </button>
          </div>

          <form onSubmit={handleApplyFilter}>
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <FormField label="Cari Order">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Kode order, user, email, template, paket..."
                  className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
                />
              </FormField>

              <FormField label="Status Pesanan">
                <select
                  name="status_pesanan"
                  value={filters.status_pesanan}
                  onChange={handleFilterChange}
                  className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-black text-[#111827] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
                >
                  <option value="">Semua</option>
                  <option value="pending">Pending</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </FormField>

              <FormField label="Pembayaran">
                <select
                  name="status_pembayaran"
                  value={filters.status_pembayaran}
                  onChange={handleFilterChange}
                  className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-black text-[#111827] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
                >
                  <option value="">Semua</option>
                  <option value="menunggu_verifikasi">
                    Menunggu Verifikasi
                  </option>
                  <option value="lunas">Lunas</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </FormField>

              <FormField label="Paket">
                <select
                  name="paket"
                  value={filters.paket}
                  onChange={handleFilterChange}
                  className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-black text-[#111827] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
                >
                  <option value="">Semua</option>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </FormField>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
              >
                Terapkan Filter
              </button>

              <button
                type="button"
                onClick={handleResetFilter}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {loading && (
          <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-4 text-sm font-bold text-[#64748b]">
            Loading order masuk...
          </div>
        )}

        {!loading && message && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold text-[#2563eb]">
            {message}
          </div>
        )}

        {!loading && sortedOrders.length === 0 && (
          <section className="mt-6 rounded-[32px] border border-dashed border-[#cbd5e1] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black tracking-[-0.04em]">
              Order tidak ditemukan.
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#64748b]">
              Tidak ada order yang sesuai dengan filter yang dipilih. Coba reset
              filter atau refresh data.
            </p>
          </section>
        )}

        {!loading && sortedOrders.length > 0 && (
          <section className="mt-6 grid gap-5">
            {sortedOrders.map((order) => {
              const paymentStatus = getPaymentStatus(order);
              const orderStatus = getOrderStatus(order);
              const portfolioFinalUrl = getPortfolioFinalUrl(order);

              return (
                <article
                  key={order.id}
                  className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                          {order.kode_order || `ORDER-${order.id}`}
                        </p>

                        <StatusBadge status={orderStatus}>
                          Pesanan: {formatStatus(orderStatus)}
                        </StatusBadge>

                        <StatusBadge status={paymentStatus}>
                          Pembayaran: {formatStatus(paymentStatus)}
                        </StatusBadge>
                      </div>

                      <h2 className="mt-4 text-[clamp(26px,4vw,34px)] font-black leading-tight tracking-[-0.04em]">
                        {getTemplateName(order)}
                      </h2>

                      <p className="mt-2 text-sm font-semibold leading-7 text-[#64748b]">
                        Dibuat oleh{" "}
                        <strong className="text-[#111827]">
                          {order.user?.name || "User"}
                        </strong>{" "}
                        dengan paket{" "}
                        <strong className="text-[#2563eb]">
                          {formatPackage(order.paket)}
                        </strong>
                        .
                      </p>

                      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <InfoMini label="User" value={order.user?.name || "-"} />
                        <InfoMini
                          label="Email"
                          value={order.user?.email || "-"}
                        />
                        <InfoMini
                          label="Paket"
                          value={formatPackage(order.paket)}
                        />
                        <InfoMini
                          label="Tanggal Order"
                          value={formatDate(getOrderDate(order))}
                        />
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <InfoMini
                          label="Jumlah Pembayaran"
                          value={
                            getOrderRevenue(order)
                              ? formatRupiah(getOrderRevenue(order))
                              : "-"
                          }
                        />
                        <InfoMini
                          label="Tanggal Pembayaran"
                          value={formatDate(getPaymentDate(order))}
                        />
                        <InfoMini
                          label="Metode"
                          value={order.payment?.metode_pembayaran || "-"}
                        />
                        <InfoMini
                          label="Nama Pengirim"
                          value={order.payment?.nama_pengirim || "-"}
                        />
                      </div>

                      {order.catatan_admin && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-7 text-red-600">
                          <strong className="block">Catatan Admin:</strong>
                          <span className="mt-1 block">
                            {order.catatan_admin}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3 lg:min-w-[220px]">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white transition hover:bg-[#1d4ed8]"
                      >
                        Detail Order
                      </Link>

                      {paymentStatus === "menunggu_verifikasi" && (
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="flex min-h-11 items-center justify-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-5 text-center text-sm font-black text-[#f97316] transition hover:bg-[#ffedd5]"
                        >
                          Verifikasi Pembayaran
                        </Link>
                      )}

                      {(orderStatus === "diproses" ||
                        orderStatus === "selesai") && (
                        <Link
                          to={`/admin/orders/${order.id}/preview-portfolio`}
                          className="flex min-h-11 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-5 text-center text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe]"
                        >
                          Preview Portfolio
                        </Link>
                      )}

                      {orderStatus === "selesai" && portfolioFinalUrl && (
                        <a
                          href={portfolioFinalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-h-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 text-center text-sm font-black text-emerald-600 transition hover:bg-emerald-100"
                        >
                          Buka Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

const QuickFilterLink = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/15"
    >
      {label}
    </Link>
  );
};

const HeroBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>

      <strong className="mt-2 block break-words text-2xl font-black tracking-[-0.04em] text-white">
        {value}
      </strong>
    </div>
  );
};

const SummaryCard = ({ label, value, color = "blue" }) => {
  const colorMap = {
    blue: "bg-[#eff6ff] text-[#2563eb]",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-[#fff7ed] text-[#f97316]",
    red: "bg-red-50 text-red-600",
    dark: "bg-[#f8fafc] text-[#0f172a]",
  };

  return (
    <article className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div
        className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl text-lg font-black ${
          colorMap[color] || colorMap.blue
        }`}
      >
        {value}
      </div>

      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
        {label}
      </span>

      <strong className="mt-2 block text-3xl font-black tracking-[-0.05em] text-[#111827]">
        {value}
      </strong>
    </article>
  );
};

const FormField = ({ label, children }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label}
      </span>

      {children}
    </label>
  );
};

const InfoMini = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        {label}
      </span>

      <strong className="mt-2 block break-words text-sm text-[#111827]">
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

const normalizeText = (value) => {
  return String(value || "").toLowerCase().trim();
};

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
};

const getPaymentStatus = (order) => {
  return normalizeStatus(order?.status_pembayaran || order?.payment?.status);
};

const getOrderStatus = (order) => {
  return normalizeStatus(order?.status_pesanan || "pending");
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

const getTemplateName = (order) => {
  return (
    order?.template?.nama_template ||
    order?.template_name ||
    order?.nama_template ||
    "Template Portfolio"
  );
};

const formatRupiah = (value) => {
  const number = Number(value || 0);
  return `Rp${number.toLocaleString("id-ID")}`;
};

const getOrderRevenue = (order) => {
  return Number(
    order.payment?.jumlah_pembayaran ||
      order.jumlah_pembayaran ||
      order.total_harga ||
      order.harga_paket ||
      order.harga ||
      order.price ||
      0
  );
};

const getOrderDate = (order) => {
  const rawDate = order.created_at || order.tanggal_order || order.updated_at;
  return parseFlexibleDate(rawDate);
};

const getPaymentDate = (order) => {
  const rawDate =
    order.payment?.tanggal_pembayaran ||
    order.tanggal_pembayaran ||
    order.payment?.updated_at ||
    order.updated_at ||
    order.created_at;

  return parseFlexibleDate(rawDate);
};

const parseFlexibleDate = (rawDate) => {
  if (!rawDate) return null;

  const date = new Date(rawDate);

  if (!Number.isNaN(date.getTime())) {
    return date;
  }

  const value = String(rawDate).trim();

  if (value.includes("/")) {
    const [day, month, year] = value.split("/").map(Number);

    if (day && month && year) {
      const fallbackDate = new Date(year, month - 1, day);
      return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
    }
  }

  return null;
};

const formatDate = (date) => {
  if (!date) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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

export default AdminOrdersPage;
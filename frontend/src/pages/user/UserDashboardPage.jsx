import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showErrorAlert } from "../../utils/sweetAlert";

const UserDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = dashboard?.summary?.user || getStoredUser();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setMessage("");

      const dashboardResponse = await axiosInstance.get("/user/dashboard");
      const dashboardData = dashboardResponse.data?.data || null;

      setDashboard(dashboardData);

      const orderFromDashboard =
        dashboardData?.order_terbaru ||
        dashboardData?.orders ||
        dashboardData?.recent_orders ||
        [];

      const portfolioFromDashboard =
        dashboardData?.portfolio_terbaru ||
        dashboardData?.portfolios ||
        dashboardData?.recent_portfolios ||
        [];

      if (Array.isArray(orderFromDashboard)) {
        setOrders(orderFromDashboard);
      }

      if (Array.isArray(portfolioFromDashboard)) {
        setPortfolios(portfolioFromDashboard);
      }

      try {
        const ordersResponse = await axiosInstance.get("/user/orders");
        const ordersData = normalizeArrayResponse(ordersResponse.data);

        if (ordersData.length > 0) {
          setOrders(ordersData);
        }
      } catch {
        // Jika endpoint /user/orders bermasalah, dashboard tetap memakai data dari /user/dashboard.
      }
    } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Gagal mengambil data dashboard user.";

        setMessage(errorMessage);

        await showErrorAlert("Gagal Memuat Dashboard", errorMessage);
      } finally {
        setLoading(false);
      }
     };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const summaryOrders = dashboard?.summary?.orders;
    const summaryPayments = dashboard?.summary?.payments;
    const summaryPortfolios = dashboard?.summary?.portfolios;

    if (summaryOrders || summaryPayments || summaryPortfolios) {
      return {
        total:
          summaryOrders?.total_pesanan ??
          summaryOrders?.total_order ??
          orders.length,
        pending:
          summaryOrders?.pending ?? countByProcessStatus(orders, "pending"),
        diproses:
          summaryOrders?.diproses ?? countByProcessStatus(orders, "diproses"),
        selesai:
          summaryOrders?.selesai ?? countByProcessStatus(orders, "selesai"),
        ditolak:
          summaryOrders?.ditolak ?? countByProcessStatus(orders, "ditolak"),
        menungguVerifikasi:
          summaryPayments?.menunggu_verifikasi ??
          countByPaymentStatus(orders, "menunggu_verifikasi"),
        lunas: summaryPayments?.lunas ?? countByPaymentStatus(orders, "lunas"),
        pembayaranDitolak:
          summaryPayments?.ditolak ?? countByPaymentStatus(orders, "ditolak"),
        belumBayar:
          summaryPayments?.belum_bayar ??
          countByPaymentStatus(orders, "belum_bayar"),
        portfolioSelesai:
          summaryPortfolios?.total_portfolio_selesai ??
          countCompletedPortfolios(orders),
      };
    }

    return {
      total: orders.length,
      pending: countByProcessStatus(orders, "pending"),
      diproses: countByProcessStatus(orders, "diproses"),
      selesai: countByProcessStatus(orders, "selesai"),
      ditolak: countByProcessStatus(orders, "ditolak"),
      menungguVerifikasi: countByPaymentStatus(orders, "menunggu_verifikasi"),
      lunas: countByPaymentStatus(orders, "lunas"),
      pembayaranDitolak: countByPaymentStatus(orders, "ditolak"),
      belumBayar: countByPaymentStatus(orders, "belum_bayar"),
      portfolioSelesai: countCompletedPortfolios(orders),
    };
  }, [dashboard, orders]);

  const latestOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  const activeOrder = useMemo(() => {
    return (
      orders.find((order) => {
        const processStatus = getOrderProcessStatus(order);
        const paymentStatus = getOrderPaymentStatus(order);

        return (
          processStatus !== "selesai" &&
          processStatus !== "ditolak" &&
          ["pending", "diproses"].includes(processStatus) &&
          ["menunggu_verifikasi", "lunas", "belum_bayar"].includes(
            paymentStatus
          )
        );
      }) || null
    );
  }, [orders]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="relative overflow-hidden rounded-[38px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2563eb]/30 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#f97316]/25 blur-[90px]" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdba74] text-xs font-black text-[#0f172a]">
                  U
                </span>

                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                  User Dashboard
                </span>
              </div>

              <h1 className="mt-5 text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em]">
                Halo, {user?.name || "User"}.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Pantau order portfolio kamu, cek pembayaran, lihat progress
                pengerjaan, dan buka link portfolio final saat sudah aktif.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/user/templates"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full !bg-[#2563eb] px-6 text-sm font-black !text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition hover:!bg-[#1d4ed8] hover:!text-white focus:!bg-[#1d4ed8] focus:!text-white active:!bg-[#1e40af] active:!text-white"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[10px]">
                    T
                  </span>
                  <span>Pilih Template</span>
                </Link>

                <Link
                  to="/user/orders"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 !bg-white/10 px-6 text-sm font-black !text-white transition hover:!bg-white/15 hover:!text-white focus:!bg-white/15 focus:!text-white active:!bg-white/20 active:!text-white"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[10px]">
                    O
                  </span>
                  <span>Lihat Order Saya</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroStat icon="O" label="Total Order" value={stats.total} />
                <HeroStat icon="L" label="Pembayaran Lunas" value={stats.lunas} />
                <HeroStat icon="P" label="Diproses" value={stats.diproses} />
                <HeroStat
                  icon="W"
                  label="Portfolio Aktif"
                  value={stats.portfolioSelesai}
                />
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-7 text-red-600">
            {message}
          </div>
        )}

        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="V"
            title="Verifikasi"
            value={stats.menungguVerifikasi}
            desc="Pembayaran menunggu dicek admin"
            color="blue"
          />

          <StatCard
            icon="L"
            title="Lunas"
            value={stats.lunas}
            desc="Pembayaran sudah disetujui"
            color="green"
          />

          <StatCard
            icon="P"
            title="Diproses"
            value={stats.diproses}
            desc="Portfolio sedang dikerjakan"
            color="dark"
          />

          <StatCard
            icon="S"
            title="Selesai"
            value={stats.selesai}
            desc="Portfolio final sudah aktif"
            color="orange"
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                  Progress
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                  Order aktif
                </h2>
              </div>

              <Link
                to="/user/templates"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full !bg-[#eff6ff] px-4 text-xs font-black !text-[#2563eb] transition hover:!bg-[#dbeafe] hover:!text-[#1d4ed8]"
              >
                <span>＋</span>
                <span>Buat Baru</span>
              </Link>
            </div>

            {loading ? (
              <LoadingBox />
            ) : activeOrder ? (
              <ActiveOrderCard order={activeOrder} />
            ) : (
              <EmptyState
                icon="BP"
                title="Belum ada order aktif."
                desc="Mulai dengan memilih template portfolio yang sesuai kebutuhan kamu."
                actionText="Pilih Template"
                actionTo="/user/templates"
              />
            )}
          </div>

          <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                  Recent Orders
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                  Order terbaru
                </h2>
              </div>

              <Link
                to="/user/orders"
                className="inline-flex min-h-10 items-center justify-center rounded-full !bg-[#f8fafc] px-4 text-xs font-black !text-[#111827] transition hover:!bg-[#eff6ff] hover:!text-[#2563eb]"
              >
                Semua
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-2xl bg-[#f1f5f9]"
                  />
                ))}
              </div>
            ) : latestOrders.length > 0 ? (
              <div className="grid gap-3">
                {latestOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="ORD"
                title="Belum ada order."
                desc="Order yang kamu buat nanti akan tampil di sini."
                actionText="Lihat Template"
                actionTo="/user/templates"
              />
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          <QuickAction
            icon="T"
            title="Pilih Template"
            desc="Lihat katalog template yang tersedia dan mulai buat portfolio."
            to="/user/templates"
            button="Buka Template"
          />

          <QuickAction
            icon="O"
            title="Cek Order"
            desc="Pantau status pembayaran, proses admin, dan link final."
            to="/user/orders"
            button="Lihat Order"
          />

          <QuickAction
            icon="W"
            title="Portfolio Saya"
            desc="Lihat portfolio yang sudah selesai dan link public yang aktif dari halaman order."
            to="/user/orders"
            button="Lihat Portfolio"
          />
        </section>

        {portfolios.length > 0 && (
          <section className="mt-6 rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                  Portfolio Aktif
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                  Portfolio terbaru kamu
                </h2>
              </div>

              <Link
                to="/user/orders"
                className="inline-flex min-h-11 items-center justify-center rounded-full !bg-[#eff6ff] px-5 text-sm font-black !text-[#2563eb] transition hover:!bg-[#dbeafe] hover:!text-[#1d4ed8]"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {portfolios.slice(0, 4).map((portfolio, index) => (
                <PortfolioRow
                  key={portfolio.id || portfolio.slug || index}
                  portfolio={portfolio}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

const ActiveOrderCard = ({ order }) => {
  const processStatus = getOrderProcessStatus(order);
  const paymentStatus = getOrderPaymentStatus(order);
  const displayStatus = getDisplayStatus(order);
  const progress = getProgressByOrder(order);
  const portfolioUrl = getPortfolioUrl(order);

  return (
    <div>
      <div className="rounded-[28px] bg-[#f8fafc] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black tracking-[-0.03em] text-[#111827]">
              {getTemplateName(order)}
            </h3>

            <p className="mt-2 text-sm leading-7 text-[#64748b]">
              Paket {getPackageName(order)} • Dibuat{" "}
              {formatDate(order.created_at)}
            </p>
          </div>

          <StatusBadge status={displayStatus} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoPill
            icon="PAY"
            label="Status Pembayaran"
            value={formatStatus(paymentStatus)}
          />

          <InfoPill
            icon="ORD"
            label="Status Pesanan"
            value={formatStatus(processStatus)}
          />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-[#2563eb]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <ProgressStep
            active={progress >= 20}
            icon="1"
            title="Order dibuat"
            desc="Data order portfolio berhasil masuk."
          />

          <ProgressStep
            active={paymentStatus === "menunggu_verifikasi" || progress >= 40}
            icon="2"
            title="Verifikasi pembayaran"
            desc="Admin mengecek bukti pembayaran yang kamu upload."
          />

          <ProgressStep
            active={paymentStatus === "lunas" || progress >= 60}
            icon="3"
            title="Pembayaran lunas"
            desc="Pembayaran sudah disetujui admin."
          />

          <ProgressStep
            active={processStatus === "diproses" || progress >= 80}
            icon="4"
            title="Diproses admin"
            desc="Admin memproses dan merapikan portfolio kamu."
          />

          <ProgressStep
            active={processStatus === "selesai" || progress >= 100}
            icon="5"
            title="Selesai"
            desc="Link portfolio final sudah aktif."
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/user/orders/${order.id}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full !bg-[#2563eb] px-6 text-sm font-black !text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:!bg-[#1d4ed8] hover:!text-white focus:!bg-[#1d4ed8] focus:!text-white active:!bg-[#1e40af] active:!text-white"
        >
          <span>Detail Order</span>
          <span>→</span>
        </Link>

        {processStatus === "selesai" && portfolioUrl && (
          <Link
            to={portfolioUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#e5e7eb] !bg-white px-6 text-sm font-black !text-[#111827] transition hover:!bg-[#f8fafc] hover:!text-[#2563eb]"
          >
            <span>Buka Portfolio</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
};

const OrderRow = ({ order }) => {
  const displayStatus = getDisplayStatus(order);

  return (
    <Link
      to={`/user/orders/${order.id}`}
      className="block rounded-[24px] border border-[#e5e7eb] !bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-black text-[#111827]">
            {getTemplateName(order)}
          </h3>

          <p className="mt-1 text-xs font-semibold leading-5 text-[#64748b]">
            Paket {getPackageName(order)} • {formatDate(order.created_at)}
          </p>

          <p className="mt-1 text-xs font-semibold leading-5 text-[#94a3b8]">
            Bayar: {formatStatus(getOrderPaymentStatus(order))} • Pesanan:{" "}
            {formatStatus(getOrderProcessStatus(order))}
          </p>
        </div>

        <StatusBadge status={displayStatus} />
      </div>
    </Link>
  );
};

const PortfolioRow = ({ portfolio }) => {
  const url = getPortfolioRowUrl(portfolio);

  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-[#f8fafc] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[#111827]">
            {portfolio?.order?.template?.nama_template ||
              portfolio?.template?.nama_template ||
              portfolio?.nama_template ||
              "Portfolio Final"}
          </h3>

          <p className="mt-1 text-xs font-semibold leading-5 text-[#64748b]">
            Aktif pada{" "}
            {formatDate(
              portfolio?.diaktifkan_pada ||
                portfolio?.activated_at ||
                portfolio?.created_at
            )}
          </p>
        </div>

        {url ? (
          <Link
            to={url}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full !bg-[#2563eb] px-4 text-xs font-black !text-white transition hover:!bg-[#1d4ed8] hover:!text-white"
          >
            <span>Buka</span>
            <span>→</span>
          </Link>
        ) : (
          <span className="rounded-full bg-[#e5e7eb] px-4 py-2 text-xs font-black text-[#64748b]">
            Link belum aktif
          </span>
        )}
      </div>
    </div>
  );
};

const ProgressStep = ({ active, icon, title, desc }) => {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-4">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${
          active ? "bg-[#2563eb] text-white" : "bg-[#e5e7eb] text-[#94a3b8]"
        }`}
      >
        {active ? "✓" : icon}
      </span>

      <div>
        <h4 className="text-sm font-black text-[#111827]">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-[#64748b]">{desc}</p>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, title, desc, to, button }) => {
  return (
    <article className="group rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eff6ff] text-lg font-black text-[#2563eb] transition group-hover:bg-[#2563eb] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black tracking-[-0.03em] text-[#111827]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#64748b]">{desc}</p>

      <Link
        to={to}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full !bg-[#f8fafc] px-5 text-sm font-black !text-[#111827] transition hover:!bg-[#eff6ff] hover:!text-[#2563eb] focus:!bg-[#eff6ff] focus:!text-[#2563eb] active:!bg-[#dbeafe] active:!text-[#1d4ed8]"
      >
        <span>{button}</span>
        <span>→</span>
      </Link>
    </article>
  );
};

const HeroStat = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-sm font-black">
          {icon}
        </span>

        <strong className="block text-3xl font-black tracking-[-0.04em]">
          {value}
        </strong>
      </div>

      <span className="mt-3 block text-xs font-bold text-white/60">
        {label}
      </span>
    </div>
  );
};

const StatCard = ({ icon, title, value, desc, color }) => {
  const colorMap = {
    blue: "bg-[#eff6ff] text-[#2563eb]",
    orange: "bg-[#fff7ed] text-[#f97316]",
    dark: "bg-[#f8fafc] text-[#0f172a]",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <article className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl text-lg font-black ${
            colorMap[color] || colorMap.blue
          }`}
        >
          {icon}
        </div>

        <strong className="text-4xl font-black tracking-[-0.06em] text-[#111827]">
          {value}
        </strong>
      </div>

      <h3 className="mt-5 text-lg font-black text-[#111827]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#64748b]">{desc}</p>
    </article>
  );
};

const StatusBadge = ({ status }) => {
  const statusData = getStatusData(status);

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-4 text-xs font-black ${statusData.className}`}
    >
      {statusData.label}
    </span>
  );
};

const InfoPill = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="grid h-6 min-w-8 place-items-center rounded-full bg-[#eff6ff] px-2 text-[9px] font-black text-[#2563eb]">
          {icon}
        </span>

        <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
          {label}
        </span>
      </div>

      <strong className="mt-2 block text-sm text-[#111827]">{value}</strong>
    </div>
  );
};

const EmptyState = ({ icon, title, desc, actionText, actionTo }) => {
  return (
    <div className="rounded-[28px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-7 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-sm font-black text-[#2563eb] shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-black tracking-[-0.03em] text-[#111827]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#64748b]">
        {desc}
      </p>

      <Link
        to={actionTo}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full !bg-[#2563eb] px-6 text-sm font-black !text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:!bg-[#1d4ed8] hover:!text-white"
      >
        {actionText}
      </Link>
    </div>
  );
};

const LoadingBox = () => {
  return (
    <div className="h-[420px] animate-pulse rounded-[28px] bg-[#f1f5f9]" />
  );
};

const normalizeArrayResponse = (responseData) => {
  const data = responseData?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(responseData)) return responseData;

  return [];
};

const getStoredUser = () => {
  const possibleKeys = ["user", "auth_user", "authUser"];

  for (const key of possibleKeys) {
    const raw = localStorage.getItem(key);

    if (!raw) continue;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return null;
};

const getOrderPaymentStatus = (order) => {
  return normalizeStatus(
    order?.status_pembayaran ||
      order?.payment?.status ||
      order?.pembayaran?.status ||
      "menunggu_verifikasi"
  );
};

const getOrderProcessStatus = (order) => {
  return normalizeStatus(order?.status_pesanan || "pending");
};

const getDisplayStatus = (order) => {
  const processStatus = getOrderProcessStatus(order);
  const paymentStatus = getOrderPaymentStatus(order);

  if (processStatus === "selesai") return "selesai";
  if (processStatus === "diproses") return "diproses";
  if (processStatus === "ditolak") return "ditolak";

  if (paymentStatus === "lunas") return "lunas";
  if (paymentStatus === "ditolak") return "pembayaran_ditolak";
  if (paymentStatus === "belum_bayar") return "belum_bayar";
  if (paymentStatus === "menunggu_verifikasi") return "menunggu_verifikasi";

  return "pending";
};

const getProgressByOrder = (order) => {
  const processStatus = getOrderProcessStatus(order);
  const paymentStatus = getOrderPaymentStatus(order);

  if (processStatus === "selesai") return 100;
  if (processStatus === "diproses") return 80;
  if (processStatus === "ditolak") return 35;

  if (paymentStatus === "lunas") return 60;
  if (paymentStatus === "menunggu_verifikasi") return 40;
  if (paymentStatus === "ditolak") return 30;
  if (paymentStatus === "belum_bayar") return 20;

  return 20;
};

const countByPaymentStatus = (orders, status) => {
  return orders.filter((order) => getOrderPaymentStatus(order) === status)
    .length;
};

const countByProcessStatus = (orders, status) => {
  return orders.filter((order) => getOrderProcessStatus(order) === status)
    .length;
};

const countCompletedPortfolios = (orders) => {
  return orders.filter((order) => {
    const processStatus = getOrderProcessStatus(order);
    const paymentStatus = getOrderPaymentStatus(order);
    const link = order?.portfolio_link || order?.portfolioLink;

    return (
      processStatus === "selesai" &&
      paymentStatus === "lunas" &&
      Boolean(link?.is_active || link?.slug || link?.url_final || link?.url)
    );
  }).length;
};

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
};

const getTemplateName = (order) => {
  return (
    order?.template?.nama_template ||
    order?.template_name ||
    order?.nama_template ||
    "Template Portfolio"
  );
};

const getPackageName = (order) => {
  const paket = order?.paket || order?.package || order?.jenis_paket || "-";

  return String(paket).charAt(0).toUpperCase() + String(paket).slice(1);
};

const getPortfolioUrl = (order) => {
  const link = order?.portfolio_link || order?.portfolioLink;

  if (!link) return "";

  if (link.slug) {
    return `/portfolio/${link.slug}`;
  }

  const rawUrl =
    link.url_final ||
    link.public_url ||
    link.url ||
    order?.public_url ||
    order?.portfolio_url ||
    "";

  return normalizePortfolioRoute(rawUrl);
};

const getPortfolioRowUrl = (portfolio) => {
  if (!portfolio) return "";

  if (portfolio.slug) {
    return `/portfolio/${portfolio.slug}`;
  }

  const rawUrl =
    portfolio.url_final ||
    portfolio.public_url ||
    portfolio.url ||
    portfolio.portfolio_url ||
    "";

  return normalizePortfolioRoute(rawUrl);
};

const normalizePortfolioRoute = (rawUrl) => {
  if (!rawUrl) return "";

  try {
    const parsedUrl = new URL(rawUrl);
    const pathname = parsedUrl.pathname;

    if (pathname.includes("/portfolio/")) {
      const slug = pathname.split("/portfolio/")[1]?.replaceAll("/", "");
      return slug ? `/portfolio/${slug}` : "";
    }

    return pathname || "";
  } catch {
    if (rawUrl.includes("/portfolio/")) {
      const slug = rawUrl.split("/portfolio/")[1]?.replaceAll("/", "");
      return slug ? `/portfolio/${slug}` : "";
    }

    if (rawUrl.startsWith("portfolio/")) {
      return `/${rawUrl}`;
    }

    if (rawUrl.startsWith("/portfolio/")) {
      return rawUrl;
    }

    return "";
  }
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
  const statusData = getStatusData(status);
  return statusData.label;
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default UserDashboardPage;
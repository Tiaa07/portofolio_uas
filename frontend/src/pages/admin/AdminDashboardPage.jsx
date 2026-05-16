import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showConfirmAlert, showErrorAlert } from "../../utils/sweetAlert";

const AdminDashboardPage = () => {
  const currentDate = new Date();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [filterMonth, setFilterMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0")
  );

  const [filterYear, setFilterYear] = useState(
    String(currentDate.getFullYear())
  );

  const [appliedMonth, setAppliedMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0")
  );

  const [appliedYear, setAppliedYear] = useState(
    String(currentDate.getFullYear())
  );

  const fetchDashboard = async () => {
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
        error.response?.data?.message || "Gagal mengambil dashboard admin.";

      setMessage(errorMessage);

      await showErrorAlert("Gagal Memuat Dashboard", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApplyReportFilter = () => {
    setAppliedMonth(filterMonth);
    setAppliedYear(filterYear);
  };

 const handlePrint = async () => {
    const confirm = await showConfirmAlert({
      title: "Print laporan?",
      text: `Laporan ${getMonthName(appliedMonth)} ${appliedYear} akan dicetak.`,
      confirmButtonText: "Ya, print",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirm.isConfirmed) return;

    setTimeout(() => {
      window.print();
    }, 500);
  };

  const overallSummary = useMemo(() => {
    const paidOrders = orders.filter((order) => isPaidOrder(order));

    const totalPendapatan = paidOrders.reduce(
      (total, order) => total + getOrderRevenue(order),
      0
    );

    const pendapatanBulanIni = paidOrders
      .filter((order) => isThisMonth(getPaymentDate(order)))
      .reduce((total, order) => total + getOrderRevenue(order), 0);

    const pendapatanHariIni = paidOrders
      .filter((order) => isToday(getPaymentDate(order)))
      .reduce((total, order) => total + getOrderRevenue(order), 0);

    return {
      totalOrder: orders.length,
      pending: orders.filter((order) => getOrderStatus(order) === "pending")
        .length,
      menungguVerifikasi: orders.filter(
        (order) => getPaymentStatus(order) === "menunggu_verifikasi"
      ).length,
      pembayaranLunas: orders.filter(
        (order) => getPaymentStatus(order) === "lunas"
      ).length,
      pembayaranDitolak: orders.filter(
        (order) => getPaymentStatus(order) === "ditolak"
      ).length,
      orderDiproses: orders.filter(
        (order) => getOrderStatus(order) === "diproses"
      ).length,
      orderSelesai: orders.filter(
        (order) => getOrderStatus(order) === "selesai"
      ).length,
      orderDitolak: orders.filter(
        (order) => getOrderStatus(order) === "ditolak"
      ).length,
      totalPendapatan,
      pendapatanBulanIni,
      pendapatanHariIni,
    };
  }, [orders]);

  const packageSummary = useMemo(() => {
    return {
      basic: orders.filter((order) => normalizeText(order.paket) === "basic")
        .length,
      standard: orders.filter(
        (order) =>
          normalizeText(order.paket) === "standard" ||
          normalizeText(order.paket) === "standar"
      ).length,
      premium: orders.filter((order) => normalizeText(order.paket) === "premium")
        .length,
    };
  }, [orders]);

  const latestOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        return (
          new Date(b.created_at || b.updated_at || 0) -
          new Date(a.created_at || a.updated_at || 0)
        );
      })
      .slice(0, 6);
  }, [orders]);

  const verificationQueue = useMemo(() => {
    return orders
      .filter((order) => getPaymentStatus(order) === "menunggu_verifikasi")
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
      .slice(0, 5);
  }, [orders]);

  const processingQueue = useMemo(() => {
    return orders
      .filter((order) => getOrderStatus(order) === "diproses")
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
      .slice(0, 5);
  }, [orders]);

  const filteredReportOrders = useMemo(() => {
    return orders.filter((order) => {
      const date = getPaymentDate(order) || getOrderDate(order);

      if (!date) return false;

      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());

      return month === appliedMonth && year === appliedYear;
    });
  }, [orders, appliedMonth, appliedYear]);

  const reportSummary = useMemo(() => {
    const paidOrders = filteredReportOrders.filter((order) =>
      isPaidOrder(order)
    );

    return {
      totalOrder: filteredReportOrders.length,
      totalPendapatan: paidOrders.reduce(
        (total, order) => total + getOrderRevenue(order),
        0
      ),
      pembayaranLunas: filteredReportOrders.filter(
        (order) => getPaymentStatus(order) === "lunas"
      ).length,
      menungguVerifikasi: filteredReportOrders.filter(
        (order) => getPaymentStatus(order) === "menunggu_verifikasi"
      ).length,
      pembayaranDitolak: filteredReportOrders.filter(
        (order) => getPaymentStatus(order) === "ditolak"
      ).length,
      pending: filteredReportOrders.filter(
        (order) => getOrderStatus(order) === "pending"
      ).length,
      diproses: filteredReportOrders.filter(
        (order) => getOrderStatus(order) === "diproses"
      ).length,
      selesai: filteredReportOrders.filter(
        (order) => getOrderStatus(order) === "selesai"
      ).length,
      ditolak: filteredReportOrders.filter(
        (order) => getOrderStatus(order) === "ditolak"
      ).length,
    };
  }, [filteredReportOrders]);

  const monthlyRevenue = useMemo(() => {
    const months = getLastSixMonths();

    return months.map((month) => {
      const paidOrdersInMonth = orders.filter((order) => {
        if (!isPaidOrder(order)) return false;

        const paymentDate = getPaymentDate(order);
        if (!paymentDate) return false;

        return (
          paymentDate.getFullYear() === month.year &&
          paymentDate.getMonth() === month.month
        );
      });

      const revenue = paidOrdersInMonth.reduce(
        (total, order) => total + getOrderRevenue(order),
        0
      );

      return {
        label: month.label,
        revenue,
        orders: paidOrdersInMonth.length,
      };
    });
  }, [orders]);

  const maxMonthlyRevenue = Math.max(
    ...monthlyRevenue.map((item) => item.revenue),
    1
  );

  const reportTitle = `Laporan Bulanan ${getMonthName(
    appliedMonth
  )} ${appliedYear}`;

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto w-full max-w-[1180px] print:max-w-none">
        <section className="overflow-hidden rounded-[38px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9 print:hidden">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Admin Dashboard
              </p>

              <h1 className="mt-4 text-[clamp(36px,5vw,68px)] font-black leading-[1] tracking-[-0.06em]">
                Pusat kontrol Build Portfolio.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Pantau order masuk, pembayaran, proses pengerjaan, portfolio
                final, dan laporan pendapatan dalam satu halaman.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/admin/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition hover:bg-[#1d4ed8]"
                >
                  Kelola Order Masuk
                </Link>

                <button
                  type="button"
                  onClick={fetchDashboard}
                  disabled={loading}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Memuat..." : "Refresh Data"}
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroBox
                  label="Total Pendapatan"
                  value={formatRupiah(overallSummary.totalPendapatan)}
                />
                <HeroBox
                  label="Order Masuk"
                  value={overallSummary.totalOrder}
                />
                <HeroBox
                  label="Perlu Verifikasi"
                  value={overallSummary.menungguVerifikasi}
                />
                <HeroBox
                  label="Portfolio Selesai"
                  value={overallSummary.orderSelesai}
                />
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-4 text-sm font-bold text-[#64748b] print:hidden">
            Loading dashboard...
          </div>
        )}

        {!loading && message && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold text-[#2563eb] print:hidden">
            {message}
          </div>
        )}

        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4 print:hidden">
          <DashboardCard
            title="Total Pendapatan"
            value={formatRupiah(overallSummary.totalPendapatan)}
            desc="Akumulasi pembayaran yang sudah lunas."
            color="blue"
          />

          <DashboardCard
            title="Bulan Ini"
            value={formatRupiah(overallSummary.pendapatanBulanIni)}
            desc="Pendapatan lunas pada bulan berjalan."
            color="green"
          />

          <DashboardCard
            title="Hari Ini"
            value={formatRupiah(overallSummary.pendapatanHariIni)}
            desc="Pendapatan lunas hari ini."
            color="orange"
          />

          <DashboardCard
            title="Total Order"
            value={overallSummary.totalOrder}
            desc="Semua order portfolio yang masuk."
            color="dark"
          />

          <DashboardCard
            title="Verifikasi"
            value={overallSummary.menungguVerifikasi}
            desc="Pembayaran yang perlu dicek admin."
            color="blue"
          />

          <DashboardCard
            title="Diproses"
            value={overallSummary.orderDiproses}
            desc="Order yang sedang dikerjakan."
            color="dark"
          />

          <DashboardCard
            title="Selesai"
            value={overallSummary.orderSelesai}
            desc="Portfolio final sudah selesai."
            color="green"
          />

          <DashboardCard
            title="Ditolak"
            value={overallSummary.orderDitolak}
            desc="Order yang ditolak admin."
            color="red"
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] print:hidden">
          <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                  Priority Queue
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                  Pembayaran perlu diverifikasi.
                </h2>
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#eff6ff] px-5 text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe]"
              >
                Lihat Semua
              </Link>
            </div>

            {verificationQueue.length === 0 ? (
              <EmptyBox text="Belum ada pembayaran yang menunggu verifikasi." />
            ) : (
              <div className="grid gap-3">
                {verificationQueue.map((order) => (
                  <SmallOrderRow
                    key={order.id}
                    order={order}
                    actionText="Verifikasi"
                    actionTo={`/admin/orders/${order.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
              Package Breakdown
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
              Paket terjual.
            </h2>

            <div className="mt-6 grid gap-4">
              <PackageBar
                label="Basic"
                value={packageSummary.basic}
                total={orders.length}
              />
              <PackageBar
                label="Standard"
                value={packageSummary.standard}
                total={orders.length}
              />
              <PackageBar
                label="Premium"
                value={packageSummary.premium}
                total={orders.length}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
              <p className="text-sm font-bold leading-7 text-[#64748b]">
                Gunakan bagian ini untuk melihat paket mana yang paling banyak
                dipilih user.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] print:hidden">
          <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                  Processing
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                  Sedang dikerjakan.
                </h2>
              </div>
            </div>

            {processingQueue.length === 0 ? (
              <EmptyBox text="Belum ada order yang sedang diproses." />
            ) : (
              <div className="grid gap-3">
                {processingQueue.map((order) => (
                  <SmallOrderRow
                    key={order.id}
                    order={order}
                    actionText="Detail"
                    actionTo={`/admin/orders/${order.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                  Latest Orders
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                  Order terbaru.
                </h2>
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#f8fafc] px-5 text-sm font-black text-[#111827] transition hover:bg-[#eff6ff] hover:text-[#2563eb]"
              >
                Semua
              </Link>
            </div>

            {latestOrders.length === 0 ? (
              <EmptyBox text="Belum ada order yang masuk." />
            ) : (
              <div className="grid gap-3">
                {latestOrders.map((order) => (
                  <SmallOrderRow
                    key={order.id}
                    order={order}
                    actionText="Buka"
                    actionTo={`/admin/orders/${order.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] print:hidden">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                Rekap Laporan Bulanan
              </p>

              <h2 className="mt-3 text-[clamp(28px,4vw,42px)] font-black leading-none tracking-[-0.05em]">
                {reportTitle}.
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#64748b]">
                Pilih bulan dan tahun, lalu klik tampilkan agar laporan berubah
                sesuai periode yang dipilih.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[170px_130px_auto_auto]">
              <select
                value={filterMonth}
                onChange={(event) => setFilterMonth(event.target.value)}
                className="min-h-11 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-black text-[#111827] outline-none focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={filterYear}
                onChange={(event) => setFilterYear(event.target.value)}
                placeholder="2026"
                className="min-h-11 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm font-black text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10"
              />

              <button
                type="button"
                onClick={handleApplyReportFilter}
                className="min-h-11 rounded-full bg-[#2563eb] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
              >
                Tampilkan
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="min-h-11 rounded-full bg-emerald-600 px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(16,185,129,0.2)] transition hover:bg-emerald-700"
              >
                Print
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MiniInfo label="Total Order" value={reportSummary.totalOrder} />
            <MiniInfo
              label="Total Pendapatan"
              value={formatRupiah(reportSummary.totalPendapatan)}
            />
            <MiniInfo
              label="Pembayaran Lunas"
              value={reportSummary.pembayaranLunas}
            />
            <MiniInfo label="Order Selesai" value={reportSummary.selesai} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MiniInfo
              label="Menunggu Verifikasi"
              value={reportSummary.menungguVerifikasi}
            />
            <MiniInfo label="Pending" value={reportSummary.pending} />
            <MiniInfo label="Diproses" value={reportSummary.diproses} />
            <MiniInfo label="Ditolak" value={reportSummary.ditolak} />
          </div>
        </section>

        <section className="print-area mt-6 rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] print:mt-0 print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <div className="mb-6 print:mb-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316] print:text-gray-500">
              Detail Laporan Bulanan
            </p>

            <h2 className="mt-3 text-[clamp(28px,4vw,42px)] font-black leading-none tracking-[-0.05em] print:text-2xl">
              Daftar Order {reportTitle}.
            </h2>

            <p className="mt-3 hidden text-sm text-gray-600 print:block">
              Dicetak dari Admin Dashboard Build Portfolio.
            </p>
          </div>

          {filteredReportOrders.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-7 text-sm font-bold text-[#64748b] print:border-gray-300 print:bg-white">
              Tidak ada order pada periode ini.
            </div>
          ) : (
            <div className="overflow-auto rounded-[26px] border border-[#e5e7eb] print:overflow-visible print:rounded-none print:border-gray-300">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm print:min-w-0 print:text-xs">
                <thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.14em] text-[#64748b] print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="px-4 py-4 print:px-2 print:py-2">Tanggal</th>
                    <th className="px-4 py-4 print:px-2 print:py-2">
                      Kode Order
                    </th>
                    <th className="px-4 py-4 print:px-2 print:py-2">User</th>
                    <th className="px-4 py-4 print:px-2 print:py-2">
                      Template
                    </th>
                    <th className="px-4 py-4 print:px-2 print:py-2">Paket</th>
                    <th className="px-4 py-4 print:px-2 print:py-2">
                      Pembayaran
                    </th>
                    <th className="px-4 py-4 print:px-2 print:py-2">
                      Pesanan
                    </th>
                    <th className="px-4 py-4 text-right print:px-2 print:py-2">
                      Jumlah
                    </th>
                    <th className="px-4 py-4 print:hidden">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReportOrders.map((order) => {
                    const date = getPaymentDate(order) || getOrderDate(order);
                    const paymentStatus = getPaymentStatus(order);
                    const orderStatus = getOrderStatus(order);

                    return (
                      <tr
                        key={order.id}
                        className="border-t border-[#e5e7eb] print:border-gray-200"
                      >
                        <td className="px-4 py-4 text-[#64748b] print:px-2 print:py-2 print:text-gray-700">
                          {formatDate(date)}
                        </td>

                        <td className="px-4 py-4 font-black print:px-2 print:py-2">
                          {order.kode_order || `ORDER-${order.id}`}
                        </td>

                        <td className="px-4 py-4 text-[#64748b] print:px-2 print:py-2 print:text-gray-700">
                          {order.user?.name || order.user?.email || "-"}
                        </td>

                        <td className="px-4 py-4 print:px-2 print:py-2">
                          {getTemplateName(order)}
                        </td>

                        <td className="px-4 py-4 print:px-2 print:py-2">
                          {formatPackage(order.paket)}
                        </td>

                        <td className="px-4 py-4 print:px-2 print:py-2">
                          <StatusBadge status={paymentStatus}>
                            {formatStatus(paymentStatus)}
                          </StatusBadge>
                        </td>

                        <td className="px-4 py-4 print:px-2 print:py-2">
                          <StatusBadge status={orderStatus}>
                            {formatStatus(orderStatus)}
                          </StatusBadge>
                        </td>

                        <td className="px-4 py-4 text-right font-black print:px-2 print:py-2">
                          {isPaidOrder(order)
                            ? formatRupiah(getOrderRevenue(order))
                            : "-"}
                        </td>

                        <td className="px-4 py-4 print:hidden">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#2563eb] px-4 text-xs font-black text-white transition hover:bg-[#1d4ed8]"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot className="border-t border-[#e5e7eb] bg-[#f8fafc] print:border-gray-300 print:bg-gray-100">
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-4 text-right font-black print:px-2 print:py-2"
                    >
                      Total Pendapatan Periode Ini
                    </td>

                    <td className="px-4 py-4 text-right text-lg font-black print:px-2 print:py-2 print:text-sm">
                      {formatRupiah(reportSummary.totalPendapatan)}
                    </td>

                    <td className="px-4 py-4 print:hidden" />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr] print:hidden">
          <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
              Grafik Pendapatan
            </p>

            <h2 className="mt-3 text-[clamp(28px,4vw,42px)] font-black leading-none tracking-[-0.05em]">
              Rekap 6 bulan terakhir.
            </h2>

            <div className="mt-6 grid gap-4">
              {monthlyRevenue.map((item) => {
                const width = `${Math.max(
                  (item.revenue / maxMonthlyRevenue) * 100,
                  item.revenue > 0 ? 8 : 0
                )}%`;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="font-black">{item.label}</span>

                      <span className="text-sm font-bold text-[#64748b]">
                        {formatRupiah(item.revenue)} • {item.orders} order
                      </span>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-[#e5e7eb]">
                      <div
                        className="h-full rounded-full bg-[#2563eb]"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 self-start">
            <QuickActionCard />
            <StatusSummaryCard summary={overallSummary} />
          </div>
        </section>
      </div>
    </main>
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

const DashboardCard = ({ title, value, desc, color }) => {
  const colorMap = {
    blue: "bg-[#eff6ff] text-[#2563eb]",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-[#fff7ed] text-[#f97316]",
    red: "bg-red-50 text-red-600",
    dark: "bg-[#f8fafc] text-[#0f172a]",
  };

  return (
    <article className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
      <div
        className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl text-lg font-black ${
          colorMap[color] || colorMap.blue
        }`}
      >
        {String(value).startsWith("Rp") ? "Rp" : value}
      </div>

      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
        {title}
      </span>

      <strong className="mt-3 block break-words text-2xl font-black tracking-[-0.04em] text-[#111827]">
        {value}
      </strong>

      <p className="mt-3 text-sm leading-6 text-[#64748b]">{desc}</p>
    </article>
  );
};

const SmallOrderRow = ({ order, actionText, actionTo }) => {
  const paymentStatus = getPaymentStatus(order);
  const orderStatus = getOrderStatus(order);

  return (
    <div className="rounded-[22px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#f97316]">
            {order.kode_order || `ORDER-${order.id}`}
          </p>

          <h3 className="mt-2 text-lg font-black tracking-[-0.03em] text-[#111827]">
            {getTemplateName(order)}
          </h3>

          <p className="mt-1 text-sm font-semibold leading-6 text-[#64748b]">
            {order.user?.name || order.user?.email || "User"} • Paket{" "}
            {formatPackage(order.paket)}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={paymentStatus}>
              {formatStatus(paymentStatus)}
            </StatusBadge>
            <StatusBadge status={orderStatus}>
              {formatStatus(orderStatus)}
            </StatusBadge>
          </div>
        </div>

        <Link
          to={actionTo}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white transition hover:bg-[#1d4ed8]"
        >
          {actionText}
        </Link>
      </div>
    </div>
  );
};

const PackageBar = ({ label, value, total }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="font-black text-[#111827]">{label}</span>
        <span className="text-sm font-bold text-[#64748b]">
          {value} order • {percent}%
        </span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-[#e5e7eb]">
        <div
          className="h-full rounded-full bg-[#2563eb]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const MiniInfo = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4 print:border-gray-200 print:bg-white">
      <span className="block text-sm font-bold text-[#64748b] print:text-gray-600">
        {label}
      </span>

      <strong className="mt-1 block text-2xl font-black text-[#111827] print:text-black">
        {value}
      </strong>
    </div>
  );
};

const EmptyBox = ({ text }) => {
  return (
    <div className="rounded-[24px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-6 text-sm font-bold leading-7 text-[#64748b]">
      {text}
    </div>
  );
};

const QuickActionCard = () => {
  return (
    <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        Quick Action
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
        Aksi cepat.
      </h2>

      <div className="mt-6 grid gap-3">
        <Link
          to="/admin/orders"
          className="flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white transition hover:bg-[#1d4ed8]"
        >
          Buka Order Masuk
        </Link>

        <Link
          to="/admin/orders"
          className="flex min-h-11 items-center justify-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-5 text-center text-sm font-black text-[#f97316] transition hover:bg-[#ffedd5]"
        >
          Cek Pembayaran
        </Link>

        <Link
          to="/admin/orders"
          className="flex min-h-11 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-5 text-center text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe]"
        >
          Order Diproses
        </Link>
      </div>
    </div>
  );
};

const StatusSummaryCard = ({ summary }) => {
  return (
    <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        Ringkasan Status
      </p>

      <div className="mt-5 grid gap-3">
        <MiniInfo label="Pembayaran Ditolak" value={summary.pembayaranDitolak} />
        <MiniInfo label="Order Pending" value={summary.pending} />
        <MiniInfo label="Order Ditolak" value={summary.orderDitolak} />
      </div>
    </div>
  );
};

const StatusBadge = ({ status, children }) => {
  const statusData = getStatusData(status);

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-black print:border print:border-gray-300 print:bg-white print:text-black ${statusData.className}`}
    >
      {children}
    </span>
  );
};

const monthOptions = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

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

const isPaidOrder = (order) => {
  return getPaymentStatus(order) === "lunas";
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

const getOrderDate = (order) => {
  const rawDate = order.created_at || order.tanggal_order || order.updated_at;
  return parseFlexibleDate(rawDate);
};

const parseFlexibleDate = (rawDate) => {
  if (!rawDate) return null;

  if (rawDate instanceof Date) {
    return Number.isNaN(rawDate.getTime()) ? null : rawDate;
  }

  const value = String(rawDate).trim();

  const normalDate = new Date(value);
  if (!Number.isNaN(normalDate.getTime())) {
    return normalDate;
  }

  if (value.includes("/")) {
    const [day, month, year] = value.split("/").map(Number);

    if (day && month && year) {
      const date = new Date(year, month - 1, day);
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  if (value.includes("-")) {
    const parts = value.split("-").map(Number);

    if (parts.length === 3) {
      const [first, second, third] = parts;

      if (first > 12) {
        const date = new Date(third, second - 1, first);
        return Number.isNaN(date.getTime()) ? null : date;
      }
    }
  }

  return null;
};

const isToday = (date) => {
  if (!date) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const isThisMonth = (date) => {
  if (!date) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

const getLastSixMonths = () => {
  const now = new Date();

  return Array.from({ length: 6 })
    .map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        }),
      };
    })
    .reverse();
};

const getMonthName = (month) => {
  const monthData = monthOptions.find((item) => item.value === month);
  return monthData?.label || month;
};

const formatDate = (date) => {
  if (!date) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default AdminDashboardPage;
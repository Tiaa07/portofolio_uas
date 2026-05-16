import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { storageUrl } from "../../utils/portfolioDataMapper";
import { formatValidationMessage } from "../../utils/validationFormatter";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
  showWarningAlert,
} from "../../utils/sweetAlert";

const AdminOrderDetailPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  const [rejectOrderReason, setRejectOrderReason] = useState("");
  const [showRejectOrderBox, setShowRejectOrderBox] = useState(false);

  const [paymentProofModal, setPaymentProofModal] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.get(`/admin/orders/${id}`);
      const data = response.data?.data || response.data;

      setOrder(data);
      setMessage(response.data?.message || "");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil detail order.";

      setMessage(errorMessage);
      await showErrorAlert("Gagal Memuat Detail Order", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleApprovePayment = async () => {
    const confirmApprove = await showConfirmAlert({
      title: "Setujui pembayaran?",
      text: "Status pembayaran akan berubah menjadi lunas.",
      confirmButtonText: "Ya, setujui",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmApprove.isConfirmed) return;

    try {
      setActionLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.patch(
        `/admin/orders/${id}/approve-payment`
      );

      const successMessage =
        response.data?.message ||
        "Pembayaran berhasil disetujui. Status pembayaran menjadi lunas.";

      setMessage(successMessage);
      await showSuccessAlert("Pembayaran Disetujui", successMessage);

      await fetchOrder();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menyetujui pembayaran.";

      setMessage(errorMessage);
      setErrors(error.response?.data?.errors || {});
      await showErrorAlert("Gagal Menyetujui Pembayaran", errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (event) => {
    event.preventDefault();

    if (!rejectReason.trim()) {
      const validationErrors = {
        alasan_penolakan: ["Alasan penolakan pembayaran wajib diisi."],
      };

      setErrors(validationErrors);
      await showWarningAlert(
        "Alasan Belum Diisi",
        "Isi alasan penolakan pembayaran terlebih dahulu."
      );
      return;
    }

    const confirmReject = await showConfirmAlert({
      title: "Tolak pembayaran?",
      text: "User harus upload ulang bukti pembayaran setelah pembayaran ditolak.",
      confirmButtonText: "Ya, tolak",
      cancelButtonText: "Batal",
      icon: "warning",
    });

    if (!confirmReject.isConfirmed) return;

    try {
      setActionLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.patch(
        `/admin/orders/${id}/reject-payment`,
        {
          alasan_penolakan: rejectReason,
        }
      );

      const successMessage =
        response.data?.message ||
        "Pembayaran berhasil ditolak. User dapat upload ulang bukti pembayaran.";

      setMessage(successMessage);
      setRejectReason("");
      setShowRejectBox(false);

      await showSuccessAlert("Pembayaran Ditolak", successMessage);
      await fetchOrder();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menolak pembayaran.";

      setMessage(errorMessage);
      setErrors(error.response?.data?.errors || {});
      await showErrorAlert("Gagal Menolak Pembayaran", errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessOrder = async () => {
    const confirmProcess = await showConfirmAlert({
      title: "Proses order ini?",
      text: "Status pesanan akan berubah menjadi diproses.",
      confirmButtonText: "Ya, proses",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmProcess.isConfirmed) return;

    try {
      setActionLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.patch(`/admin/orders/${id}/process`);

      const successMessage = response.data?.message || "Order berhasil diproses.";

      setMessage(successMessage);
      await showSuccessAlert("Order Diproses", successMessage);

      await fetchOrder();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal memproses order.";

      setMessage(errorMessage);
      setErrors(error.response?.data?.errors || {});
      await showErrorAlert("Gagal Memproses Order", errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

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
      setErrors({});

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
      setErrors(error.response?.data?.errors || {});
      await showErrorAlert("Gagal Mengaktifkan Portfolio", errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOrder = async (event) => {
    event.preventDefault();

    if (!rejectOrderReason.trim()) {
      const validationErrors = {
        alasan_penolakan: ["Alasan penolakan order wajib diisi."],
      };

      setErrors(validationErrors);
      await showWarningAlert(
        "Alasan Belum Diisi",
        "Isi alasan penolakan order terlebih dahulu."
      );
      return;
    }

    const confirmReject = await showConfirmAlert({
      title: "Tolak order ini?",
      text: "Order yang ditolak tidak bisa diproses lagi.",
      confirmButtonText: "Ya, tolak order",
      cancelButtonText: "Batal",
      icon: "warning",
    });

    if (!confirmReject.isConfirmed) return;

    try {
      setActionLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.patch(
        `/admin/orders/${id}/reject-order`,
        {
          alasan_penolakan: rejectOrderReason,
        }
      );

      const successMessage = response.data?.message || "Order berhasil ditolak.";

      setMessage(successMessage);
      setRejectOrderReason("");
      setShowRejectOrderBox(false);

      await showSuccessAlert("Order Ditolak", successMessage);
      await fetchOrder();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menolak order.";

      setMessage(errorMessage);
      setErrors(error.response?.data?.errors || {});
      await showErrorAlert("Gagal Menolak Order", errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

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

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <section className="rounded-[30px] border border-red-200 bg-red-50 p-7 text-red-600 shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em]">
              Detail Error
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em]">
              Order tidak ditemukan.
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7">
              {message || "Data order tidak tersedia."}
            </p>

            <Link
              to="/admin/orders"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-black text-white hover:bg-red-700"
            >
              Kembali ke Order Masuk
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const paymentStatus = getPaymentStatus(order);
  const orderStatus = getOrderStatus(order);

  const paket = normalizeText(order.paket);
  const isStandard = paket === "standard" || paket === "standar";
  const isPremium = paket === "premium";

  const profile = order.portfolio_profile || order.portfolioProfile || {};
  const payment = order.payment || order.pembayaran || order.payment_data || {};
  const portfolioLink = order.portfolio_link || order.portfolioLink || null;
  const finalPortfolioUrl = getFrontendPortfolioUrl(portfolioLink);

  const canVerifyPayment = 
  paymentStatus === "menunggu_verifikasi" && orderStatus !== "ditolak";

  const canProcessOrder =
    paymentStatus === "lunas" &&
    orderStatus !== "diproses" &&
    orderStatus !== "selesai" &&
    orderStatus !== "ditolak";

  const canActivatePortfolioLink =
    paymentStatus === "lunas" && orderStatus === "diproses";

  const canRejectOrder =
    orderStatus !== "selesai" &&
    orderStatus !== "ditolak" &&
    orderStatus !== "diproses";

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="overflow-hidden rounded-[38px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Detail Order Admin
              </p>

              <h1 className="mt-4 text-[clamp(36px,5vw,68px)] font-black leading-[1] tracking-[-0.06em]">
                {order.kode_order || `ORDER-${order.id}`}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Periksa data user, data portfolio, pembayaran, lalu lanjutkan
                verifikasi sampai portfolio final aktif.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/admin/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Kembali ke Order Masuk
                </Link>

                {(orderStatus === "diproses" || orderStatus === "selesai") && (
                  <Link
                    to={`/admin/orders/${order.id}/preview-portfolio`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white transition hover:bg-[#1d4ed8]"
                  >
                    Preview Portfolio
                  </Link>
                )}

                {finalPortfolioUrl && (
                  <a
                    href={finalPortfolioUrl}
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
                <HeroBox label="Paket" value={formatPackage(order.paket)} />
                <HeroBox label="User" value={order.user?.name || "-"} />
                <HeroBox
                  label="Pembayaran"
                  value={formatStatus(paymentStatus)}
                />
                <HeroBox label="Pesanan" value={formatStatus(orderStatus)} />
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold leading-7 text-[#2563eb]">
            <p>{message}</p>

            {Object.keys(errors).length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-red-600">
                {Object.entries(errors).map(([field, messages]) => (
                  <li key={field}>{formatValidationMessage(field, messages)}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-6">
            <Card eyebrow="Customer" title="Data User">
              <InfoGrid>
                <Info label="Nama User" value={order.user?.name} />
                <Info label="Email User" value={order.user?.email} />
                <Info label="Kode Order" value={order.kode_order || `ORDER-${order.id}`} />
                <Info label="Tanggal Order" value={formatDate(order.created_at)} />
              </InfoGrid>
            </Card>

            <Card eyebrow="Template" title="Template & Paket">
              <InfoGrid>
                <Info label="Nama Template" value={getTemplateName(order)} />
                <Info label="Kategori" value={order.template?.kategori} />
                <Info label="Paket" value={formatPackage(order.paket)} />
                <Info label="Harga / Pembayaran" value={formatRupiah(getOrderRevenue(order))} />
                <Info label="Status Pesanan" value={formatStatus(orderStatus)} />
                <Info label="Status Pembayaran" value={formatStatus(paymentStatus)} />
              </InfoGrid>
            </Card>

            <Card eyebrow="Portfolio" title="Data Portfolio">
              <InfoGrid>
                <Info label="Nama Lengkap" value={profile.nama_lengkap} />
                <Info label="Profesi" value={profile.profesi} />
                <Info label="Email" value={profile.email} />
                <Info label="Nomor HP" value={profile.nomor_hp} />
                <Info label="Instagram" value={profile.instagram} />
                <Info label="LinkedIn" value={profile.linkedin} />
                <Info label="GitHub" value={profile.github} />
                <Info label="Website" value={profile.website} />
              </InfoGrid>

              {(isStandard || isPremium) && (
                <>
                  <Info label="About Me" value={profile.about_me || profile.about} />

                  <ListInfo
                    title="Skills"
                    items={order.skills || []}
                    emptyText="Skill belum tersedia."
                    getText={(item) =>
                      [
                        item.nama_skill || item.skill || item.name || item.nama || "-",
                        item.level_skill || item.tingkat_skill || item.level || item.tingkat || "",
                        item.persentase_skill || item.persentase || item.percent
                          ? `${item.persentase_skill || item.persentase || item.percent}%`
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    }
                  />

                  <ListInfo
                    title="Tools"
                    items={order.tools || []}
                    emptyText="Tools belum tersedia."
                    getText={(item) =>
                      item.nama_tools ||
                      item.nama_tool ||
                      item.tool ||
                      item.name ||
                      item.nama ||
                      "-"
                    }
                  />
                </>
              )}

              {isPremium && (
                <>
                  <ListInfo
                    title="Projects"
                    items={order.projects || []}
                    emptyText="Project belum tersedia."
                    getText={(item) =>
                      [
                        item.nama_project || item.nama_proyek || item.title || item.name || "-",
                        item.deskripsi_project || item.deskripsi || item.description || "",
                        item.link_project || item.link || item.url || "",
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    }
                  />

                  <ListInfo
                    title="Pendidikan"
                    items={order.educations || []}
                    emptyText="Pendidikan belum tersedia."
                    getText={(item) =>
                      [
                        item.nama_sekolah ||
                          item.nama_kampus ||
                          item.sekolah ||
                          item.school ||
                          item.title ||
                          "-",
                        item.jurusan || item.program_studi || "",
                        formatYearRange(item.tahun_mulai, item.tahun_selesai),
                        item.deskripsi || item.description || "",
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    }
                  />

                  <ListInfo
                    title="Pengalaman"
                    items={order.experiences || []}
                    emptyText="Pengalaman belum tersedia."
                    getText={(item) =>
                      [
                        item.posisi || item.jabatan || item.position || item.title || "-",
                        item.nama_tempat || item.perusahaan || item.company || "",
                        formatYearRange(item.tahun_mulai, item.tahun_selesai),
                        item.deskripsi || item.description || "",
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    }
                  />

                  <CertificateInfo title="Sertifikat" items={order.certificates || []} />

                  <ListInfo
                    title="Pencapaian"
                    items={order.achievements || []}
                    emptyText="Pencapaian belum tersedia."
                    getText={(item) =>
                      [
                        item.nama_pencapaian ||
                          item.pencapaian ||
                          item.name ||
                          item.title ||
                          "-",
                        item.deskripsi || item.description || "",
                        item.tahun || "",
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    }
                  />
                </>
              )}
            </Card>
          </div>

          <div className="grid gap-6 self-start">
            <Card eyebrow="Payment" title="Data Pembayaran">
              <InfoGrid>
                <Info label="Metode" value={payment?.metode_pembayaran} />
                <Info
                  label="Bank / E-Wallet"
                  value={
                    payment?.bank_atau_ewallet_pengirim ||
                    payment?.bank_pengirim
                  }
                />
                <Info label="Nomor Pengirim" value={payment?.nomor_pengirim} />
                <Info label="Nama Pengirim" value={payment?.nama_pengirim} />
                <Info
                  label="Jumlah"
                  value={formatRupiah(payment?.jumlah_pembayaran)}
                />
                <Info
                  label="Tanggal Pembayaran"
                  value={formatDate(payment?.tanggal_pembayaran)}
                />
                <Info label="Status Payment" value={formatStatus(payment?.status)} />
                <Info label="Alasan Penolakan" value={payment?.alasan_penolakan} />
              </InfoGrid>

              <PaymentProofButton
                payment={payment}
                onOpen={(url) => setPaymentProofModal(url)}
              />
            </Card>

            <Card eyebrow="Action" title="Aksi Admin">
              <PaymentAction
                canVerifyPayment={canVerifyPayment}
                paymentStatus={paymentStatus}
                actionLoading={actionLoading}
                showRejectBox={showRejectBox}
                rejectReason={rejectReason}
                errors={errors}
                onApprove={handleApprovePayment}
                onToggleReject={() => setShowRejectBox((prev) => !prev)}
                onRejectReasonChange={setRejectReason}
                onRejectSubmit={handleRejectPayment}
              />

              <OrderAction
                order={order}
                paymentStatus={paymentStatus}
                orderStatus={orderStatus}
                canProcessOrder={canProcessOrder}
                canRejectOrder={canRejectOrder}
                canActivatePortfolioLink={canActivatePortfolioLink}
                actionLoading={actionLoading}
                showRejectOrderBox={showRejectOrderBox}
                rejectOrderReason={rejectOrderReason}
                errors={errors}
                finalPortfolioUrl={finalPortfolioUrl}
                onProcess={handleProcessOrder}
                onActivate={handleActivatePortfolioLink}
                onShowRejectOrder={() => {
                  setShowRejectOrderBox(true);
                  setErrors({});
                  setMessage("");
                }}
                onRejectOrderReasonChange={setRejectOrderReason}
                onRejectOrderSubmit={handleRejectOrder}
                onCancelRejectOrder={() => {
                  setShowRejectOrderBox(false);
                  setRejectOrderReason("");
                  setErrors({});
                }}
              />

              <Link
                to="/admin/orders"
                className="mt-2 flex min-h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
              >
                Kembali ke Order Masuk
              </Link>
            </Card>
          </div>
        </section>

        {paymentProofModal && (
          <PaymentProofModal
            url={paymentProofModal}
            onClose={() => setPaymentProofModal(null)}
          />
        )}
      </div>
    </main>
  );
};

const PaymentAction = ({
  canVerifyPayment,
  paymentStatus,
  actionLoading,
  showRejectBox,
  rejectReason,
  errors,
  onApprove,
  onToggleReject,
  onRejectReasonChange,
  onRejectSubmit,
}) => {
  if (!canVerifyPayment) {
    return (
      <div className="rounded-[24px] border border-[#e5e7eb] bg-[#f8fafc] p-5">
        <p className="text-sm font-semibold leading-7 text-[#64748b]">
          Pembayaran tidak berada pada status{" "}
          <strong className="text-[#111827]">menunggu verifikasi</strong>.
          Aksi verifikasi tidak tersedia.
        </p>

        <div className="mt-4">
          <StatusBadge status={paymentStatus}>
            Pembayaran: {formatStatus(paymentStatus)}
          </StatusBadge>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#bfdbfe] bg-[#eff6ff] p-5">
      <p className="text-sm font-semibold leading-7 text-[#2563eb]">
        Pembayaran masih menunggu verifikasi. Cek bukti pembayaran terlebih
        dahulu, lalu setujui atau tolak pembayaran.
      </p>

      <button
        type="button"
        disabled={actionLoading}
        onClick={onApprove}
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {actionLoading ? "Memproses..." : "Setujui Pembayaran"}
      </button>

      <button
        type="button"
        disabled={actionLoading}
        onClick={onToggleReject}
        className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Tolak Pembayaran
      </button>

      {showRejectBox && (
        <form onSubmit={onRejectSubmit} className="mt-4">
          <label className="mb-2 block text-sm font-black text-[#111827]">
            Alasan Penolakan
          </label>

          <textarea
            value={rejectReason}
            onChange={(event) => onRejectReasonChange(event.target.value)}
            rows={4}
            placeholder="Contoh: Bukti transfer tidak jelas / nominal tidak sesuai."
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
          />

          {errors.alasan_penolakan && (
            <small className="mt-2 block text-red-600">
              {errors.alasan_penolakan[0]}
            </small>
          )}

          <button
            type="submit"
            disabled={actionLoading}
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {actionLoading ? "Memproses..." : "Kirim Penolakan"}
          </button>
        </form>
      )}
    </div>
  );
};

const OrderAction = ({
  order,
  paymentStatus,
  orderStatus,
  canProcessOrder,
  canRejectOrder,
  canActivatePortfolioLink,
  actionLoading,
  showRejectOrderBox,
  rejectOrderReason,
  errors,
  finalPortfolioUrl,
  onProcess,
  onActivate,
  onShowRejectOrder,
  onRejectOrderReasonChange,
  onRejectOrderSubmit,
  onCancelRejectOrder,
}) => {
  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        Order Action
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">
        Proses Order
      </h3>

      <p className="mt-3 text-sm font-semibold leading-7 text-[#64748b]">
        Order hanya bisa diproses jika pembayaran sudah lunas.
      </p>

      {canProcessOrder ? (
        <button
          type="button"
          disabled={actionLoading}
          onClick={onProcess}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {actionLoading ? "Memproses..." : "Proses Order"}
        </button>
      ) : (
        <div className="mt-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
          <p className="text-sm font-semibold leading-7 text-[#64748b]">
            Tombol proses order aktif saat pembayaran sudah lunas dan order belum
            diproses, selesai, atau ditolak.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={paymentStatus}>
              Pembayaran: {formatStatus(paymentStatus)}
            </StatusBadge>

            <StatusBadge status={orderStatus}>
              Pesanan: {formatStatus(orderStatus)}
            </StatusBadge>
          </div>
        </div>
      )}

      {paymentStatus === "lunas" && orderStatus === "diproses" && (
        <>
          <Link
            to={`/admin/orders/${order.id}/edit-portfolio`}
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-[#f97316] px-5 text-sm font-black text-white transition hover:bg-[#ea580c]"
          >
            Edit Data Portfolio
          </Link>

          <Link
            to={`/admin/orders/${order.id}/preview-portfolio`}
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-5 text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe]"
          >
            Preview Portfolio
          </Link>

          {canActivatePortfolioLink && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onActivate}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {actionLoading ? "Memproses..." : "Selesaikan Order"}
            </button>
          )}
        </>
      )}

      {orderStatus === "selesai" && (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-7 text-emerald-600">
          <p className="font-black">Order sudah selesai.</p>
          <p className="mt-1">
            Portfolio final sudah aktif. Admin tidak perlu memproses order ini
            lagi.
          </p>
        </div>
      )}

      {orderStatus === "ditolak" && (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-7 text-red-600">
          <p className="font-black">Order sudah ditolak.</p>
          <p className="mt-1">
            Order ini sudah dihentikan dan tidak bisa diproses lagi.
          </p>
        </div>
      )}

      {canRejectOrder && (
        <div className="mt-5 rounded-[24px] border border-red-200 bg-red-50 p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-600">
            Tolak Order
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#111827]">
            Penolakan Order
          </h3>

          <p className="mt-3 text-sm font-semibold leading-7 text-red-600/85">
            Gunakan fitur ini jika order harus dihentikan total.
          </p>

          {!showRejectOrderBox ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onShowRejectOrder}
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Tolak Order
            </button>
          ) : (
            <form onSubmit={onRejectOrderSubmit} className="mt-4">
              <label className="mb-2 block text-sm font-black text-[#111827]">
                Alasan Penolakan Order
              </label>

              <textarea
                value={rejectOrderReason}
                onChange={(event) =>
                  onRejectOrderReasonChange(event.target.value)
                }
                rows={5}
                placeholder="Contoh: Data order tidak valid atau pembayaran terindikasi bermasalah."
                className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
              />

              {errors.alasan_penolakan && (
                <small className="mt-2 block text-red-600">
                  {errors.alasan_penolakan[0]}
                </small>
              )}

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actionLoading ? "Memproses..." : "Kirim Penolakan Order"}
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={onCancelRejectOrder}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-sm font-black text-[#111827] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {orderStatus === "selesai" && finalPortfolioUrl && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">
            Portfolio Final Aktif
          </p>

          <p className="mt-2 break-all text-sm font-semibold leading-6 text-emerald-600">
            {finalPortfolioUrl}
          </p>

          <a
            href={finalPortfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            Buka Portfolio Final
          </a>
        </div>
      )}
    </div>
  );
};

const PaymentProofButton = ({ payment, onOpen }) => {
  const proof =
    payment?.foto_bukti_pembayaran ||
    payment?.bukti_pembayaran ||
    payment?.payment_proof;

  if (!proof) {
    return (
      <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-4 text-sm font-semibold text-[#f97316]">
        Bukti pembayaran belum tersedia / path belum terbaca frontend.
      </div>
    );
  }

  const proofUrl = fileUrl(proof);

  return (
    <button
      type="button"
      onClick={() => onOpen(proofUrl)}
      className="flex min-h-11 w-full items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white transition hover:bg-[#1d4ed8]"
    >
      Lihat Bukti Pembayaran
    </button>
  );
};

const PaymentProofModal = ({ url, onClose }) => {
  const isPdf = url?.toLowerCase().includes(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] bg-white p-5 text-[#111827] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
              Bukti Pembayaran
            </p>

            <h3 className="mt-1 text-2xl font-black">Preview Bukti Transfer</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#e5e7eb] bg-[#f8fafc] text-xl font-black hover:bg-[#e5e7eb]"
          >
            ×
          </button>
        </div>

        <div className="max-h-[72vh] overflow-auto rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
          {isPdf ? (
            <iframe
              src={url}
              title="Bukti Pembayaran"
              className="h-[68vh] w-full rounded-xl bg-white"
            />
          ) : (
            <img
              src={url}
              alt="Bukti Pembayaran"
              className="mx-auto max-h-[68vh] w-auto max-w-full rounded-xl object-contain"
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-sm font-black text-[#111827] hover:bg-[#f8fafc]"
          >
            Buka di Tab Baru
          </a>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white hover:bg-[#1d4ed8]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const Card = ({ eyebrow, title, children }) => {
  return (
    <section className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-[clamp(28px,4vw,40px)] font-black leading-none tracking-[-0.05em]">
        {title}
      </h2>

      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
};

const InfoGrid = ({ children }) => {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
};

const Info = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        {label}
      </span>

      <strong className="mt-2 block break-words text-sm leading-6 text-[#111827]">
        {value || "-"}
      </strong>
    </div>
  );
};

const ListInfo = ({ title, items = [], getText, emptyText = "-" }) => {
  if (!items || items.length === 0) {
    return <Info label={title} value={emptyText} />;
  }

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        {title}
      </span>

      <div className="mt-3 grid gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#111827]"
          >
            {getText(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

const CertificateInfo = ({ title, items = [] }) => {
  if (!items || items.length === 0) {
    return <Info label={title} value="Sertifikat belum tersedia." />;
  }

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        {title}
      </span>

      <div className="mt-3 grid gap-3">
        {items.map((item, index) => {
          const certificateName =
            item.nama_sertifikat ||
            item.sertifikat ||
            item.name ||
            item.title ||
            "Sertifikat";

          const issuer = item.penerbit || item.issuer || "";
          const year = item.tahun || "";

          const file =
            item.file_sertifikat ||
            item.sertifikat_file ||
            item.file_certificate ||
            item.certificate_file ||
            item.file_path ||
            item.file ||
            null;

          const url = fileUrl(file);
          const isPdf = url?.toLowerCase().includes(".pdf");

          return (
            <div
              key={index}
              className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3"
            >
              <strong className="block text-sm leading-6 text-[#111827]">
                {[certificateName, issuer, year].filter(Boolean).join(" • ")}
              </strong>

              {url ? (
                <>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full bg-[#2563eb] px-4 text-xs font-black text-white hover:bg-[#1d4ed8]"
                  >
                    Lihat File Sertifikat
                  </a>

                  {!isPdf && (
                    <img
                      src={url}
                      alt={certificateName}
                      className="mt-3 max-h-56 w-full rounded-xl object-cover"
                    />
                  )}
                </>
              ) : (
                <p className="mt-2 text-xs font-semibold text-[#64748b]">
                  File sertifikat belum tersedia.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HeroBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>

      <strong className="mt-2 block break-words text-xl font-black tracking-[-0.04em] text-white">
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
    unpaid: {
      label: "Belum Bayar",
      className: "bg-[#fff7ed] text-[#f97316]",
    },
    menunggu_verifikasi: {
      label: "Verifikasi",
      className: "bg-[#eff6ff] text-[#2563eb]",
    },
    waiting: {
      label: "Verifikasi",
      className: "bg-[#eff6ff] text-[#2563eb]",
    },
    lunas: {
      label: "Lunas",
      className: "bg-emerald-50 text-emerald-600",
    },
    paid: {
      label: "Lunas",
      className: "bg-emerald-50 text-emerald-600",
    },
    diproses: {
      label: "Diproses",
      className: "bg-[#f8fafc] text-[#0f172a]",
    },
    processing: {
      label: "Diproses",
      className: "bg-[#f8fafc] text-[#0f172a]",
    },
    selesai: {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-600",
    },
    completed: {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-600",
    },
    success: {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-600",
    },
    ditolak: {
      label: "Ditolak",
      className: "bg-red-50 text-red-600",
    },
    rejected: {
      label: "Ditolak",
      className: "bg-red-50 text-red-600",
    },
    failed: {
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

const formatYearRange = (start, end) => {
  if (!start && !end) return "";
  return `${start || "-"} - ${end || "-"}`;
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
  return number ? `Rp${number.toLocaleString("id-ID")}` : "-";
};

const getOrderRevenue = (order) => {
  return Number(
    order?.payment?.jumlah_pembayaran ||
      order?.jumlah_pembayaran ||
      order?.total_harga ||
      order?.harga_paket ||
      order?.harga ||
      order?.price ||
      0
  );
};

const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const fileUrl = (path) => {
  return storageUrl(path);
};

const getFrontendPortfolioUrl = (link) => {
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

export default AdminOrderDetailPage;

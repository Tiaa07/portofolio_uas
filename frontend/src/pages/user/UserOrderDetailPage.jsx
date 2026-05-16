import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { storageUrl } from "../../utils/portfolioDataMapper";
import { showErrorAlert } from "../../utils/sweetAlert";

const UserOrderDetailPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [paymentProofModal, setPaymentProofModal] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(`/user/orders/${id}`);

      setOrder(response.data?.data || response.data);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="h-[360px] animate-pulse rounded-[34px] bg-white shadow-sm" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="h-[520px] animate-pulse rounded-[30px] bg-white shadow-sm" />
            <div className="h-[520px] animate-pulse rounded-[30px] bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600">
            {message || "Order tidak ditemukan."}
          </div>
        </div>
      </main>
    );
  }

  const paket = normalizeText(order.paket);
  const isStandard = paket === "standard";
  const isPremium = paket === "premium";

  const profile = order.portfolio_profile || order.portfolioProfile || {};
  const payment = order.payment || order.pembayaran || order.payment_data || {};
  const orderStatus = getOrderStatus(order);
  const paymentStatus = getPaymentStatus(order);
  const displayStatus = getDisplayStatus(order);
  const progress = getProgressByOrder(order);
  const portfolioFinalUrl = getPortfolioFinalUrl(order);
  const paymentProofUrl = getPaymentProofUrl(payment);

  const canUploadAgain = paymentStatus === "ditolak" && orderStatus !== "ditolak";
  const canPreviewPortfolio = orderStatus === "diproses" || orderStatus === "selesai";
  const canOpenPortfolio = Boolean(portfolioFinalUrl);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="overflow-hidden rounded-[34px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Detail Order
              </p>

              <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em]">
                {order.kode_order || `ORDER-${order.id}`}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Lihat detail data portfolio, pembayaran, progress order, catatan
                admin, dan link portfolio final jika sudah aktif.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/user/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition hover:bg-[#1d4ed8]"
                >
                  Kembali ke Order
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
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-white/50">
                    Status Utama
                  </span>
                  <div className="mt-2">
                    <StatusBadge status={displayStatus} />
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-white/50">
                    Progress
                  </span>
                  <strong className="mt-1 block text-3xl font-black">
                    {progress}%
                  </strong>
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#2563eb]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <HeroInfo label="Pembayaran" value={formatStatus(paymentStatus)} />
                <HeroInfo label="Pesanan" value={formatStatus(orderStatus)} />
                <HeroInfo label="Paket" value={formatPackage(order.paket)} />
                <HeroInfo label="Harga" value={formatRupiah(order.harga_paket)} />
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className="mt-6 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold text-[#2563eb]">
            {message}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="grid gap-6">
            <Card eyebrow="Order Summary" title="Ringkasan Order">
              <div className="grid gap-3 md:grid-cols-2">
                <Info label="Kode Order" value={order.kode_order || `ORDER-${order.id}`} />
                <Info label="Template" value={getTemplateName(order)} />
                <Info label="Paket" value={formatPackage(order.paket)} />
                <Info label="Harga Paket" value={formatRupiah(order.harga_paket)} />
                <Info label="Status Pembayaran" value={formatStatus(paymentStatus)} />
                <Info label="Status Pesanan" value={formatStatus(orderStatus)} />
                <Info label="Tanggal Order" value={formatDate(order.created_at)} />
                <Info label="Terakhir Update" value={formatDate(order.updated_at)} />
              </div>

              {order.catatan_admin && (
                <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-4">
                  <span className="block text-sm font-black text-[#f97316]">
                    Catatan Admin
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[#64748b]">
                    {order.catatan_admin}
                  </p>
                </div>
              )}
            </Card>

            <Card eyebrow="Portfolio Data" title="Data Portfolio">
              <div className="grid gap-3 md:grid-cols-2">
                <Info label="Nama Lengkap" value={profile.nama_lengkap} />
                <Info label="Profesi" value={profile.profesi} />
                <Info label="Email" value={profile.email} />
                <Info label="Nomor HP" value={profile.nomor_hp} />
                <Info label="Instagram" value={profile.instagram} />
                <Info label="LinkedIn" value={profile.linkedin} />
                <Info label="GitHub" value={profile.github} />
                <Info label="Website" value={profile.website} />
              </div>

              {getFileUrl(profile.foto_profil) && (
                <div className="rounded-[24px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
                  <span className="block text-sm font-black text-[#64748b]">
                    Foto Profil
                  </span>

                  <img
                    src={getFileUrl(profile.foto_profil)}
                    alt="Foto Profil"
                    className="mt-3 h-40 w-40 rounded-[24px] object-cover shadow-sm"
                  />
                </div>
              )}

              {(isStandard || isPremium) && (
                <>
                  <Info label="Tentang Saya" value={profile.about_me || profile.about} />

                  <ListInfo
                    title="Skills"
                    items={order.skills || []}
                    emptyText="Skill belum tersedia."
                    getText={(item) => {
                      const name =
                        item.nama_skill ||
                        item.skill ||
                        item.name ||
                        item.nama ||
                        "-";

                      const level =
                        item.level_skill ||
                        item.tingkat_skill ||
                        item.level ||
                        item.tingkat ||
                        "";

                      const percent =
                        item.persentase_skill ||
                        item.persentase ||
                        item.percent ||
                        "";

                      return [name, level, percent ? `${percent}%` : ""]
                        .filter(Boolean)
                        .join(" • ");
                    }}
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
            </Card>

            {isPremium && (
              <>
                <Card eyebrow="Premium Data" title="Projects">
                  <ListInfo
                    title="Daftar Project"
                    items={order.projects || []}
                    emptyText="Project belum tersedia."
                    getText={(item) => {
                      const title =
                        item.nama_project ||
                        item.nama_proyek ||
                        item.title ||
                        item.name ||
                        "-";

                      const description =
                        item.deskripsi_project ||
                        item.deskripsi ||
                        item.description ||
                        "";

                      const link =
                        item.link_project || item.link || item.url || "";

                      return [title, description, link]
                        .filter(Boolean)
                        .join(" • ");
                    }}
                  />

                  <ProjectImages items={order.projects || []} />
                </Card>

                <Card eyebrow="Premium Data" title="Pendidikan & Pengalaman">
                  <ListInfo
                    title="Pendidikan"
                    items={order.educations || []}
                    emptyText="Pendidikan belum tersedia."
                    getText={(item) => {
                      const school =
                        item.nama_sekolah ||
                        item.nama_kampus ||
                        item.sekolah ||
                        item.school ||
                        item.title ||
                        "-";

                      const major = item.jurusan || item.program_studi || "";
                      const start = item.tahun_mulai || "";
                      const end = item.tahun_selesai || "";
                      const year =
                        start || end ? `${start || "-"} - ${end || "-"}` : "";

                      return [
                        school,
                        major,
                        year,
                        item.deskripsi || item.description,
                      ]
                        .filter(Boolean)
                        .join(" • ");
                    }}
                  />

                  <ListInfo
                    title="Pengalaman"
                    items={order.experiences || []}
                    emptyText="Pengalaman belum tersedia."
                    getText={(item) => {
                      const position =
                        item.posisi ||
                        item.jabatan ||
                        item.position ||
                        item.title ||
                        "-";

                      const place =
                        item.nama_tempat ||
                        item.perusahaan ||
                        item.company ||
                        "";

                      const start = item.tahun_mulai || "";
                      const end = item.tahun_selesai || "";
                      const year =
                        start || end ? `${start || "-"} - ${end || "-"}` : "";

                      return [
                        position,
                        place,
                        year,
                        item.deskripsi || item.description,
                      ]
                        .filter(Boolean)
                        .join(" • ");
                    }}
                  />
                </Card>

                <Card eyebrow="Premium Data" title="Sertifikat & Pencapaian">
                  <ListInfo
                    title="Sertifikat"
                    items={order.certificates || []}
                    emptyText="Sertifikat belum tersedia."
                    getText={(item) => {
                      const title =
                        item.nama_sertifikat ||
                        item.sertifikat ||
                        item.name ||
                        item.title ||
                        "-";

                      const issuer = item.penerbit || item.issuer || "";
                      const year = item.tahun || "";

                      return [title, issuer, year].filter(Boolean).join(" • ");
                    }}
                  />

                  <CertificateFiles items={order.certificates || []} />

                  <ListInfo
                    title="Pencapaian"
                    items={order.achievements || []}
                    emptyText="Pencapaian belum tersedia."
                    getText={(item) => {
                      const title =
                        item.nama_pencapaian ||
                        item.pencapaian ||
                        item.name ||
                        item.title ||
                        "-";

                      const description =
                        item.deskripsi || item.description || "";
                      const year = item.tahun || "";

                      return [title, description, year]
                        .filter(Boolean)
                        .join(" • ");
                    }}
                  />
                </Card>
              </>
            )}
          </div>

          <aside className="grid gap-6 self-start">
            <Card eyebrow="Payment" title="Pembayaran">
              <div className="grid gap-3">
                <Info label="Metode Pembayaran" value={payment.metode_pembayaran} />
                <Info
                  label="Bank / E-Wallet Pengirim"
                  value={payment.bank_atau_ewallet_pengirim}
                />
                <Info label="Nomor Pengirim" value={payment.nomor_pengirim} />
                <Info label="Nama Pengirim" value={payment.nama_pengirim} />
                <Info
                  label="Jumlah Pembayaran"
                  value={formatRupiah(payment.jumlah_pembayaran)}
                />
                <Info
                  label="Tanggal Pembayaran"
                  value={formatDate(payment.tanggal_pembayaran)}
                />
                <Info label="Status" value={formatStatus(payment.status)} />
              </div>

              {payment.alasan_penolakan && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <span className="block text-sm font-black text-red-600">
                    Alasan Penolakan
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-7 text-red-500">
                    {payment.alasan_penolakan}
                  </p>
                </div>
              )}

              {paymentProofUrl ? (
                <button
                  type="button"
                  onClick={() => setPaymentProofModal(paymentProofUrl)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
                >
                  Lihat Bukti Pembayaran
                </button>
              ) : (
                <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-4 text-sm font-bold text-[#f97316]">
                  Bukti pembayaran belum tersedia.
                </div>
              )}

              {canUploadAgain && (
                <Link
                  to={`/user/orders/${order.id}/upload-payment-proof`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-5 text-center text-sm font-black text-[#f97316] transition hover:bg-[#ffedd5]"
                >
                  Upload Ulang Bukti Pembayaran
                </Link>
              )}
            </Card>

            <Card eyebrow="Progress" title="Alur Order">
              <div className="grid gap-3">
                <ProgressStep
                  active={progress >= 20}
                  title="Order dibuat"
                  desc="Data order portfolio berhasil masuk."
                />

                <ProgressStep
                  active={paymentStatus === "menunggu_verifikasi" || progress >= 40}
                  title="Verifikasi pembayaran"
                  desc="Admin mengecek bukti pembayaran."
                />

                <ProgressStep
                  active={paymentStatus === "lunas" || progress >= 60}
                  title="Pembayaran lunas"
                  desc="Pembayaran sudah disetujui admin."
                />

                <ProgressStep
                  active={orderStatus === "diproses" || progress >= 80}
                  title="Diproses admin"
                  desc="Admin memproses portfolio kamu."
                />

                <ProgressStep
                  active={orderStatus === "selesai" || progress >= 100}
                  title="Selesai"
                  desc="Link portfolio final sudah aktif."
                />
              </div>
            </Card>

           <Card eyebrow="Action" title="Aksi Order">
              <div className="grid gap-3">
                <Link
                  to="/user/orders"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-center text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
                >
                  ← Kembali ke Order Saya
                </Link>

                {canPreviewPortfolio && (
                  <Link
                    to={`/user/orders/${order.id}/preview-portfolio`}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-5 text-center text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)] transition hover:bg-[#1d4ed8]"
                  >
                    Lihat Preview Portfolio
                  </Link>
                )}

                {canOpenPortfolio && (
                  <a
                    href={portfolioFinalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 text-center text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Buka Portfolio Final
                  </a>
                )}

                {!canPreviewPortfolio && !canOpenPortfolio && (
                  <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-4 text-sm font-bold leading-7 text-[#f97316]">
                    Preview atau link portfolio akan muncul setelah order diproses admin.
                  </div>
                )}
              </div>
            </Card> 
          </aside>
        </section>

        {paymentProofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                    Bukti Pembayaran
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-[#111827]">
                    Preview Bukti Transfer
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentProofModal(null)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#e5e7eb] bg-[#f8fafc] text-xl font-black text-[#111827] hover:bg-[#eff6ff]"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[72vh] overflow-auto rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
                {paymentProofModal?.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={paymentProofModal}
                    title="Bukti Pembayaran"
                    className="h-[68vh] w-full rounded-xl bg-white"
                  />
                ) : (
                  <img
                    src={paymentProofModal}
                    alt="Bukti Pembayaran"
                    className="mx-auto max-h-[68vh] w-auto max-w-full rounded-xl object-contain"
                  />
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-3">
                <a
                  href={paymentProofModal}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 text-sm font-black text-[#111827] hover:bg-[#f8fafc]"
                >
                  Buka di Tab Baru
                </a>

                <button
                  type="button"
                  onClick={() => setPaymentProofModal(null)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-5 text-sm font-black text-white hover:bg-[#1d4ed8]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const Card = ({ eyebrow, title, children }) => {
  return (
    <section className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#111827]">
        {title}
      </h2>

      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
};

const Info = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <span className="block text-xs font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        {label}
      </span>

      <strong className="mt-1 block break-words text-sm leading-6 text-[#111827]">
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
      <span className="block text-xs font-black uppercase tracking-[0.12em] text-[#94a3b8]">
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

const ProjectImages = ({ items = [] }) => {
  const images = items
    .map((item) => getFileUrl(item.gambar_project || item.image || item.gambar))
    .filter(Boolean);

  if (images.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <span className="block text-xs font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        Gambar Project
      </span>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Project ${index + 1}`}
            className="h-40 w-full rounded-2xl object-cover"
          />
        ))}
      </div>
    </div>
  );
};

const CertificateFiles = ({ items = [] }) => {
  const files = items
    .map((item) => getFileUrl(item.file_sertifikat || item.file || item.url))
    .filter(Boolean);

  if (files.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <span className="block text-xs font-black uppercase tracking-[0.12em] text-[#94a3b8]">
        File Sertifikat
      </span>

      <div className="mt-3 grid gap-2">
        {files.map((file, index) => (
          <a
            key={index}
            href={file}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-black text-[#2563eb] hover:bg-[#eff6ff]"
          >
            Buka Sertifikat {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

const HeroInfo = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>

      <strong className="mt-1 block text-sm text-white">{value || "-"}</strong>
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

const ProgressStep = ({ active, title, desc }) => {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#f8fafc] p-4">
      <span
        className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black ${
          active
            ? "bg-[#2563eb] text-white"
            : "bg-[#e5e7eb] text-[#94a3b8]"
        }`}
      >
        ✓
      </span>

      <div>
        <h4 className="text-sm font-black text-[#111827]">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-[#64748b]">{desc}</p>
      </div>
    </div>
  );
};

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim();
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
  return getStatusData(normalizeStatus(status)).label;
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

const getFileUrl = (path) => {
  return storageUrl(path) || "";
};

const getPaymentProofUrl = (payment) => {
  const proof =
    payment?.foto_bukti_pembayaran ||
    payment?.bukti_pembayaran ||
    payment?.payment_proof;

  return getFileUrl(proof);
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

export default UserOrderDetailPage;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/sweetAlert";

const paymentDestinations = [
  {
    title: "BCA",
    type: "Bank Transfer",
    number: "1234567890",
    name: "Build Portfolio",
    note: "Transfer sesuai nominal paket yang dipilih.",
  },
  {
    title: "BRI",
    type: "Bank Transfer",
    number: "0987654321",
    name: "Build Portfolio",
    note: "Pastikan nama pengirim sesuai dengan data pembayaran.",
  },
  {
    title: "DANA / GoPay",
    type: "E-Wallet",
    number: "081234567890",
    name: "Build Portfolio",
    note: "Kirim bukti pembayaran setelah transfer berhasil.",
  },
];

const UploadPaymentProofPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [form, setForm] = useState({
    metode_pembayaran: "",
    bank_atau_ewallet_pengirim: "",
    nomor_pengirim: "",
    nama_pengirim: "",
    jumlah_pembayaran: "",
    tanggal_pembayaran: "",
    foto_bukti_pembayaran: null,
  });

  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const fetchOrder = async () => {
    try {
      setFetchLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.get(`/user/orders/${id}`);
      const orderData = response.data?.data || response.data;
      const price = getOrderPrice(orderData);

      setOrder(orderData);

      setForm((prev) => ({
        ...prev,
        jumlah_pembayaran: price || "",
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil data order.";

      setMessage(errorMessage);

      await showErrorAlert("Gagal Memuat Order", errorMessage);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      foto_bukti_pembayaran: file,
    }));

    setErrors((prev) => ({
      ...prev,
      foto_bukti_pembayaran: "",
    }));

    if (!file) {
      setPreview(null);
      setPreviewType("");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setPreviewType(file.type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmUpload = await showConfirmAlert({
      title: "Kirim ulang bukti pembayaran?",
      text: "Data pembayaran dan bukti transfer baru akan dikirim untuk diverifikasi ulang oleh admin.",
      confirmButtonText: "Ya, kirim ulang",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmUpload.isConfirmed) return;

    try {
      setLoading(true);
      setSuccess(false);
      setMessage("");
      setErrors({});

      const formData = new FormData();

      formData.append("metode_pembayaran", form.metode_pembayaran);
      formData.append(
        "bank_atau_ewallet_pengirim",
        form.bank_atau_ewallet_pengirim
      );
      formData.append("nomor_pengirim", form.nomor_pengirim);
      formData.append("nama_pengirim", form.nama_pengirim);
      formData.append("jumlah_pembayaran", form.jumlah_pembayaran);
      formData.append("tanggal_pembayaran", form.tanggal_pembayaran);

      if (form.foto_bukti_pembayaran) {
        formData.append("foto_bukti_pembayaran", form.foto_bukti_pembayaran);
      }

      await axiosInstance.post(
        `/user/orders/${id}/upload-payment-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const successMessage =
        "Bukti pembayaran berhasil dikirim ulang. Status pembayaran sekarang menunggu verifikasi admin.";

      setSuccess(true);
      setMessage(successMessage);

      await showSuccessAlert(
        "Bukti Pembayaran Terkirim",
        "Bukti pembayaran berhasil dikirim ulang dan menunggu verifikasi admin."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Gagal mengirim ulang bukti pembayaran.";

      setSuccess(false);
      setMessage(errorMessage);
      setErrors(error.response?.data?.errors || {});

      await showErrorAlert("Gagal Upload Bukti", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="h-[340px] animate-pulse rounded-[34px] bg-white shadow-sm" />
          <div className="mt-6 h-[520px] animate-pulse rounded-[30px] bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  const orderStatus = normalizeStatus(order?.status_pesanan || "pending");
  const paymentStatus = normalizeStatus(
    order?.status_pembayaran || order?.payment?.status || "ditolak"
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#111827] md:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="overflow-hidden rounded-[34px] bg-[#0f172a] p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#fdba74]">
                Upload Ulang Pembayaran
              </p>

              <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[1] tracking-[-0.05em]">
                Bukti Pembayaran
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                Isi ulang data pembayaran dan upload bukti transfer terbaru agar
                admin bisa melakukan verifikasi ulang.
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
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroInfo label="Kode Order" value={order?.kode_order || `ORDER-${id}`} />
                <HeroInfo label="Paket" value={formatPackage(order?.paket)} />
                <HeroInfo label="Jumlah" value={formatRupiah(form.jumlah_pembayaran)} />
                <HeroInfo label="Status" value={formatStatus(paymentStatus)} />
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div
            className={`mt-6 rounded-2xl border px-5 py-4 text-sm font-bold leading-7 ${
              success
                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                : Object.keys(errors).length > 0
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]"
            }`}
          >
            <p>{message}</p>

            {Object.keys(errors).length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                {Object.entries(errors).map(([field, messages]) => (
                  <li key={field}>{formatErrorMessage(field, messages)}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {orderStatus === "ditolak" ? (
          <section className="mt-6 rounded-[30px] border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm">
            <h2 className="text-2xl font-black tracking-[-0.04em]">
              Order ini sudah ditolak.
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7">
              Bukti pembayaran tidak dapat diupload ulang karena pesanan sudah
              dihentikan oleh admin.
            </p>

            <Link
              to={`/user/orders/${id}`}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-black text-white transition hover:bg-red-700"
            >
              Kembali ke Detail Order
            </Link>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
            <Card eyebrow="Payment Destination" title="Rekening Tujuan">
              <SectionNote>
                Transfer sesuai nominal paket, lalu upload bukti pembayaran
                terbaru. Pastikan foto bukti transfer jelas dan tidak terpotong.
              </SectionNote>

              <div className="grid gap-4 md:grid-cols-3">
                {paymentDestinations.map((destination) => (
                  <PaymentMethodCard
                    key={destination.title}
                    destination={destination}
                  />
                ))}
              </div>
            </Card>

            <Card eyebrow="Payment Form" title="Data Pembayaran Baru">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Metode Pembayaran"
                  name="metode_pembayaran"
                  value={form.metode_pembayaran}
                  onChange={handleChange}
                  placeholder="Contoh: Transfer Bank / E-Wallet"
                  required
                  disabled={success}
                  helperText="Isi metode pembayaran yang kamu gunakan untuk transfer."
                />

                <Input
                  label="Bank / E-Wallet Pengirim"
                  name="bank_atau_ewallet_pengirim"
                  value={form.bank_atau_ewallet_pengirim}
                  onChange={handleChange}
                  placeholder="Contoh: BCA / DANA / GoPay"
                  required
                  disabled={success}
                  helperText="Isi nama bank atau e-wallet yang digunakan."
                />

                <Input
                  label="Nomor Pengirim"
                  name="nomor_pengirim"
                  value={form.nomor_pengirim}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                  required
                  disabled={success}
                  helperText="Isi nomor rekening, nomor e-wallet, atau nomor HP pengirim."
                />

                <Input
                  label="Nama Pengirim"
                  name="nama_pengirim"
                  value={form.nama_pengirim}
                  onChange={handleChange}
                  placeholder="Contoh: Tiaa Anggraeni"
                  required
                  disabled={success}
                  helperText="Isi nama pemilik rekening atau e-wallet pengirim."
                />

                <Input
                  label="Jumlah Pembayaran"
                  name="jumlah_pembayaran"
                  type="number"
                  value={form.jumlah_pembayaran}
                  readOnly
                  required
                  helperText="Jumlah pembayaran otomatis mengikuti harga paket."
                />

                <Input
                  label="Tanggal Pembayaran"
                  name="tanggal_pembayaran"
                  type="date"
                  value={form.tanggal_pembayaran}
                  onChange={handleChange}
                  required
                  disabled={success}
                  helperText="Pilih tanggal ketika pembayaran dilakukan."
                />
              </div>

              <FileInput
                label="Foto Bukti Pembayaran"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
                disabled={success}
                helperText="Upload screenshot atau foto bukti transfer yang jelas."
              />

              {preview && (
                <div className="rounded-[26px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
                  <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#f97316]">
                    Preview Bukti Pembayaran
                  </p>

                  {previewType === "application/pdf" ? (
                    <iframe
                      src={preview}
                      title="Preview bukti pembayaran"
                      className="h-[420px] w-full rounded-2xl bg-white"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview bukti pembayaran"
                      className="max-h-[420px] w-full rounded-2xl object-contain"
                    />
                  )}
                </div>
              )}
            </Card>

            <div className="flex flex-wrap gap-3">
              {!success && (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Mengirim..." : "Kirim Ulang Bukti Pembayaran"}
                </button>
              )}

              {success && (
                <Link
                  to={`/user/orders/${id}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(16,185,129,0.2)] transition hover:bg-emerald-700"
                >
                  Lihat Detail Order
                </Link>
              )}

              <Link
                to={`/user/orders/${id}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-7 text-sm font-black text-[#111827] transition hover:bg-[#f8fafc]"
              >
                Keluar
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

const Card = ({ eyebrow, title, children }) => {
  return (
    <section className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:p-7">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-[clamp(28px,4vw,40px)] font-black leading-none tracking-[-0.05em] text-[#111827]">
        {title}
      </h2>

      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
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

const SectionNote = ({ children }) => {
  return (
    <div className="rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-4 text-sm font-bold leading-7 text-[#2563eb]">
      {children}
    </div>
  );
};

const PaymentMethodCard = ({ destination }) => {
  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-[#f8fafc] p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-black tracking-[-0.04em] text-[#111827]">
          {destination.title}
        </h3>

        <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-black text-[#f97316]">
          {destination.type}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
          Nomor
        </p>
        <p className="mt-2 break-words text-xl font-black text-[#111827]">
          {destination.number}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
          Atas Nama
        </p>
        <p className="mt-2 text-lg font-black text-[#111827]">
          {destination.name}
        </p>
      </div>

      <p className="mt-5 text-sm font-semibold leading-6 text-[#64748b]">
        {destination.note}
      </p>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  name,
  type = "text",
  required = false,
  readOnly = false,
  disabled = false,
  placeholder = "",
  helperText = "",
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10 disabled:cursor-not-allowed disabled:opacity-70 read-only:cursor-not-allowed read-only:bg-[#eef2f7] read-only:text-[#64748b]"
      />

      {helperText && (
        <small className="mt-2 block text-xs font-semibold leading-5 text-[#64748b]">
          {helperText}
        </small>
      )}
    </label>
  );
};

const FileInput = ({
  label,
  onChange,
  accept,
  required = false,
  disabled = false,
  helperText = "",
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#111827]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <input
        type="file"
        accept={accept}
        required={required}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#64748b] file:mr-4 file:rounded-xl file:border-0 file:bg-[#2563eb] file:px-4 file:py-2 file:text-sm file:font-black file:text-white disabled:cursor-not-allowed disabled:opacity-70"
      />

      {helperText && (
        <small className="mt-2 block text-xs font-semibold leading-5 text-[#64748b]">
          {helperText}
        </small>
      )}
    </label>
  );
};

const getOrderPrice = (orderData) => {
  if (!orderData) return "";

  const paket = String(orderData.paket || "").toLowerCase();

  if (orderData.total_harga) return orderData.total_harga;
  if (orderData.harga) return orderData.harga;
  if (orderData.price) return orderData.price;
  if (orderData.jumlah_pembayaran) return orderData.jumlah_pembayaran;

  if (paket === "basic") {
    return (
      orderData.template?.harga_basic ||
      orderData.template?.harga_basic_package ||
      orderData.template?.harga_basic_paket ||
      0
    );
  }

  if (paket === "standar" || paket === "standard") {
    return (
      orderData.template?.harga_standar ||
      orderData.template?.harga_standard ||
      orderData.template?.harga_standar_package ||
      orderData.template?.harga_standard_package ||
      0
    );
  }

  if (paket === "premium") {
    return (
      orderData.template?.harga_premium ||
      orderData.template?.harga_premium_package ||
      0
    );
  }

  return "";
};

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
};

const formatPackage = (paket) => {
  if (!paket) return "-";
  return String(paket).charAt(0).toUpperCase() + String(paket).slice(1);
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

const formatRupiah = (value) => {
  const number = Number(value || 0);
  return `Rp${number.toLocaleString("id-ID")}`;
};

const formatErrorMessage = (field, messages) => {
  const message = Array.isArray(messages) ? messages[0] : messages;

  const fieldLabels = {
    metode_pembayaran: "Metode pembayaran",
    bank_atau_ewallet_pengirim: "Bank / e-wallet pengirim",
    nomor_pengirim: "Nomor pengirim",
    nama_pengirim: "Nama pengirim",
    jumlah_pembayaran: "Jumlah pembayaran",
    tanggal_pembayaran: "Tanggal pembayaran",
    foto_bukti_pembayaran: "Foto bukti pembayaran",
  };

  const label = fieldLabels[field] || field;

  if (!message) return `${label} tidak valid.`;

  if (message.includes("required")) {
    return `${label} wajib diisi.`;
  }

  if (message.includes("must not be greater than")) {
    return `${label} terlalu besar. Gunakan file dengan ukuran yang lebih kecil.`;
  }

  if (message.includes("image")) {
    return `${label} harus berupa gambar yang valid.`;
  }

  if (message.includes("file")) {
    return `${label} harus berupa file yang valid.`;
  }

  if (message.includes("numeric") || message.includes("number")) {
    return `${label} harus berupa angka.`;
  }

  if (message.includes("date")) {
    return `${label} harus berupa tanggal yang valid.`;
  }

  return `${label}: ${message}`;
};

export default UploadPaymentProofPage;
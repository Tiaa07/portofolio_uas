import { useState } from "react";
import { Link } from "react-router-dom";
import {
  showConfirmAlert,
  showWarningAlert,
} from "../../utils/sweetAlert";

const ContactPage = () => {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    pesan: "",
  });

  const [errors, setErrors] = useState({});

  const adminEmail = "buildportfolio7@gmail.com";

  const supportCards = [
    {
      number: "01",
      title: "Template & Paket",
      desc: "Tanya paket Basic, Standard, atau Premium yang paling cocok untuk kebutuhan portfolio kamu.",
    },
    {
      number: "02",
      title: "Pembayaran",
      desc: "Bantuan terkait upload bukti pembayaran, status verifikasi, atau nominal paket.",
    },
    {
      number: "03",
      title: "Link Final",
      desc: "Tanya proses portfolio final, preview, dan link portfolio yang sudah aktif.",
    },
  ];

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

  const handleSendEmail = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!form.nama.trim()) {
      newErrors.nama = "Nama wajib diisi.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!form.pesan.trim()) {
      newErrors.pesan = "Kritik atau saran wajib diisi.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      await showWarningAlert(
        "Form Belum Lengkap",
        "Lengkapi nama, email, dan kritik/saran terlebih dahulu."
      );

      return;
    }

    const confirmSend = await showConfirmAlert({
      title: "Kirim lewat Gmail?",
      text: "Gmail akan terbuka di tab baru dengan isi pesan yang sudah disiapkan.",
      confirmButtonText: "Ya, buka Gmail",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmSend.isConfirmed) return;

    const subject = encodeURIComponent("Kritik dan Saran Build Portfolio");

    const body = encodeURIComponent(
      `Halo Admin Build Portfolio,

  Saya ingin mengirim kritik/saran.

  Nama:
  ${form.nama}

  Email:
  ${form.email}

  Kritik/Saran:
  ${form.pesan}

  Terima kasih.`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="overflow-hidden text-[#111827]">
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <form
            onSubmit={handleSendEmail}
            className="relative overflow-hidden rounded-[34px] border border-[#e5e7eb] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-8"
          >
            <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#dbeafe]" />
            <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[#ffedd5]" />

            <div className="relative">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f97316]">
                Contact Form
              </p>

              <h1 className="mt-4 max-w-3xl text-[clamp(34px,5vw,58px)] font-black leading-[1] tracking-[-0.05em] text-[#111827]">
                Kirim pertanyaan, kritik, atau saran kamu.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#64748b] md:text-base">
                Isi form di bawah ini. Setelah dikirim, Gmail akan terbuka
                otomatis dan pesan kamu akan diarahkan ke email admin Build
                Portfolio.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-[#111827]">
                    Nama
                  </span>

                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama kamu"
                    className={`min-h-12 w-full rounded-2xl border bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                      errors.nama
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                        : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                    }`}
                  />

                  {errors.nama && (
                    <p className="mt-2 text-xs font-bold text-red-500">
                      {errors.nama}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-[#111827]">
                    Email
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className={`min-h-12 w-full rounded-2xl border bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                        : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-2 text-xs font-bold text-red-500">
                      {errors.email}
                    </p>
                  )}
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-black text-[#111827]">
                  Kritik / Saran
                </span>

                <textarea
                  rows={7}
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  placeholder="Tulis pertanyaan, kritik, atau saran kamu di sini..."
                  className={`w-full rounded-2xl border bg-[#f8fafc] px-4 py-3 text-sm font-semibold leading-7 text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                    errors.pesan
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                      : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                  }`}
                />

                {errors.pesan && (
                  <p className="mt-2 text-xs font-bold text-red-500">
                    {errors.pesan}
                  </p>
                )}
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
                >
                  Kirim Lewat Email
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-7 text-sm font-black text-[#111827] shadow-sm transition hover:bg-[#f8fafc]"
                >
                  Email Admin
                </a>
              </div>
            </div>
          </form>

          <aside className="grid gap-5">
            <div className="rounded-[34px] bg-[#0f172a] p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/logo.png"
                    alt="Build Portfolio Logo"
                    className="h-12 w-12 object-contain"
                  />

                  <div>
                    <strong className="block text-sm">Build Portfolio</strong>
                    <span className="text-xs font-semibold text-white/60">
                      Support Center
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#fdba74]">
                  Gmail
                </span>
              </div>

              <h2 className="text-[clamp(28px,4vw,42px)] font-black leading-[1] tracking-[-0.04em]">
                Admin siap bantu proses portfolio kamu.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/70">
                Untuk sekarang, pesan akan dikirim melalui Gmail.
              </p>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-white/50">
                  Email tujuan
                </span>
                <strong className="mt-1 block text-sm text-white">
                  {adminEmail}
                </strong>
              </div>
            </div>

            <div className="grid gap-4">
              {supportCards.map((item, index) => (
                <article
                  key={item.number}
                  className={`rounded-[26px] border border-[#e5e7eb] p-5 shadow-sm ${
                    index === 0
                      ? "bg-[#eff6ff]"
                      : index === 1
                      ? "bg-[#fff7ed]"
                      : "bg-white"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-2xl text-xs font-black text-white ${
                      index === 0
                        ? "bg-[#2563eb]"
                        : index === 1
                        ? "bg-[#f97316]"
                        : "bg-[#0f172a]"
                    }`}
                  >
                    {item.number}
                  </span>

                  <h3 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#111827]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#64748b]">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 py-12 md:py-14">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center justify-between gap-5 rounded-[30px] border border-[#e5e7eb] bg-white p-7 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:flex-row md:text-left">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
              Need more info?
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#111827] md:text-3xl">
              Mau lihat template dulu sebelum bertanya?
            </h2>
          </div>

          <Link
            to="/templates"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af]"
          >
            Lihat Template
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
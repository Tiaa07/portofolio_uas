import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
  getErrorMessage,
  getValidationErrors,
} from "../../utils/responseHelper";
import { showErrorAlert,showSuccessAlert } from "../../utils/sweetAlert";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const response = await axiosInstance.post("/register", form);

      const successMessage =
        response.data.message ||
        "Registrasi berhasil. Silakan login menggunakan akun kamu.";

      setMessage(successMessage);

      await showSuccessAlert(
        "Registrasi Berhasil",
        "Akun kamu berhasil dibuat. Silakan login untuk melanjutkan."
      );

      navigate("/login");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Registrasi gagal.");

      setMessage(errorMessage);
      setErrors(getValidationErrors(error));

      await showErrorAlert("Registrasi Gagal", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="overflow-hidden px-4 py-12 text-[#111827] md:py-16">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative min-h-[560px] overflow-hidden rounded-[34px] border border-[#e5e7eb] bg-[#f8fafc] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <img
            src="/images/register-image.png"
            alt="Register Build Portfolio"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/25 to-transparent" />

          <div className="absolute left-6 top-6 flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm backdrop-blur">
            <img
              src="/images/logo.png"
              alt="Build Portfolio Logo"
              className="h-9 w-9 object-contain"
            />

            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#111827]">
              Build Portfolio
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#fdba74]">
              Create Account
            </p>

            <h1 className="mt-3 max-w-lg text-[clamp(34px,4.5vw,56px)] font-black leading-[1] tracking-[-0.05em]">
              Mulai buat portfolio profesional kamu.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Daftar akun user untuk memilih template, membuat order, mengisi
              data portfolio, upload bukti pembayaran, dan mendapatkan link
              final.
            </p>
          </div>
        </section>

        <section className="rounded-[34px] border border-[#e5e7eb] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                Register
              </p>

              <h2 className="mt-3 text-[clamp(34px,4.6vw,54px)] font-black leading-none tracking-[-0.05em] text-[#111827]">
                Daftar Akun
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#64748b] md:text-base">
                Buat akun user baru untuk mulai order portfolio.
              </p>
            </div>

            <img
              src="/images/logo.png"
              alt="Build Portfolio Logo"
              className="hidden h-16 w-16 object-contain sm:block"
            />
          </div>

          {message && (
            <div className="mb-5 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm font-bold leading-7 text-[#2563eb]">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#111827]">
                Nama
              </span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama kamu"
                className={`min-h-12 w-full rounded-2xl border bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                  errors.name
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                    : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                }`}
              />

              {errors.name && (
                <small className="mt-2 block text-xs font-bold text-red-500">
                  {errors.name[0]}
                </small>
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
                placeholder="email@example.com"
                className={`min-h-12 w-full rounded-2xl border bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                    : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                }`}
              />

              {errors.email && (
                <small className="mt-2 block text-xs font-bold text-red-500">
                  {errors.email[0]}
                </small>
              )}
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-[#111827]">
                  Password
                </span>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  className={`min-h-12 w-full rounded-2xl border bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                    errors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                      : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                  }`}
                />

                {errors.password && (
                  <small className="mt-2 block text-xs font-bold text-red-500">
                    {errors.password[0]}
                  </small>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-[#111827]">
                  Konfirmasi
                </span>

                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={`min-h-12 w-full rounded-2xl border bg-[#f8fafc] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                    errors.password_confirmation
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                      : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                  }`}
                />

                {errors.password_confirmation && (
                  <small className="mt-2 block text-xs font-bold text-red-500">
                    {errors.password_confirmation[0]}
                  </small>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <div className="mt-6 rounded-[24px] bg-[#f8fafc] px-5 py-4">
            <p className="text-sm leading-7 text-[#64748b]">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-black text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                Login sekarang
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

const MiniInfo = ({ title, desc }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3">
      <strong className="block text-sm font-black text-[#111827]">
        {title}
      </strong>

      <span className="mt-1 block text-xs font-semibold leading-5 text-[#64748b]">
        {desc}
      </span>
    </div>
  );
};

export default RegisterPage;
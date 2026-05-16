import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { saveAuthData } from "../../utils/auth";
import {
  getErrorMessage,
  getTokenFromResponse,
  getUserFromResponse,
  getValidationErrors,
} from "../../utils/responseHelper";
import { showErrorAlert, showSuccessAlert } from "../../utils/sweetAlert";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await axiosInstance.post("/login", form);

      const data = response.data?.data || response.data;
      const token = getTokenFromResponse(response);
      const user = getUserFromResponse(response);

      if (token && user?.role === "admin") {
        saveAuthData({ token, user });

        await showSuccessAlert(
          "Login Admin Berhasil",
          "Selamat datang di dashboard admin."
        );

        navigate("/admin/dashboard");
        return;
      }

      if (data?.role === "user") {
        localStorage.setItem("otp_email", data.email || form.email);

        const successMessage =
          response.data?.message ||
          "Login berhasil. Kode OTP sudah dikirim ke email.";

        setMessage(successMessage);

        await showSuccessAlert(
          "OTP Dikirim",
          "Kode OTP sudah dikirim ke email kamu. Silakan verifikasi untuk melanjutkan."
        );

        navigate("/verify-otp", {
          state: {
            email: data.email || form.email,
          },
        });

        return;
      }

      if (token && user?.role === "user") {
        saveAuthData({ token, user });

        await showSuccessAlert(
          "Login Berhasil",
          "Selamat datang di dashboard user."
        );

        navigate("/user/dashboard");
        return;
      }

      const successMessage = response.data?.message || "Login berhasil.";
      setMessage(successMessage);
      await showSuccessAlert("Login Berhasil", successMessage);
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Login gagal.");

      setMessage(errorMessage);
      setErrors(getValidationErrors(error));

      await showErrorAlert("Login Gagal", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="overflow-hidden px-4 py-12 text-[#111827] md:py-16">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[34px] border border-[#e5e7eb] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f97316]">
                Login
              </p>

              <h1 className="mt-3 text-[clamp(34px,4.6vw,54px)] font-black leading-none tracking-[-0.05em] text-[#111827]">
                Login Akun
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#64748b] md:text-base">
                Masuk untuk melanjutkan order portfolio, mengisi data, upload
                bukti pembayaran, dan melihat status portfolio kamu.
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

            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#111827]">
                Password
              </span>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
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

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <div className="mt-6 rounded-[24px] bg-[#f8fafc] px-5 py-4">
            <p className="text-sm leading-7 text-[#64748b]">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-black text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                Daftar user
              </Link>
            </p>
          </div>
        </section>

        <section className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-[#e5e7eb] bg-[#f8fafc] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <img
            src="/images/login-image.png"
            alt="Login Build Portfolio"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#fdba74]">
              Build Portfolio
            </p>

            <h2 className="mt-3 max-w-lg text-[clamp(32px,4vw,52px)] font-black leading-[1] tracking-[-0.05em]">
              Portfolio profesional dimulai dari satu akun.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Pilih template, isi data, upload pembayaran, lalu dapatkan link
              portfolio final yang siap dibagikan.
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

export default LoginPage;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { saveAuthData } from "../../utils/auth";
import {
  getErrorMessage,
  getTokenFromResponse,
  getUserFromResponse,
  getValidationErrors,
} from "../../utils/responseHelper";
import {
  showErrorAlert,
  showSuccessAlert,
  showWarningAlert,
} from "../../utils/sweetAlert";


const VerifyOtpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    kode_otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("otp_email");

    if (emailFromStorage) {
      setForm((prev) => ({
        ...prev,
        email: emailFromStorage,
      }));
    }
  }, []);

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

  const handleResendOtp = async () => {
    const targetEmail = form.email || localStorage.getItem("otp_email");

    if (!targetEmail) {
      const warningMessage = "Email tidak ditemukan. Silakan login ulang.";

      setMessage(warningMessage);

      await showWarningAlert("Email Tidak Ditemukan", warningMessage);
      return;
    }

    try {
      setResendLoading(true);
      setMessage("");
      setErrors({});

      const response = await axiosInstance.post("/resend-otp", {
        email: targetEmail,
      });

      localStorage.setItem("otp_email", targetEmail);

      const successMessage =
        response.data?.message || "Kode OTP baru sudah dikirim ke email.";

      setMessage(successMessage);

      await showSuccessAlert(
        "OTP Dikirim Ulang",
        "Kode OTP baru sudah dikirim ke email kamu."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengirim ulang kode OTP.";

      setMessage(errorMessage);
      setErrors(getValidationErrors(error));

      await showErrorAlert("Gagal Kirim Ulang OTP", errorMessage);
    } finally {
      setResendLoading(false);
    }
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const response = await axiosInstance.post("/verify-otp", form);

      const token = getTokenFromResponse(response);
      const user = getUserFromResponse(response);

      if (!token || !user) {
        const warningMessage =
          "OTP berhasil diverifikasi, tapi token/user tidak ditemukan di response.";

        setMessage(warningMessage);

        await showWarningAlert("Data Login Tidak Lengkap", warningMessage);
        return;
      }

      saveAuthData({ token, user });
      localStorage.removeItem("otp_email");

      const successMessage =
        response.data.message || "OTP berhasil diverifikasi.";

      setMessage(successMessage);

      await showSuccessAlert(
        "Verifikasi Berhasil",
        "OTP berhasil diverifikasi. Kamu akan masuk ke dashboard user."
      );

      navigate("/user/dashboard");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Verifikasi OTP gagal.");

      setMessage(errorMessage);
      setErrors(getValidationErrors(error));

      await showErrorAlert("Verifikasi OTP Gagal", errorMessage);
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
                Verify OTP
              </p>

              <h1 className="mt-3 text-[clamp(34px,4.6vw,54px)] font-black leading-none tracking-[-0.05em] text-[#111827]">
                Masukkan OTP
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#64748b] md:text-base">
                Masukkan kode OTP yang dikirim setelah login untuk masuk ke
                dashboard user.
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
                Kode OTP
              </span>

              <input
                type="text"
                name="kode_otp"
                value={form.kode_otp}
                onChange={handleChange}
                placeholder="Contoh: 123456"
                maxLength={6}
                inputMode="numeric"
                className={`min-h-14 w-full rounded-2xl border bg-[#f8fafc] px-4 text-center text-2xl font-black tracking-[0.25em] text-[#111827] outline-none transition placeholder:text-base placeholder:font-semibold placeholder:tracking-normal placeholder:text-[#94a3b8] focus:bg-white focus:ring-4 ${
                  errors.kode_otp
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                    : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#2563eb]/10"
                }`}
              />

              {errors.kode_otp && (
                <small className="mt-2 block text-xs font-bold text-red-500">
                  {errors.kode_otp[0]}
                </small>
              )}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || loading}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-6 text-sm font-black text-[#2563eb] transition hover:bg-[#dbeafe] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendLoading ? "Mengirim ulang..." : "Kirim Ulang OTP"}
            </button>
          </form>

          <div className="mt-6 rounded-[24px] bg-[#f8fafc] px-5 py-4">
            <p className="text-sm leading-7 text-[#64748b]">
              Salah email atau belum dapat kode?{" "}
              <Link
                to="/login"
                className="font-black text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                Login ulang
              </Link>
            </p>
          </div>
        </section>

        <section className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-[#e5e7eb] bg-[#f8fafc] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <img
            src="/images/otp-image.png"
            alt="OTP Build Portfolio"
            className="absolute inset-0 h-full w-full object-cover object-[center_65%]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/25 to-transparent" />

          <div className="absolute left-6 top-6 flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm backdrop-blur">
            <img
              src="/images/logo.png"
              alt="Build Portfolio Logo"
              className="h-9 w-9 object-contain"
            />

            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#111827]">
              OTP Verification
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#fdba74]">
              Secure Login
            </p>

            <h2 className="mt-3 max-w-lg text-[clamp(32px,4vw,52px)] font-black leading-[1] tracking-[-0.05em]">
              Satu langkah lagi menuju dashboard kamu.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Verifikasi OTP membantu memastikan akun user yang masuk sesuai
              dengan email yang digunakan saat login.
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

export default VerifyOtpPage;
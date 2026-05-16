import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { isLoggedIn, getAuthRole } from "../../utils/auth";

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const loggedIn = isLoggedIn();
  const role = getAuthRole();
  const dashboardPath = role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-3 font-extrabold tracking-tight text-[#111827]"
          >
            <span className="relative h-10 w-20 shrink-0 overflow-visible">
              <img
                src="/images/logo.png"
                alt="Build Portfolio Logo"
                className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            </span>

            <span className="text-base font-black md:text-lg">
              Build Portfolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 text-sm font-bold text-[#111827] md:flex">
            <Link
              className="rounded-full px-4 py-2 transition hover:bg-[#f3f4f6]"
              to="/"
            >
              Home
            </Link>

            <Link
              className="rounded-full px-4 py-2 transition hover:bg-[#f3f4f6]"
              to="/about"
            >
              About
            </Link>

            <Link
              className="rounded-full px-4 py-2 transition hover:bg-[#f3f4f6]"
              to="/templates"
            >
              Template
            </Link>

            <Link
              className="rounded-full px-4 py-2 transition hover:bg-[#f3f4f6]"
              to="/contact"
            >
              Contact
            </Link>

            {loggedIn ? (
              <Link
                to={dashboardPath}
                className="inline-flex min-h-9 min-w-[120px] items-center justify-center rounded-full bg-[#2563eb] px-4 text-xs font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)] transition hover:bg-[#1d4ed8] hover:text-white active:bg-[#1e40af]"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  className="rounded-full px-4 py-2 transition hover:bg-[#f3f4f6]"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-9 min-w-[100px] items-center justify-center rounded-full bg-[#2563eb] px-4 text-xs font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)] transition hover:bg-[#1d4ed8] hover:text-white active:bg-[#1e40af]"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#111827] transition hover:bg-[#e5e7eb] md:hidden"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#e5e7eb] bg-white p-4 md:hidden">
            <nav className="flex flex-col gap-1 text-sm font-bold text-[#111827]">
              <Link
                onClick={toggleMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-[#f3f4f6]"
                to="/"
              >
                Home
              </Link>

              <Link
                onClick={toggleMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-[#f3f4f6]"
                to="/about"
              >
                About
              </Link>

              <Link
                onClick={toggleMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-[#f3f4f6]"
                to="/templates"
              >
                Template
              </Link>

              <Link
                onClick={toggleMobileMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-[#f3f4f6]"
                to="/contact"
              >
                Contact
              </Link>

              {loggedIn ? (
                <Link
                  onClick={toggleMobileMenu}
                  to={dashboardPath}
                  className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)] transition hover:bg-[#1d4ed8]"
                >
                  Ke Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    onClick={toggleMobileMenu}
                    className="rounded-xl px-4 py-3 transition hover:bg-[#f3f4f6]"
                    to="/login"
                  >
                    Login
                  </Link>

                  <Link
                    onClick={toggleMobileMenu}
                    to="/register"
                    className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)] transition hover:bg-[#1d4ed8]"
                  >
                    Register Sekarang
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <Outlet />

      <footer className="relative overflow-hidden bg-[#0f172a] px-4 text-white">
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#2563eb]/25 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-[#f97316]/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1180px] py-12">
          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] md:p-8">
            <div className="grid gap-9 lg:grid-cols-[1.15fr_0.75fr_0.95fr]">
              <div>
                <Link to="/" className="inline-flex items-center gap-3">
                  <img
                    src="/images/logo.png"
                    alt="Build Portfolio Logo"
                    className="h-16 w-16 object-contain"
                  />

                  <div>
                    <span className="block text-xl font-black tracking-[-0.04em] text-white">
                      Build Portfolio
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#fdba74]">
                      Portfolio Website Builder
                    </span>
                  </div>
                </Link>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
                  Platform pembuatan website portfolio berbasis template. User
                  cukup memilih template, memilih paket, mengisi data, upload
                  bukti pembayaran, lalu mendapatkan link portfolio final yang
                  siap dibagikan.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white">
                    Template Ready
                  </span>

                  <span className="rounded-full bg-[#2563eb] px-4 py-2 text-xs font-black text-white">
                    Public Link
                  </span>

                  <span className="rounded-full bg-[#f97316] px-4 py-2 text-xs font-black text-white">
                    Admin Process
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                  Quick Menu
                </h3>

                <div className="mt-5 grid gap-3 text-sm font-bold text-white/65">
                  <Link to="/" className="transition hover:text-[#fdba74]">
                    Home
                  </Link>

                  <Link
                    to="/about"
                    className="transition hover:text-[#fdba74]"
                  >
                    About
                  </Link>

                  <Link
                    to="/templates"
                    className="transition hover:text-[#fdba74]"
                  >
                    Template
                  </Link>

                  <Link
                    to="/contact"
                    className="transition hover:text-[#fdba74]"
                  >
                    Contact
                  </Link>

                  <Link
                    to="/login"
                    className="transition hover:text-[#fdba74]"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="transition hover:text-[#fdba74]"
                  >
                    Register
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                  Contact
                </h3>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                    <span className="block text-xs font-black uppercase tracking-[0.14em] text-white/45">
                      Email
                    </span>

                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=buildportfolio7@gmail.com"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block break-all text-sm font-black text-white transition hover:text-[#fdba74]"
                    >
                      buildportfolio7@gmail.com
                    </a>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                    <span className="block text-xs font-black uppercase tracking-[0.14em] text-white/45">
                      Support
                    </span>

                    <p className="mt-2 text-sm font-semibold leading-6 text-white/65">
                      Bantuan template, paket, pembayaran, preview, dan link
                      portfolio final.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-9 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold text-white/55">
                  © {new Date().getFullYear()} Build Portfolio. All rights
                  reserved.
                </p>

                <div className="flex flex-wrap gap-3 text-sm font-bold">
                  <Link
                    to="/templates"
                    className="rounded-full bg-white/10 px-4 py-2 text-white transition hover:bg-white/15"
                  >
                    Lihat Template
                  </Link>

                  <Link
                    to="/contact"
                    className="rounded-full bg-[#2563eb] px-4 py-2 text-white transition hover:bg-[#1d4ed8]"
                  >
                    Bantuan
                  </Link>

                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=buildportfolio7@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#f97316] px-4 py-2 text-white transition hover:bg-[#ea580c]"
                  >
                    Email Admin
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PublicLayout;
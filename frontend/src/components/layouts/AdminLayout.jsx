import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { showConfirmAlert } from "../../utils/sweetAlert";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirm = await showConfirmAlert({
      title: "Logout dari admin?",
      text: "Kamu akan keluar dari halaman admin.",
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      icon: "warning",
    });

    if (!confirm.isConfirmed) return;

    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4 py-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 font-extrabold text-[#111827]"
          >
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[#0f172a] p-1 shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
              <img
                src="/admin-avatar.png"
                alt="Admin Panel"
                className="h-full w-full rounded-xl object-cover"
              />
            </span>

            <div className="leading-none">
              <span className="block text-lg font-black">Admin Panel</span>
              <span className="mt-1 hidden text-xs font-bold text-[#64748b] sm:block">
                Build Portfolio Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 text-sm font-bold text-[#111827] md:flex">
            <AdminNavLink to="/admin/dashboard">Dashboard</AdminNavLink>
            <AdminNavLink to="/admin/orders">Order Masuk</AdminNavLink>
            <button
              type="button"
              className="rounded-full bg-[#0f172a] px-5 py-2.5 font-black text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] transition hover:bg-[#2563eb]"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#111827] transition hover:bg-[#e5e7eb]"
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
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#e5e7eb] bg-white p-4 md:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                to="/admin/dashboard"
                onClick={toggleMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f3f4f6]"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/orders"
                onClick={toggleMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f3f4f6]"
              >
                Order Masuk
              </Link>
              <button
                onClick={() => {
                  toggleMobileMenu();
                  handleLogout();
                }}
                className="mt-2 w-full rounded-xl bg-[#ef4444]/10 px-4 py-3 text-left text-sm font-bold text-[#ef4444] transition hover:bg-[#ef4444]/20"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto w-[min(1180px,calc(100%-32px))] py-8">
        <Outlet />
      </main>
    </div>
  );
};

const AdminNavLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2.5 transition ${isActive
          ? "bg-[#eff6ff] text-[#2563eb]"
          : "text-[#111827] hover:bg-[#f3f4f6]"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default AdminLayout;
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { showConfirmAlert } from "../../utils/sweetAlert";

const getStoredUser = () => {
  const possibleKeys = ["user", "auth_user", "authUser"];

  for (const key of possibleKeys) {
    const raw = localStorage.getItem(key);

    if (!raw) continue;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return null;
};

const UserLayout = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirm = await showConfirmAlert({
      title: "Logout dari akun?",
      text: "Kamu akan keluar dari halaman user.",
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      icon: "warning",
    });

    if (!confirm.isConfirmed) return;

    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2.5 transition ${
      isActive
        ? "bg-[#eff6ff] text-[#2563eb]"
        : "text-[#111827] hover:bg-[#f3f4f6]"
    }`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4 py-4">
          <Link
            to="/user/dashboard"
            className="flex items-center gap-4 text-[#111827]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:h-16 md:w-16 md:rounded-[22px] md:p-1.5">
              <img
                src="/user-avatar.png"
                alt="User Panel"
                className="h-full w-full rounded-lg object-cover md:rounded-[18px]"
              />
            </div>

            <div className="leading-tight">
              <h1 className="text-base font-black tracking-[-0.03em] text-[#0f172a] md:text-[20px]">
                Dashboard User
              </h1>
              <p className="mt-0.5 text-[11px] font-bold text-[#64748b] md:mt-1 md:text-sm">
                {user?.name || "User Account"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 text-sm font-bold md:flex">
            <NavLink className={navClass} to="/user/dashboard">
              Dashboard
            </NavLink>

            <NavLink className={navClass} to="/user/templates">
              Template
            </NavLink>

            <NavLink className={navClass} to="/user/orders">
              Order Saya
            </NavLink>

            <button
              type="button"
              className="ml-2 rounded-full bg-[#0f172a] px-5 py-2.5 font-black text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] transition hover:bg-[#2563eb]"
              onClick={handleLogout}
            >
              Logout
            </button>
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
            <nav className="flex flex-col gap-1 text-sm font-bold">
              <NavLink
                to="/user/dashboard"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 transition ${
                    isActive ? "bg-[#eff6ff] text-[#2563eb]" : "hover:bg-[#f3f4f6]"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/user/templates"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 transition ${
                    isActive ? "bg-[#eff6ff] text-[#2563eb]" : "hover:bg-[#f3f4f6]"
                  }`
                }
              >
                Template
              </NavLink>
              <NavLink
                to="/user/orders"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 transition ${
                    isActive ? "bg-[#eff6ff] text-[#2563eb]" : "hover:bg-[#f3f4f6]"
                  }`
                }
              >
                Order Saya
              </NavLink>
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

      <Outlet />
    </div>
  );
};

export default UserLayout;
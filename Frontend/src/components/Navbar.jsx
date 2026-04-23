import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeartHandshake, Menu, ShoppingBag, X } from "lucide-react";
import { logout } from "../store/slices/authSlice";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [role, setRole] = useState(localStorage.getItem("role"));
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setRole(user?.role || localStorage.getItem("role"));
  }, [user]);

  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  const hideOnAuthPages = [
    "/login",
    "/admin/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  if (
    hideOnAuthPages.some(
      (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
    )
  ) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isLanding = location.pathname === "/" || location.pathname === "/home";
  const isCatalog = location.pathname.startsWith("/products");
  const navTone = isLanding
    ? "bg-white/72 text-slate-950 border-white/70"
    : "bg-white/80 text-slate-800 border-white/70";

  const baseLinks =
    role === "admin"
      ? [
          { to: "/admin/dashboard", label: "Dashboard" },
          { to: "/admin/add-product", label: "Add Product" },
          { to: "/admin/orders", label: "Orders" },
        ]
      : [
          { to: "/home", label: "Home" },
          { to: "/products", label: "Shop" },
          { to: "/orders", label: "Orders" },
          { to: "/profile", label: "Profile" },
        ];

  const activeNavClass = "bg-slate-950 !text-white shadow-md";
  const inactiveDesktopClass = "text-slate-950 hover:bg-slate-100";
  const inactiveMobileClass = "text-slate-700 hover:bg-slate-100";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-[28px] border px-4 py-3 shadow-xl backdrop-blur-xl transition-all duration-300 sm:px-6 ${navTone}`}
      >
        <Link
          to={role === "admin" ? "/admin/dashboard" : "/home"}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-300 to-teal-500 text-slate-950 shadow-lg">
            <HeartHandshake size={20} strokeWidth={2.1} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-600">
              Curated Everyday
            </p>
            <h1 className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              YourShopingStore
            </h1>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {baseLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin/dashboard" || link.to === "/home"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? activeNavClass : inactiveDesktopClass
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {role !== "admin" && (
            <Link
              to="/cart"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isLanding || isCatalog
                  ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <ShoppingBag size={18} />
              Cart
            </Link>
          )}

          {user ? (
            <LogoutButton onClick={handleLogout} />
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isLanding
                    ? "text-slate-950 hover:bg-slate-100"
                    : "text-teal-700 hover:bg-teal-50"
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Create account
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpenMenu((value) => !value)}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border lg:hidden ${
            isLanding
              ? "border-slate-200 bg-white text-slate-950"
              : "border-slate-200 bg-white text-slate-800"
          }`}
          aria-label="Toggle navigation"
        >
          {openMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {openMenu && (
        <div className="dropdown-animate mx-auto mt-3 max-w-7xl rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-2">
            {baseLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin/dashboard" || link.to === "/home"}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? activeNavClass : inactiveMobileClass
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {role !== "admin" && (
              <NavLink
                to="/cart"
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cart
              </NavLink>
            )}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {user ? (
              <LogoutButton onClick={handleLogout} />
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Create account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

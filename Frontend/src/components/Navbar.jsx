import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/authSlice"
import LogoutButton from "./LogoutButton"
import { ShoppingCart } from "lucide-react"


const Navbar = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [role, setRole] = useState(localStorage.getItem("role"))
  const [openMenu, setOpenMenu] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setRole(user?.role || localStorage.getItem("role"))
  }, [user])

  const hideOnAuthPages = ["/login", "/admin/login", "/register", "/signup", "/forgot-password", "/reset-password", "/verify-otp"]
  if (hideOnAuthPages.some((path) => location.pathname === path || location.pathname.startsWith(path + "/"))) return null

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const isHome = location.pathname === "/" || location.pathname === "/home"
  const linkBase =
    `relative pb-1 transition-all duration-300 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:transition-all after:duration-300 ${isHome ? "hover:text-green-400 after:bg-green-400" : "hover:text-green-600 after:bg-green-600"}`

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${location.pathname === "/" || location.pathname === "/home"
          ? "bg-transparent backdrop-blur-sm text-white" 
          : location.pathname === "/products" 
            ? "bg-transparent backdrop-blur-sm text-gray-800" 
            : "bg-white text-gray-800 shadow-md"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to={role === "admin" ? "/admin/dashboard" : "/home"}
          className="text-2xl font-bold tracking-tight flex items-center hover:opacity-90 transition"
        >
          <span className="text-gray-600">Your</span><span className="text-green-600">Store</span><span className="text-green-600 text-3xl leading-8">.</span>
        </Link>

          <button
            className={`md:hidden text-3xl ${isHome ? "text-white" : "text-gray-700"}`}
            onClick={() => setOpenMenu(!openMenu)}
          >
            ☰
          </button>


        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[18px] font-medium text-gray-600">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? (isHome ? "text-green-400" : "text-green-600") + " after:w-full" : ""}`
            }
          >
            Home
          </NavLink>
          {role === "user" && (
            <>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                My Orders
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Profile
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/add-product"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Add Product
              </NavLink>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Manage Orders
              </NavLink>
            </>
          )}
        </div>


{openMenu && (
  <div
    className="md:hidden absolute right-6 top-20 w-48 bg-white text-gray-800 p-4 rounded-2xl shadow-xl 
               flex flex-col gap-3 z-50 dropdown-animate backdrop-blur-md border border-gray-200"
  >
    <NavLink
      to="/home"
      onClick={() => setOpenMenu(false)}
      className="font-semibold hover:text-green-600 transition"
    >
      Home
    </NavLink>
    {role === "user" && (
      <>
        <NavLink
          to="/products"
          onClick={() => setOpenMenu(false)}
          className="font-semibold hover:text-green-600 transition"
        >
          Products
        </NavLink>
        <NavLink
          to="/cart"
          onClick={() => setOpenMenu(false)}
          className="font-semibold hover:text-green-600 transition"
        >
          Cart
        </NavLink>

        <NavLink
          to="/orders"
          onClick={() => setOpenMenu(false)}
          className="font-semibold hover:text-green-600 transition"
        >
          My Orders
        </NavLink>

        <NavLink
          to="/profile"
          onClick={() => setOpenMenu(false)}
          className="font-semibold hover:text-green-600 transition"
        >
          Profile
        </NavLink>
      </>
    )}

    {role === "admin" && (
      <>
        <NavLink
          to="/admin/dashboard"
          onClick={() => setOpenMenu(false)}
          className="font-semibold text-gray-700 hover:text-green-600 transition"
        >
          Dashboard
        </NavLink>

        <div className="border-b" />

        <NavLink
          to="/admin/add-product"
          onClick={() => setOpenMenu(false)}
          className="hover:text-green-600 transition"
        >
          Add Product
        </NavLink>

        <NavLink
          to="/admin/orders"
          onClick={() => setOpenMenu(false)}
          className="hover:text-green-600 transition"
        >
          Manage Orders
        </NavLink>
      </>
    )}

    {user && (
      <div className="mt-1">
        <LogoutButton onClick={handleLogout} />
      </div>
    )}
  </div>
)}



        <div className="flex items-center gap-3">
          {/* Cart icon - hidden on admin login page and when logged in as admin */}
          {role !== "admin" && (
            <Link
              to="/cart"
              className={`p-2 rounded-lg transition-colors ${isHome ? "hover:bg-white/20 text-white" : "hover:bg-gray-100 text-gray-600"}`}
              title="Cart"
            >
              <ShoppingCart size={24} />
            </Link>
          )}
          {user ? (
            <LogoutButton onClick={handleLogout} />
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`px-4 py-2 font-medium rounded-lg transition ${isHome ? "text-white hover:bg-white/20" : "text-green-600 hover:bg-green-50"}`}
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

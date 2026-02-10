import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/authSlice"
import LogoutButton from "./LogoutButton"


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

  const hideOnAuthPages = ["/login", "/signup", "/forgot-password", "/reset-password"]
  if (hideOnAuthPages.some((path) => location.pathname.startsWith(path))) return null

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const linkBase =
    "relative pb-1 transition-all duration-300 hover:text-green-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-green-600 after:transition-all after:duration-300"

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${location.pathname === "/" 
          ? "bg-transparent backdrop-blur-sm text-white" 
          : location.pathname === "/products" 
            ? "bg-transparent backdrop-blur-sm text-gray-800" 
            : "bg-white text-gray-800 shadow-md"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight flex items-center hover:opacity-90 transition"
        >
          <span className="text-gray-600">Your</span><span className="text-green-600">Store</span><span className="text-green-600 text-3xl leading-8">.</span>
        </Link>

          <button
            className="md:hidden text-3xl text-gray-700"
            onClick={() => setOpenMenu(!openMenu)}
          >
            ☰
          </button>


        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[18px] font-medium text-gray-600">
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
                to="/cart"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Cart
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
    {role === "user" && (
      <>
        <div className="" />
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
          {user ? (
            <LogoutButton onClick={handleLogout} />
          ) : (
            <>

            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

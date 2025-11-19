import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaUserCircle,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import CalendarModal from "@/components/CalendarModal";
import { useState } from "react";
import logo from "../assets/logo-transparent.png";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Trips", path: "/trips" },
    { name: "About Us", path: "/about" },
    { name: "Blogs", path: "/home/blogs" },
  ];

  return (
    <>
      <nav className="w-full bg-white shadow-md px-4 py-2 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 text-blue-600 text-2xl font-bold">
          <img
            src={logo}
            alt="TripHub Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="hidden sm:inline">TripHub</span>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-gray-700"
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-8">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `text-lg font-semibold transition ${
                          isActive
                            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                            : "text-gray-700 hover:text-blue-600"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="text-gray-500 hover:text-green-600 transition"
            title="Planner"
          >
            <FaCalendarAlt className="text-xl" />
          </button>

          <NavLink to="/profile" className="hover:scale-105 transition">
            {authUser?.profilePic ? (
              <img
                src={authUser.profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-300 hover:ring-2 hover:ring-blue-500"
              />
            ) : (
              <FaUserCircle className="text-xl text-gray-500 hover:text-blue-600" />
            )}
          </NavLink>

          {authUser && (
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium transition ${
                    isActive ? "text-blue-600" : "text-gray-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => {
                setIsCalendarOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-gray-500 hover:text-green-600 transition"
              title="Planner"
            >
              <FaCalendarAlt className="text-xl" />
            </button>

            <NavLink
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:scale-105 transition"
            >
              {authUser?.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <FaUserCircle className="text-xl text-gray-500 hover:text-blue-600" />
              )}
            </NavLink>

            {authUser && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-500 hover:text-red-600 transition"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            )}
          </div>
        </div>
      )}

      <CalendarModal isOpen={isCalendarOpen} setIsOpen={setIsCalendarOpen} />
    </>
  );
}

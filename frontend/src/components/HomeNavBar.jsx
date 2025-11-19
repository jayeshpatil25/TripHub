import { FaPlaneDeparture } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from '../assets/logo-transparent.png';

const HomeNavbar = () => {
  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 px-6 lg:px-12 py-2 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
      {/* Left: Logo and Name */}
      <div className="flex items-center gap-2 text-blue-600 text-2xl font-bold">
                {/* <FaPlaneDeparture className="text-blue-600 text-3xl" />
                <span>TripHub</span> */}
                <img
                src={logo}
                alt="TripHub Logo"
                className="h-12 w-auto object-contain"
              />
              <span>TripHub</span>
        </div>

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-3">
        <NavLink
          to="/login"
          className="px-6 py-2.5 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
        >
          Login
        </NavLink>
        <NavLink
          to="/signup"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Sign Up
        </NavLink>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default HomeNavbar;
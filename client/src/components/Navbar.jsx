import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Logo from "../assets/logo2.png";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await customFetch.get("/auth/check-auth");
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await customFetch.get("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  // Dynamic navigation links based on user role
  const getNavLinks = () => {
    const baseLinks = [{ name: "Home", path: "/" }];

    if (user) {
      if (user.role === "admin") {
        return [
          ...baseLinks,
          { name: "Dashboard", path: "/dashboard" },
          { name: "View Teachers", path: "/search-teacher" },
          { name: "Manage Teachers", path: "/admin-dashboard" },
          { name: "Contact", path: "/contact" },
        ];
      } else if (user.role === "teacher") {
        return [
          ...baseLinks,
          { name: "Dashboard", path: "/teacher-dashboard" },
          { name: "Schedules", path: "/schedule-appointment" },
          { name: "Contact", path: "/contact" },
        ];
      } else {
        return [
          ...baseLinks,
          { name: "Dashboard", path: "/dashboard" },
          { name: "Book Appointment", path: "/search-teacher" },
          { name: "Contact", path: "/contact" },
        ];
      }
    }
      return [...baseLinks, { name: "Contact", path: "/contact" }];
  };

  const navLinks = getNavLinks();

  const isActivePath = (path) => {
    if (path.includes("?")) {
      const basePath = path.split("?")[0];
      const queryParam = new URLSearchParams(path.split("?")[1]);
      return (
        location.pathname === basePath &&
        location.search.includes(queryParam.get("tab"))
      );
    }
    if (path === "schedule-appointment") {
      return location.pathname === "/schedule-appointment";
    }
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-white/50 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between h-20">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-12 w-auto sm:h-16 md:h-16 lg:h-16 transition-transform duration-300 hover:scale-105"
                src={Logo}
                alt="Logo"
                loading="lazy"
                style={{ 
                  objectFit: 'contain',
                  maxWidth: '100%'
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 md:ml-8 sm:flex sm:space-x-4 md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActivePath(link.path)
                      ? "border-blue-500 text-blue-600 border-b-2"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2"
                  } inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-200`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate(`/${user.role === "teacher" ? "teacher-dashboard" : "dashboard"}`)}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100">
                  <div className="avatar placeholder">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user.role === "teacher"
                          ? user.name?.charAt(0)
                          : user.username?.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.role === "teacher" ? user.name : user.username}
                    {user.role === "admin" && (
                      <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Admin
                      </span>
                    )}
                  </span>
                </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-200 shadow-md hover:shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-sm font-medium">Login</span>
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Updated z-index and positioning */}
      <div
        className={`${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } sm:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out transform`}
        style={{ height: "100vh" }} // Force full height
      >
        {/* Close button - Increased z-index */}
        <div className="absolute top-0 right-0 pt-4 pr-4 z-[10000]">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-700 hover:bg-gray-100"
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu content - Added higher z-index */}
        <div className="pt-20 pb-6 px-4 h-full overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActivePath(link.path)
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                    : "text-gray-900 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                } px-4 py-3 text-base font-medium transition-all duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="mt-6 px-4">
            {user ? (
              <div className="space-y-4">
               <button className="w-full " onClick={() => navigate(`/${user.role === "teacher" ? "teacher-dashboard" : "dashboard"}`)}>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <div className="avatar placeholder">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {user.role === "teacher"
                          ? user.name?.charAt(0)
                          : user.username?.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 ">
                      {user.role === "teacher" ? user.name : user.username}
                    </span>
                    {user.role === "admin" && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
               </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="block">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-200 shadow-md hover:shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-medium">Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu - Added higher z-index */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}

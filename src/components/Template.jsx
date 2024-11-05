import React, { useState } from "react";
// import logo from "../../assets/logo.png";
import logo from '../assets/logo.png';

const Template = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
 
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
 
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };
 
  return (
    <div>
      <nav className="bg-[#27235c] text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <span className="font-bold text-lg">
            <img src={logo} alt="Logo" className="h-12" />
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 22c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
              ></path>
            </svg>
          </button>
          <button>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
          {/* Language Dropdown */}
          <div className="relative">
            <button onClick={toggleLanguageDropdown} className="flex items-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5v6h2V7h-2zm0 8v2h2v-2h-2z"
                ></path>
              </svg>
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  English
                </a>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Español
                </a>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Français
                </a>
              </div>
            )}
          </div>
 
          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={toggleProfileDropdown} className="flex items-center space-x-1">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <span className="block text-sm">John Doe</span>
                <span className="block text-xs text-gray-400">Admin</span>
              </div>
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
 
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A3.001 3.001 0 016 16h12a3.001 3.001 0 01.879 1.804M12 12a5 5 0 100-10 5 5 0 000 10z"
                    ></path>
                  </svg>
                  Profile
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 8V5a2 2 0 00-2-2H7a2 2 0 00-2 2v11m14 0a2 2 0 002-2H5a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Inbox
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
 
      {/* Side Navbar */}
      <div
        className={`bg-white w-1/5 h-screen fixed top-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <ul className="mt-4 space-y-4">
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
 
      {/* Main Content */}
      {/* <div
        className={`ml-0 ${
          sidebarOpen ? "ml-1/5" : ""
        } transition-all duration-300 bg-[#EEEEEE] p-4`}
      >
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p className="mt-4">This is where your main content will go.</p>
      </div> */}
    </div>
  );
};
 
export default Template;

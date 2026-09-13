"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContent";
import { useAuth } from ".././components/AuthProvider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const cartCount = cart.length;

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-300 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main Navbar */}
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Campus<span className="text-blue-600">Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/Marketplace"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Marketplace
            </Link>

            <Link
              href="/accommodation"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Accommodation
            </Link>

            <Link
              href="/services"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Services
            </Link>

            <Link
              href="/groups"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Study Groups
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Shopping cart"
            >
              <span className="text-xl">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Logged Out */}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              /* Logged In */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                  aria-label="Open profile menu"
                  aria-expanded={showProfile}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <path
                      d="M4 21C4.5 17.5 7.5 15 12 15C16.5 15 19.5 17.5 20 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">

                    {/* User Info */}
                    <div className="border-b border-gray-100 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                          {user?.firstName?.charAt(0)}
                          {user?.lastName?.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>

                          <p className="truncate text-sm text-gray-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile */}
                    <Link
                      href="/profile"
                      onClick={() => setShowProfile(false)}
                      className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label={
              isMenuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t py-4 md:hidden">

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-1">

              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                href="/Marketplace"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Marketplace
              </Link>

              <Link
                href="/accommodation"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Accommodation
              </Link>

              <Link
                href="/services"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Services
              </Link>

              <Link
                href="/groups"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Study Groups
              </Link>

              {/* Mobile Cart */}
              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <span>Shopping Cart</span>

                {cartCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Auth */}
            <div className="mt-4 border-t pt-4">

              {!isAuthenticated ? (
                <div className="flex flex-col gap-2">

                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-blue-600 px-3 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>

                </div>
              ) : (
                <div>

                  {/* Mobile User */}
                  <div className="mb-2 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>

                      <p className="truncate text-sm text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>

                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
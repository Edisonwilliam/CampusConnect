import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t-gray-300 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-gray-900"
            >
              Campus<span className="text-blue-600">Connect</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
              Everything you need on campus, in one place.
              Connect, discover, and make campus life easier.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Platform
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/Marketplace"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Marketplace
                </Link>
              </li>

              <li>
                <Link
                  href="/accommodation"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Accommodation
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  href="/groups"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Study Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Company
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/help"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Legal
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CampusConnect. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-blue-600"
              aria-label="Twitter"
            >
              Twitter
            </Link>

            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-blue-600"
              aria-label="Instagram"
            >
              Instagram
            </Link>

            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-blue-600"
              aria-label="LinkedIn"
            >
              LinkedIn
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;

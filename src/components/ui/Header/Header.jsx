import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-800">Logo</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Services", "Products", "Jobs", "About", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
              Sign In / Sign Up
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden mt-4 py-4 border-t space-y-3">
            {["Home", "Services", "Products", "Jobs", "About", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-600 hover:text-gray-900 py-2 transition"
                >
                  {item}
                </a>
              ),
            )}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition mt-4">
              Sign In / Sign Up
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

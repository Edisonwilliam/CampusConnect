"use client";

import Link from "next/link";

const RegisterSuccess = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12.5L9.5 17L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Account created!
        </h1>

        <p className="mt-3 text-gray-500">
          Your Campus Connect account has been created
          successfully. You can now log in and start
          connecting with your campus community.
        </p>

        <Link
          href="/login"
          className="mt-8 block w-full rounded-xl bg-black px-6 py-3.5 font-medium text-white transition hover:bg-gray-800"
        >
          Continue to Login
        </Link>

        <Link
          href="/"
          className="mt-4 block text-sm font-medium text-gray-500 hover:text-black"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default RegisterSuccess;
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    school: "",
    department: "",
    level: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      console.log("Registration successful:", data);

      router.push("/register/success");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

 const handleGoogleSignup = () => {
  window.location.href = `${API_URL}/auth/google`;
};

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900"
          >
            Campus Connect
          </Link>

          <h1 className="mt-8 text-3xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-gray-500">
            Join your campus community today.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.805 12.23c0-.79-.065-1.56-.205-2.3H12v4.35h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.045-4.4 3.045-7.69Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.76 0 5.07-.91 6.76-2.47l-3.3-2.56c-.92.62-2.1.99-3.46.99-2.66 0-4.91-1.8-5.72-4.22H2.87v2.64A10.2 10.2 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M6.28 13.74A6.1 6.1 0 0 1 5.96 12c0-.6.11-1.19.32-1.74V7.62H2.87A10.01 10.01 0 0 0 1.8 12c0 1.61.39 3.13 1.07 4.38l3.41-2.64Z"
                fill="#FBBC05"
              />
              <path
                d="M12 6.04c1.5 0 2.85.52 3.91 1.54l2.93-2.93C17.07 3.02 14.76 2 12 2a10.2 10.2 0 0 0-9.13 5.62l3.41 2.64C7.09 7.84 9.34 6.04 12 6.04Z"
                fill="#EA4335"
              />
            </svg>

            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength={6}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                School
              </label>

              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="University of Benin"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Computer Engineering"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Level
              </label>

              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="">
                  Select your level
                </option>

                <option value="100 Level">
                  100 Level
                </option>

                <option value="200 Level">
                  200 Level
                </option>

                <option value="300 Level">
                  300 Level
                </option>

                <option value="400 Level">
                  400 Level
                </option>

                <option value="500 Level">
                  500 Level
                </option>

                <option value="Postgraduate">
                  Postgraduate
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-3.5 font-medium text-white transition hover:bg-gray-800"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-medium text-black hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
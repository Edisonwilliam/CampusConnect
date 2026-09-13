"use client";

import Link from "next/link";
import { useAuth } from ".././components/AuthProvider";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            You are not logged in
          </h1>

          <Link
            href="/login"
            className="mt-5 inline-block rounded-xl bg-black px-6 py-3 text-white"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-700">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">
                School
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {user?.school}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Department
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {user?.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Level
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {user?.level}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all font-medium text-gray-900">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
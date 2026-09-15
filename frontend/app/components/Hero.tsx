"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const handleGetStarted = () => {
    if (loading) return;

    if (isAuthenticated) {
      router.push("/");
    } else {
      router.push("/register");
    }
  };

  return (
    <section
      className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Everything you need
          <span className="block text-blue-400">
            on campus, in one place.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
          Discover accommodation, marketplace listings, campus services,
          and study groups all in one place.
        </p>

        <div className="mt-8">
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className="inline-block rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
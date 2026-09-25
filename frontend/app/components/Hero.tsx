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

  const handleExplore = () => {
    router.push("/Marketplace");
  };

  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/80" />

      {/* Subtle glow */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Built for modern campus life
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Everything you need
              <span className="mt-2 block text-blue-400">
                on campus.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Discover accommodation, buy and sell items, find useful
              campus services, and connect with study groups — all from
              one simple platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleGetStarted}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Loading..." : "Get Started"}
              </button>

              <button
                onClick={handleExplore}
                className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Explore Campus
              </button>
            </div>

            {/* Trust stats */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7">
              <div>
                <p className="text-xl font-bold text-white">4+</p>
                <p className="mt-1 text-xs text-slate-400">
                  Campus features
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-white">1</p>
                <p className="mt-1 text-xs text-slate-400">
                  Connected platform
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-white">24/7</p>
                <p className="mt-1 text-xs text-slate-400">
                  Access
                </p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            {/* Main dashboard card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-4 shadow-2xl shadow-black/30 sm:p-5">
              {/* Browser header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-300" />
                  <div className="h-3 w-3 rounded-full bg-slate-300" />
                  <div className="h-3 w-3 rounded-full bg-slate-300" />
                </div>

                <div className="rounded-lg bg-slate-100 px-4 py-1.5 text-xs text-slate-500">
                  CampusConnect
                </div>

                <div className="h-6 w-6 rounded-full bg-slate-200" />
              </div>

              {/* Dashboard content */}
              <div className="grid gap-4 pt-5 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-950 p-5 text-white sm:col-span-2">
                  <p className="text-xs text-slate-400">
                    Welcome back
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Your campus, simplified.
                  </h2>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                    Access everything you need without jumping between
                    different platforms.
                  </p>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-blue-500" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    🏠
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Accommodation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Find a place that works for you.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    🛍️
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Marketplace
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Buy and sell within your campus.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    🧰
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Services
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Discover useful student services.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    📚
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Study Groups
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Learn and collaborate together.
                  </p>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
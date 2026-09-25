"use client";

import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";

const CTA = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const handleGetStarted = () => {
    if (loading) return;

    if (isAuthenticated) {
      router.push("/Marketplace");
    } else {
      router.push("/register");
    }
  };

  return (
    <section className="bg-slate-950 py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
        <div className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
          CampusConnect
        </div>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Your campus.
          <span className="block text-slate-400">
            Your community. One place.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          Discover accommodation, buy and sell items, find useful services,
          and connect with other students through one simple platform.
        </p>

        <div className="mt-9">
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className="inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Loading..." : "Get Started"}

            {!loading && (
              <span className="ml-2 transition-transform duration-200">
                →
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
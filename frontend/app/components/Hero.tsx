import Link from "next/link";

const Hero = () => {
  return (
    <section
      className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
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
          <Link
            href="/register"
            className="inline-block rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
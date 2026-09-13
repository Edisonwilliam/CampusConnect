import Link from "next/link";

const CTA = () => {
  return (
    <section className="bg-blue-600 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">

        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Your campus. Your community. One place.
        </h2>

        <p className="mt-5 text-blue-100">
          Join CampusConnect and make your campus experience more connected.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-block rounded-lg bg-white px-7 py-3 text-sm font-semibold text-blue-600 transition hover:bg-gray-100"
        >
          Get Started
        </Link>

      </div>
    </section>
  );
};

export default CTA;
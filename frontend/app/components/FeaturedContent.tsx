import Image from "next/image";
import Link from "next/link";

const featuredItems = [
  {
    title: "Marketplace",
    description:
      "Discover electronics, books, fashion, furniture, and more from students around your campus.",
    href: "/Marketplace",
    image: "/market.jpg",
    label: "Buy & sell",
  },
  {
    title: "Accommodation",
    description:
      "Explore available hostels, apartments, rooms, and other accommodation options near campus.",
    href: "/accommodation",
    image: "/accommodation.jpg",
    label: "Find accommodation",
  },
  {
    title: "Campus Services",
    description:
      "Find useful services offered by students and people within your campus community.",
    href: "/services",
    image: "/services.jpg",
    label: "Discover services",
  },
];

const FeaturedContent = () => {
  return (
    <section className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Explore CampusConnect
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Discover what&apos;s happening
              <span className="block text-slate-400">
                around your campus.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            Explore some of the ways CampusConnect helps students
            discover opportunities, resources, and useful services.
          </p>
        </div>

        {/* Featured cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {featuredItems.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden sm:h-72">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Number */}
                <span className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-slate-900 backdrop-blur-sm">
                  0{index + 1}
                </span>

                {/* Image label */}
                <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 backdrop-blur-sm">
                  {item.label}
                </span>
              </div>

              {/* Content */}
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    {item.title}
                  </h3>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition duration-300 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <path
                        d="M4 10H16M11 5L16 10L11 15"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center text-sm font-semibold text-slate-900">
                  Explore {item.title}

                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              More to explore
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Your campus has more waiting for you.
            </h3>
          </div>

          <Link
            href="/groups"
            className="inline-flex w-fit items-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Explore Study Groups
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
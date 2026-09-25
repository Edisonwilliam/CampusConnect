import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Marketplace",
    description:
      "Buy and sell items within your campus community without the hassle of searching everywhere.",
    href: "/Marketplace",
    label: "Buy & sell",
  },
  {
    number: "02",
    title: "Accommodation",
    description:
      "Discover accommodation options around campus that match your needs, location, and budget.",
    href: "/accommodation",
    label: "Find a place",
  },
  {
    number: "03",
    title: "Campus Services",
    description:
      "Find useful services offered by students and people within your campus community.",
    href: "/services",
    label: "Discover services",
  },
  {
    number: "04",
    title: "Study Groups",
    description:
      "Find students with similar academic goals, join study groups, and learn together.",
    href: "/groups",
    label: "Join a group",
  },
];

const WhatYouCanDo = () => {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              CampusConnect
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Everything your campus needs,
              <span className="block text-slate-400">
                in one place.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            From finding a place to stay to connecting with other students,
            CampusConnect brings useful campus experiences together in one
            simple platform.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60 sm:p-8"
            >
              {/* Background number */}
              <span className="pointer-events-none absolute -right-3 -top-8 text-[130px] font-black leading-none text-slate-100 transition duration-300 group-hover:text-blue-50">
                {feature.number}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {feature.label}
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-300 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
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

                <h3 className="mt-12 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {feature.title}
                </h3>

                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                  {feature.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  Explore {feature.title}

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom statement */}
        <div className="mt-8 rounded-3xl bg-slate-950 px-7 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">
                One platform. Multiple possibilities.
              </p>

              <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Make more of your campus experience.
              </h3>
            </div>

            <Link
              href="/register"
              className="inline-flex w-fit items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Get started
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouCanDo;
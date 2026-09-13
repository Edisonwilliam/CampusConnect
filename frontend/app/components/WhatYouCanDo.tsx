const features = [
  {
    title: "Marketplace",
    description: "Buy and sell items within your campus community.",
    href: "/Marketplace",
  },
  {
    title: "Accommodation",
    description: "Find accommodation that fits your needs and budget.",
    href: "/accommodation",
  },
  {
    title: "Campus Services",
    description: "Discover useful services available around your campus.",
    href: "/services",
  },
  {
    title: "Study Groups",
    description: "Connect with students and learn together.",
    href: "/groups",
  },
];

const WhatYouCanDo = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            What you can do
          </h2>

          <p className="mt-4 text-gray-600">
            Everything you need to make campus life easier and more connected.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                Explore →
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhatYouCanDo;
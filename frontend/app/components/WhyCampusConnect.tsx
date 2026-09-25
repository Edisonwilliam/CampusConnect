const features = [
  {
    number: "01",
    title: "Everything in one place",
    description:
      "Instead of searching through different platforms, access the things you need for campus life from one simple platform.",
  },
  {
    number: "02",
    title: "Built around students",
    description:
      "CampusConnect is designed around real student needs, from finding accommodation to discovering useful services.",
  },
  {
    number: "03",
    title: "Connect with your community",
    description:
      "Discover other students, join study groups, exchange items, and make campus life more connected.",
  },
];

const WhyCampusConnect = () => {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Why CampusConnect
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Campus life should be simpler.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            CampusConnect brings the everyday things students need into
            one organized and easy-to-use platform.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-sm font-bold text-blue-600">
                {feature.number}
              </span>

              <h3 className="mt-8 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCampusConnect;
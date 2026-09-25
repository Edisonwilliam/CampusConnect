const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up and create your student profile in just a few steps.",
  },
  {
    number: "02",
    title: "Explore CampusConnect",
    description:
      "Browse accommodation, marketplace listings, services, and study groups.",
  },
  {
    number: "03",
    title: "Connect and get things done",
    description:
      "Find what you need, connect with other students, and make campus life easier.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-slate-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple from the start.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Everything is designed to help you spend less time searching and
            more time getting things done.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-3rem)] bg-white/10 md:block" />
              )}

              <div className="relative">
                {/* Step Number */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="mt-7 text-xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;


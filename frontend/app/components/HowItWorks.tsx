const steps = [
  {
    number: "01",
    title: "Create an account",
    description:
      "Sign up and create your CampusConnect profile.",
  },
  {
    number: "02",
    title: "Explore",
    description:
      "Discover accommodation, marketplace listings, services, and groups.",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Connect with students, sellers, landlords, and service providers.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How it works
          </h2>

          <p className="mt-4 text-gray-600">
            Getting started with CampusConnect is simple.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {step.number}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
                {step.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
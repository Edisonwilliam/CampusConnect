import Image from "next/image";
import Link from "next/link";

const featuredItems = [
  {
    title: "Marketplace",
    description: "Discover items being sold by students around you.",
    href: "/Marketplace",
    image: "/market.jpg",
  },
  {
    title: "Accommodation",
    description: "Explore available hostels and apartments.",
    href: "/accommodation",
    image: "/accommodation.jpg",
  },
  {
    title: "Campus Services",
    description: "Find useful services from people around your campus.",
    href: "/services",
    image: "/services.jpg",
  },
];

const FeaturedContent = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Explore CampusConnect
            </h2>

            <p className="mt-3 text-gray-600">
              Discover what is available around your campus.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredItems.map((item) => (
            <div
              key={item.title}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              {/* Featured Image */}
              <div className="relative h-52 w-full sm:h-56 md:h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View more →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedContent;

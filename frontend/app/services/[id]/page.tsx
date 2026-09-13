"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  title: string;
  description: string;
  category: string;
  phone: string;
  location: string;
  price: string;
  image?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

export default function ServiceDetailsPage() {
  const params = useParams();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/services/${params.id}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const data = await response.json();

        setService(data);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching service:", error);
        setService(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (params.id) {
      fetchService();
    }

    return () => {
      controller.abort();
    };
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-gray-500">Loading service...</p>
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Services
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Service not found
            </h1>

            <p className="mt-2 text-gray-500">
              The service you are looking for does not exist.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const provider = `${service.user.firstName} ${service.user.lastName}`;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Services
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {service.image && (
            <div className="border-b border-gray-100">
              <img
                src={`http://localhost:5000${service.image}`}
                alt={service.title}
                className="h-72 w-full object-cover sm:h-96"
              />
            </div>
          )}

          <div className="border-b border-gray-100 p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                {service.category}
              </span>

              <span className="text-lg font-bold text-gray-900">
                {service.price}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {service.title}
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-600">
              {service.description}
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="text-sm text-gray-500">
                Provider
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {provider}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {service.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {service.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Starting Price
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {service.price}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Interested in this service?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Contact the provider to ask questions or make a
              booking.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${service.phone}`}
                className="rounded-xl bg-black px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
              >
                📞 Contact Provider
              </a>

              <Link
                href="/services"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Browse More Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
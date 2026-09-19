"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const categories = [
  "All",
  "Design",
  "Beauty",
  "Repairs",
  "Laundry",
  "Photography",
  "Education",
];

const getImageUrl = (image?: string) => {
  if (!image) {
    return "/placeholder.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${API_URL}${image}`;
};

const ServicesPage = () => {
  const { token, isAuthenticated, user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Design",
    description: "",
    phone: "",
    location: "",
    price: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch services: ${response.status}`
          );
        }

        const data = await response.json();

        setServices(data);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching services:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      controller.abort();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setFormData({
      ...formData,
      image: file,
    });

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
    });

    setImagePreview("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      alert("Please log in to offer a service.");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("phone", formData.phone);
      data.append("location", formData.location);
      data.append("price", formData.price);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create service"
        );
      }

      setServices((prev) => [result, ...prev]);

      setFormData({
        title: "",
        category: "Design",
        description: "",
        phone: "",
        location: "",
        price: "",
        image: null,
      });

      setImagePreview("");
      setShowForm(false);

      alert("Service created successfully!");
    } catch (error) {
      console.error("Error creating service:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (!token) {
      alert("Please log in.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete service"
        );
      }

      setServices((prev) =>
        prev.filter((service) => service.id !== serviceId)
      );

      alert("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  const filteredServices = services.filter((service) => {
    const provider = `${service.user.firstName} ${service.user.lastName}`;

    const searchText = search.toLowerCase();

    const matchesSearch =
      service.title.toLowerCase().includes(searchText) ||
      service.description.toLowerCase().includes(searchText) ||
      provider.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || service.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Campus Services
            </h1>

            <p className="mt-2 text-gray-600">
              Find useful services offered by students and
              providers around campus.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                alert("Please log in to offer a service.");
                return;
              }

              setShowForm(true);
            }}
            className="w-fit rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Offer a Service
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Offer a Service
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add the details of the service you provide.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  removeImage();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Service Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Laptop Repair"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                >
                  {categories
                    .filter((item) => item !== "All")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the service you provide..."
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. UNIBEN Ugbowo"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. From ₦5,000"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Service Image
                </label>

                {!imagePreview ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-gray-400 hover:bg-gray-100">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                      📷
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Click to upload an image
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG or WEBP · Max 5MB
                    </p>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Selected service"
                      className="h-64 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-2 text-sm font-medium text-white transition hover:bg-black"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    removeImage();
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Creating Service..."
                    : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6 max-w-2xl">
          <input
            type="text"
            placeholder="Search for a service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 outline-none focus:border-black"
          />
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium ${
                category === item
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Services
          </h2>

          <span className="text-sm text-gray-500">
            {filteredServices.length} services
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">
              Loading services...
            </p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const provider = `${service.user.firstName} ${service.user.lastName}`;

              const isOwner =
                user?.id === service.user.id;

              const isAdmin = user?.role === "admin";

              const canManage =
                isOwner || isAdmin;

              return (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {service.image && (
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {service.category}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {service.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {service.description}
                    </p>

                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">
                          Provider:
                        </span>{" "}
                        {provider}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        📍 {service.location}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service.id}`}
                      className="mt-5 block rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
                    >
                      View Service
                    </Link>

                    {canManage && (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <Link
                          href={`/services/${service.id}/edit`}
                          className="rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(service.id)
                          }
                          className="rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="font-semibold text-gray-900">
              No services found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ServicesPage;

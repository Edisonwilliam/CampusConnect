"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Accommodation = {
  id: number;
  title: string;
  price: number;
  type: string;
  location: string;
  image?: string;
  description: string;
  contact: string;
  ownerId: number;
  ownerName: string;
};

const accommodationTypes = [
  "All",
  "Hostel",
  "Apartment",
  "Room",
  "Self Contain",
];

const Accommodation = () => {
  const [accommodations, setAccommodations] = useState<
    Accommodation[]
  >([]);

  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    type: "Hostel",
    location: "",
    contact: "",
    description: "",
    image: null as File | null,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        const response = await fetch(
          `${API_URL}/accommodation`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch accommodations");
        }

        const data = await response.json();

        const formattedAccommodations = data.map(
          (item: any) => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            type: item.type,
            location: item.location,
            image: getImageUrl(item.image),
            description: item.description,
            contact: item.contact,
            ownerId: item.ownerId,
            ownerName: item.ownerName,
          })
        );

        setAccommodations(formattedAccommodations);
      } catch (error) {
        console.error(
          "Failed to load accommodations:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  const filteredAccommodations = accommodations.filter(
    (item) => {
      const matchesType =
        selectedType === "All" ||
        item.type === selectedType;

      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.location
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.type
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    }
  );

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
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      alert("Please log in to list accommodation.");
      return;
    }

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("type", formData.type);
      data.append("location", formData.location);
      data.append("contact", formData.contact);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch(
        `${API_URL}/accommodation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create accommodation"
        );
      }

      const newAccommodation: Accommodation = {
        id: result.id,
        title: result.title,
        price: Number(result.price),
        type: result.type,
        location: result.location,
        image: getImageUrl(result.image),
        description: result.description,
        contact: result.contact,
        ownerId: result.ownerId,
        ownerName: result.ownerName,
      };

      setAccommodations((prev) => [
        newAccommodation,
        ...prev,
      ]);

      setFormData({
        title: "",
        price: "",
        type: "Hostel",
        location: "",
        contact: "",
        description: "",
        image: null,
      });

      setImagePreview("");
      setShowForm(false);
      setSelectedType("All");

      alert("Accommodation listed successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Accommodation
              </h1>

              <p className="mt-2 max-w-xl text-gray-500">
                Find affordable accommodation around your campus.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-fit rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              + List Accommodation
            </button>

          </div>
        </section>

        {/* Search */}
        <section className="mb-7">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by location, hostel or apartment..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 outline-none focus:border-black"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
              🔍
            </span>
          </div>
        </section>

        {/* Accommodation Types */}
        <section className="mb-10">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {accommodationTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  selectedType === type
                    ? "bg-black text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Listings Header */}
        <section className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedType === "All"
              ? "Available Accommodation"
              : `${selectedType} Accommodation`}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredAccommodations.length}{" "}
            {filteredAccommodations.length === 1
              ? "listing"
              : "listings"}{" "}
            available
          </p>
        </section>

        {/* Listings */}
        <section>
          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <p className="text-gray-500">
                Loading accommodation...
              </p>
            </div>
          ) : filteredAccommodations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredAccommodations.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="relative h-56 w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-5">

                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {item.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                      ₦{item.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        / year
                      </span>
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      📍 {item.location}
                    </p>

                    <Link
                      href={`/accommodation/${item.id}`}
                      className="mt-5 block w-full rounded-xl bg-black py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      View Details
                    </Link>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
              <p className="text-gray-500">
                No accommodation found.
              </p>
            </div>
          )}
        </section>

      </div>

      {/* List Accommodation Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  List Accommodation
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add details about the accommodation.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Accommodation Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Self Contain Near UNIBEN"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price Per Year
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 350000"
                  min="0"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Accommodation Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                >
                  <option value="Hostel">
                    Hostel
                  </option>

                  <option value="Apartment">
                    Apartment
                  </option>

                  <option value="Room">
                    Room
                  </option>

                  <option value="Self Contain">
                    Self Contain
                  </option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Ekewan"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. 08012345678"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Accommodation Image
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
                      alt="Selected accommodation"
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

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the accommodation..."
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                  List Accommodation
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Accommodation;
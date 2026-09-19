"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  "Hostel",
  "Apartment",
  "Room",
  "Self Contain",
];

const getImageUrl = (image?: string) => {
  if (!image) return "/placeholder.jpg";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${API_URL}${image}`;
};

const AccommodationDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { token, user } = useAuth();

  const [accommodation, setAccommodation] =
    useState<Accommodation | null>(null);

  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    type: "Hostel",
    location: "",
    contact: "",
    description: "",
  });

  useEffect(() => {
    const loadAccommodation = async () => {
      try {
        const response = await fetch(
          `${API_URL}/accommodation/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Accommodation not found");
        }

        const data = await response.json();

        const accommodationData: Accommodation = {
          id: data.id,
          title: data.title,
          price: Number(data.price),
          type: data.type,
          location: data.location,
          image: getImageUrl(data.image),
          description: data.description,
          contact: data.contact,
          ownerId: data.ownerId,
          ownerName: data.ownerName,
        };

        setAccommodation(accommodationData);

        setFormData({
          title: accommodationData.title,
          price: String(accommodationData.price),
          type: accommodationData.type,
          location: accommodationData.location,
          contact: accommodationData.contact,
          description: accommodationData.description,
        });
      } catch (error) {
        console.error(
          "Failed to load accommodation:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadAccommodation();
    }
  }, [params.id]);

  const isOwner =
    user?.id === accommodation?.ownerId;

  const isAdmin =
    user?.role === "admin";

  const canManage =
    isOwner || isAdmin;

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

  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/accommodation/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            price: Number(formData.price),
            type: formData.type,
            location: formData.location,
            contact: formData.contact,
            description: formData.description,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update accommodation"
        );
      }

      setAccommodation({
        ...result,
        price: Number(result.price),
        image: getImageUrl(result.image),
      });

      setShowEditForm(false);

      alert("Accommodation updated successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this accommodation?"
    );

    if (!confirmed) return;

    if (!token) {
      alert("Please log in.");
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/accommodation/${params.id}`,
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
          result.message ||
            "Failed to delete accommodation"
        );
      }

      alert("Accommodation deleted successfully.");

      router.push("/accommodation");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500">
          Loading accommodation...
        </p>
      </main>
    );
  }

  if (!accommodation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Accommodation not found
          </h1>

          <Link
            href="/accommodation"
            className="mt-5 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white"
          >
            Back to Accommodation
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/accommodation"
          className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Accommodation
        </Link>

        <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2">

          <div className="relative h-[350px] md:h-[550px]">
            <img
              src={accommodation.image}
              alt={accommodation.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col p-6 md:p-10">

            <div className="flex items-center justify-between">
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                {accommodation.type}
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900 md:text-4xl">
              {accommodation.title}
            </h1>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              ₦{accommodation.price.toLocaleString()}
              <span className="text-base font-normal text-gray-500">
                {" "}
                / year
              </span>
            </p>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-500">
                Location
              </p>

              <p className="mt-2 text-gray-900">
                📍 {accommodation.location}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-500">
                Description
              </p>

              <p className="mt-2 leading-7 text-gray-600">
                {accommodation.description}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-500">
                Listed by
              </p>

              <p className="mt-2 text-gray-900">
                {accommodation.ownerName}
              </p>
            </div>

            {canManage ? (
              <div className="mt-8 flex gap-3">

                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex-1 rounded-xl border border-gray-200 py-4 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600 py-4 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>
            ) : (
              <a
                href={`tel:${accommodation.contact}`}
                className="mt-auto w-full rounded-xl bg-black py-4 text-center font-medium text-white transition hover:bg-gray-800"
              >
                Contact Owner
              </a>
            )}

          </div>
        </div>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Accommodation
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your accommodation details.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowEditForm(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Accommodation Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price Per Year
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

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
                  {accommodationTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
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
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditForm(false)
                  }
                  className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                  Save Changes
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AccommodationDetails;

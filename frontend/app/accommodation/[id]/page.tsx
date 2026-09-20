"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://campusconnect-qgah.onrender.com";

interface Accommodation {
  id: number;
  title: string;
  description: string;
  price: number;
  type: string;
  location: string;
  image?: string;
  contact: string;
  ownerId: number;
  ownerName: string;
  createdAt?: string;
}

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

export default function AccommodationDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [accommodation, setAccommodation] =
    useState<Accommodation | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    location: "",
    contact: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const accommodationId = params?.id;

  useEffect(() => {
    if (!accommodationId) return;

    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/accommodation/${accommodationId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch accommodation");
        }

        const data = await response.json();

        const formattedAccommodation: Accommodation = {
          ...data,
          price: Number(data.price),
          image: getImageUrl(data.image),
        };

        setAccommodation(formattedAccommodation);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          type: data.type || "",
          location: data.location || "",
          contact: data.contact || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load accommodation");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [accommodationId]);

  const canManageAccommodation =
    user &&
    accommodation &&
    (user.role === "admin" ||
      Number(user.id) === Number(accommodation.ownerId));

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!accommodation) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      setUpdating(true);

      const form = new FormData();

      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("type", formData.type);
      form.append("location", formData.location);
      form.append("contact", formData.contact);

      if (imageFile) {
        form.append("image", imageFile);
      }

      const response = await fetch(
        `${API_URL}/accommodation/${accommodation.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update accommodation");
      }

      const result = await response.json();

      const updatedAccommodation: Accommodation = {
        ...result,
        price: Number(result.price),
        image: getImageUrl(result.image),
      };

      setAccommodation(updatedAccommodation);

      setFormData({
        title: result.title || "",
        description: result.description || "",
        price: result.price?.toString() || "",
        type: result.type || "",
        location: result.location || "",
        contact: result.contact || "",
      });

      setImageFile(null);
      setShowEdit(false);

      alert("Accommodation updated successfully.");
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update accommodation."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!accommodation) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this accommodation?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/accommodation/${accommodation.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete accommodation");
      }

      alert("Accommodation deleted successfully.");

      router.push("/accommodation");
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete accommodation."
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-600">
          Loading accommodation...
        </p>
      </main>
    );
  }

  if (error || !accommodation) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-red-600 mb-4">
          {error || "Accommodation not found."}
        </p>

        <button
          onClick={() => router.push("/accommodation")}
          className="px-5 py-2 bg-black text-white rounded-lg"
        >
          Back to Accommodation
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/accommodation")}
          className="mb-6 text-sm text-gray-600 hover:text-black"
        >
          ← Back to Accommodation
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-[350px] md:h-[500px] bg-gray-100">
              <img
                src={getImageUrl(accommodation.image)}
                alt={accommodation.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {accommodation.title}
                  </h1>

                  <p className="text-gray-500 mt-2">
                    {accommodation.type}
                  </p>
                </div>
              </div>

              <p className="text-2xl font-bold text-green-600 mb-6">
                ₦{Number(accommodation.price).toLocaleString()}
              </p>

              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900">
                    Location
                  </p>

                  <p>{accommodation.location}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Description
                  </p>

                  <p className="whitespace-pre-wrap">
                    {accommodation.description ||
                      "No description provided."}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Contact
                  </p>

                  <p>{accommodation.contact}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Listed by
                  </p>

                  <p>{accommodation.ownerName}</p>
                </div>
              </div>

              {canManageAccommodation && (
                <div className="flex flex-wrap gap-3 mt-8">
                  <button
                    onClick={() => setShowEdit(true)}
                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Edit Accommodation
              </h2>

              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select type</option>
                  <option value="Apartment">
                    Apartment
                  </option>
                  <option value="Self Contain">
                    Self Contain
                  </option>
                  <option value="Room">
                    Room
                  </option>
                  <option value="Flat">
                    Flat
                  </option>
                  <option value="Hostel">
                    Hostel
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact
                </label>

                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Replace Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 5MB
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {updating
                    ? "Updating..."
                    : "Update Accommodation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

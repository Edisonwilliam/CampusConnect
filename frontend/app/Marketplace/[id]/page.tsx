"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  image: string;
  description: string;
  sellerId: number;
};

const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/marketplace/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        const formattedProduct = {
          id: data.id,
          title: data.title,
          price: Number(data.price),
          category: data.category,
          condition: data.condition,
          location: data.location,
          description: data.description,
          sellerId: data.sellerId,
          image: data.image
            ? `http://localhost:5000${data.image}`
            : "/placeholder.jpg",
        };

        setProduct(formattedProduct);

        setEditData({
          title: data.title,
          price: String(data.price),
          category: data.category,
          condition: data.condition,
          location: data.location,
          description: data.description,
        });
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const canManage =
    !!user &&
    !!product &&
    (user.role === "admin" || user.id === product.sellerId);

  const handleDelete = async () => {
    if (!product) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `http://localhost:5000/marketplace/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete listing");
      }

      router.push("/Marketplace");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete listing:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete listing"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!product) return;

    try {
      setSaving(true);

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `http://localhost:5000/marketplace/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editData.title,
            price: Number(editData.price),
            category: editData.category,
            condition: editData.condition,
            location: editData.location,
            description: editData.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update listing");
      }

      setProduct({
        ...product,
        title: data.title,
        price: Number(data.price),
        category: data.category,
        condition: data.condition,
        location: data.location,
        description: data.description,
      });

      setEditing(false);
    } catch (error) {
      console.error("Failed to update listing:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update listing"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>

          <Link
            href="/Marketplace"
            className="mt-4 inline-block rounded-xl bg-black px-5 py-3 text-white"
          >
            Back to Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/Marketplace"
          className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Marketplace
        </Link>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">

          <div className="relative h-[350px] md:h-[550px]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col p-6 md:p-10">

            {editing ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Listing
                </h1>

                <div className="mt-6 space-y-4">

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Books">Books</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Condition
                    </label>
                    <select
                      value={editData.condition}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          condition: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    >
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          location: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleEdit}
                      disabled={saving}
                      className="flex-1 rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                    {product.category}
                  </span>

                  <span className="text-sm text-gray-500">
                    {product.condition}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  {product.title}
                </h1>

                <p className="mt-4 text-3xl font-bold text-gray-900">
                  ₦{product.price.toLocaleString()}
                </p>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="text-sm font-medium text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 text-gray-900">
                    📍 {product.location}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="text-sm font-medium text-gray-500">
                    Description
                  </p>

                  <p className="mt-2 leading-7 text-gray-600">
                    {product.description}
                  </p>
                </div>

                {canManage && (
                  <div className="mt-6 flex gap-3 border-t border-gray-100 pt-6 mb-3">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}

                <button className="mt-auto w-full rounded-xl bg-black py-8 font-medium text-white transition hover:bg-gray-800">
                  Add to Cart
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getListings } from ".././lib/api";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  image: string;
  description?: string;
};

const categories = [
  "All",
  "Electronics",
  "Books",
  "Fashion",
  "Furniture",
  "Gaming",
  "Others",
];

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSellForm, setShowSellForm] = useState(false);
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Electronics",
    condition: "New",
    location: "",
    description: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      try {
        const listings = await getListings();

        const formattedListings = listings.map(
          (listing: any) => ({
            id: listing.id,
            title: listing.title,
            price: Number(listing.price),
            category: listing.category,
            condition: listing.condition,
            location: listing.location,
            description: listing.description,
            image: listing.image
              ? `${API_URL}${listing.image}`
              : "/placeholder.jpg",
          })
        );

        setProducts(formattedListings);
      } catch (error) {
        console.error("Failed to load listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const filteredProducts = [...products]
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.location
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") {
        return a.price - b.price;
      }

      if (sortOption === "Price: High to Low") {
        return b.price - a.price;
      }

      return b.id - a.id;
    });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please log in to sell an item.");
      return;
    }

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("condition", formData.condition);
      data.append("location", formData.location);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch(
        `${API_URL}/marketplace`,
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
          result.message || "Failed to create listing"
        );
      }

      const newProduct: Product = {
        id: result.id,
        title: result.title,
        price: Number(result.price),
        category: result.category,
        condition: result.condition,
        location: result.location,
        description: result.description,
        image: result.image
          ? `${API_URL}${result.image}`
          : "/placeholder.jpg",
      };

      setProducts((prev) => [newProduct, ...prev]);

      setFormData({
        title: "",
        price: "",
        category: "Electronics",
        condition: "New",
        location: "",
        description: "",
        image: null,
      });

      setImagePreview("");
      setShowSellForm(false);
      setSelectedCategory("All");

      alert("Item listed successfully!");
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

        <section className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Marketplace
              </h1>

              <p className="mt-2 max-w-xl text-gray-500">
                Buy and sell items within your campus community.
              </p>
            </div>

            <button
              onClick={() => setShowSellForm(true)}
              className="w-fit rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              + Sell an Item
            </button>
          </div>
        </section>

        <section className="mb-7">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-12 py-3 outline-none focus:border-black"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
              🔍
            </span>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === "All"
                ? "Latest Listings"
                : `${selectedCategory} Listings`}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "item" : "items"} available
            </p>
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="hidden rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none md:block"
          >
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </section>

        <section>
          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <p className="text-gray-500">
                Loading listings...
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
              <p className="text-gray-500">
                No products found in this category.
              </p>
            </div>
          )}
        </section>
      </div>

      {showSellForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sell an Item
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add the details of the item you want to sell.
                </p>
              </div>

              <button
                onClick={() => setShowSellForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Item Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 12"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 450000"
                  min="0"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                  >
                    {categories
                      .filter((category) => category !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Condition
                  </label>

                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
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
                  placeholder="e.g. UNIBEN"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Item Image
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
                    alt="Selected item"
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

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item..."
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSellForm(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                  Add Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Marketplace;
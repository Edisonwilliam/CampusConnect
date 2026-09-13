"use client";

import Link from "next/link";
import { useCart } from "./CartContent";

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();

  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Product Image */}
      <div className="relative h-52 w-full">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-4">

        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {product.category}
          </span>

          <span className="text-xs text-gray-500">
            {product.condition}
          </span>
        </div>

        <Link href={`/Marketplace/${product.id}`}>
          <h3 className="truncate text-lg font-semibold text-gray-900 hover:underline">
            {product.title}
          </h3>
        </Link>

        <p className="mt-1 text-xl font-bold text-gray-900">
          ₦{Number(product.price).toLocaleString()}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          📍 {product.location}
        </p>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>

        <button
          onClick={() => addToCart(product)}
          disabled={isInCart}
          className={`mt-4 w-full rounded-xl py-3 text-sm font-medium transition ${
            isInCart
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isInCart ? "Added to Cart ✓" : "Add to Cart"}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;
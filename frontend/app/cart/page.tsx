"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContent";
import { useAuth } from "../components/AuthProvider";

const CartPage = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, product) => {
    return sum + product.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: cart }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Server error: ${response.status}`
        );
      }

      const { url } = data;

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL in response");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);

      setError(
        err.message ||
          "Failed to proceed to checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart
            </h1>

            <p className="mt-2 text-gray-500">
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center">
            <div className="mb-4 text-5xl">🛒</div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-md text-gray-500">
              Browse the marketplace and add some products to your cart.
            </p>

            <Link
              href="/Marketplace"
              className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row"
                >
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/Marketplace/${product.id}`}
                            className="text-lg font-semibold text-gray-900 hover:underline"
                          >
                            {product.title}
                          </Link>

                          <p className="mt-1 text-sm text-gray-500">
                            {product.category} • {product.condition}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            📍 {product.location}
                          </p>
                        </div>

                        <p className="whitespace-nowrap text-lg font-bold text-gray-900">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-lg border border-gray-300">
                        <button
                          onClick={() =>
                            decreaseQuantity(product.id)
                          }
                          className="px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center font-semibold text-gray-900">
                          {product.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(product.id)
                          }
                          className="px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Subtotal
                        </p>

                        <p className="font-bold text-gray-900">
                          ₦
                          {(
                            product.price * product.quantity
                          ).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(product.id)
                        }
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items</span>

                  <span className="font-medium text-gray-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium text-gray-900">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="mt-4 w-full rounded-xl bg-black py-4 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : "Proceed to Checkout"}
                </button>

                <Link
                  href="/Marketplace"
                  className="block text-center text-sm font-medium text-gray-600 hover:text-black"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
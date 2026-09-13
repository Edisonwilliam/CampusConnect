"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/CartContent";
import { useAuth } from "../../components/AuthProvider";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "failed">("success");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      router.push("/cart");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/checkout-session?sessionId=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "paid") {
          setStatus("success");
          clearCart(); // Clear cart on success
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, token, clearCart, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verifying payment...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          {status === "success" ? (
            <>
              <div className="mb-4 text-6xl">✅</div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Successful!
              </h1>
              <p className="mt-2 text-gray-500">
                Thank you for your purchase. Your items have been ordered.
              </p>

              <div className="mt-8 flex gap-4 justify-center">
                <Link
                  href="/marketplace"
                  className="rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/orders"
                  className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-900 hover:bg-gray-50"
                >
                  View Orders
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 text-6xl">❌</div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Failed
              </h1>
              <p className="mt-2 text-gray-500">
                Something went wrong. Please try again.
              </p>

              <Link
                href="/cart"
                className="mt-8 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
              >
                Back to Cart
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
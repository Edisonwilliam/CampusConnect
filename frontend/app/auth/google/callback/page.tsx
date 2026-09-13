"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthProvider";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // Prevent double execution
    hasRun.current = true;

    // Read params directly from window.location instead of useSearchParams
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    console.log("Token:", token);
    console.log("User:", userParam);

    if (!token || !userParam) {
      console.error("Missing token or user");
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userParam);
      console.log("Parsed user:", user);

      login(token, user);

      const redirectPath =
        !user.school || !user.department || !user.level
          ? "/complete-profile"
          : "/";

      console.log("Redirecting to:", redirectPath);
      router.push(redirectPath);
    } catch (error) {
      console.error("Error parsing user:", error);
      router.push("/login");
    }
  }, [login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Signing you in...</p>
      </div>
    </div>
  );
}
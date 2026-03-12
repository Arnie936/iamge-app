"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "verifying" | "confirmed" | "timeout";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    const supabase = createClient();
    let attempts = 0;
    const maxAttempts = 15; // 30s total at 2s intervals

    const interval = setInterval(async () => {
      attempts++;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        clearInterval(interval);
        router.push("/login");
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (sub?.status === "active") {
        clearInterval(interval);
        setStatus("confirmed");
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus("timeout");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-6 h-8 w-8 animate-spin border-2 border-black border-t-transparent" />
            <h1 className="mb-3 text-2xl font-bold tracking-[0.15em] uppercase">
              Verifying Payment
            </h1>
            <p className="text-sm tracking-wider text-gray-600">
              Please wait while we confirm your subscription...
            </p>
          </>
        )}

        {status === "confirmed" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-2 border-black">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mb-3 text-2xl font-bold tracking-[0.15em] uppercase">
              Welcome
            </h1>
            <p className="mb-8 text-sm tracking-wider text-gray-600">
              Your subscription is active. You now have full access to the
              virtual try-on experience.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-black py-3 text-sm font-medium tracking-wider text-white uppercase hover:bg-gray-900"
            >
              Start Exploring
            </button>
          </>
        )}

        {status === "timeout" && (
          <>
            <h1 className="mb-3 text-2xl font-bold tracking-[0.15em] uppercase">
              Almost There
            </h1>
            <p className="mb-4 text-sm tracking-wider text-gray-600">
              Your payment was received but confirmation is taking longer than
              expected. This usually resolves within a minute.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mb-3 w-full bg-black py-3 text-sm font-medium tracking-wider text-white uppercase hover:bg-gray-900"
            >
              Check Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full border border-black py-3 text-sm font-medium tracking-wider uppercase hover:bg-gray-50"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

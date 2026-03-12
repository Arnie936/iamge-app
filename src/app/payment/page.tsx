"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PaymentPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? "");
      setUserId(user.id);

      // Check for existing canceled/expired subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (sub && sub.status !== "active") {
        setHasExpired(true);
      }

      setLoading(false);
    }

    init();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const paymentUrl = `${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL}?client_reference_id=${userId}&prefilled_email=${encodeURIComponent(email)}`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-3 text-2xl font-bold tracking-[0.15em] uppercase">
          {hasExpired ? "Resubscribe" : "Subscribe"}
        </h1>

        <p className="mb-8 text-sm tracking-wider text-gray-600">
          {hasExpired
            ? "Your subscription has ended. Resubscribe to continue using the virtual try-on experience."
            : "Get access to the AI-powered virtual try-on experience."}
        </p>

        <div className="mb-8 border border-gray-200 p-6">
          <p className="text-xs font-medium tracking-wider uppercase text-gray-500">
            Monthly Subscription
          </p>
          <p className="mt-2 text-4xl font-bold">
            $9.99<span className="text-base font-normal text-gray-500">/mo</span>
          </p>
          <p className="mt-3 text-xs tracking-wider text-gray-500">
            Unlimited virtual try-ons. Cancel anytime.
          </p>
        </div>

        <a
          href={paymentUrl}
          className="block w-full bg-black py-3 text-sm font-medium tracking-wider text-white uppercase hover:bg-gray-900"
        >
          {hasExpired ? "Resubscribe Now" : "Subscribe Now"}
        </a>

        <button
          onClick={handleSignOut}
          className="mt-6 text-xs tracking-wider text-gray-500 underline hover:text-black"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
}

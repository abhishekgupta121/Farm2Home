"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ShoppingCart,
  Tractor,
  ShieldCheck,
  TrendingUp,
  Languages,
} from "lucide-react";

const features = [
  {
    title: "Direct Farm Buying",
    description:
      "Consumers can buy crops directly from nearby farmers.",
    icon: ShoppingCart,
  },
  {
    title: "Secure Payments",
    description:
      "Payments are safely held until crop pickup verification.",
    icon: ShieldCheck,
  },
  {
    title: "Market Trends",
    description:
      "Farmers can track live market crop prices.",
    icon: TrendingUp,
  },
  {
    title: "Multi Language",
    description:
      "Supports both English and Hindi languages.",
    icon: Languages,
  },
];

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);

      if (parsedUser.role === "farmer") {
        router.push("/farmer/dashboard");
      } else {
        router.push("/consumer/dashboard");
      }
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 lg:px-16">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-600 p-3 text-white shadow-md">
            <Leaf size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-green-700">
              AgroConnect
            </h1>

            <p className="text-sm text-gray-500">
              Farmer ↔ Consumer Marketplace
            </p>
          </div>
        </div>

        <div className="hidden gap-8 md:flex">
          <button className="hover:text-green-600">
            Features
          </button>

          <button className="hover:text-green-600">
            Market Prices
          </button>

          <button className="hover:text-green-600">
            Contact
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:px-16 lg:py-20">
        {/* Left */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            <ShieldCheck size={18} />
            Trusted Agriculture Platform
          </div>

          <h2 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
            Fresh Crops Directly From
            <span className="text-green-600"> Farmers </span>
            To Consumers
          </h2>

          <p className="mb-8 max-w-xl text-lg leading-8 text-gray-600">
            Buy vegetables, wheat, rice, and fresh crops directly
            from nearby farmers with secure payments and smart
            delivery tracking.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/signup/farmer")}
              className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-green-700"
            >
              <Tractor size={22} />
              I Am a Farmer
            </button>

            <button
              onClick={() => router.push("/signup/consumer")}
              className="flex items-center justify-center gap-3 rounded-2xl border-2 border-orange-400 bg-white px-8 py-4 text-lg font-semibold text-orange-600 shadow-md transition hover:bg-orange-50"
            >
              <ShoppingCart size={22} />
              I Am a Consumer
            </button>
          </div>

          {/* Login */}
          <div className="mt-6">
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-green-700 hover:underline"
            >
              Already have an account? Login →
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop"
              alt="Farmer"
              width={600}
              height={450}
              priority
              className="h-[420px] w-full rounded-3xl object-cover"
            />
          </div>

          {/* Floating Card 1 */}
          <div className="absolute left-0 top-10 rounded-2xl bg-white p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <TrendingUp size={22} />
              </div>

              <div>
                <h4 className="font-bold">
                  Live Market Prices
                </h4>

                <p className="text-sm text-gray-500">
                  Real-time crop trends
                </p>
              </div>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute bottom-0 right-0 rounded-2xl bg-white p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-3 text-orange-500">
                <Languages size={22} />
              </div>

              <div>
                <h4 className="font-bold">
                  English & Hindi
                </h4>

                <p className="text-sm text-gray-500">
                  Multi-language support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-4xl font-bold text-gray-900">
            Platform Features
          </h3>

          <p className="text-lg text-gray-600">
            Everything needed for a modern agriculture marketplace.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-8 shadow-md transition hover:shadow-lg"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-green-100 p-4 text-green-600">
                <feature.icon size={28} />
              </div>

              <h4 className="mb-3 text-xl font-bold">
                {feature.title}
              </h4>

              <p className="leading-7 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-10 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h4 className="text-2xl font-bold text-green-700">
              AgroConnect
            </h4>

            <p className="mt-2 text-gray-500">
              Empowering Farmers & Consumers Together.
            </p>
          </div>

          <div className="flex gap-6 text-gray-600">
            <button className="hover:text-green-600">
              Privacy
            </button>

            <button className="hover:text-green-600">
              Terms
            </button>

            <button className="hover:text-green-600">
              Support
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
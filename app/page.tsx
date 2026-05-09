"use client";

import Image from "next/image";
import Link from "next/link";
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
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  const features = [
    {
      title: t("feat1Title"),
      description: t("feat1Desc"),
      icon: ShoppingCart,
    },
    {
      title: t("feat2Title"),
      description: t("feat2Desc"),
      icon: ShieldCheck,
    },
    {
      title: t("feat3Title"),
      description: t("feat3Desc"),
      icon: TrendingUp,
    },
    {
      title: t("feat4Title"),
      description: t("feat4Desc"),
      icon: Languages,
    },
  ];

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
              {t("farm2home")}
            </h1>

            <p className="text-sm text-gray-500">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="hidden gap-8 md:flex items-center">
          <Link href="/features" className="hover:text-green-600">
            {t("features")}
          </Link>

          <Link href="/market-prices" className="hover:text-green-600">
            {t("marketPrices")}
          </Link>

          <Link href="/contact" className="hover:text-green-600">
            {t("contact")}
          </Link>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/farm_background.png"
            alt="Farm Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 via-white/80 to-orange-50/90 backdrop-blur-sm"></div>
        </div>
        
        {/* Dynamic moving objects */}
        <div className="absolute top-10 left-10 z-0 opacity-30 animate-float text-green-500">
          <Leaf size={48} />
        </div>
        <div className="absolute bottom-20 left-1/3 z-0 opacity-20 animate-float-reverse text-orange-400">
          <Tractor size={64} />
        </div>
        <div className="absolute top-1/3 right-10 z-0 opacity-20 animate-float text-green-400">
          <Leaf size={40} />
        </div>

        <div className="relative z-10 grid items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:px-16 lg:py-20">
          {/* Left */}
          <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            <ShieldCheck size={18} />
            {t("trustedPlatform")}
          </div>

          <h2 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
            {t("heroTitle1")}
            <span className="text-green-600"> {t("heroTitleFarmers")} </span>
            {t("heroTitle2")}
          </h2>

          <p className="mb-8 max-w-xl text-lg leading-8 text-gray-600">
            {t("heroDesc")}
          </p>

          {/* Image Cards for Signup */}
          <div className="flex flex-col sm:flex-row gap-5 mt-8 justify-start">
            <button
              onClick={() => router.push("/signup/farmer")}
              className="group relative flex items-center gap-4 bg-white/80 backdrop-blur-md p-3 pr-6 rounded-full shadow-lg border border-green-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-green-50 text-left"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md">
                <Image
                  src="/farmer_avatar.png"
                  alt="Farmer"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800 tracking-wide">{t("iamFarmer")}</h3>
                <p className="text-green-600 text-sm font-medium">
                  Start selling now →
                </p>
              </div>
            </button>

            <button
              onClick={() => router.push("/signup/consumer")}
              className="group relative flex items-center gap-4 bg-white/80 backdrop-blur-md p-3 pr-6 rounded-full shadow-lg border border-orange-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-orange-50 text-left"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md">
                <Image
                  src="/consumer_avatar.png"
                  alt="Consumer"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-800 tracking-wide">{t("iamConsumer")}</h3>
                <p className="text-orange-600 text-sm font-medium">
                  Start buying now →
                </p>
              </div>
            </button>
          </div>

          {/* Login */}
          <div className="mt-6">
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-green-700 hover:underline"
            >
              {t("loginPrompt")}
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
                  {t("liveMarket")}
                </h4>

                <p className="text-sm text-gray-500">
                  {t("realTimeTrends")}
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
                  {t("engHindi")}
                </h4>

                <p className="text-sm text-gray-500">
                  {t("multiLangSupport")}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-4xl font-bold text-gray-900">
            {t("platformFeatures")}
          </h3>

          <p className="text-lg text-gray-600">
            {t("featuresDesc")}
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
              {t("farm2home")}
            </h4>

            <p className="mt-2 text-gray-500">
              {t("empowering")}
            </p>
          </div>

          <div className="flex gap-6 text-gray-600">
            <button className="hover:text-green-600">
              {t("privacy")}
            </button>

            <button className="hover:text-green-600">
              {t("terms")}
            </button>

            <button className="hover:text-green-600">
              {t("support")}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
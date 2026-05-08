export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-5xl font-bold text-green-700">
        KisanMandi 🌾
      </h1>

      <p className="mt-4 text-gray-600">
        Smart Farm to Consumer Marketplace
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="/login"
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Login
        </a>

        <a
          href="/signup"
          className="border border-green-600 text-green-700 px-6 py-3 rounded-xl"
        >
          Signup
        </a>
      </div>
    </div>
  );
}
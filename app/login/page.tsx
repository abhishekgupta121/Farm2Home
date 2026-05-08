export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 shadow-lg rounded-xl w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button className="w-full bg-green-600 text-white py-3 rounded-lg">
          Login
        </button>
      </div>
    </div>
  );
}
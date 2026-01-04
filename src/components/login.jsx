import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { loginWithGoogle } from "../config/firebase";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      alert("Google login failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-blue-700">
          PrepFit
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Prepare smart. Avoid overfitting.
        </p>

        {/* Divider */}
        <div className="my-8 border-t" />

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition duration-300 disabled:opacity-60"
        >
          <FcGoogle size={22} />
          <span className="font-medium text-gray-700">
            {loading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>

        {/* Footer text */}
        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to PrepFit’s terms and privacy policy.
        </p>
      </div>
    </div>
  );
};

export default Login;

"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-6 text-indigo-700"
      >
        AI Career Guidance
      </motion.h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl text-center">
        Get personalized AI-driven career guidance and shape your future with confidence.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-3 bg-gray-200 text-indigo-700 rounded-xl shadow-md hover:bg-gray-300 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

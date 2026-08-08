"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KeyRound, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login gagal");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 relative overflow-hidden font-sans-body">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A961]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#C9A961]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8 relative z-10"
      >
        {/* Prabaswara Logo Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="relative w-48 h-16 mb-2">
            <Image
              src="/logo.png"
              alt="Prabaswara Logo"
              fill
              sizes="192px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-serif-heading text-2xl font-bold tracking-tight text-white">
            Admin Panel Login
          </h1>
          <p className="text-xs text-neutral-400 font-light tracking-wide">
            Masukan Password Keamanan untuk Mengakses Dashboard Admin
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
          <span>Protected Security Portal</span>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
              Password Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A961] focus:ring-1 focus:ring-[#C9A961] transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-[#C9A961]/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk Ke Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-neutral-500 hover:text-[#C9A961] transition-colors"
          >
            ← Kembali ke Website Utama
          </a>
        </div>
      </motion.div>
    </div>
  );
}

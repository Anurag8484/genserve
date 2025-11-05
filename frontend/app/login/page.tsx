"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import ThreeBg from "@/components/ThreeBg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Minimal Google SVG to avoid extra icon dependencies
function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.7 3.4-5.5 3.4a6.4 6.4 0 1 1 0-12.8c1.8 0 3 0.7 3.7 1.4l2.6-2.6C16.9 2.5 14.7 1.6 12 1.6 6.9 1.6 2.8 5.7 2.8 10.8S6.9 20 12 20c3.5 0 6-1.2 7.5-3.3 1.9-2.4 2-5.5 1.7-7h-9.2z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onGoogle = () => {
    setLoading(true);
    // Redirect-based sign in
    signIn("google", { callbackUrl: "/" })
      .catch(() => setLoading(false));
  };

  const onMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a placeholder if you want to hook your FastAPI later.
    // For now, we just no-op.
    alert("Demo login not wired to backend yet. Please use Google Sign-In.");
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* 3D background */}
      <ThreeBg />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2 md:py-24">
        {/* Left: Brand / hero like Twitter */}
        <section className="hidden md:flex md:flex-col md:items-start md:justify-center">
          <div className="rounded-full bg-white/10 p-4 backdrop-blur">
            <div className="h-8 w-8 rounded-full bg-blue-400" />
          </div>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight md:text-6xl">
            Happening now
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Join GenServe today.
          </p>
        </section>

        {/* Right: Auth card */}
        <section className="flex w-full items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <h2 className="mb-6 text-center text-2xl font-bold">Sign in to GenServe</h2>

            <div className="space-y-3">
              <Button
                onClick={onGoogle}
                className="w-full bg-white text-black hover:bg-white/90"
                disabled={loading}
              >
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>

            <div className="my-6 flex items-center gap-3 text-sm text-white/60">
              <div className="h-px w-full bg-white/10" />
              <span>or</span>
              <div className="h-px w-full bg-white/10" />
            </div>

            <form onSubmit={onMockLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 placeholder:text-white/50"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 placeholder:text-white/50"
              />
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

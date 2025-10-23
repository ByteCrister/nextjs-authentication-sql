'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // async function onSubmit(e: React.FormEvent) {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         await axios.post("/api/auth/sign-in", { email, password, remember });
    //         window.location.href = "/";
    //     } catch (err: any) {
    //         setError(err.response?.data?.error?.message || "Failed to sign in");
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await signIn("credentials", {
                redirect: false, // handle redirect manually
                email,
                password,
                remember,
                callbackUrl: "/"
            });
            if (res?.error) setError(res.error);
            else window.location.href = res?.url || "/";
        } catch (err: any) {
            setError(err?.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    }


    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div>
                <label className="block text-sm mb-1">Email</label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-sm mb-1">Password</label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="text-sm">
                    Remember me
                </label>
            </div>
            <Button disabled={loading} type="submit">
                {loading ? "Signing in..." : "Sign in"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-4">
                <div className="flex border-t border-gray-300"></div>
                <span className="px-2 text-sm text-gray-500">or</span>
                <div className="flex border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
            <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2 w-full"
                onClick={() => signIn("google", { callbackUrl: "/" })}
            >
                <Image
                    src="/google-logo.svg"
                    alt="Google"
                    width={20}
                    height={20}
                />
                Sign in with Google
            </Button>
        </form>
    );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@nith.ac.in")) {
      setError("Please use your college email (@nith.ac.in)");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.forgotPassword(email);
      setUserId(data.userId);
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(userId, otp, newPassword);
      toast.success(
        "Password reset successful! You can now login with your new password."
      );
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setError("");
    setResendLoading(true);

    try {
      const data = await authAPI.forgotPassword(email);
      setUserId(data.userId);
      toast.success("OTP resent successfully! Check your email.");
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">ZeroVerse</h1>
          </div>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Set New Password"}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  College Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@nith.ac.in"
                  className="w-full bg-muted/50 border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send an OTP to your registered email
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <div>
              <div className="bg-indigo-500/10 border border-indigo-500/50 text-indigo-300 px-4 py-3 rounded-md mb-4 text-sm">
                We've sent a 6-digit OTP to <strong>{email}</strong>. Please
                check your inbox.
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) setOtp(value);
                    }}
                    placeholder="000000"
                    className="w-full bg-muted/50 border border-input rounded-md px-4 py-2 text-foreground text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Valid for 10 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11"
                >
                  Continue
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                >
                  {resendLoading
                    ? "Resending..."
                    : "Didn't receive OTP? Resend"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-md mb-4 text-sm">
                ✓ OTP verified! Now set your new password.
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 12 characters"
                  className="w-full bg-muted/50 border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full bg-muted/50 border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-indigo-500 hover:text-purple-300 font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

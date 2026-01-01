"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MessageCircleHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ConfessionCard() {
  const router = useRouter();
  const { user } = useAuth();

  const handleConfessClick = () => {
    // TODO: Redirect to confession page when created
    toast.info("Confession page coming soon!");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-50/5 via-pink-100/10 to-rose-50/5 border border-pink-200/20 rounded-xl p-6 backdrop-blur-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-300/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <MessageCircleHeart className="h-5 w-5 text-pink-400" />
          </div>
          <h3 className="font-bold text-white">Anonymous Confessions</h3>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            Share your thoughts anonymously. Your identity stays hidden while
            your voice is heard.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs bg-pink-500/10 text-pink-300 px-2.5 py-1 rounded-full border border-pink-500/20">
              <Sparkles className="h-3 w-3" />
              100% Anonymous
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-pink-500/10 text-pink-300 px-2.5 py-1 rounded-full border border-pink-500/20">
              Safe Space
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleConfessClick}
          className="w-full bg-white/5 hover:bg-white/10 text-white border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <MessageCircleHeart className="h-4 w-4 mr-2" />
          Share Your Confession
        </Button>

        {/* Footer note */}
        <p className="text-xs text-gray-500 text-center mt-3">
          Your secret is safe with us 🤫
        </p>
      </div>
    </div>
  );
}

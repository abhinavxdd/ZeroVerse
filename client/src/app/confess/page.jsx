"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { postsAPI } from "@/lib/api";
import { toast } from "sonner";
import { MessageCircleHeart, Lock, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfessPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to share a confession");
      router.push("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await postsAPI.createPost({
        title: title.trim(),
        content: content.trim(),
        category: "Confession",
      });

      toast.success("Your confession has been shared anonymously! 🤫");
      setTitle("");
      setContent("");

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Error creating confession:", error);
      toast.error(
        error.response?.data?.message || "Failed to share confession"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="bg-zinc-900 border-pink-500/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-pink-500/10 rounded-full">
                <Lock className="h-8 w-8 text-pink-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">
              Login Required
            </CardTitle>
            <CardDescription className="text-gray-400">
              Please login to share your anonymous confession
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-3">
            <Button
              onClick={() => router.push("/login")}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/signup")}
              variant="outline"
              className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
            >
              Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full">
              <MessageCircleHeart className="h-10 w-10 text-pink-400" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-5 w-5 text-pink-300 animate-pulse" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">
          Anonymous Confession
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Share your thoughts, feelings, or secrets in a safe, anonymous space.
          Your identity will remain completely hidden.
        </p>
      </div>

      {/* Anonymous Badge */}
      <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-pink-400 flex-shrink-0" />
          <div>
            <h3 className="text-white font-semibold text-sm">100% Anonymous</h3>
            <p className="text-gray-400 text-xs mt-1">
              Your confession will be posted with your anonymous alias. No one
              can trace it back to you.
            </p>
          </div>
        </div>
      </div>

      {/* Confession Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Share Your Confession</CardTitle>
            <CardDescription className="text-gray-400">
              Express yourself freely and authentically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your confession a title..."
                maxLength={100}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* Content Textarea */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Your Confession
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share what's on your mind... This is a safe space."
                rows={8}
                maxLength={2000}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length}/2000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Share Confession
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/")}
                variant="outline"
                className="border-white/10 text-gray-300 hover:bg-white/5"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Guidelines */}
      <div className="mt-8 bg-zinc-900 border border-white/10 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-pink-400" />
          Confession Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-0.5">•</span>
            <span>Be respectful and considerate of others</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-0.5">•</span>
            <span>No hate speech, harassment, or threats</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-0.5">•</span>
            <span>
              Your identity is protected - share freely but responsibly
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-0.5">•</span>
            <span>
              Confessions that violate community rules will be removed
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

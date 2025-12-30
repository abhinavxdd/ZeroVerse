"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { postsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function CreatePostPage() {
  const [category, setCategory] = useState("General");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const categories = ["General", "Hostel", "Exams", "Gossip", "Placements"];

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    const wordCount = title
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (wordCount > 50) {
      alert("Title cannot exceed 50 words");
      return;
    }

    if (!user) {
      alert("Please log in to create a post");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      await postsAPI.createPost({ title, content, category });
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Create post</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-full text-white hover:bg-zinc-800 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <span className="text-xs font-bold text-black">
                  {category[0]}
                </span>
              </div>
              <span className="text-sm font-medium">{category}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full mt-2 w-64 bg-zinc-900 border border-white/10 rounded-lg shadow-lg z-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <span className="text-sm font-bold text-black">
                        {cat[0]}
                      </span>
                    </div>
                    <span className="text-sm text-white">{cat}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-white/10">
            <button
              type="button"
              className="pb-3 px-1 text-sm font-medium text-white border-b-2 border-indigo-500"
            >
              Text
            </button>
          </div>

          {/* Title Input */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <span className="absolute bottom-3 right-4 text-xs text-gray-500">
                {
                  title
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }
                /50 words
              </span>
            </div>
          </div>

          {/* Body Text */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Body text (optional)"
              rows={10}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={submitting}
              className="border-white/20 bg-transparent text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !title.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { postsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Upload,
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { toast } from "sonner";

export default function CreatePostPage() {
  const [category, setCategory] = useState("General");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const categories = ["General", "Hostel", "Exams", "Gossip", "Placements"];

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryDropdown]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setMediaFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews((prev) => [
          ...prev,
          {
            url: reader.result,
            type: file.type.startsWith("video") ? "video" : "image",
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const wordCount = title
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (wordCount > 50) {
      toast.error("Title cannot exceed 50 words");
      return;
    }

    if (!user) {
      toast.error("Please log in to create a post");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);

      // Append media files
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      await postsAPI.createPost(formData);
      toast.success("Post created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post: " + error.message);
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

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 rounded-lg border border-white/10 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/10 bg-black/40 px-3">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "text"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "media"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Images & Video
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Category Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/10 rounded hover:bg-black/60 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <span className="text-xs font-bold text-black">
                    {category[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-white">
                  {category}
                </span>
                <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
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

            {/* Title Input */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Content based on active tab */}
            {activeTab === "text" ? (
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Body text (optional)"
                  rows={10}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-white/20 rounded p-12 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    id="media-upload"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-white mb-2">
                      Drag and Drop or upload media
                    </p>
                    <p className="text-sm text-gray-400">
                      Images and videos supported
                    </p>
                  </label>
                </div>

                {/* Media Previews */}
                {mediaPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaPreviews.map((media, index) => (
                      <div key={index} className="relative group">
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={media.name}
                            className="w-full h-40 object-cover rounded border border-white/10"
                          />
                        ) : (
                          <div className="relative w-full h-40 bg-black/40 rounded border border-white/10 flex items-center justify-center">
                            <Video className="h-12 w-12 text-gray-400" />
                            <video
                              src={media.url}
                              className="absolute inset-0 w-full h-full object-cover rounded opacity-50"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={submitting}
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !title.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

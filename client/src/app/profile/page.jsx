"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Loader2,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      General: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Hostel: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      Exams: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      Gossip: "bg-green-500/10 text-green-500 border-green-500/20",
      Placements: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return colors[category] || colors.General;
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await authAPI.getProfile();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  const { user: userData, stats, posts } = profileData;

  const joinDate = new Date(userData.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Profile Header */}
        <div className="mb-8 border-b border-white/10 pb-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarFallback className="bg-white text-black text-2xl font-bold">
                {userData.alias[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">@{userData.alias}</h1>
              <p className="text-sm text-white/60 mb-3">{userData.email}</p>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Calendar className="h-3 w-3" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex gap-8 text-sm">
            <div>
              <span className="font-semibold">{stats.totalPosts}</span>
              <span className="text-white/60 ml-1">posts</span>
            </div>
            <div>
              <span className="font-semibold">{stats.totalLikes}</span>
              <span className="text-white/60 ml-1">likes</span>
            </div>
            <div>
              <span className="font-semibold">{stats.totalDislikes}</span>
              <span className="text-white/60 ml-1">dislikes</span>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
            Posts
          </h2>

          {posts.length === 0 ? (
            <div className="border border-white/10 rounded-lg p-8 text-center">
              <p className="text-white/60 mb-4">No posts yet</p>
              <Link href="/create">
                <Button variant="outline" size="sm">
                  Create post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  className="block"
                >
                  <div className="bg-zinc-900 border border-white/10 hover:border-white/20 rounded-lg transition-all overflow-hidden mb-6">
                    <div className="flex gap-3 p-4">
                      {/* Avatar */}
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-white text-black text-xs font-semibold">
                          {userData.alias[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                          <span className="font-medium text-white/70">
                            {userData.alias}
                          </span>
                          <span>•</span>
                          <span>
                            {(() => {
                              const now = new Date();
                              const postDate = new Date(post.createdAt);
                              const diffMs = now - postDate;
                              const diffMins = Math.floor(diffMs / 60000);
                              const diffHours = Math.floor(diffMs / 3600000);
                              const diffDays = Math.floor(diffMs / 86400000);
                              const diffMonths = Math.floor(
                                diffMs / 2592000000
                              );

                              if (diffMins < 60) return `${diffMins} min. ago`;
                              if (diffHours < 24) return `${diffHours} hr. ago`;
                              if (diffDays < 30)
                                return `${diffDays} day${
                                  diffDays > 1 ? "s" : ""
                                } ago`;
                              return `${diffMonths} mo. ago`;
                            })()}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-white mb-2 line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Content preview */}
                        <p className="text-sm text-white/60 mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        {/* Tag */}
                        <div className="mb-3">
                          <span
                            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryColor(
                              post.category
                            )}`}
                          >
                            {post.category}
                          </span>
                        </div>

                        {/* Footer stats */}
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <div className="flex items-center gap-1.5">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="font-medium">
                              {post.likes?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ThumbsDown className="h-4 w-4" />
                            <span className="font-medium">
                              {post.dislikes?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

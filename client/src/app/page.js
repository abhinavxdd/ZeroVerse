"use client";

import React from "react";
import { MessageSquare, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HomePage() {
  // TODO: Fetch posts from backend
  const posts = [
    {
      id: 1,
      title: "Just got my first internship offer! 🎉",
      content:
        "After 50+ applications and countless rejections, I finally landed an internship at a startup. Don't give up guys, your time will come!",
      author: "anonymous_coder",
      likes: 124,
      dislikes: 5,
      commentsCount: 18,
      createdAt: "2h ago",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <main className="flex flex-col gap-4">
        {/* Create Post Input */}
        <div className="flex items-center gap-3 bg-card p-3 rounded-md border border-border">
          <Avatar className="h-10 w-10">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="Create Post"
            className="flex-1 bg-muted/50 border-none rounded-md px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No posts yet. Be the first to create one!
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
}

// --- POST CARD COMPONENT ---
function PostCard({ post }) {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden hover:border-foreground/20 transition-colors">
      <div className="p-3">
        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">
              {post.author?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <span className="hover:underline cursor-pointer">
            @{post.author || "anonymous"}
          </span>
          <span>•</span>
          <span>{post.createdAt || "Just now"}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-foreground mb-2 leading-snug">
          {post.title}
        </h2>

        {/* Body Content */}
        {post.content && (
          <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        {/* Image (centered) */}
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden border border-border flex justify-center items-center bg-muted/20">
            <img
              src={post.image}
              alt={post.title}
              className="max-h-[400px] w-auto object-contain"
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{post.dislikes || 0}</span>
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full"
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
}

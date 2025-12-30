"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsAPI.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <main className="flex flex-col gap-4">
        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No posts yet. Be the first to create one!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} userId={user?.id} />
          ))
        )}
      </main>
    </div>
  );
}

// --- POST CARD COMPONENT ---
function PostCard({ post, userId }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [dislikes, setDislikes] = useState(post.dislikes || []);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  // Check if current user has liked or disliked
  const hasLiked = userId && likes.includes(userId);
  const hasDisliked = userId && dislikes.includes(userId);

  const handleLike = async () => {
    if (!userId) {
      alert("Please log in to like posts!");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    try {
      const updatedPost = await postsAPI.likePost(post._id);
      setLikes(updatedPost.likes);
      setDislikes(updatedPost.dislikes);
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Error liking post: " + error.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!userId) {
      alert("Please log in to dislike posts!");
      return;
    }
    if (isDisliking) return;

    setIsDisliking(true);
    try {
      const updatedPost = await postsAPI.dislikePost(post._id);
      setLikes(updatedPost.likes);
      setDislikes(updatedPost.dislikes);
    } catch (error) {
      console.error("Error disliking post:", error);
      alert("Error disliking post: " + error.message);
    } finally {
      setIsDisliking(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden hover:border-foreground/20 transition-colors">
      <div className="p-3">
        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">
              {post.alias?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <span className="hover:underline cursor-pointer">
            @{post.alias || "anonymous"}
          </span>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
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
            onClick={handleLike}
            disabled={isLiking}
            className={`gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full transition-colors ${
              hasLiked ? "text-blue-500 hover:text-blue-600" : ""
            } ${!userId ? "cursor-pointer" : ""}`}
            title={!userId ? "Login to like" : ""}
          >
            <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
            <span>{likes.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            disabled={isDisliking}
            className={`gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full transition-colors ${
              hasDisliked ? "text-red-500 hover:text-red-600" : ""
            } ${!userId ? "cursor-pointer" : ""}`}
            title={!userId ? "Login to dislike" : ""}
          >
            <ThumbsDown
              className={`w-4 h-4 ${hasDisliked ? "fill-current" : ""}`}
            />
            <span>{dislikes.length}</span>
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

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageCircleHeart,
  Sparkles,
  PlusCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { postsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const data = await postsAPI.getAllPosts();
        // Filter only confession posts
        const confessionPosts = data.filter(
          (post) => post.category === "Confession"
        );
        setConfessions(confessionPosts);
      } catch (error) {
        console.error("Error fetching confessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfessions();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl px-5 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full">
                <MessageCircleHeart className="h-6 w-6 text-pink-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Anonymous Confessions
              </h1>
            </div>
            <p className="text-gray-400">
              A safe space for sharing thoughts, feelings, and secrets
              anonymously
            </p>
          </div>
          <Button
            onClick={() => router.push("/confess")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Share Confession
          </Button>
        </div>
      </div>

      {/* Anonymous Info Banner */}
      <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">
              100% Anonymous & Safe
            </h3>
            <p className="text-gray-400 text-xs">
              All confessions are completely anonymous. Share freely without
              fear of judgment.
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-pink-300 flex-shrink-0 animate-pulse" />
        </div>
      </div>

      {/* Confessions List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading confessions...
        </div>
      ) : confessions.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="p-6 bg-pink-500/10 rounded-full">
              <MessageCircleHeart className="h-12 w-12 text-pink-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No confessions yet
          </h3>
          <p className="text-gray-400 mb-6">
            Be the first to share your thoughts anonymously
          </p>
          <Button
            onClick={() => router.push("/confess")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            Share Your Confession
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {confessions.map((confession) => (
            <ConfessionCard
              key={confession._id}
              confession={confession}
              userId={user?.id}
              router={router}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ConfessionCard({ confession, userId, router }) {
  const [likes, setLikes] = useState(confession.likes || []);
  const [dislikes, setDislikes] = useState(confession.dislikes || []);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const hasLiked = userId && likes.includes(userId);
  const hasDisliked = userId && dislikes.includes(userId);

  const handleLike = async () => {
    if (!userId) {
      toast.error("Please log in to like confessions!");
      return;
    }

    setIsLiking(true);
    try {
      await postsAPI.likePost(confession._id);
      if (hasLiked) {
        setLikes(likes.filter((id) => id !== userId));
      } else {
        setLikes([...likes, userId]);
        if (hasDisliked) {
          setDislikes(dislikes.filter((id) => id !== userId));
        }
      }
    } catch (error) {
      console.error("Error liking confession:", error);
      toast.error("Failed to like confession");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!userId) {
      toast.error("Please log in to dislike confessions!");
      return;
    }

    setIsDisliking(true);
    try {
      await postsAPI.dislikePost(confession._id);
      if (hasDisliked) {
        setDislikes(dislikes.filter((id) => id !== userId));
      } else {
        setDislikes([...dislikes, userId]);
        if (hasLiked) {
          setLikes(likes.filter((id) => id !== userId));
        }
      }
    } catch (error) {
      console.error("Error disliking confession:", error);
      toast.error("Failed to dislike confession");
    } finally {
      setIsDisliking(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${confession._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div
      onClick={() => router.push(`/post/${confession._id}`)}
      className="bg-zinc-900 border border-pink-500/20 rounded-lg p-5 hover:border-pink-500/40 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-pink-500/30">
            <AvatarFallback className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-400 font-semibold">
              {confession.author?.alias === "Anonymous User"
                ? "AU"
                : confession.author?.alias?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">
                {confession.author?.alias === "Anonymous User"
                  ? "Anonymous User"
                  : confession.author?.alias || "Anonymous"}
              </p>
              <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs rounded-full border border-pink-500/30">
                Anonymous
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(confession.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-white mb-2">
        {confession.title}
      </h2>

      {/* Content */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
        {confession.content}
      </p>

      {/* Action Bar */}
      <div className="flex items-center gap-2 text-gray-400">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          disabled={isLiking}
          className={`gap-1.5 h-9 px-3 text-sm hover:bg-pink-500/10 rounded-full transition-colors ${
            hasLiked
              ? "text-pink-500 hover:text-pink-600"
              : "hover:text-pink-400"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
          <span>{likes.length}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDislike();
          }}
          disabled={isDisliking}
          className={`gap-1.5 h-9 px-3 text-sm hover:bg-red-500/10 rounded-full transition-colors ${
            hasDisliked
              ? "text-red-500 hover:text-red-600"
              : "hover:text-red-400"
          }`}
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
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/post/${confession._id}`);
          }}
          className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{confession.comments?.length || 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full"
        >
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </div>
    </div>
  );
}

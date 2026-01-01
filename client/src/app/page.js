"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Home,
  PenSquare,
  Info,
  Github,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
  Rocket,
  GraduationCap,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { postsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSearch } from "@/contexts/SearchContext";
import { toast } from "sonner";
import Leaderboard from "@/components/Leaderboard";
import ConfessionCard from "@/components/ConfessionCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user } = useAuth();
  const { searchQuery } = useSearch();
  const router = useRouter();

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

  // Filter posts by category and search
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const categories = ["General", "Hostel", "Exams", "Gossip", "Placements"];

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

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="flex gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="hidden lg:block w-64 sticky top-20 h-fit">
          <nav className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Navigation
            </h2>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </button>

            <button
              onClick={() => router.push("/create")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground cursor-pointer"
            >
              <PenSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Create Post</span>
            </button>

            <div className="pt-4 mt-4 border-t border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
                Categories
              </h3>

              {categories.map((category) => {
                const isActive = selectedCategory === category;
                const dotColor = {
                  General: "bg-blue-500",
                  Hostel: "bg-orange-500",
                  Exams: "bg-yellow-500",
                  Gossip: "bg-green-500",
                  Placements: "bg-purple-500",
                }[category];

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? "bg-muted text-foreground font-medium"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                    <span className="text-sm">{category}</span>
                  </button>
                );
              })}

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <span className="text-sm">Clear filter</span>
                </button>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-border space-y-2">
              <button
                onClick={() => router.push("/about")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">About & Rules</span>
              </button>
            </div>

            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex gap-1">
                <a
                  href="https://github.com/abhinavxdd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abh1navvv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/abh1navv.v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:abh1nav.rj02@gmail.com"
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl flex flex-col gap-4">
          {/* Filter Indicator */}
          {selectedCategory && (
            <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-3 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Filter by:
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${getCategoryColor(
                    selectedCategory
                  )}`}
                >
                  {selectedCategory}
                </span>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-md hover:bg-primary/10 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? "No posts found."
                : selectedCategory
                ? `No posts in ${selectedCategory} category yet.`
                : "No posts yet. Be the first to create one!"}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                userId={user?.id}
                router={router}
                searchQuery={searchQuery}
              />
            ))
          )}
        </main>

        {/* Right Sidebar - Leaderboard */}
        <aside className="hidden xl:block w-80 sticky top-20 h-fit space-y-4">
          <Leaderboard />
          <ConfessionCard />
        </aside>
      </div>
    </div>
  );
}

// --- POST CARD COMPONENT ---
function PostCard({ post, userId, router, searchQuery }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [dislikes, setDislikes] = useState(post.dislikes || []);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  // Highlight search terms
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-yellow-500/30 text-yellow-200 px-0.5 rounded"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

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

  // Check if current user has liked or disliked
  const hasLiked = userId && likes.includes(userId);
  const hasDisliked = userId && dislikes.includes(userId);

  const handleLike = async () => {
    if (!userId) {
      toast.error("Please log in to like posts!");
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
      toast.error("Error liking post: " + error.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!userId) {
      toast.error("Please log in to dislike posts!");
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
      toast.error("Error disliking post: " + error.message);
    } finally {
      setIsDisliking(false);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;

    // Try native Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content?.substring(0, 100) || post.title,
          url: postUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy link");
      }
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
    <div
      onClick={() => router.push(`/post/${post._id}`)}
      className="bg-card border border-border rounded-md overflow-hidden hover:border-foreground/20 transition-colors cursor-pointer"
    >
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
          {post.isEdited && (
            <>
              <span>•</span>
              <span className="text-xs text-muted-foreground">(edited)</span>
            </>
          )}
          {post.category && (
            <>
              <span>•</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryColor(
                  post.category
                )}`}
              >
                {post.category}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-foreground mb-2 leading-snug">
          {highlightText(post.title, searchQuery)}
        </h2>

        {/* Body Content */}
        {post.content && (
          <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
            {highlightText(post.content, searchQuery)}
          </p>
        )}

        {/* Media Carousel */}
        {post.media && post.media.length > 0 && (
          <div className="mb-3">
            <Carousel className="w-full">
              <CarouselContent>
                {post.media.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="relative bg-muted/20 border border-border rounded-lg overflow-hidden">
                      {item.resourceType === "image" ? (
                        <img
                          src={item.url}
                          alt={`Media ${index + 1}`}
                          className="w-full max-h-[400px] object-contain cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.url, "_blank");
                          }}
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="w-full max-h-[400px] object-contain"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        )}

        {/* Image (centered) - Legacy support */}
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
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            disabled={isLiking}
            className={`gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full transition-colors cursor-pointer ${
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
            onClick={(e) => {
              e.stopPropagation();
              handleDislike();
            }}
            disabled={isDisliking}
            className={`gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full transition-colors cursor-pointer ${
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
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/post/${post._id}`);
            }}
            className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
}

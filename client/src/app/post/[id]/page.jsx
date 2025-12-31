"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Send,
  Trash2,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { postsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

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

  // Fetch post and comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await postsAPI.getPostById(params.id);
        setPost(postData);
        setLikes(postData.likes || []);
        setDislikes(postData.dislikes || []);
        setComments(postData.comments || []);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Error loading post");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPostData();
    }
  }, [params.id]);

  const hasLiked = user?.id && likes.includes(user.id);
  const hasDisliked = user?.id && dislikes.includes(user.id);

  const handleLike = async () => {
    if (!user) {
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
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
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
    } finally {
      setIsDisliking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to comment!");
    }

    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const updatedPost = await postsAPI.addComment(post._id, newComment);
      setComments(updatedPost.comments);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Error adding comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      await postsAPI.deletePost(post._id);
      toast.success("Post deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Error deleting post");
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const updatedPost = await postsAPI.deleteComment(
        post._id,
        commentToDelete
      );
      setComments(updatedPost.comments);
      toast.success("Comment deleted successfully");
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.message || "Error deleting comment");
    }
  };

  const handleEditPost = () => {
    setEditedTitle(post.title);
    setEditedContent(post.content || "");
    setIsEditingPost(true);
  };

  const handleSavePost = async () => {
    try {
      const updatedPost = await postsAPI.updatePost(post._id, {
        title: editedTitle,
        content: editedContent,
      });
      setPost(updatedPost);
      setIsEditingPost(false);
      toast.success("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(error.message || "Error updating post");
    }
  };

  const handleCancelEditPost = () => {
    setIsEditingPost(false);
    setEditedTitle("");
    setEditedContent("");
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditedCommentContent(comment.content);
  };

  const handleSaveComment = async () => {
    if (!editingCommentId) return;

    try {
      const updatedPost = await postsAPI.updateComment(
        post._id,
        editingCommentId,
        editedCommentContent
      );
      setComments(updatedPost.comments);
      setEditingCommentId(null);
      setEditedCommentContent("");
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(error.message || "Error updating comment");
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditedCommentContent("");
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

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="text-center py-12 text-muted-foreground">
          Loading post...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="text-center py-12 text-muted-foreground">
          Post not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </Button>

      {/* Post Card */}
      <div className="bg-card border border-border rounded-md overflow-hidden mb-4">
        <div className="p-4">
          {/* Post Metadata */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {post.alias?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">@{post.alias || "anonymous"}</span>
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
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                    post.category
                  )}`}
                >
                  {post.category}
                </span>
              </>
            )}
            {user?.id === post.userId && (
              <div className="ml-auto flex gap-1">
                {!isEditingPost && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditPost}
                      className="h-7 w-7 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialogOpen(true)}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Title and Content - Editable */}
          {isEditingPost ? (
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Post title"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={6}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Post content (optional)"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSavePost}
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  onClick={handleCancelEditPost}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Title */}
              <h1 className="text-2xl font-bold text-foreground mb-3">
                {post.title}
              </h1>

              {/* Content */}
              {post.content && (
                <p className="text-base text-foreground mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
              )}
            </>
          )}

          {/* Media Carousel */}
          {post.media && post.media.length > 0 && (
            <div className="mb-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {post.media.map((item, index) => (
                    <CarouselItem key={index}>
                      <div className="relative bg-muted/20 border border-border rounded-lg overflow-hidden">
                        {item.resourceType === "image" ? (
                          <img
                            src={item.url}
                            alt={`Media ${index + 1}`}
                            className="w-full max-h-[500px] object-contain cursor-pointer"
                            onClick={() => window.open(item.url, "_blank")}
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="w-full max-h-[500px] object-contain"
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

          {/* Image - Legacy support */}
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden border border-border">
              <img
                src={post.image}
                alt={post.title}
                className="w-full max-h-[500px] object-contain"
              />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center gap-2 text-muted-foreground pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full ${
                hasLiked ? "text-blue-500 hover:text-blue-600" : ""
              }`}
            >
              <ThumbsUp
                className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`}
              />
              <span>{likes.length}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              disabled={isDisliking}
              className={`gap-1.5 h-9 px-3 text-sm hover:bg-muted rounded-full ${
                hasDisliked ? "text-red-500 hover:text-red-600" : ""
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
              className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{comments.length}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2 h-9 px-3 text-sm hover:bg-muted rounded-full"
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="bg-card border border-border rounded-md overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="text-xs">
                    {user.alias?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="gap-2"
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Posting..." : "Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-muted/50 border border-border rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Please log in to comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  className="flex gap-3 pb-4 border-b border-border last:border-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {comment.alias?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        @{comment.alias || "anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.isEdited && (
                        <span className="text-xs text-muted-foreground">
                          (edited)
                        </span>
                      )}
                      {user?.id === comment.userId &&
                        editingCommentId !== comment._id && (
                          <div className="ml-auto flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditComment(comment)}
                              className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCommentToDelete(comment._id);
                                setDeleteCommentDialogOpen(true);
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                    </div>
                    {editingCommentId === comment._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) =>
                            setEditedCommentContent(e.target.value)
                          }
                          rows={3}
                          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveComment}
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700 h-7 text-xs"
                          >
                            <Check className="h-3 w-3" />
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelEditComment}
                            size="sm"
                            variant="outline"
                            className="gap-1 h-7 text-xs"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Post Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-950 border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Comment Dialog */}
      <AlertDialog
        open={deleteCommentDialogOpen}
        onOpenChange={setDeleteCommentDialogOpen}
      >
        <AlertDialogContent className="bg-zinc-950 border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Comment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

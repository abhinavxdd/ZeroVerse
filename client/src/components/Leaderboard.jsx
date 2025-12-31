"use client";

import React, { useState, useEffect } from "react";
import { postsAPI } from "@/lib/api";
import { Trophy, TrendingUp, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await postsAPI.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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

  const getMedalColor = (index) => {
    if (index === 0) return "text-yellow-500";
    if (index === 1) return "text-gray-400";
    if (index === 2) return "text-orange-600";
    return "text-gray-600";
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="font-bold text-white">Leaderboard</h2>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          No data available yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="font-bold text-white">Top Contributors</h2>
      </div>

      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div
            key={user._id}
            className="border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              {/* Rank */}
              <div className="flex-shrink-0">
                {index < 3 ? (
                  <Trophy className={`h-5 w-5 ${getMedalColor(index)}`} />
                ) : (
                  <div className="h-5 w-5 flex items-center justify-center text-xs font-bold text-gray-500">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">
                  @{user.alias}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{user.totalPosts} posts</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {user.totalLikes} likes
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarFallback className="bg-white text-black text-sm font-bold">
                  {user.alias[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

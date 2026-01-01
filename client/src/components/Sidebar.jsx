"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  TrendingUp,
  List,
  PenSquare,
  ChevronDown,
  ChevronUp,
  Info,
  Github,
  Linkedin,
  Instagram,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Sidebar({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  setSearchQuery,
}) {
  const router = useRouter();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const categories = ["General", "Hostel", "Exams", "Gossip", "Placements"];

  const getCategoryIcon = (category) => {
    const icons = {
      General: "bg-blue-500",
      Hostel: "bg-orange-500",
      Exams: "bg-yellow-500",
      Gossip: "bg-green-500",
      Placements: "bg-purple-500",
    };
    return icons[category] || icons.General;
  };

  const NavButton = ({ icon: Icon, label, onClick, isActive = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
        isActive
          ? "bg-zinc-800 text-white font-medium"
          : "hover:bg-zinc-800/50 text-gray-300 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{label}</span>
    </button>
  );

  const CategoryButton = ({ category, isActive }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
        isActive
          ? "bg-zinc-800 text-white"
          : "hover:bg-zinc-800/50 text-gray-300 hover:text-white"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${getCategoryIcon(
          category
        )}`}
      />
      <span className="text-sm">{category}</span>
    </button>
  );

  return (
    <aside className="hidden lg:block w-64 sticky top-20 h-fit">
      <nav className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
        {/* Main Navigation */}
        <div className="p-2">
          <NavButton
            icon={Home}
            label="Home"
            onClick={() => {
              setSelectedCategory(null);
              setSortBy(null);
              setSearchQuery("");
            }}
            isActive={!selectedCategory && !sortBy}
          />
          <NavButton
            icon={TrendingUp}
            label="Popular"
            onClick={() => {
              setSortBy("popular");
              setSelectedCategory(null);
            }}
            isActive={sortBy === "popular"}
          />
          <NavButton
            icon={List}
            label="All"
            onClick={() => {
              setSelectedCategory(null);
              setSortBy(null);
            }}
            isActive={!selectedCategory && !sortBy}
          />
        </div>

        <Separator className="bg-white/10" />

        {/* Create Post Section */}
        <div className="p-2">
          <Button
            onClick={() => router.push("/create")}
            className="w-full justify-start gap-3 bg-transparent hover:bg-zinc-800 text-gray-300 hover:text-white border border-white/10 cursor-pointer"
          >
            <PenSquare className="w-5 h-5" />
            <span className="text-sm">Start a community post</span>
          </Button>
        </div>

        <Separator className="bg-white/10" />

        {/* Categories Section */}
        <div>
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Categories
            </span>
            {isCategoriesOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {isCategoriesOpen && (
            <div className="px-2 pb-2 space-y-1">
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  category={category}
                  isActive={selectedCategory === category}
                />
              ))}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-md transition-all text-left"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* Resources Section */}
        <div>
          <button
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Resources
            </span>
            {isResourcesOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {isResourcesOpen && (
            <div className="px-2 pb-2">
              <NavButton
                icon={Info}
                label="About & Rules"
                onClick={() => router.push("/about")}
              />
            </div>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* Social Links */}
        <div className="p-3">
          <div className="flex gap-1 justify-center">
            <a
              href="https://github.com/abhinavxdd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-800 transition-colors text-gray-400 hover:text-white"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/abh1navvv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-800 transition-colors text-gray-400 hover:text-white"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/abh1navvv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-800 transition-colors text-gray-400 hover:text-white"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="mailto:abhigaming0311@gmail.com"
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-800 transition-colors text-gray-400 hover:text-white"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>
    </aside>
  );
}

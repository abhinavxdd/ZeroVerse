"use client";

import React from "react";
import Link from "next/link";
import { Search, Zap, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* --- Logo --- */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl font-bold tracking-tight text-white">
            ZeroVerse
          </span>
        </Link>

        {/* --- Search Bar --- */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="h-4 w-px bg-white/20"></div>
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full bg-zinc-900 border border-white/10 rounded-full pl-16 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* --- Right Side Actions --- */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            <>
              {/* Create Post Button */}
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-zinc-800"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-zinc-700 text-white">
                        {user.alias?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-zinc-950 text-white border-white/10"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        @{user.alias}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:bg-red-950/50 focus:text-red-400 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-zinc-800 hover:text-white"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

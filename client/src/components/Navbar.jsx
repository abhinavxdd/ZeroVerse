"use client"

import React from "react";
import Link from "next/link";
import { Menu, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const isLoggedIn = false; 

  return (
    // CHANGED: bg-black/50 -> bg-black (Solid Black)
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* --- Logo --- */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ZeroVerse
          </span>
        </Link>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/dashboard" 
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white`}
                  >
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/projects" 
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white`}
                  >
                    Projects
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/community" 
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white`}
                  >
                    NITH Community
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* --- Right Side Actions --- */}
        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-zinc-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>ZV</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-950 text-white border-white/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Student</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@nith.ac.in
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">Profile</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-red-500 focus:bg-red-950/50 focus:text-red-400 cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-300 hover:bg-zinc-800 hover:text-white">
                Log in
              </Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                Register
              </Button>
            </>
          )}
        </div>

        {/* --- Mobile Menu --- */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-zinc-800 hover:text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            {/* CHANGED: bg-zinc-950 -> bg-black (Solid Black Mobile Menu) */}
            <SheetContent side="right" className="bg-black border-l border-white/10 text-white w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left text-white text-xl font-bold flex items-center gap-2">
                   <Zap className="h-5 w-5 text-indigo-500" /> ZeroVerse
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <Link href="/dashboard" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                    Dashboard
                    </Link>
                    <Link href="/projects" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                    Projects
                    </Link>
                    <Link href="/community" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                    NITH Community
                    </Link>
                </div>
                
                <div className="h-px bg-white/10 w-full my-2"></div>

                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-zinc-900">
                    Log in
                  </Button>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                    Register
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
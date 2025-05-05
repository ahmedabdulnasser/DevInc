import { useTheme } from "@/context/theme-context.jsx";
import { Menu, Moon, Plus, Search, Sun, User } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import NewPostDialog from "./NewPostDialog";
import SearchPosts from "./SearchPosts";
import useAuthStore from "@/store/useAuthStore";
import { NavLink } from "react-router";

const NavLinks = () => {
  return (
    <nav className="flex flex-col gap-4  px-4 py-2">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  );
};

function Navbar() {
  const { setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);

  // Helper function to safely get avatar fallback text
  const getAvatarFallback = () => {
    // If user is null or undefined, return 'U'
    if (!user) return "U";

    // Check if user has data property
    const userData = user.data || user;

    // Try to get first letter of firstName, username, or email
    if (userData.firstName && userData.firstName.length > 0) {
      return userData.firstName[0].toUpperCase();
    }

    if (userData.username && userData.username.length > 0) {
      return userData.username[0].toUpperCase();
    }

    if (userData.email && userData.email.length > 0) {
      return userData.email[0].toUpperCase();
    }

    // Default fallback
    return "U";
  };

  return (
    <header>
      <nav>
        {/* Mobile logo section */}
        <div className="md:hidden flex justify-center items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle className={"px-4"}>Navigation</SheetTitle>
              <NavLinks />
            </SheetContent>
          </Sheet>
          {/* Logo */}
          <span className="text-lg font-bold">Dev Inc.</span>
        </div>

        <div className="flex items-center justify-center md:justify-between px-4 py-2 border-b sticky top-0 z-50 bg-background gap-2">
          <div className="hidden md:flex gap-2 items-center">
            {/* Mobile nav sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetTitle className={"px-4"}>Navigation</SheetTitle>
                <NavLinks />
              </SheetContent>
            </Sheet>
            {/* Logo */}
            <span className="text-lg font-bold">Dev Inc.</span>
          </div>

          {/* New Post Button Section */}
          <div className="flex items-center gap-2">
            {/* Mobile: icon only */}
            <NewPostDialog>
              <Button className="sm:hidden" size="icon">
                <Plus className="w-5 h-5" />
              </Button>
            </NewPostDialog>

            {/* Desktop: full label + icon */}
            {/* Trigger wrapper for the new post button */}
            <NewPostDialog>
              <Button className=" hidden sm:flex items-center gap-1 cursor-pointer">
                New Post
                <Plus className="w-4 h-4" />
              </Button>
            </NewPostDialog>
            {/* Search Input */}
            <div className="relative w-full">
              <SearchPosts />
            </div>
          </div>

          {/* Right side: theme toggle + user menu */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User avatar/menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                <DropdownMenuItem>
                  <NavLink to="/logout">Logout</NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

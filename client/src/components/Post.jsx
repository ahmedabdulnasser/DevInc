import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";

export default function Post({ children, post }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [author, setAuthor] = useState("Unknown");
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  // Fetch author info
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/${post.user_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [post.user_id]);

  // Derive author display name
  useEffect(() => {
    if (!user) return;
    if (user.firstName && user.lastName) {
      setAuthor(`${user.firstName} ${user.lastName[0]}.`);
    } else if (user.username) {
      setAuthor(
        user.username.length > 10 ? user.username.slice(0, 10) : user.username
      );
    }
  }, [user]);

  // Date formatting helper
  const formatDate = (iso) => {
    const date = new Date(iso);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="break-words">{post.title}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 my-2">
              {post.tags?.split(",").map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 overflow-hidden">
          <p className="text-base text-foreground break-words whitespace-normal overflow-wrap-anywhere">
            {post.body}
          </p>

          {post.img && !hasImageError ? (
            <div className="relative h-60 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {isLoadingImage && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Loading…
                </div>
              )}
              <img
                src={post.img}
                alt={`Thumbnail of ${post.title}`}
                className={`h-full w-full object-cover ${
                  isLoadingImage ? "hidden" : "block"
                }`}
                onLoad={() => setIsLoadingImage(false)}
                onError={() => {
                  setIsLoadingImage(false);
                  setHasImageError(true);
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{author}</span>
          </div>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

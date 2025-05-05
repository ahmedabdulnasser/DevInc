import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";

function PostCard({ children, post }) {
  const [user, setUser] = useState(null);
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const handleImageLoad = () => {
    setLoading(false); // Once the image is loaded, set loading to false.
  };

  useEffect(() => {
    const userApi = `${import.meta.env.VITE_API_BASE_URL}/users/${
      post.user_id
    }`;
    axios
      .get(userApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      });
  }, []);

  useEffect(() => {
    if (user) {
      if (user.firstName && user.lastName) {
        setAuthor(`${user.firstName} ${user.lastName[0]}.`);
      } else if (user.username) {
        setAuthor(
          user.username.length > 8 ? user.username.slice(0, 10) : user.username
        );
      } else {
        setAuthor("Unknown");
      }
    }
  }, [user]);

  return (
    <Card className={"gap-2 hover:outline-1 cursor-pointer"}>
      <CardHeader>
        {/* Title container */}
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg font-bold break-words leading-snug">
            {post.title.length > 25
              ? post.title.slice(0, 25) + "..."
              : post.title}
          </CardTitle>

          {/* Badge container */}
          <div className="flex gap-2 flex-wrap">
            {post.tags
              ? post.tags
                  .split(",")
                  .slice(0, 3)
                  .map((tag) => (
                    <Badge
                      key={post.id + tag + Math.random()}
                      className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-default"
                      variant="outline"
                    >
                      {tag}
                    </Badge>
                  ))
              : ""}
          </div>
        </div>
        <CardDescription>
          <p>
            {(() => {
              const date = new Date(post.createdAt);
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
              } else {
                return date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }
            })()}
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground break-words">{children}</p>

        {post.img && !hasError ? (
          // container for positioning placeholder + image
          <div className="relative h-[150px] w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
            {/* 1) Loading placeholder */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-300">
                Loading…
              </div>
            )}

            {/* 2) The image itself, hidden until loaded */}
            <img
              src={post.img}
              alt={`Thumbnail of ${post.title}`}
              className={`h-full w-full object-cover select-none pointer-events-none
          ${isLoading ? "hidden" : "block"}`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          </div>
        ) : (
          // 3) “No Image” fallback (either no URL or onError)
          <div className="h-[150px] w-full rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
            No Image
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Post post={post}>
          <Button className="cursor-pointer flex gap-1 items-center justify-center">
            <span>Read</span>
            <ExternalLink />
          </Button>
        </Post>
        <a
          href="#"
          className="mt-2 flex gap-1 items-center text-sm text-gray-600 dark:text-white"
        >
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.firstName?.[0] ||
                user?.username?.[0].toUpperCase() ||
                "AV"}
            </AvatarFallback>
          </Avatar>
          {author}
        </a>
      </CardFooter>
    </Card>
  );
}

export default PostCard;

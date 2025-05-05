import React, { useContext, useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import { fetchData } from "@/lib/utils";
import { PostPagination } from "./PostPagination";
import { Spinner } from "./ui/spinner";
import { PostsContext } from "@/App";
import axios from "axios";
import usePostStore from "@/store/uesPostStore";
function Posts() {
  const pageNo = usePostStore((state) => state.pageNo);
  const setPageNo = usePostStore((state) => state.setPageNo);
  const searchTerm = usePostStore((state) => state.searchTerm);
  const { posts, setPosts } = useContext(PostsContext);
  const [pagination, setPagination] = useState({ next: null, prev: null });
  const [isLoading, setIsLoading] = useState(true);

  const prevSearchTerm = useRef(searchTerm);

  useEffect(() => {
    if (prevSearchTerm.current !== searchTerm) {
      setPageNo(1);
      prevSearchTerm.current = searchTerm;
    }
  }, [searchTerm]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    setIsLoading(true);
    const fetchPosts = async (apiUrl) => {
      if (apiUrl) {
        let postsApi = `${apiUrl}/posts?page=${pageNo}&limit=9`;
        if (searchTerm !== "") {
          postsApi = `${apiUrl}/posts/search?q=${searchTerm}&limit=9&page=${pageNo}`;
        }

        const returnedPosts = await axios
          .get(postsApi, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setPosts(res.data.posts);
            setPagination({
              next: res.data.next,
              prev: res.data.prev,
              noPages: res.data.pages,
            });
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching posts:", err);
            setIsLoading(false);
          });
      }
    };

    fetchPosts(apiUrl);
  }, [pageNo, searchTerm]);

  const handlePageChange = (page) => setPageNo(page);
  const handlePageNext = () => {
    pagination.next ? setPageNo(pagination.next) : "";
  };
  const handlePagePrev = () => {
    pagination.prev ? setPageNo(pagination.prev) : "";
  };

  return (
    <>
      {isLoading ? (
        <span className="flex justify-center items-center h-96 w-full">
          <Spinner size="md" className="  bg-black dark:bg-white" />
        </span>
      ) : (
        <>
          <section className="flex flex-col gap-4 lg:grid grid-cols-3 md:gap-8 mb-4">
            {posts.length === 0 ? (
              <div className="flex justify-center items-center h-96 w-full">
                <h1 className="text-2xl font-bold">No Posts Found</h1>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post}>
                  {post.body.length > 30
                    ? post.body.split(" ").slice(0, 50).join(" ") + "..."
                    : post.body}
                </PostCard>
              ))
            )}
          </section>
          <PostPagination
            handlers={{
              handlePagePrev: handlePagePrev,
              handlePageNext: handlePageNext,
              handlePageChange: handlePageChange,
            }}
            noPages={pagination.noPages}
            pageNo={pageNo}
          />
        </>
      )}
    </>
  );
}

export default Posts;

import React, { useContext, useEffect } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { fetchData } from "@/lib/utils";
import { PostsContext } from "@/App";
import axios from "axios";
import usePostStore from "@/store/uesPostStore";
function SearchPosts() {
  const { posts, setPosts } = useContext(PostsContext);
  const searchTerm = usePostStore((state) => state.searchTerm);
  const setSearchTerm = usePostStore((state) => state.setSearchTerm);
  const pageNo = usePostStore((state) => state.pageNo);
  const setPageNo = usePostStore((state) => state.setPageNo);

  const handleSearch = (e) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value.trim(""));
  };

  // useEffect(() => {
  //   const apiUrl = import.meta.env.VITE_API_BASE_URL;
  //   console.log(searchTerm);
  //   if (searchTerm === "") {
  //     setPageNo(1);
  //     return;
  //   }
  //   const queryUrl = `${apiUrl}/posts/search?q=${searchTerm}&limit=9&page=${pageNo}`;
  //   console.log("queryUrl:", queryUrl);
  //   try {
  //     axios
  //       .get(queryUrl, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       })
  //       .then((res) => {
  //         setPosts(res.data);
  //         console.log(res.data);
  //       });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }, [searchTerm, pageNo]);

  return (
    <>
      <Search className="absolute h-[20px] left-[3%] top-[50%] -translate-y-[50%]" />
      <Input
        className=" sm:block w-[150px] md:w-[300px] px-10"
        placeholder="Search"
        onChange={(e) => handleSearch(e)}
      />
    </>
  );
}

export default SearchPosts;

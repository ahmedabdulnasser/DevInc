import { create } from "zustand";

const usePostStore = create((set) => ({
  pageNo: 1,
  setPageNo: (pageNo) => set({ pageNo }),
  searchTerm: "",
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  newPostCreated: false,
  setNewPostCreated: (newPostCreated) => set({ newPostCreated }),
}));

export default usePostStore;

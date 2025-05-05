import React, { createContext, useContext, useState } from "react";
import Posts from "./components/Posts";
import AppLayout from "./components/AppLayout";
import { ThemeProvider } from "./context/theme-context";
import Home from "./pages/Home";
import { Route, Routes } from "react-router";
import Post from "./components/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
export const PostsContext = createContext();

function App() {
  const [posts, setPosts] = useState([]);
  return (
    <ThemeProvider>
      <PostsContext.Provider value={{ posts, setPosts }}>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/post/:postId" element={<Post />} />
            </Route>
          </Routes>
          <Toaster />
        </AppLayout>
      </PostsContext.Provider>
    </ThemeProvider>
  );
}

export default App;

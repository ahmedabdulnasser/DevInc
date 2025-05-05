import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function fetchData(url, setData) {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

export async function uploadToImgur(file) {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`,
        },
      }
    );
    return response.data.data.link;
  } catch (error) {
    console.error("Error uploading to Imgur:", error);
  }
}
export async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  const apiKey = `${import.meta.env.VITE_IMGBB_CLIENT_KEY}`;
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
  try {
    const response = await axios.post(url, formData);
    return response.data.data.display_url || response.data.data.url;
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
  }
}

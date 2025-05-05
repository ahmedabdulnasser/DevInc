import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { Flame, Plus, Pointer, SendHorizonal } from "lucide-react";
import { uploadToImgBB, uploadToImgur } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { useNavigate } from "react-router";
import usePostStore from "@/store/uesPostStore";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  body: z
    .string()
    .min(10, { message: "Body must be at least 10 characters." })
    .max(160, { message: "Body must not be longer than 160 characters." }),
  imgUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

function NewPostForm({ onSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [hasImg, setHasImg] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const newPostCreated = usePostStore((state) => state.newPostCreated);
  const setNewPostCreated = usePostStore((state) => state.setNewPostCreated);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      imgUrl: "",
    },
  });

  const onSubmit = (data) => {
    const postData = {
      ...data,
      user_id: user.data.id,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/posts`,
        { ...postData, img: postData.imgUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        form.reset();
        setNewPostCreated(true);
        onSuccess();
        navigate(0);
        console.log("Form submitted:", postData);
        toast("Dev Inc:", {
          description: "Post submitted successfully.",
        });
      });
  };
  // Img uploading logic
  const handleImgChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setHasImg(true);
      try {
        const imgUrl = await uploadToImgBB(file);
        form.setValue("imgUrl", imgUrl);
        toast("Image uploaded successfully!", { description: imgUrl });
      } catch (err) {
        toast("Error uploading image", { description: err.message });
        console.error("Error uploading img: ", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-4 md:w-100 space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className=" resize-none h-48 md:w-100 md:mx-auto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="picture" className="font-semibold">
            Picture
          </label>
          <Input
            id="picture"
            className="w-100"
            type="file"
            onChange={handleImgChange}
          />
          {isUploading && <p>Image is being uploaded...</p>}
        </div>

        <Button
          type="submit"
          className={"mx-auto flex gap-1.5"}
          disabled={isUploading}
        >
          Post <SendHorizonal />
        </Button>
      </form>
    </Form>
  );
}

export default NewPostForm;

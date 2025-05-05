import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import NewPostForm from "./NewPostForm";
import { Toaster } from "./ui/sonner";
import usePostStore from "@/store/uesPostStore";
import { useState } from "react";

function NewPostDialog({ children }) {
  const newPostCreated = usePostStore((state) => state.newPostCreated);
  const setNewPostCreated = usePostStore((state) => state.setNewPostCreated);
  const closeDialog = () => {
    setNewPostCreated(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Post a new thread</DialogTitle>
          <DialogDescription>
            You may write whatever is up on your mind as long as you follow our
            community rules!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 md:w-100 md:mx-auto">
          <div className="flex flex-col gap-2  "></div>
          <div className="grid grid-cols-4 items-center gap-4">
            {/* Form */}
            <NewPostForm
              onSuccess={() => {
                setIsOpen(false);
              }}
            />
          </div>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}
export default NewPostDialog;

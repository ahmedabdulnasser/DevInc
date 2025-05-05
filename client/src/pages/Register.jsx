import { GalleryVerticalEnd } from "lucide-react";

import { RegisterForm } from "@/components/register-form";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Register() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Dev Inc.
      </a>
      <RegisterForm />
    </div>
  );
}

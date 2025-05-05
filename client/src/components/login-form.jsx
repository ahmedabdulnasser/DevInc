import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [apiError, setApiError] = useState(null);

  const { login } = useLogin();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>
            Login with your credentials to access your account.
          </CardDescription>
          {errors && (
            <div className="text-red-500 text-sm">
              {Object.values(errors).map((error) => (
                <p key={error.message}>{error.message}</p>
              ))}
              {apiError && (
                <div className="text-red-500 text-sm">
                  {console.error(apiError)}
                  {Array.isArray(apiError)
                    ? apiError?.map((error) => (
                        <p key={error.message}>{error.message}</p>
                      ))
                    : apiError}
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => {
              login(data, setApiError);
            })}
          >
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Log in
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your unique username goes here"
                    required
                    {...register("username", {
                      required: "Username is a required field.",
                      minLength: {
                        value: 3,
                        message: "Entered username minimum length is 3.",
                      },
                    })}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your super secret password goes here"
                    required
                    {...register("password", {
                      required: "Password is a required field.",
                    })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <NavLink
                  to="/register"
                  className="underline underline-offset-4"
                >
                  Sign up
                </NavLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

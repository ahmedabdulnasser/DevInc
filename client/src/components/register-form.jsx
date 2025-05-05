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
import { toast } from "sonner";
import { useRegister } from "@/hooks/useRegister";

export function RegisterForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [apiError, setApiError] = useState(null);
  const { register: registerUser } = useRegister();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign up</CardTitle>
          <CardDescription>
            Don't have an account? Create one to get started.
          </CardDescription>
          {errors && (
            <div className="text-red-500 text-sm">
              {Object.values(errors)?.map((error) => (
                <p key={error.message}>{error.message}</p>
              ))}
              {apiError && (
                <div className="text-red-500 text-sm">
                  {apiError?.map((error) => (
                    <p key={error.message}>{error.message}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(async (data) => {
              const result = await registerUser(data, setApiError);
              if (result?.success) {
                toast.success(
                  "Registration successful! You are now logged in."
                );
              }
            })}
          >
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Register an account
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your preferred unique account name"
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
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. m@example.com"
                    required
                    {...register("email", {
                      required: "Email is a required field.",
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
                    placeholder="Your super secret password"
                    required
                    {...register("password", {
                      required: "Password is a required field.",
                    })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <NavLink to="/login" className="underline underline-offset-4">
                  Login
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

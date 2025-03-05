"use client";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";

const signUpSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email().min(1),
  password: z.string().min(6).max(32),
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  type AuthStates = "idle" | "loading" | "finished" | "error";
  const [authState, setAuthState] = useState<AuthStates>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.username,
        callbackURL: "/auth/sign-in",
      },
      {
        onError: (err) => {
          setErrorMessage(err.error.message);
          setAuthState("error");
          setTimeout(() => {
            setErrorMessage("");
            setAuthState("idle");
          }, 3000);
        },
        onRequest: (req) => {
          setAuthState("loading");
        },
        onSuccess: (res) => {
          setAuthState("finished");
          setTimeout(() => {
            redirect("/auth/sign-in");
          }, 3000);
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="me@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {authState === "loading" ? (
            <Loader
              size={15}
              strokeWidth={1.5}
              className="text-white animate-spin"
            />
          ) : authState === "finished" ? (
            "Account created, you are being redirected."
          ) : authState === "error" ? (
            "something went wrong"
          ) : (
            "Sign up"
          )}
        </Button>
        {authState === "error" && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}
      </form>
    </Form>
  );
}

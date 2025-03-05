"use client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import { Loader } from "lucide-react";
import { useAtom } from "jotai";
import { userIdAtom, usernameAtom } from "@/stores/user-store";

const signInSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(6).max(32),
});

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [, setUserId] = useAtom(userIdAtom);
  const [, setUsername] = useAtom(usernameAtom);
  type AuthStates = "idle" | "loading" | "finished" | "error";
  const [authState, setAuthState] = useState<AuthStates>("idle");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onError: (err) => {
          setAuthState("error");
          setTimeout(() => {
            setAuthState("idle");
          }, 3000);
        },
        onRequest: (req) => {
          setAuthState("loading");
        },
        onSuccess: (res) => {
          console.log(res.data);
          setUserId(res.data.user.id);
          setUsername(res.data.user.name);
          setAuthState("finished");
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 1000); // Small delay
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/4">
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
            "Success!"
          ) : authState === "error" ? (
            "something went wrong"
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}

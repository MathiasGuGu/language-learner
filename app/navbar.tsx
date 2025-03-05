"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignoutButton from "./signout-button";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    name: "home",
    href: "/",
    needsAuth: true,
  },
  {
    name: "dashboard",
    href: "/dashboard",
    needsAuth: true,
  },
  {
    name: "anki",
    href: "/anki",
    needsAuth: true,
  },
  {
    name: "sign up",
    href: "/auth/sign-up",
    needsAuth: false,
  },
  {
    name: "sign in",
    href: "/auth/sign-in",
    needsAuth: false,
  },
];
export default function Navbar() {
  const pathname = usePathname();
  const user = authClient.useSession();

  return (
    <div className="w-screen h-16 border-b flex items-center justify-center">
      <ul className="flex items-center justify-end gap-2 w-full h-full container">
        {navLinks.map((link) => {
          if (!link.needsAuth && user?.data?.user.id) return null;
          if (link.needsAuth && !user?.data?.user.id) return null;
          return (
            <Button
              className={cn({
                "text-gray-800 underline underline-black underline-offset-4":
                  pathname == link.href,
                "text-gray-600": pathname != link.href,
              })}
              variant={"ghost"}
              asChild
              key={link.name}
            >
              <Link href={link.href}>{link.name}</Link>
            </Button>
          );
        })}
        {user?.data?.user.id && (
          <>
            <Button
              variant={"ghost"}
              className={cn({
                "text-gray-800 underline underline-black underline-offset-4":
                  pathname == `/u/${user.data.user.id}`,
                "text-gray-600": pathname != `/u/${user.data.user.id}`,
              })}
              asChild
            >
              <Link href={`/u/${user.data.user.id}`}>account</Link>
            </Button>
            <SignoutButton />
          </>
        )}
      </ul>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignoutButton() {
  const router = useRouter();
  async function signOut() {
    await authClient.signOut();
    router.refresh();
  }
  return (
    <Button onClick={signOut} variant={"ghost"}>
      sign out
    </Button>
  );
}

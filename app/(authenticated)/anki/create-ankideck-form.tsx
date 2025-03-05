"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewAnkiDeckType } from "@/db/schema/schema";
import { authClient } from "@/lib/auth-client";
import { CreateAnkiDeckUsecase } from "@/use-cases/anki-usecases";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createAnkideckSchema = z.object({
  name: z.string().min(3),
});

export function CreateAnkideckForm() {
  const router = useRouter();
  const session = authClient.useSession();
  const userId = session.data?.user.id;

  const {
    mutate: createAnkiDeck,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (deckInfo: NewAnkiDeckType) =>
      await CreateAnkiDeckUsecase(deckInfo),
    mutationKey: ["create-anki-deck", userId],
    onSuccess: () => {
      router.refresh();
    },
  });

  const form = useForm<z.infer<typeof createAnkideckSchema>>({
    resolver: zodResolver(createAnkideckSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createAnkideckSchema>) {
    try {
      if (!userId) throw new Error("Not authenticated");
      const deckInfo: NewAnkiDeckType = {
        name: values.name,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      createAnkiDeck(deckInfo);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full mt-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deck name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isPending ? (
            <Loader size={16} strokeWidth={1.5} className="animate-spin" />
          ) : isSuccess ? (
            <>
              Deck created <Check size={16} strokeWidth={1.5} />
            </>
          ) : (
            "Create Ankideck"
          )}
        </Button>
      </form>
    </Form>
  );
}

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
import { toast } from "sonner";

const createAnkideckSchema = z.object({
  name: z.string().min(3),
});

// Type for the creation response
type CreateDeckResponse = {
  success: boolean;
  createdDeck: any; // Using any here since we don't need the exact type
};

type CreateAnkideckFormProps = {
  onSuccess?: () => void; // Callback to close the dialog
};

export function CreateAnkideckForm({ onSuccess }: CreateAnkideckFormProps) {
  const router = useRouter();
  const session = authClient.useSession();
  const userId = session.data?.user.id;

  const {
    mutate: createAnkiDeck,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (deckInfo: NewAnkiDeckType): Promise<CreateDeckResponse> => {
      // Expected to return the properly serialized response
      return await CreateAnkiDeckUsecase(deckInfo) as CreateDeckResponse;
    },
    mutationKey: ["create-anki-deck", userId],
    onSuccess: (data) => {
      if (!data.success || !data.createdDeck) {
        toast.error("Failed to create deck");
        return;
      }

      // Show success toast
      toast.success(`Deck "${data.createdDeck.name}" created successfully`);

      // Emit a custom event to update the deck list in real-time
      try {
        const event = new CustomEvent("deck-created", {
          detail: { newDeck: data.createdDeck }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Failed to dispatch deck-created event:", error);
      }

      // Call onSuccess callback to close the modal
      if (onSuccess) {
        onSuccess();
      }

      // Reset the form
      form.reset();

      // Refresh the page to update the server data - do this last
      setTimeout(() => {
        router.refresh();
      }, 100);
    },
    onError: (error) => {
      toast.error("Failed to create deck: " + (error instanceof Error ? error.message : "Unknown error"));
      console.error("Create deck error:", error);
    }
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
      console.error(e);
      toast.error("Failed to create deck. Please try again.");
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
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-100">
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

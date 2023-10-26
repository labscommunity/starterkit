import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MessageCircle } from "lucide-react";
import { createTransaction } from "arweavekit/transaction";
import { useUser } from "@/hooks/useUser";
import * as React from "react";
import { QueriedComment } from "@/types/query";
import { getComments } from "@/lib/query-comments";

const commentSchema = z.object({
  comment: z.string(),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  txId: string;
}

export function CommentDialog(props: CommentFormProps) {
  const { address } = useUser();
  const [comments, setComments] = React.useState<QueriedComment[]>([]);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  async function onSubmit(values: CommentFormValues): Promise<void> {
    try {
      const result = await createTransaction({
        type: "data",
        environment: "mainnet",
        data: values.comment,
        options: {
          tags: [
            {
              name: "Content-Type",
              value: "text/plain",
            },
            {
              name: "Data-Protocol",
              value: "comment",
            },
            {
              name: "Data-Source",
              value: props.txId,
            },
            {
              name: "Creator",
              value: address || "",
            },
          ],
          signAndPost: true,
        },
      });

      console.log(
        "Added comment successfully for:",
        props.txId,
        result.transaction
      );
    } catch (error: any) {
      console.log(error);
    }
  }

  const fetchData = async () => {
    const comments = await getComments(props.txId);
    console.log(comments);

    setComments(comments);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // console.log("<<<<<<<<<<<<CommentData>>>>>>>>>>>>", comments);

  return (
    <Dialog>
      <DialogTrigger onClick={() => fetchData()} asChild>
        <button>
          <MessageCircle size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a comment</DialogTitle>
          <DialogDescription>Share your thoughts below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Comment <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your comment" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Post Comment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

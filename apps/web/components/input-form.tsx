import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { postAsset } from "@/lib/post";
import { useActiveAddress, useConnection } from "arweave-wallet-kit";

// Accepted MIME types
const ACCEPTED_IMAGE_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// zod schema for form inputs
const imageSchema = z
  .any()
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    `.jpg, .jpeg, .png and .webp files are accepted`
  );

const formSchema = z.object({
  image: imageSchema,
  title: z.string(),
  creatorName: z.string().optional(),
  description: z.string().optional(),
  tags: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  // license: z.string().optional(),
});

type InputFormValues = z.infer<typeof formSchema>;

export function InputForm() {
  const [preview, setPreview] = useState("");

  // defining form based on zod schema
  const form = useForm<InputFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      creatorName: "",
      description: "",
      tags: [],
      // license: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  const { connected } = useConnection();
  const activeAddress = useActiveAddress();

  function onSubmit(values: InputFormValues) {
    // This will be type-safe and validated.

    postAsset({
      file: values.image,
      title: values.title,
      description: values.description || "",
      tags: values.tags || [],
      creatorName: values.creatorName || "",
      creatorId: activeAddress || "",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col w-full"
      >
        {preview ? (
          <div className="w-full">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={preview}
                alt="Image"
                objectFit="contain"
                layout="fill"
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        ) : null}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange: onChangeField, value, ...rest } }) => {
            return (
              <FormItem>
                <FormLabel>Image *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) =>
                      onChangeField(
                        e.target.files
                          ? (() => {
                              const file = e.target.files?.[0];
                              setPreview(URL.createObjectURL(file));
                              return file;
                            })()
                          : null
                      )
                    }
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex flex-col md:flex-row w-full gap-5">
          <div className="w-full md:w-1/2 space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creatorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creator</FormLabel>
                  <FormControl>
                    <Input placeholder="creatorName" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`tags.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Tags
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add tags to your images.
                    </FormDescription>
                    <FormControl>
                      <div className="flex w-full gap-4">
                        <Input {...field} />
                        <Button
                          className={buttonVariants({ variant: "secondary" })}
                          onClick={() => remove(index)}
                        >
                          X
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              className={buttonVariants({ variant: "secondary" })}
              onClick={() => append({ value: "" })}
              type="button"
            >
              Add Tag
            </Button>
          </div>
        </div>
        <Button type="submit" className={buttonVariants()}>
          Upload Image
        </Button>
      </form>
    </Form>
  );
}

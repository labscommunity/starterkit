import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, Controller } from "react-hook-form";

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
import { ChangeEvent, useState } from "react";

// Accepted MIME types
const ACCEPTED_IMAGE_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// zod schema for form inputs
const imageSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

const formSchema = z.object({
  image: imageSchema,
  title: z.string(),
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
      description: "",
      tags: [],
      // license: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  function onSubmit(values: InputFormValues) {
    // This will be type-safe and validated.
    console.log(values);
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
          render={({ field: { onChange, value, ...rest } }) => {
            return (
              <FormItem>
                <FormLabel>Image *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex flex-col md:flex-row w-full gap-5">
          <div className="w-full md:w-1/2">
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

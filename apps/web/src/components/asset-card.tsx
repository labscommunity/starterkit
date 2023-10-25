import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QueriedAsset } from "@/types/query";
import { cn } from "@/lib/utils";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `https://ar-io.dev/${src}?w=${width}&q=${quality || 75}`;
};

export function AssetCard(props: QueriedAsset) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={cn("text-sm")}>{props.title}</CardTitle>
        <CardDescription>By: {props.creatorName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={props.id}
          alt={props.title}
          loader={imageLoader}
          className="aspect-[1/1] h-fit w-fit object-cover mx-auto"
          width={200}
          height={200}
        />
        <p>Topics: {props.topics.join(", ")}</p>
      </CardContent>
      {/* <CardFooter>
        <a href={props.audio} target="_blank" rel="noopener noreferrer">
          Listen to Audio
        </a>
      </CardFooter> */}
    </Card>
  );
}

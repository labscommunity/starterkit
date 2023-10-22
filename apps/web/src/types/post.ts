export interface Asset {
  file: File;
  title: string;
  description: string;
  tags: Tag[];
  creatorName: string;
  creatorId: string;
}
interface Tag {
  name?: string;
  value: string;
}

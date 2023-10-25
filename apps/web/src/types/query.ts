export interface QueriedAsset {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  creatorId: string;
  creatorName: string;
}

type Tag = {
  name: string;
  value: string;
};

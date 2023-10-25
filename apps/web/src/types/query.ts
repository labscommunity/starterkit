export interface QueriedAsset {
  id: string;
  image: string;
  title: string;
  description: string;
  topics: string[];
  creatorId: string;
  creatorName: string;
}

export type Tag = {
  name: string;
  value: string;
};

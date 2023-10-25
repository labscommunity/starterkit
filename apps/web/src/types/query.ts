export interface QueriedAsset {
  id: string;
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

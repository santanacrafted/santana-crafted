export interface Template {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  createdAt: any;
  tiers: string[];
  demoLink?: string;
  tutorialLink?: string;
  category: string;
}

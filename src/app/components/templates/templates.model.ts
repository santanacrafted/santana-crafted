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

export interface TemplateFormValues {
  name: string;
  description: string;
  category: string;
  demoLink: string;
  coverPhotoUrl?: string; // this is the image URL, not a File
  tiers: Array<{
    tierName: string;
    tierDemoLink: string;
    tierTutorialLink: string;
    features: string[];
  }>;
}

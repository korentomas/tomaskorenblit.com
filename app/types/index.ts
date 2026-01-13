export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  published: boolean;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

export interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  tags: string[];
  impact?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

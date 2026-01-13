import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  coverImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  body: any[]; // Portable Text content
  tags: string[];
  publishedAt: string;
  status: 'draft' | 'published';
}

export async function getAllSanityPosts(): Promise<SanityPost[]> {
  if (!process.env.SANITY_PROJECT_ID) {
    return [];
  }

  try {
    const posts = await client.fetch<SanityPost[]>(
      `*[_type == "post" && status == "published"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        description,
        coverImage,
        body,
        tags,
        publishedAt,
        status
      }`
    );
    return posts;
  } catch (error) {
    console.error('Error fetching Sanity posts:', error);
    return [];
  }
}

export async function getSanityPost(slug: string): Promise<SanityPost | null> {
  if (!process.env.SANITY_PROJECT_ID) {
    return null;
  }

  try {
    const post = await client.fetch<SanityPost>(
      `*[_type == "post" && slug.current == $slug && status == "published"][0] {
        _id,
        title,
        slug,
        description,
        coverImage,
        body,
        tags,
        publishedAt,
        status
      }`,
      { slug }
    );
    return post || null;
  } catch (error) {
    console.error(`Error fetching Sanity post ${slug}:`, error);
    return null;
  }
}

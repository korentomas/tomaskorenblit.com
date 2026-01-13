import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { bundleMDX } from 'mdx-bundler';
import type { BlogPost, BlogPostWithContent } from '~/types';

const CONTENT_PATH = path.join(process.cwd(), 'content', 'blog');

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(CONTENT_PATH);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(CONTENT_PATH, file);
        const source = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(source);

        return {
          slug: file.replace(/\.mdx$/, ''),
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || new Date().toISOString(),
          readingTime: readingTime(content).text,
          tags: data.tags || [],
          published: data.published !== false,
        } as BlogPost;
      })
    );

    // Filter published posts and sort by date
    return posts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPostWithContent | null> {
  try {
    const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
    const source = await fs.readFile(filePath, 'utf-8');

    const { code, frontmatter } = await bundleMDX({
      source,
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? [])];
        options.rehypePlugins = [...(options.rehypePlugins ?? [])];
        return options;
      },
    });

    return {
      slug,
      title: frontmatter.title || 'Untitled',
      description: frontmatter.description || '',
      date: frontmatter.date || new Date().toISOString(),
      readingTime: readingTime(source).text,
      tags: frontmatter.tags || [],
      published: frontmatter.published !== false,
      content: code,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

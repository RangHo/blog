import slugify from 'slugify';

import type { Post } from '$lib/types';

import type { OrgModule } from 'ox-svelte';

const imports = import.meta.glob('$posts/*.svelte', { eager: true });

export const posts = (() => {
  let posts: Post[] = [];

  // Grab metadata from each post
  for (const path in imports) {
    const module = imports[path] as OrgModule;
    const metadata = module.metadata;
    const original = path
      .split('/')
      .pop()!
      .replace(/\.svelte$/, '')
    const slug = slugify(
      original
        .replace(/_/g, ' '),
      {
        replacement: '-',
        lower: true
      }
    );

    posts.push({
      original,
      slug,
      metadata
    });
  }

  // Sort by date
  posts.sort((a, b) => {
    const dateA = new Date(a.metadata.date);
    const dateB = new Date(b.metadata.date);

    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  });

  return posts;
})();

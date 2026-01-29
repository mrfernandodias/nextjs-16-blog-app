import { fetchQuery } from 'convex/nextjs';
import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';

// export const dynamic = 'force-static';
// export const revalidate = 30; // ou 60/300

export const metadata: Metadata = {
  title: 'Blog | Next.js 16 Tutorial',
  description: 'Read the latest articles and updates from our team.',
  category: 'Web Development',
  authors: [{ name: 'Fernando Dias <mrfernandodias@gmail.com>' }],
};

const BlogPage = () => {
  return (
    <div className="p-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Blog</h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and trends from our team.
        </p>
      </div>

      <LoadBlogPosts />
    </div>
  );
};

async function LoadBlogPosts() {
  'use cache';
  cacheLife('hours');
  cacheTag('blog-posts');

  const data = await fetchQuery(api.posts.getPosts);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="h-48 w-full overflow-hidden relative">
            <Image
              src={post.imageUrl ?? '/placeholder.png'}
              alt={post.title}
              fill
              className="rounded-t-lg object-cover"
            />
          </div>
          <CardContent>
            <Link href={`/blog/${post._id}`} className="">
              <h1 className="text-2xl font-bold hover:text-primary line-clamp-2 mb-4">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>
          <CardFooter>
            <Link
              href={`/blog/${post._id}`}
              className={buttonVariants({
                className: 'w-full',
              })}
            >
              Read more →
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default BlogPage;

import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CommentSection from '@/components/web/CommentSection';
import PostPresence from '@/components/web/PostPresence';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getToken } from '@/lib/auth-server';

type PostIdRouteProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PostIdRouteProps): Promise<Metadata> {
  const { id } = await params;
  const postId = id as Id<'posts'>;
  const data = await fetchQuery(api.posts.getPostById, { postId });

  if (!data) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: data.title,
    description: data.body.slice(0, 160),
    authors: [{ name: 'Fernando Dias <mrfernandodias@gmail.com>' }],
  };
}

const PostIdRoute = async ({ params }: PostIdRouteProps) => {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const postId = id as Id<'posts'>;
  const token = await getToken();

  const [data, preloadComments, currentUserId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId }),
    preloadQuery(api.comments.getCommentsByPostId, { postId }),
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!data) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-6xl font-extrabold text-red-500 py-20">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link href="/blog" className={buttonVariants({ variant: 'outline', className: 'mb-4' })}>
        <ArrowLeft className="size-4" /> Back to Blog
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={data.imageUrl || '/default-image.jpg'}
          alt={data.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{data.title}</h1>
        <p className="text-sm text-muted-foreground flex items-center ">
          <Calendar className="inline size-3 mr-1" />
          Posted on {new Date(data._creationTime).toLocaleDateString('pt-BR')}
        </p>
        {currentUserId && <PostPresence roomId={postId} userId={currentUserId} />}
      </div>
      <Separator className="my-6" />
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{data.body}</p>
      <Separator className="my-6" />
      {currentUserId ? (
        <CommentSection preloadComments={preloadComments} />
      ) : (
        <p className="text-center text-muted-foreground">Please log in to view and add comments.</p>
      )}
    </div>
  );
};

export default PostIdRoute;

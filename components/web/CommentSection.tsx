'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { type CommentSchema, commentSchema } from '@/app/schemas/commentSchema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

import { Separator } from '../ui/separator';

const CommentSection = (props: {
  preloadComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) => {
  const params = useParams<{ id: string }>();
  const postId = params.id as Id<'posts'>;
  const createComment = useMutation(api.comments.createComment);
  const comments = usePreloadedQuery(props.preloadComments);

  const [isPending, startTransition] = useTransition();
  const form = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId: postId,
      body: '',
    },
  });

  const onSubmit = (data: CommentSchema) => {
    startTransition(async () => {
      try {
        await createComment({
          postId: data.postId,
          body: data.body,
        });
        toast.success('Comment submitted successfully!');
        form.reset();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unexpected error occurred';
        console.error('Error submitting comment:', errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{comments ? comments.length : 0} Comments</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="body">Let us know your thoughts:</FieldLabel>
                <Textarea placeholder="Share your thoughts..." {...field} />
                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
              </Field>
            )}
          />
          <Button
            type="submit"
            className={buttonVariants({ className: 'mt-4 cursor-pointer' })}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                Submitting...
              </>
            ) : (
              'Submit Comment'
            )}
          </Button>
          {comments && comments.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <>
              <Separator className="my-6" />
              <section className="space-y-6">
                <h2 className="text-lg font-semibold">Comments</h2>
                {comments?.map((comment, index) => (
                  <div
                    key={comment._id}
                    className={`flex gap-4 ${index !== comments.length - 1 ? 'border-b pb-4' : ''}`}
                  >
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${comment.authorName}`}
                        alt={comment.authorName}
                      />
                      <AvatarFallback>
                        {comment.authorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{comment.authorName}</p>
                        <p className="text-muted-foreground text-xs">
                          Commented on {new Date(comment._creationTime).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentSection;

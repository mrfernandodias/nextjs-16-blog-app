'use client';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

import SearchInput from './SearchInput';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  return (
    <nav className="w-full py-5 items-center justify-between flex">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-primary">Pro</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/blog" className={buttonVariants({ variant: 'ghost' })}>
            Blog
          </Link>
          <Link href="/create" className={buttonVariants({ variant: 'ghost' })}>
            Create
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:block mr-2">
          <SearchInput />
        </div>
        {isLoading ? null : isAuthenticated ? (
          <Button
            onClick={() => {
              setIsLoggingOut(true);
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success('Logged out successfully');
                  },
                  onError: (error) => {
                    const errorMessage = error?.error.message || 'Error logging out';
                    toast.error(errorMessage);
                    setIsLoggingOut(false);
                  },
                },
              });
            }}
            className={cn(buttonVariants(), 'cursor-pointer')}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Spinner /> Logging out...
              </>
            ) : (
              <span>Logout</span>
            )}
          </Button>
        ) : (
          <>
            <Link href="/auth/sign-up" className={buttonVariants()}>
              Sign Up
            </Link>
            <Link href="/auth/login" className={buttonVariants({ variant: 'outline' })}>
              Login
            </Link>
          </>
        )}

        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;

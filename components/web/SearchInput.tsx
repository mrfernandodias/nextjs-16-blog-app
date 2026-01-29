import { useQuery } from 'convex/react';
import { Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';

const SearchInput = () => {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);

  const results = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { term: term, limit: 5 } : 'skip'
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setTerm(value);
    setOpen(true);
    // You can add additional logic here if needed
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="size-4 left-2.5 top-2.5 text-muted-foreground absolute" />
        <Input
          type="search"
          className="w-full pl-8 bg-background"
          placeholder="Search Posts..."
          value={term}
          onChange={handleInputChange}
        />
      </div>
      {open && term.length > 2 && (
        <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 z-10">
          <div className="">
            {results === undefined ? (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-muted-foreground mr-2" />
                Searching...
              </div>
            ) : results.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">No results found.</p>
            ) : (
              <div className="py-1">
                {results.map((post, index) => (
                  <Link
                    href={`/blog/${post._id}`}
                    className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    key={index}
                    onClick={() => {
                      setOpen(false);
                      setTerm('');
                    }}
                  >
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {post.body.substring(0, 50)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;

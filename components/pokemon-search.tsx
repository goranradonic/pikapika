'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PokemonSearchProps {
  initialValue?: string;
  onSearch: (searchTerm: string) => void;
}

export function PokemonSearch({ initialValue = '', onSearch }: PokemonSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams();
    if (value) {
      params.set('name', value);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : '/';
    
    router.push(url);
    onSearch(value);
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    router.push('/');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
'use client';

import { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

interface PokemonTableProps {
  data: Pokemon[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  itemsPerPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onRowClick: (pokemon: Pokemon) => void;
}

const columnHelper = createColumnHelper<Pokemon>();

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-sm font-medium text-muted-foreground">
        #{info.getValue().toString().padStart(3, '0')}
      </span>
    ),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <span className="font-medium capitalize text-foreground">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('sprites', {
    header: 'Sprite',
    cell: (info) => (
      <div className="flex justify-center">
        <img
          src={info.getValue().front_default}
          alt={info.row.original.name}
          className="h-12 w-12 pixelated"
          loading="lazy"
        />
      </div>
    ),
  }),
  columnHelper.accessor('types', {
    header: 'Types',
    cell: (info) => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().map((type) => (
          <Badge
            key={type.type.name}
            variant="secondary"
            className={cn(
              'text-white capitalize text-xs',
              typeColors[type.type.name] || 'bg-gray-400'
            )}
          >
            {type.type.name}
          </Badge>
        ))}
      </div>
    ),
  }),
];

export function PokemonTable({
  data,
  loading,
  error,
  currentPage,
  totalCount,
  hasNext,
  hasPrevious,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
  onRowClick,
}: PokemonTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {loading
              ? // Loading skeleton
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Skeleton className="mx-auto h-12 w-12 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick(row.original)}
                    className="cursor-pointer transition-colors hover:bg-muted/50 hover:shadow-sm"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startItem}–{endItem} of {totalCount} Pokémon
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={!hasPrevious || loading}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!hasNext || loading}
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
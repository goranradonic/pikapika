'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvolutionTriggers } from '@/hooks/use-pokemon-data';

interface EvolutionTrigger {
  id: number;
  name: string;
  url: string;
}

interface EvolutionTriggersTableProps {
  currentPage: number;
  itemsPerPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const columnHelper = createColumnHelper<EvolutionTrigger>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Trigger Name',
    cell: (info) => (
      <span className="font-medium capitalize text-foreground">
        {info.getValue().replace('-', ' ')}
      </span>
    ),
  }),
  columnHelper.accessor('url', {
    header: 'API URL',
    cell: (info) => (
      <a
        href={info.getValue()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        View API Documentation
      </a>
    ),
  }),
];

export function EvolutionTriggersTable({
  currentPage,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
}: EvolutionTriggersTableProps) {
  const offset = (currentPage - 1) * itemsPerPage;
  const {
    data,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
  } = useEvolutionTriggers(itemsPerPage, offset);

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
              ? Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-48" />
                    </td>
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/50">
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startItem}–{endItem} of {totalCount} evolution triggers
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
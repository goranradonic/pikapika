'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePokemonData } from '@/hooks/use-pokemon-data';
import { PokemonTable } from '@/components/pokemon-table';
import { PokemonSearch } from '@/components/pokemon-search';
import { PokemonModal } from '@/components/pokemon-modal';
import { EvolutionTriggersTable } from '@/components/evolution-triggers-table';

export default function Home() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('name') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [evolutionPage, setEvolutionPage] = useState(1);
  
  const itemsPerPage = 20;
  const offset = (currentPage - 1) * itemsPerPage;
  
  const { data, loading, error, totalCount, hasNext, hasPrevious } = usePokemonData({
    limit: itemsPerPage,
    offset,
    searchTerm,
  });

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleRowClick = (pokemon: any) => {
    setSelectedPokemon(pokemon.name);
  };

  const handleEvolutionPrevious = () => {
    setEvolutionPage(prev => Math.max(1, prev - 1));
  };

  const handleEvolutionNext = () => {
    setEvolutionPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pokémon Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Discover and explore the world of Pokémon
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <PokemonSearch
            initialValue={initialSearchTerm}
            onSearch={handleSearch}
          />
        </div>

        {/* No Results Message */}
        {!loading && searchTerm && data.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pokémon not found
              </h3>
              <p className="text-gray-600 mb-4">
                No Pokémon found with the name "{searchTerm}". Try a different search term.
              </p>
              <button
                onClick={() => handleSearch('')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search and view all Pokémon
              </button>
            </div>
          </div>
        )}

        {/* Main Pokemon Table */}
        <div className="mb-12">
          <PokemonTable
            data={data}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalCount={totalCount}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            itemsPerPage={itemsPerPage}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onRowClick={handleRowClick}
          />
        </div>

        {/* Evolution Triggers Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Evolution Triggers
          </h2>
          <EvolutionTriggersTable
            currentPage={evolutionPage}
            itemsPerPage={10}
            onPreviousPage={handleEvolutionPrevious}
            onNextPage={handleEvolutionNext}
          />
        </div>

        {/* Pokemon Detail Modal */}
        <PokemonModal
          isOpen={!!selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          pokemonName={selectedPokemon}
        />
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchPokemonList, 
  fetchPokemonByName, 
  fetchPokemonDetails, 
  fetchEvolutionTriggers,
  type Pokemon,
  type PokemonListResponse,
  type EvolutionTriggerResponse,
  getPokemonIdFromUrl
} from '@/lib/pokemon-api';

interface UsePokemonDataOptions {
  limit?: number;
  offset?: number;
  searchTerm?: string;
}

interface PokemonWithDetails extends Pokemon {
  id: number;
}

interface UsePokemonDataReturn {
  data: PokemonWithDetails[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  refetch: () => void;
}

export function usePokemonData({
  limit = 20,
  offset = 0,
  searchTerm = ''
}: UsePokemonDataOptions): UsePokemonDataReturn {
  const [data, setData] = useState<PokemonWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (searchTerm) {
        // Search for specific Pokemon
        try {
          // First try exact match
          try {
            const pokemon = await fetchPokemonByName(searchTerm);
            const pokemonWithId = { ...pokemon, id: pokemon.id };
            setData([pokemonWithId]);
            setTotalCount(1);
            setHasNext(false);
            setHasPrevious(false);
          } catch (exactError) {
            // If exact match fails, try partial search
            if (exactError instanceof Error && exactError.message.includes('not found')) {
              // Fetch a larger list to search through
              const listResponse = await fetchPokemonList(1000, 0);
              
              // Filter Pokemon that start with the search term
              const matchingPokemon = listResponse.results.filter(pokemon => 
                pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase())
              );
              
              if (matchingPokemon.length > 0) {
                // Fetch details for matching Pokemon (limit to first 20 for performance)
                const pokemonToFetch = matchingPokemon.slice(0, 20);
                const detailedPokemon = await Promise.all(
                  pokemonToFetch.map(async (pokemon) => {
                    const details = await fetchPokemonDetails(pokemon.url);
                    return {
                      ...details,
                      id: getPokemonIdFromUrl(pokemon.url)
                    };
                  })
                );
                
                setData(detailedPokemon);
                setTotalCount(matchingPokemon.length);
                setHasNext(matchingPokemon.length > 20);
                setHasPrevious(false);
              } else {
                // No matches found
                setData([]);
                setTotalCount(0);
                setHasNext(false);
                setHasPrevious(false);
              }
            } else {
              throw exactError;
            }
          }
        } catch (searchError) {
          throw searchError;
        }
      } else {
        // Fetch paginated list
        const listResponse = await fetchPokemonList(limit, offset);
        
        // Fetch details for each Pokemon
        const detailedPokemon = await Promise.all(
          listResponse.results.map(async (pokemon) => {
            const details = await fetchPokemonDetails(pokemon.url);
            return {
              ...details,
              id: getPokemonIdFromUrl(pokemon.url)
            };
          })
        );

        setData(detailedPokemon);
        setTotalCount(listResponse.count);
        setHasNext(listResponse.next !== null);
        setHasPrevious(listResponse.previous !== null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Pokemon data fetch error:', errorMessage);
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    refetch
  };
}

interface UseEvolutionTriggersReturn {
  data: EvolutionTriggerResponse['results'];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  refetch: () => void;
}

export function useEvolutionTriggers(
  limit: number = 10,
  offset: number = 0
): UseEvolutionTriggersReturn {
  const [data, setData] = useState<EvolutionTriggerResponse['results']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchEvolutionTriggers(limit, offset);
      
      setData(response.results);
      setTotalCount(response.count);
      setHasNext(response.next !== null);
      setHasPrevious(response.previous !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    refetch
  };
}

export function usePokemonDetails(name: string | null) {
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async (pokemonName: string) => {
    try {
      setLoading(true);
      setError(null);
      const pokemon = await fetchPokemonByName(pokemonName);
      setData(pokemon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon details');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (name) {
      fetchDetails(name);
    } else {
      setData(null);
      setError(null);
    }
  }, [name, fetchDetails]);

  return { data, loading, error };
}
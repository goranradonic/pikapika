import { renderHook, act, waitFor } from '@testing-library/react';
import { usePokemonData, useEvolutionTriggers, usePokemonDetails } from './use-pokemon-data';
import * as pokemonApi from '@/lib/pokemon-api';

// Mock the API functions
jest.mock('@/lib/pokemon-api', () => ({
  fetchPokemonList: jest.fn(),
  fetchPokemonByName: jest.fn(),
  fetchPokemonDetails: jest.fn(),
  fetchEvolutionTriggers: jest.fn(),
  getPokemonIdFromUrl: jest.fn()
}));

// Get the mocked functions
const fetchPokemonList = pokemonApi.fetchPokemonList;
const fetchPokemonByName = pokemonApi.fetchPokemonByName;
const fetchPokemonDetails = pokemonApi.fetchPokemonDetails;
const fetchEvolutionTriggers = pokemonApi.fetchEvolutionTriggers;
const getPokemonIdFromUrl = pokemonApi.getPokemonIdFromUrl;

describe('usePokemonData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should fetch pokemon list with default parameters', async () => {
    // Mock API response
    const mockPokemonList = {
      count: 1000,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    };

    const mockPokemonDetails = [
      { id: 1, name: 'bulbasaur', sprites: { front_default: 'url1' } },
      { id: 2, name: 'ivysaur', sprites: { front_default: 'url2' } }
    ];

    (fetchPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
    (fetchPokemonDetails as jest.Mock).mockImplementation((url) => {
      const id = parseInt(url.split('/').slice(-2, -1)[0]);
      return Promise.resolve(mockPokemonDetails.find(p => p.id === id));
    });
    (getPokemonIdFromUrl as jest.Mock).mockImplementation((url) => {
      return parseInt(url.split('/').slice(-2, -1)[0]);
    });

    // Render the hook
    const { result } = renderHook(() => usePokemonData({}));

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the API was called with correct parameters
    expect(fetchPokemonList).toHaveBeenCalledWith(20, 0);

    // Verify the data is correctly processed
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('bulbasaur');
    expect(result.current.data[1].name).toBe('ivysaur');
    expect(result.current.totalCount).toBe(1000);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrevious).toBe(false);
  });

  it('should handle pagination correctly', async () => {
    // Mock API response for second page
    const mockPokemonList = {
      count: 1000,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=40&limit=20',
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20',
      results: [
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' }
      ]
    };

    const mockPokemonDetails = [
      { id: 4, name: 'charmander', sprites: { front_default: 'url4' } },
      { id: 5, name: 'charmeleon', sprites: { front_default: 'url5' } }
    ];

    (fetchPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
    (fetchPokemonDetails as jest.Mock).mockImplementation((url) => {
      const id = parseInt(url.split('/').slice(-2, -1)[0]);
      return Promise.resolve(mockPokemonDetails.find(p => p.id === id));
    });
    (getPokemonIdFromUrl as jest.Mock).mockImplementation((url) => {
      return parseInt(url.split('/').slice(-2, -1)[0]);
    });

    // Render the hook with pagination parameters
    const { result } = renderHook(() => usePokemonData({ limit: 20, offset: 20 }));

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the API was called with correct parameters
    expect(fetchPokemonList).toHaveBeenCalledWith(20, 20);

    // Verify the data is correctly processed
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('charmander');
    expect(result.current.data[1].name).toBe('charmeleon');
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrevious).toBe(true);
  });

  it('should search for pokemon by exact name', async () => {
    // Mock API response for search
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'pikachu_url' }
    };

    (fetchPokemonByName as jest.Mock).mockResolvedValue(mockPokemon);

    // Render the hook with search term
    const { result } = renderHook(() => usePokemonData({ searchTerm: 'pikachu' }));

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the API was called with correct parameters
    expect(fetchPokemonByName).toHaveBeenCalledWith('pikachu');

    // Verify the data is correctly processed
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('pikachu');
    expect(result.current.data[0].id).toBe(25);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrevious).toBe(false);
  });

  it('should handle partial search when exact match fails', async () => {
    // Mock API responses
    (fetchPokemonByName as jest.Mock).mockRejectedValue(new Error('Pokemon "pika" not found'));

    const mockPokemonList = {
      count: 1000,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'pikipek', url: 'https://pokeapi.co/api/v2/pokemon/731/' }
      ]
    };

    const mockPokemonDetails = [
      { id: 25, name: 'pikachu', sprites: { front_default: 'pikachu_url' } },
      { id: 731, name: 'pikipek', sprites: { front_default: 'pikipek_url' } }
    ];

    (fetchPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
    (fetchPokemonDetails as jest.Mock).mockImplementation((url) => {
      const id = parseInt(url.split('/').slice(-2, -1)[0]);
      return Promise.resolve(mockPokemonDetails.find(p => p.id === id));
    });
    (getPokemonIdFromUrl as jest.Mock).mockImplementation((url) => {
      return parseInt(url.split('/').slice(-2, -1)[0]);
    });

    // Render the hook with partial search term
    const { result } = renderHook(() => usePokemonData({ searchTerm: 'pika' }));

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the APIs were called correctly
    expect(fetchPokemonByName).toHaveBeenCalledWith('pika');
    expect(fetchPokemonList).toHaveBeenCalledWith(1000, 0);

    // Verify the data is correctly processed
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('pikachu');
    expect(result.current.data[1].name).toBe('pikipek');
    expect(result.current.totalCount).toBe(2);
  });

  it('should handle errors during fetch', async () => {
    // Mock API error
    const errorMessage = 'Network error';
    (fetchPokemonList as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => usePokemonData({}));

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify error handling
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toEqual([]);
  });

  it('should refetch data when refetch is called', async () => {
    // Mock API response
    const mockPokemonList = {
      count: 1000,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      ]
    };

    const mockPokemonDetails = [
      { id: 1, name: 'bulbasaur', sprites: { front_default: 'url1' } }
    ];

    (fetchPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
    (fetchPokemonDetails as jest.Mock).mockImplementation((url) => {
      const id = parseInt(url.split('/').slice(-2, -1)[0]);
      return Promise.resolve(mockPokemonDetails.find(p => p.id === id));
    });
    (getPokemonIdFromUrl as jest.Mock).mockImplementation((url) => {
      return parseInt(url.split('/').slice(-2, -1)[0]);
    });

    // Render the hook
    const { result } = renderHook(() => usePokemonData({}));

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Clear mocks to check if they're called again
    jest.clearAllMocks();

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // Verify loading state is set
    expect(result.current.loading).toBe(true);

    // Wait for the hook to finish loading again
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the API was called again
    expect(fetchPokemonList).toHaveBeenCalledTimes(1);
  });
});

describe('useEvolutionTriggers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch evolution triggers with default parameters', async () => {
    // Mock API response
    const mockEvolutionTriggers = {
      count: 10,
      next: null,
      previous: null,
      results: [
        { id: 1, name: 'level-up', url: 'https://pokeapi.co/api/v2/evolution-trigger/1/' },
        { id: 2, name: 'trade', url: 'https://pokeapi.co/api/v2/evolution-trigger/2/' }
      ]
    };

    (fetchEvolutionTriggers as jest.Mock).mockResolvedValue(mockEvolutionTriggers);

    // Render the hook
    const { result } = renderHook(() => useEvolutionTriggers());

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the API was called with correct parameters
    expect(fetchEvolutionTriggers).toHaveBeenCalledWith(10, 0);

    // Verify the data is correctly processed
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('level-up');
    expect(result.current.data[1].name).toBe('trade');
    expect(result.current.totalCount).toBe(10);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrevious).toBe(false);
  });

  it('should handle errors during fetch', async () => {
    // Mock API error
    const errorMessage = 'Network error';
    (fetchEvolutionTriggers as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => useEvolutionTriggers());

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify error handling
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toEqual([]);
  });
});

describe('usePokemonDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch pokemon details when name is provided', async () => {
    // Mock API response
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'pikachu_url' },
      types: [{ type: { name: 'electric' } }]
    };

    (fetchPokemonByName as jest.Mock).mockResolvedValue(mockPokemon);

    // Render the hook
    const { result } = renderHook(() => usePokemonDetails('pikachu'));

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the API was called with correct parameters
    expect(fetchPokemonByName).toHaveBeenCalledWith('pikachu');

    // Verify the data is correctly processed
    expect(result.current.data).toEqual(mockPokemon);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors during fetch', async () => {
    // Mock API error
    const errorMessage = 'Pokemon not found';
    (fetchPokemonByName as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => usePokemonDetails('nonexistent'));

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify error handling
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBeNull();
  });

  it('should reset data when name is null', async () => {
    // Render the hook with null name
    const { result } = renderHook(() => usePokemonDetails(null));

    // Verify initial state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    // Verify the API was not called
    expect(fetchPokemonByName).not.toHaveBeenCalled();
  });
});

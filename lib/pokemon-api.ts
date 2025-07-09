export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
    };
  }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface EvolutionTrigger {
  id: number;
  name: string;
  url: string;
}

export interface EvolutionTriggerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EvolutionTrigger[];
}

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Pokemon "${name}" not found`);
    }
    throw new Error(`Failed to fetch Pokemon: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPokemonDetails(url: string): Promise<Pokemon> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon details: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEvolutionTriggers(
  limit: number = 10,
  offset: number = 0
): Promise<EvolutionTriggerResponse> {
  const response = await fetch(`${BASE_URL}/evolution-trigger?limit=${limit}&offset=${offset}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution triggers: ${response.statusText}`);
  }
  
  return response.json();
}

export function getPokemonIdFromUrl(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}
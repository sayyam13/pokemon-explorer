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
      url: string;
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

// Updated to use our API routes
export async function getPokemonList(offset: number = 0, limit: number = 20): Promise<PokemonListResponse> {
  const response = await fetch(`/api/pokemon?offset=${offset}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  const response = await fetch(`/api/pokemon/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with id ${id}`);
  }
  return response.json();
}

export async function getPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`/api/pokemon/${name.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with name ${name}`);
  }
  return response.json();
}

export async function getAllPokemonTypes() {
  const response = await fetch('/api/pokemon/types');
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon types');
  }
  return response.json();
}

export async function searchPokemon(query: string) {
  const response = await fetch(`/api/pokemon/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search Pokemon');
  }
  return response.json();
}

export function getPokemonIdFromUrl(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
}

export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getPokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
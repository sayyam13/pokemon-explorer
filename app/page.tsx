'use client';

import { useState, useEffect, useMemo } from 'react';
import { getPokemonList, formatPokemonName, Pokemon } from '@/lib/pokemon-api';
import { PokemonCard, PokemonCardSkeleton } from '@/components/pokemon/pokemon-card';
import { PokemonSearch } from '@/components/pokemon/pokemon-search';
import { PokemonFilter } from '@/components/pokemon/pokemon-filter';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';

interface PokemonListItem {
  name: string;
  url: string;
  data?: Pokemon;
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('id');
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredAndSortedPokemon = useMemo(() => {
    let filtered = pokemonList;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.url.includes(searchQuery)
      );
    }

    // Filter by types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(pokemon => {
        if (!pokemon.data) return false;
        return pokemon.data.types.some(type => 
          selectedTypes.includes(type.type.name)
        );
      });
    }

    // Sort
    switch (sortBy) {
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case 'id':
      default:
        return [...filtered].sort((a, b) => {
          const idA = parseInt(a.url.split('/').slice(-2)[0]);
          const idB = parseInt(b.url.split('/').slice(-2)[0]);
          return idA - idB;
        });
    }
  }, [pokemonList, searchQuery, selectedTypes, sortBy]);

  useEffect(() => {
    loadInitialPokemon();
  }, []);

  const loadInitialPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPokemonList(0, 60);
      
      // Load detailed data for each Pokemon using our API routes
      const pokemonWithData = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            const response = await fetch(`/api/pokemon/${pokemon.name}`);
            if (response.ok) {
              const pokemonData = await response.json();
              return { ...pokemon, data: pokemonData };
            }
            return pokemon;
          } catch (err) {
            console.error('Error fetching pokemon details:', err);
            return pokemon;
          }
        })
      );

      setPokemonList(pokemonWithData);
      setHasMore(data.next !== null);
    } catch (err) {
      setError('Failed to load Pokemon. Please try again.');
      console.error('Error loading Pokemon:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePokemon = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const offset = pokemonList.length;
      const data = await getPokemonList(offset, 20);
      
      const pokemonWithData = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            const response = await fetch(`/api/pokemon/${pokemon.name}`);
            if (response.ok) {
              const pokemonDetails = await response.json();
              return { ...pokemon, data: pokemonDetails };
            }
            return pokemon;
          } catch (err) {
            console.error('Error fetching pokemon details:', err);
            return pokemon;
          }
        })
      );

      setPokemonList(prev => [...prev, ...pokemonWithData]);
      setHasMore(data.next !== null);
    } catch (err) {
      console.error('Error loading more Pokemon:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <Button onClick={loadInitialPokemon}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
            Pokemon Explorer
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the world of Pokemon with detailed information, stats, and abilities
        </p>
      </header>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        <PokemonSearch onSearch={setSearchQuery} value={searchQuery} />
        <PokemonFilter
          selectedTypes={selectedTypes}
          onTypeChange={setSelectedTypes}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Pokemon Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {filteredAndSortedPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !searchQuery && selectedTypes.length === 0 && (
            <div className="text-center">
              <Button
                onClick={loadMorePokemon}
                disabled={loadingMore}
                size="lg"
                className="px-8 py-3"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading more Pokemon...
                  </>
                ) : (
                  'Load More Pokemon'
                )}
              </Button>
            </div>
          )}

          {/* No results message */}
          {filteredAndSortedPokemon.length === 0 && (searchQuery || selectedTypes.length > 0) && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">No Pokemon found matching your criteria</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Results count */}
      {!loading && (
        <div className="text-center mt-8 text-gray-500">
          {searchQuery || selectedTypes.length > 0 ? (
            <p>Showing {filteredAndSortedPokemon.length} results</p>
          ) : (
            <p>Showing {pokemonList.length} Pokemon</p>
          )}
        </div>
      )}
    </div>
  );
}
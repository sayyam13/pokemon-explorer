'use client';

import { Pokemon, getPokemonIdFromUrl, formatPokemonName, getPokemonImageUrl } from '@/lib/pokemon-api';
import { getTypeColor } from '@/lib/pokemon-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PokemonCardProps {
  pokemon: {
    name: string;
    url: string;
    data?: Pokemon;
  };
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(pokemon.data || null);
  const [loading, setLoading] = useState(!pokemon.data);
  const [imageLoading, setImageLoading] = useState(true);

  const pokemonId = getPokemonIdFromUrl(pokemon.url);

  useEffect(() => {
    if (pokemon.data) {
      setPokemonData(pokemon.data);
      setLoading(false);
      return;
    }

    async function fetchPokemon() {
      try {
        // Use our API route instead of direct PokeAPI call
        const response = await fetch(`/api/pokemon/${pokemonId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon');
        }
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error('Error fetching pokemon:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [pokemon.url, pokemon.data, pokemonId]);

  if (loading || !pokemonData) {
    return <PokemonCardSkeleton />;
  }

  return (
    <Link href={`/pokemon/${pokemonId}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-2 border-transparent hover:border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Pokemon Image */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {imageLoading && (
                <Skeleton className="absolute inset-0 w-full h-full rounded-full" />
              )}
              <img
                src={getPokemonImageUrl(pokemonId)}
                alt={formatPokemonName(pokemon.name)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                } group-hover:scale-110 transition-transform duration-300`}
                onLoad={() => setImageLoading(false)}
              />
            </div>

            {/* Pokemon Info */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-500">#{pokemonId.toString().padStart(3, '0')}</p>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {formatPokemonName(pokemon.name)}
              </h3>
            </div>

            {/* Pokemon Types */}
            <div className="flex flex-wrap gap-2 justify-center">
              {pokemonData.types.map((type) => (
                <Badge
                  key={type.type.name}
                  className={`${getTypeColor(type.type.name)} text-white border-0 px-3 py-1 text-xs font-semibold`}
                >
                  {formatPokemonName(type.type.name)}
                </Badge>
              ))}
            </div>

            {/* Pokemon Stats Preview */}
            <div className="grid grid-cols-2 gap-4 w-full text-center">
              <div>
                <p className="text-xs text-gray-500">Height</p>
                <p className="font-semibold">{(pokemonData.height / 10).toFixed(1)}m</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="font-semibold">{(pokemonData.weight / 10).toFixed(1)}kg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PokemonCardSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-12 mx-auto" />
            <Skeleton className="h-6 w-24 mx-auto" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <Skeleton className="h-3 w-8 mx-auto mb-1" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
            <div className="text-center">
              <Skeleton className="h-3 w-8 mx-auto mb-1" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
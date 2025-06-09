'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatPokemonName, getPokemonImageUrl, Pokemon } from '@/lib/pokemon-api';
import { getTypeGradient, getTypeColor } from '@/lib/pokemon-types';
import { PokemonStats } from '@/components/pokemon/pokemon-stats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Ruler, Weight, Zap, Shield, Heart } from 'lucide-react';
import Link from 'next/link';

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pokemonId = parseInt(params.id as string);

  useEffect(() => {
    if (!pokemonId || isNaN(pokemonId)) {
      setError('Invalid Pokemon ID');
      setLoading(false);
      return;
    }

    loadPokemon();
  }, [pokemonId]);

  const loadPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use our API route instead of direct PokeAPI call
      const response = await fetch(`/api/pokemon/${pokemonId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Pokemon not found');
        } else {
          setError('Failed to load Pokemon');
        }
        return;
      }
      
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError('Pokemon not found');
      console.error('Error loading Pokemon:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !pokemon) {
    return <PokemonDetailSkeleton />;
  }

  const primaryType = pokemon.types[0].type.name;
  const typeGradient = getTypeGradient(primaryType);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${typeGradient}`}>
      {/* Header */}
      <div className="bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="text-black mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pokemon List
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Pokemon Image and Basic Info */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Pokemon Image */}
                <div className="relative w-64 h-64 mx-auto">
                  {imageLoading && (
                    <Skeleton className="absolute inset-0 w-full h-full rounded-full" />
                  )}
                  <img
                    src={getPokemonImageUrl(pokemon.id)}
                    alt={formatPokemonName(pokemon.name)}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>

                {/* Basic Info */}
                <div>
                  <p className="text-lg font-medium text-gray-500 mb-2">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </p>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {formatPokemonName(pokemon.name)}
                  </h1>
                  
                  {/* Types */}
                  <div className="flex justify-center gap-2 mb-6">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type.type.name}
                        className={`${getTypeColor(type.type.name)} text-white border-0 px-4 py-2 text-sm font-semibold`}
                      >
                        {formatPokemonName(type.type.name)}
                      </Badge>
                    ))}
                  </div>

                  {/* Physical Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Ruler className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-gray-700">Height</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {(pokemon.height / 10).toFixed(1)}m
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Weight className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-700">Weight</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {(pokemon.weight / 10).toFixed(1)}kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pokemon Stats */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Base Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PokemonStats stats={pokemon.stats} />
            </CardContent>
          </Card>
        </div>

        {/* Abilities */}
        <Card className="mt-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Abilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pokemon.abilities.map((ability, index) => (
                <div
                  key={ability.ability.name}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {formatPokemonName(ability.ability.name)}
                  </h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          {pokemon.id > 1 && (
            <Link href={`/pokemon/${pokemon.id - 1}`}>
              <Button variant="outline" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Pokemon
              </Button>
            </Link>
          )}
          
          <div className="flex-1" />
          
          <Link href={`/pokemon/${pokemon.id + 1}`}>
            <Button variant="outline" className="bg-white/90 hover:bg-white">
              Next Pokemon
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PokemonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400">
      <div className="bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-10 w-48 mb-4" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/90">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <Skeleton className="w-64 h-64 mx-auto rounded-full" />
                <div>
                  <Skeleton className="h-6 w-20 mx-auto mb-2" />
                  <Skeleton className="h-10 w-48 mx-auto mb-4" />
                  <div className="flex justify-center gap-2 mb-6">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <Skeleton className="h-6 w-16 mx-auto mb-2" />
                      <Skeleton className="h-8 w-12 mx-auto" />
                    </div>
                    <div className="text-center">
                      <Skeleton className="h-6 w-16 mx-auto mb-2" />
                      <Skeleton className="h-8 w-12 mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
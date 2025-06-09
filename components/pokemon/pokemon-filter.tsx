'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getTypeColor } from '@/lib/pokemon-types';
import { formatPokemonName } from '@/lib/pokemon-api';
import { X } from 'lucide-react';

interface PokemonFilterProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const POKEMON_TYPES = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

const SORT_OPTIONS = [
  { value: 'id', label: 'Pokedex Number' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
];

export function PokemonFilter({ selectedTypes, onTypeChange, sortBy, onSortChange }: PokemonFilterProps) {
  const addType = (type: string) => {
    if (!selectedTypes.includes(type)) {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const removeType = (type: string) => {
    onTypeChange(selectedTypes.filter(t => t !== type));
  };

  const clearFilters = () => {
    onTypeChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Type Filter */}
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Type:</label>
          <Select onValueChange={addType}>
            <SelectTrigger className="w-full lg:w-64">
              <SelectValue placeholder="Select a type..." />
            </SelectTrigger>
            <SelectContent>
              {POKEMON_TYPES.filter(type => !selectedTypes.includes(type)).map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`} />
                    {formatPokemonName(type)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sort by:</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {selectedTypes.length > 0 && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="mt-6 lg:mt-6"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Selected Types */}
      {selectedTypes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <Badge
                key={type}
                className={`${getTypeColor(type)} text-white border-0 px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => removeType(type)}
              >
                {formatPokemonName(type)}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
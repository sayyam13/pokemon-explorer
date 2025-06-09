export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fighting: 'bg-red-600',
  flying: 'bg-indigo-400',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  rock: 'bg-yellow-800',
  bug: 'bg-green-500',
  ghost: 'bg-purple-700',
  steel: 'bg-gray-600',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-600',
  electric: 'bg-yellow-400',
  psychic: 'bg-pink-500',
  ice: 'bg-blue-300',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  fairy: 'bg-pink-300',
};

export const POKEMON_TYPE_GRADIENTS: Record<string, string> = {
  normal: 'from-gray-300 to-gray-500',
  fighting: 'from-red-400 to-red-700',
  flying: 'from-indigo-300 to-indigo-600',
  poison: 'from-purple-400 to-purple-700',
  ground: 'from-yellow-500 to-yellow-800',
  rock: 'from-yellow-700 to-yellow-900',
  bug: 'from-green-400 to-green-700',
  ghost: 'from-purple-600 to-purple-900',
  steel: 'from-gray-500 to-gray-800',
  fire: 'from-red-400 to-red-700',
  water: 'from-blue-400 to-blue-700',
  grass: 'from-green-400 to-green-700',
  electric: 'from-yellow-300 to-yellow-600',
  psychic: 'from-pink-400 to-pink-700',
  ice: 'from-blue-200 to-blue-500',
  dragon: 'from-indigo-600 to-indigo-900',
  dark: 'from-gray-700 to-gray-900',
  fairy: 'from-pink-200 to-pink-500',
};

export function getTypeColor(type: string): string {
  return POKEMON_TYPE_COLORS[type.toLowerCase()] || 'bg-gray-400';
}

export function getTypeGradient(type: string): string {
  return POKEMON_TYPE_GRADIENTS[type.toLowerCase()] || 'from-gray-300 to-gray-500';
}
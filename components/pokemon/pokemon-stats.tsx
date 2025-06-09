'use client';

import { Progress } from '@/components/ui/progress';
import { formatPokemonName } from '@/lib/pokemon-api';

interface PokemonStatsProps {
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

const STAT_COLORS: Record<string, string> = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  'special-attack': 'bg-blue-500',
  'special-defense': 'bg-green-500',
  speed: 'bg-purple-500',
};

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

export function PokemonStats({ stats }: PokemonStatsProps) {
  const maxStat = Math.max(...stats.map(stat => stat.base_stat));
  const total = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {stats.map((stat) => (
          <div key={stat.stat.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {STAT_NAMES[stat.stat.name] || formatPokemonName(stat.stat.name)}
              </span>
              <span className="font-bold text-gray-900">{stat.base_stat}</span>
            </div>
            <div className="relative">
              <Progress 
                value={(stat.base_stat / 150) * 100} 
                className="h-3"
              />
              <div 
                className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${
                  STAT_COLORS[stat.stat.name] || 'bg-gray-500'
                }`}
                style={{ width: `${(stat.base_stat / 150) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total</span>
          <span className="text-xl font-bold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  );
}
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePokemonDetails } from '@/hooks/use-pokemon-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemonName: string | null;
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

export function PokemonModal({ isOpen, onClose, pokemonName }: PokemonModalProps) {
  const { data: pokemon, loading, error } = usePokemonDetails(pokemonName);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-card p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-foreground"
                  >
                    {loading ? 'Loading...' : pokemon ? `${pokemon.name} Details` : 'Pokémon Details'}
                  </Dialog.Title>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>

                {loading && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-32 w-32 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-16 rounded-lg" />
                      <Skeleton className="h-16 rounded-lg" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {pokemon && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <img
                          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                          alt={pokemon.name}
                          className="h-32 w-32 rounded-lg bg-muted"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-2xl font-bold capitalize text-foreground">
                            {pokemon.name}
                          </h4>
                          <p className="text-muted-foreground">
                            #{pokemon.id.toString().padStart(3, '0')}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {pokemon.types.map((type) => (
                            <Badge
                              key={type.type.name}
                              variant="secondary"
                              className={cn(
                                'text-white capitalize',
                                typeColors[type.type.name] || 'bg-gray-400'
                              )}
                            >
                              {type.type.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="rounded-lg bg-muted p-3">
                            <p className="font-medium text-foreground">Height</p>
                            <p className="text-muted-foreground">{pokemon.height / 10} m</p>
                          </div>
                          <div className="rounded-lg bg-muted p-3">
                            <p className="font-medium text-foreground">Weight</p>
                            <p className="text-muted-foreground">{pokemon.weight / 10} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <h5 className="text-lg font-semibold mb-3 text-foreground">Base Stats</h5>
                      <div className="space-y-2">
                        {pokemon.stats.map((stat) => (
                          <div key={stat.stat.name} className="flex items-center space-x-3">
                            <div className="w-24 text-sm font-medium text-muted-foreground">
                              {statNames[stat.stat.name] || stat.stat.name}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                  <div
                                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-mono text-muted-foreground w-10 text-right">
                                  {stat.base_stat}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Abilities */}
                    <div>
                      <h5 className="text-lg font-semibold mb-3 text-foreground">Abilities</h5>
                      <div className="flex flex-wrap gap-2">
                        {pokemon.abilities.map((ability) => (
                          <Badge key={ability.ability.name} variant="outline" className="capitalize">
                            {ability.ability.name.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Moves */}
                    <div>
                      <h5 className="text-lg font-semibold mb-3 text-foreground">Moves (First 5)</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {pokemon.moves.slice(0, 5).map((move) => (
                          <div key={move.move.name} className="rounded-lg bg-muted p-2">
                            <span className="text-sm capitalize text-foreground">
                              {move.move.name.replace('-', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
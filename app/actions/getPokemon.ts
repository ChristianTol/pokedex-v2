'use client'

export interface PokemonBasic {
  name: string;
  url: string;
}

export interface PokemonDetailed {
  id: number;
    name: string;
    url: string;
    sprites: {
      other: {
        'official-artwork': {
          front_default: string;
          front_shiny: string;
        }
      }
    }
    types: any
}

let allPokemonCache: PokemonBasic[] | null = null;

export async function fetchAllPokemon(): Promise<PokemonBasic[]> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
  const data = await res.json()
  return data.results
}

export async function fetchPokemonDetails(urls: string[]): Promise<PokemonDetailed[]> {
  const promises = urls.map(url => fetch(url).then(res => res.json()))
  return Promise.all(promises)
}

export async function fetchPokemonPage(page: number, limit: number = 20): Promise<PokemonBasic[]> {
  const offset = (page - 1) * limit;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
  const data = await res.json()
  return data.results
}

export async function searchPokemon(term: string): Promise<PokemonDetailed[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`)
  if (!res.ok) {
    if (res.status === 404) {
      return []; // Return an empty array if Pokémon is not found
    }
    throw new Error('Failed to fetch Pokémon');
  }
  const data = await res.json()
  return [data]; // Wrap the single Pokémon in an array
}
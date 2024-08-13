'use client'

export interface PokemonBasic {
  name: string;
  url: string;
}

export interface PokemonDetailed {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export async function fetchAllPokemon(): Promise<PokemonBasic[]> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
  const data = await res.json()
  return data.results
}

export async function fetchPokemonDetails(urls: string[]): Promise<PokemonDetailed[]> {
  const promises = urls.map(url => fetch(url).then(res => res.json()))
  return Promise.all(promises)
}

export async function searchPokemon(term: string): Promise<PokemonDetailed[]> {
  const allPokemon = await fetchAllPokemon()
  const filtered = allPokemon.filter(p => p.name.toLowerCase().includes(term.toLowerCase()))
  return fetchPokemonDetails(filtered.map(p => p.url))
}
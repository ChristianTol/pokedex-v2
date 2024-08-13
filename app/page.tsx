'use client'

import { useReducer, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWR from 'swr'
import PokemonList from '@/components/PokemonList'
import SearchBar from '@/components/SearchBar'
import { fetchAllPokemon, fetchPokemonDetails, searchPokemon, PokemonBasic } from './actions/getPokemon'
import { pokemonReducer, initialState } from './reducer/pokemonReducer'
import Image from 'next/image'
import pokeball from "../public/pokeball-2.png";
import Head from 'next/head'
import Link from 'next/link'

const POKEMON_PER_PAGE = 20

export default function Home() {
  const [state, dispatch] = useReducer(pokemonReducer, initialState)
  const { ref, inView } = useInView()
  const loadingRef = useRef(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const { data: allPokemon } = useSWR<PokemonBasic[]>('allPokemon', fetchAllPokemon)

  const loadMorePokemon = useCallback(async () => {
    if (allPokemon && state.loadedCount < allPokemon.length && !loadingRef.current) {
      loadingRef.current = true
      const newPokemonUrls = allPokemon.slice(state.loadedCount, state.loadedCount + POKEMON_PER_PAGE).map(p => p.url)
      const newPokemon = await fetchPokemonDetails(newPokemonUrls)
      dispatch({ type: 'ADD_POKEMON', payload: newPokemon })
      loadingRef.current = false
    }
  }, [allPokemon, state.loadedCount])

  const handleSearch = useCallback(async (term: string) => {
    if (term) {
      dispatch({ type: 'SET_SEARCHING', payload: true })
      const searchResults = await searchPokemon(term)
      dispatch({ type: 'SET_POKEMON', payload: searchResults })

      // Update suggestions
      if (allPokemon) {
        const newSuggestions = allPokemon
          .filter(p => p.name.toLowerCase().includes(term.toLowerCase()))
          .map(p => p.name)
          .slice(0, 5) // Limit to 5 suggestions
        setSuggestions(newSuggestions)
      }
    } else {
      dispatch({ type: 'RESET' })
      setSuggestions([])
    }
  }, [allPokemon])

  useEffect(() => {
    if (inView && allPokemon && state.loadedCount < allPokemon.length && !state.isSearching) {
      loadMorePokemon()
    }
  }, [inView, allPokemon, state.loadedCount, state.isSearching, loadMorePokemon])

  useEffect(() => {
    if (allPokemon && state.pokemon.length === 0 && !state.isSearching) {
      loadMorePokemon()
    }
  }, [allPokemon, state.pokemon.length, state.isSearching, loadMorePokemon])

  return (
    <>
     <Head>
        <title>Pokedex</title>
      </Head>

      <header className="bg-slate-900 py-10 mb-10">
        <Link href="/" passHref>
          <h1 className="text-6xl text-center text-amber-400">Pokedex</h1>
        </Link>
      </header>

    <main className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} suggestions={suggestions} />
      <PokemonList pokemon={state.pokemon} />
      <div ref={ref} className="h-10" />
      {!state.isSearching && state.pokemon.length <= 1020 && (
      <section className="flex justify-center items-center">
      <figure ref={ref} className="animate-[spin_4s_infinite]">
        <Image src={pokeball} alt="Loading..." height={80} width={80} />
      </figure>
    </section>
      )}
    </main>
    {!state.isSearching && state.pokemon.length > 0 && (
        <a
          href="#"
          className="top bg-slate-800 border-slate-900 border-2 text-amber-400 font-semibold bottom-0 p-3 rounded-xl left-[150px] lg:bottom-5 lg:left-[350px]"
        >
          Back to Top &#8593;
        </a>
      )}
    </>
  )
}
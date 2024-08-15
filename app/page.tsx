'use client'

import { useReducer, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWR from 'swr'
import PokemonList from '@/components/PokemonList'
import SearchBar from '@/components/SearchBar'
import { fetchPokemonPage, fetchAllPokemon, fetchPokemonDetails, searchPokemon, PokemonBasic, PokemonDetailed } from './actions/getPokemon'
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

  const { data: currentPagePokemon } = useSWR<PokemonBasic[]>(
    ['pokemonPage', state.currentPage],
    () => fetchPokemonPage(state.currentPage, POKEMON_PER_PAGE)
  )

  const loadMorePokemon = useCallback(async () => {
    if (currentPagePokemon && !loadingRef.current) {
      loadingRef.current = true
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const newPokemon = await fetchPokemonDetails(currentPagePokemon.map(p => p.url))
        dispatch({ type: 'ADD_POKEMON', payload: newPokemon })
        dispatch({ type: 'SET_PAGE', payload: state.currentPage + 1 })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load more Pokémon' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
        loadingRef.current = false
      }
    }
  }, [currentPagePokemon, state.currentPage])

  const handleSearch = useCallback(async (term: string) => {
    if (term) {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })  // Clear any previous errors
      try {
        const searchResults = await searchPokemon(term)
        dispatch({ type: 'SET_POKEMON', payload: searchResults })
        dispatch({ type: 'SET_SEARCHING', payload: true })
        
        // Update suggestions
        if (allPokemon) {
          const newSuggestions = allPokemon
            .filter(p => p.name.toLowerCase().includes(term.toLowerCase()))
            .map(p => p.name)
            .slice(0, 5) // Limit to 5 suggestions
          setSuggestions(newSuggestions)
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to search Pokémon' })
        dispatch({ type: 'SET_POKEMON', payload: [] }) // Clear pokemon on error
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      dispatch({ type: 'RESET' })
      setSuggestions([])
    }
  }, [allPokemon])

  useEffect(() => {
    if (inView && !state.isSearching && !state.isLoading) {
      loadMorePokemon()
    }
  }, [inView, state.isSearching, state.isLoading, loadMorePokemon])

  useEffect(() => {
    if (state.pokemon.length === 0 && !state.isSearching && !state.isLoading) {
      loadMorePokemon()
    }
  }, [state.pokemon.length, state.isSearching, state.isLoading, loadMorePokemon])

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
        {/* {state.error && <p className="text-red-500">{state.error}</p>} */}
        <PokemonList pokemon={state.pokemon} />
        <div ref={ref} className="h-10" />
        {!state.isSearching && !state.isLoading && state.pokemon.length < 1025 && (
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
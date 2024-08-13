import { PokemonDetailed } from '../actions/getPokemon'

type PokemonState = {
  pokemon: PokemonDetailed[];
  loadedCount: number;
  isSearching: boolean;
}

type PokemonAction = 
  | { type: 'ADD_POKEMON'; payload: PokemonDetailed[] }
  | { type: 'SET_POKEMON'; payload: PokemonDetailed[] }
  | { type: 'RESET' }
  | { type: 'SET_SEARCHING'; payload: boolean }

export const initialState: PokemonState = {
  pokemon: [],
  loadedCount: 0,
  isSearching: false,
}

export function pokemonReducer(state: PokemonState, action: PokemonAction): PokemonState {
  switch (action.type) {
    case 'ADD_POKEMON':
      return {
        ...state,
        pokemon: [...state.pokemon, ...action.payload],
        loadedCount: state.loadedCount + action.payload.length,
      }
    case 'SET_POKEMON':
      return {
        ...state,
        pokemon: action.payload,
        loadedCount: action.payload.length,
        isSearching: true,
      }
    case 'RESET':
      return initialState
    case 'SET_SEARCHING':
      return {
        ...state,
        isSearching: action.payload,
      }
    default:
      return state
  }
}
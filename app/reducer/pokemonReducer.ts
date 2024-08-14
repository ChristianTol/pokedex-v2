import { PokemonDetailed } from '../actions/getPokemon'

type PokemonState = {
  pokemon: PokemonDetailed[];
  loadedCount: number;
  isSearching: boolean;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
}

type PokemonAction = 
  | { type: 'ADD_POKEMON'; payload: PokemonDetailed[] }
  | { type: 'SET_POKEMON'; payload: PokemonDetailed[] }
  | { type: 'RESET' }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }  //
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

export const initialState: PokemonState = {
  pokemon: [],
  loadedCount: 0,
  isSearching: false,
  isLoading: false,
  error: null,
  currentPage: 1,
  
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
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isSearching: false
      }
    default:
      return state
  }
}
import PokemonCard from './PokemonCard'
import { motion } from 'framer-motion'

interface PokemonDetailed {
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

interface PokemonListProps {
  pokemon: PokemonDetailed[]
}

export default function PokemonList({ pokemon }: PokemonListProps) {
  return (
    <motion.div 
      className="grid grid-cols-2 gap-5 mx-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-10 mb-5"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {pokemon.map((p) => (
        <PokemonCard key={`${p.id}-${p.name}`} pokemon={p} />
      ))}
    </motion.div>
  )
}
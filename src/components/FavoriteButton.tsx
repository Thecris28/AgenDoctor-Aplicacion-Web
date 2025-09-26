'use client';
import { Heart } from 'lucide-react'
import React from 'react'

export default function FavoriteButton() {
      const [favorited, setFavorited] = React.useState(false);
    return (
    <button onClick={() => setFavorited(!favorited)} className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <Heart className={` w-5 h-5 ${favorited ? "text-red-500" : "text-white"} `} 
          fill="currentColor"/>
        </button>
    )
  
}

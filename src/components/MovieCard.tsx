import { Star, Heart } from "lucide-react";
import { useState } from "react";

export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genre: string[];
  language: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group movie-card cursor-pointer flex-shrink-0 w-40 sm:w-48 lg:w-56">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-card">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background/70"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "text-primary fill-primary" : "text-foreground"
            }`}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-foreground">{movie.rating}</span>
          <span className="text-xs text-muted-foreground">({movie.votes})</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-foreground text-sm lg:text-base line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {movie.genre.join(" • ")}
        </p>
        <p className="text-xs text-muted-foreground">{movie.language}</p>
      </div>
    </div>
  );
};

export default MovieCard;

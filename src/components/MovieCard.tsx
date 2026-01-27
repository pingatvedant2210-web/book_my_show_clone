import { Star, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "@/hooks/useMovies";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const formatVotes = (votes: number | null) => {
    if (!votes || votes === 0) return '-';
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(0)}K`;
    }
    return votes.toString();
  };

  return (
    <div 
      className="group movie-card cursor-pointer flex-shrink-0 w-40 sm:w-48 lg:w-56"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-card">
        <img
          src={movie.poster_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80'}
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
        {movie.rating !== null && movie.rating > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-foreground">{movie.rating}</span>
            <span className="text-xs text-muted-foreground">({formatVotes(movie.votes_count)})</span>
          </div>
        )}

        {/* Coming Soon Badge */}
        {movie.is_coming_soon && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-medium">
            Coming Soon
          </div>
        )}
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

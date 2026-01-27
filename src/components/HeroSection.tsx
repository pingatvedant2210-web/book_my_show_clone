import { Play, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFeaturedMovie } from "@/hooks/useMovies";

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: featuredMovie, isLoading } = useFeaturedMovie();

  if (isLoading) {
    return (
      <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden bg-card animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">Loading featured movie...</div>
        </div>
      </section>
    );
  }

  if (!featuredMovie) {
    return null;
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatVotes = (votes: number) => {
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(0)}K`;
    }
    return votes.toString();
  };

  return (
    <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredMovie.backdrop_url || featuredMovie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80'}
          alt={featuredMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto h-full flex items-end pb-16 lg:pb-24 px-4">
        <div className="max-w-2xl animate-slide-in">
          {/* Featured Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Featured Today
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-2">
            {featuredMovie.title}
          </h1>
          {featuredMovie.description && (
            <p className="text-xl lg:text-2xl text-muted-foreground mb-4 line-clamp-2">
              {featuredMovie.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {featuredMovie.rating && featuredMovie.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <span className="text-foreground font-semibold">{featuredMovie.rating}/10</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(featuredMovie.duration_minutes)}</span>
            </div>
            <div className="flex items-center gap-2">
              {featuredMovie.genre.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 text-xs font-medium rounded bg-secondary text-muted-foreground"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
              onClick={() => navigate(`/movie/${featuredMovie.id}`)}
            >
              <Play className="h-5 w-5 mr-2 fill-current" />
              Book Tickets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

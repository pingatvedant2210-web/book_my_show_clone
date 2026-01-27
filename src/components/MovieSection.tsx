import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "@/hooks/useMovies";

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  isLoading?: boolean;
}

const MovieSection = ({ title, subtitle, movies, isLoading }: MovieSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="flex gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-40 sm:w-48 lg:w-56 animate-pulse">
                <div className="aspect-[2/3] rounded-lg bg-secondary" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!movies?.length) {
    return null;
  }

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Movies Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;

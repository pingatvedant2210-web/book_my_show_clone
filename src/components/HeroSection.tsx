import { Play, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedMovie {
  id: number;
  title: string;
  tagline: string;
  rating: number;
  duration: string;
  genre: string[];
  image: string;
}

const featuredMovie: FeaturedMovie = {
  id: 1,
  title: "Pushpa 2: The Rule",
  tagline: "The Rule Begins",
  rating: 9.2,
  duration: "3h 20m",
  genre: ["Action", "Drama", "Thriller"],
  image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
};

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredMovie.image}
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
          <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
            {featuredMovie.tagline}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-foreground font-semibold">{featuredMovie.rating}/10</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{featuredMovie.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              {featuredMovie.genre.map((g) => (
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
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Book Tickets
            </Button>
            <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10">
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

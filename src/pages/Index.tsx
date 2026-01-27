import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import { useNowShowingMovies, useComingSoonMovies } from "@/hooks/useMovies";

const Index = () => {
  const { data: nowShowingMovies, isLoading: nowShowingLoading } = useNowShowingMovies();
  const { data: comingSoonMovies, isLoading: comingSoonLoading } = useComingSoonMovies();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <main className="pt-16 lg:pt-20">
        <HeroSection />
        
        {/* Movie Sections */}
        <div id="movies">
          <MovieSection
            title="Now Showing"
            subtitle="Book tickets for movies currently in theaters"
            movies={nowShowingMovies || []}
            isLoading={nowShowingLoading}
          />
          
          <MovieSection
            title="Coming Soon"
            subtitle="Upcoming movies you won't want to miss"
            movies={comingSoonMovies || []}
            isLoading={comingSoonLoading}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

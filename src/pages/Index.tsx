import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import { nowShowingMovies, comingSoonMovies, popularMovies } from "@/data/movies";

const Index = () => {
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
            movies={nowShowingMovies}
          />
          
          <MovieSection
            title="Coming Soon"
            subtitle="Upcoming movies you won't want to miss"
            movies={comingSoonMovies}
          />
          
          <MovieSection
            title="Popular This Month"
            subtitle="Most loved movies by our audience"
            movies={popularMovies}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovie } from '@/hooks/useMovies';
import { useShowtimes, Showtime } from '@/hooks/useShowtimes';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import SeatSelection from '@/components/SeatSelection';
import { toast } from 'sonner';
import { ArrowLeft, Star, Clock, Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { format } from 'date-fns';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: movie, isLoading: movieLoading } = useMovie(id || '');
  const { data: showtimes, isLoading: showtimesLoading } = useShowtimes(id || '');
  
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [seatsCount, setSeatsCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'count' | 'seats'>('count');

  const handleBookNow = (showtime: Showtime) => {
    if (!user) {
      toast.error('Please sign in to book tickets');
      navigate('/auth');
      return;
    }
    setSelectedShowtime(showtime);
    setSeatsCount(1);
    setSelectedSeats([]);
    setBookingStep('count');
    setShowBookingModal(true);
  };

  const handleProceedToSeats = () => {
    setBookingStep('seats');
  };

  const handleSeatsSelected = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length !== seatsCount) {
      toast.error(`Please select exactly ${seatsCount} seat(s)`);
      return;
    }
    
    // Navigate to payment page with booking details
    const params = new URLSearchParams({
      movieId: id || '',
      showtimeId: selectedShowtime?.id || '',
      seats: selectedSeats.join(','),
      seatsCount: seatsCount.toString(),
    });
    
    navigate(`/payment?${params.toString()}`);
  };

  // Group showtimes by date and theater
  const groupedShowtimes = showtimes?.reduce((acc, showtime) => {
    const dateKey = showtime.show_date;
    if (!acc[dateKey]) {
      acc[dateKey] = {};
    }
    const theaterName = showtime.theater.name;
    if (!acc[dateKey][theaterName]) {
      acc[dateKey][theaterName] = [];
    }
    acc[dateKey][theaterName].push(showtime);
    return acc;
  }, {} as Record<string, Record<string, Showtime[]>>);

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Movie not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] lg:h-[60vh]">
        <div className="absolute inset-0">
          <img
            src={movie.backdrop_url || movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80'}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/70 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        
        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="container mx-auto flex gap-6 items-end">
            {/* Poster */}
            <div className="hidden lg:block w-48 flex-shrink-0">
              <img
                src={movie.poster_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80'}
                alt={movie.title}
                className="w-full rounded-lg shadow-card"
              />
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-3">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {movie.rating && movie.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <span className="text-foreground font-semibold">{movie.rating}/10</span>
                    <span className="text-muted-foreground text-sm">
                      ({(movie.votes_count || 0).toLocaleString()} votes)
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(movie.duration_minutes)}</span>
                </div>
                
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-secondary text-muted-foreground">
                  {movie.certificate}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-primary/20 text-primary border border-primary/30"
                  >
                    {g}
                  </span>
                ))}
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-secondary text-muted-foreground">
                  {movie.language}
                </span>
              </div>
              
              {movie.description && (
                <p className="text-muted-foreground max-w-2xl line-clamp-3">
                  {movie.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {movie.is_coming_soon ? 'Coming Soon' : `Theaters Showing ${movie.title}`}
        </h2>
        
        {movie.is_coming_soon ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-foreground font-semibold mb-2">
              Releasing on {movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'TBA'}
            </p>
            <p className="text-muted-foreground">
              Bookings will open soon. Stay tuned!
            </p>
          </div>
        ) : showtimesLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading showtimes...</div>
        ) : !showtimes?.length ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No showtimes available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedShowtimes || {}).map(([date, theaters]) => (
              <div key={date} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(theaters).map(([theaterName, shows]) => (
                    <div key={theaterName} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{theaterName}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {shows[0].theater.city}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {shows.map((show) => (
                          <button
                            key={show.id}
                            onClick={() => handleBookNow(show)}
                            className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                          >
                            {show.show_time.slice(0, 5)}
                            <span className="block text-xs opacity-75">₹{show.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl shadow-card animate-scale-in my-4">
            {/* Step: Select Seat Count */}
            {bookingStep === 'count' && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">How Many Seats?</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{movie.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedShowtime.show_date), 'EEEE, MMM dd')} at {selectedShowtime.show_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p className="text-foreground">{selectedShowtime.theater.name}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-3">
                      <span className="text-foreground">Number of Seats:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSeatsCount(Math.max(1, seatsCount - 1))}
                          className="w-8 h-8 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          disabled={seatsCount <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-foreground">{seatsCount}</span>
                        <button
                          onClick={() => setSeatsCount(Math.min(10, seatsCount + 1))}
                          className="w-8 h-8 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          disabled={seatsCount >= 10 || seatsCount >= selectedShowtime.available_seats}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {selectedShowtime.available_seats} seats available • ₹{selectedShowtime.price} per seat
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleProceedToSeats}
                  >
                    Select Seats
                  </Button>
                </div>
              </>
            )}

            {/* Step: Select Seats */}
            {bookingStep === 'seats' && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">Select Your Seats</h3>
                
                <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{movie.title}</span> • {selectedShowtime.theater.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(selectedShowtime.show_date), 'EEEE, MMM dd')} at {selectedShowtime.show_time.slice(0, 5)}
                  </p>
                </div>

                <SeatSelection
                  totalSeats={selectedShowtime.theater.total_seats || 100}
                  availableSeats={selectedShowtime.available_seats}
                  seatsToSelect={seatsCount}
                  onSeatsSelected={handleSeatsSelected}
                  selectedSeats={selectedSeats}
                />
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setBookingStep('count')}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleProceedToPayment}
                    disabled={selectedSeats.length !== seatsCount}
                  >
                    Proceed to Payment ({selectedSeats.length}/{seatsCount})
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;

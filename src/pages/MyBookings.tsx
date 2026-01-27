import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ticket, Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: bookings, isLoading } = useUserBookings();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Please sign in to view your bookings</h2>
          <Button onClick={() => navigate('/auth')} className="bg-primary text-primary-foreground">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (bookingStatus: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && bookingStatus === 'confirmed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (paymentStatus === 'processing') {
      return <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />;
    }
    if (bookingStatus === 'cancelled' || paymentStatus === 'failed') {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusText = (bookingStatus: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && bookingStatus === 'confirmed') {
      return 'Confirmed';
    }
    if (paymentStatus === 'processing') {
      return 'Processing';
    }
    if (bookingStatus === 'cancelled') {
      return 'Cancelled';
    }
    if (paymentStatus === 'failed') {
      return 'Failed';
    }
    return 'Pending';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">My Bookings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-primary">Loading bookings...</div>
          </div>
        ) : !bookings?.length ? (
          <div className="text-center py-12">
            <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">Start exploring movies and book your first ticket!</p>
            <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground">
              Browse Movies
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-xl p-4 lg:p-6"
              >
                <div className="flex gap-4">
                  {/* Movie Poster */}
                  {booking.showtime?.movie?.poster_url && (
                    <div className="w-20 lg:w-28 flex-shrink-0">
                      <img
                        src={booking.showtime.movie.poster_url}
                        alt={booking.showtime.movie.title}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-foreground text-lg">
                        {booking.showtime?.movie?.title || 'Unknown Movie'}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(booking.booking_status, booking.payment_status)}
                        <span className="text-sm font-medium text-foreground">
                          {getStatusText(booking.booking_status, booking.payment_status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {booking.showtime?.show_date 
                            ? format(new Date(booking.showtime.show_date), 'EEEE, MMM dd, yyyy')
                            : 'N/A'
                          } at {booking.showtime?.show_time?.slice(0, 5) || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {booking.showtime?.theater?.name || 'Unknown Theater'}, {booking.showtime?.theater?.city || ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ticket className="h-4 w-4" />
                        <span>{booking.seats_count} {booking.seats_count === 1 ? 'Ticket' : 'Tickets'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Booking Code</p>
                        <p className="font-mono font-bold text-primary">{booking.booking_code || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-foreground">₹{booking.total_amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;

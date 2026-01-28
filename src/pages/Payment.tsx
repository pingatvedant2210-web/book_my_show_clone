import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMovie } from '@/hooks/useMovies';
import { useShowtimes } from '@/hooks/useShowtimes';
import { useCreateBooking, useUpdateBookingPayment } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Smartphone, Check, Ticket, MapPin, Calendar, Clock, Armchair } from 'lucide-react';
import { format } from 'date-fns';

type PaymentMethod = 'debit' | 'credit' | 'upi';

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const movieId = searchParams.get('movieId') || '';
  const showtimeId = searchParams.get('showtimeId') || '';
  const seatsParam = searchParams.get('seats') || '';
  const seatsCount = parseInt(searchParams.get('seatsCount') || '1', 10);
  
  const selectedSeats = seatsParam ? seatsParam.split(',') : [];
  
  const { data: movie, isLoading: movieLoading } = useMovie(movieId);
  const { data: showtimes, isLoading: showtimesLoading } = useShowtimes(movieId);
  
  const createBooking = useCreateBooking();
  const updatePayment = useUpdateBookingPayment();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState<string>('');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // UPI state
  const [upiId, setUpiId] = useState('');
  
  const selectedShowtime = showtimes?.find(s => s.id === showtimeId);
  const totalAmount = selectedShowtime ? selectedShowtime.price * seatsCount : 0;
  
  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  
  const validatePaymentDetails = (): boolean => {
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID');
        return false;
      }
    } else {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      if (!cardName.trim()) {
        toast.error('Please enter the cardholder name');
        return false;
      }
      if (cardExpiry.length !== 5) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (cardCvv.length !== 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }
    return true;
  };
  
  const handlePayment = async () => {
    if (!validatePaymentDetails()) return;
    if (!selectedShowtime || !movie) return;
    
    setIsProcessing(true);
    
    try {
      // Create booking
      const booking = await createBooking.mutateAsync({
        showtime_id: selectedShowtime.id,
        seats_count: seatsCount,
        total_amount: totalAmount,
      });
      
      toast.info('Processing payment...', { duration: 2000 });
      
      // Update to processing
      await updatePayment.mutateAsync({
        bookingId: booking.id,
        paymentStatus: 'processing',
      });
      
      // Simulate payment gateway delay (2.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Complete payment
      await updatePayment.mutateAsync({
        bookingId: booking.id,
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
      });
      
      const code = booking.booking_code || 'BMS' + booking.id.slice(0, 8).toUpperCase();
      setBookingCode(code);
      setPaymentSuccess(true);
      setIsProcessing(false);
      
      // Mock email notification
      setTimeout(() => {
        toast.info(
          `📧 Email Notification: Your tickets for "${movie.title}" have been confirmed!`,
          { duration: 6000 }
        );
      }, 1000);
      
    } catch (error) {
      setIsProcessing(false);
      toast.error('Payment failed. Please try again.');
    }
  };
  
  if (movieLoading || showtimesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }
  
  if (!movie || !selectedShowtime) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Booking details not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Success Screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">Your booking has been confirmed</p>
            
            <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking Code</span>
                <span className="font-bold text-primary">{bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Movie</span>
                <span className="font-medium text-foreground">{movie.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theater</span>
                <span className="font-medium text-foreground">{selectedShowtime.theater.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium text-foreground">
                  {format(new Date(selectedShowtime.show_date), 'MMM dd')} at {selectedShowtime.show_time.slice(0, 5)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="font-medium text-foreground">{selectedSeats.sort().join(', ')}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-foreground">₹{totalAmount}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => navigate('/bookings')}
              >
                View My Bookings
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Payment</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-4"
                >
                  {/* UPI */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">UPI</p>
                          <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                        </div>
                      </Label>
                    </div>
                    
                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pl-8">
                        <Label htmlFor="upiId" className="text-sm text-muted-foreground">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Debit Card */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'debit' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="debit" id="debit" />
                      <Label htmlFor="debit" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-foreground">Debit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                        </div>
                      </Label>
                    </div>
                    
                    {paymentMethod === 'debit' && (
                      <div className="mt-4 pl-8 space-y-4">
                        <div>
                          <Label htmlFor="debitNumber" className="text-sm text-muted-foreground">Card Number</Label>
                          <Input
                            id="debitNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="debitName" className="text-sm text-muted-foreground">Cardholder Name</Label>
                          <Input
                            id="debitName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="debitExpiry" className="text-sm text-muted-foreground">Expiry Date</Label>
                            <Input
                              id="debitExpiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                              maxLength={5}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="debitCvv" className="text-sm text-muted-foreground">CVV</Label>
                            <Input
                              id="debitCvv"
                              placeholder="123"
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              maxLength={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Credit Card */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'credit' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-foreground">Credit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                        </div>
                      </Label>
                    </div>
                    
                    {paymentMethod === 'credit' && (
                      <div className="mt-4 pl-8 space-y-4">
                        <div>
                          <Label htmlFor="creditNumber" className="text-sm text-muted-foreground">Card Number</Label>
                          <Input
                            id="creditNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="creditName" className="text-sm text-muted-foreground">Cardholder Name</Label>
                          <Input
                            id="creditName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="creditExpiry" className="text-sm text-muted-foreground">Expiry Date</Label>
                            <Input
                              id="creditExpiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                              maxLength={5}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="creditCvv" className="text-sm text-muted-foreground">CVV</Label>
                            <Input
                              id="creditCvv"
                              placeholder="123"
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              maxLength={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Movie Info */}
                <div className="flex gap-3">
                  <img
                    src={movie.poster_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80'}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">{movie.language} • {movie.certificate}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedShowtime.theater.name}, {selectedShowtime.theater.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(selectedShowtime.show_date), 'EEEE, MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{selectedShowtime.show_time.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Armchair className="h-4 w-4" />
                    <span>{seatsCount} Ticket(s) - Seats: {selectedSeats.sort().join(', ')}</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ticket Price</span>
                    <span className="text-foreground">₹{selectedShowtime.price} x {seatsCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Convenience Fee</span>
                    <span className="text-foreground">₹0</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{totalAmount}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${totalAmount}`
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

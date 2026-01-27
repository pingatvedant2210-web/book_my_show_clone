import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  user_id: string;
  showtime_id: string;
  seats_count: number;
  total_amount: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  booking_code: string | null;
  created_at: string;
  showtime?: {
    id: string;
    show_date: string;
    show_time: string;
    price: number;
    movie: {
      id: string;
      title: string;
      poster_url: string | null;
    };
    theater: {
      id: string;
      name: string;
      city: string;
    };
  };
}

export const useUserBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          showtime:showtimes(
            id,
            show_date,
            show_time,
            price,
            movie:movies(id, title, poster_url),
            theater:theaters(id, name, city)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

interface CreateBookingData {
  showtime_id: string;
  seats_count: number;
  total_amount: number;
}

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateBookingData) => {
      if (!user) throw new Error('You must be logged in to book');
      
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          showtime_id: data.showtime_id,
          seats_count: data.seats_count,
          total_amount: data.total_amount,
        })
        .select()
        .single();
      
      if (error) throw error;
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBookingPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookingId, paymentStatus, bookingStatus }: { 
      bookingId: string; 
      paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
      bookingStatus?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    }) => {
      const updateData: Record<string, string> = {
        payment_status: paymentStatus,
      };
      
      if (bookingStatus) {
        updateData.booking_status = bookingStatus;
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

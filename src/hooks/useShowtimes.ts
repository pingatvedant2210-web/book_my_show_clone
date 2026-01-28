import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price: number;
  available_seats: number;
  is_available: boolean | null;
  theater: {
    id: string;
    name: string;
    city: string;
    address: string | null;
    total_seats: number;
  };
}

export const useShowtimes = (movieId: string) => {
  return useQuery({
    queryKey: ['showtimes', movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('showtimes')
        .select(`
          *,
          theater:theaters(id, name, city, address, total_seats)
        `)
        .eq('movie_id', movieId)
        .eq('is_available', true)
        .gte('show_date', new Date().toISOString().split('T')[0])
        .order('show_date', { ascending: true })
        .order('show_time', { ascending: true });
      
      if (error) throw error;
      return data as Showtime[];
    },
    enabled: !!movieId,
  });
};

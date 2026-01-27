import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  duration_minutes: number;
  release_date: string | null;
  genre: string[];
  language: string;
  rating: number | null;
  votes_count: number | null;
  certificate: string | null;
  is_featured: boolean | null;
  is_now_showing: boolean | null;
  is_coming_soon: boolean | null;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useNowShowingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_now_showing', true)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useComingSoonMovies = () => {
  return useQuery({
    queryKey: ['movies', 'coming-soon'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_coming_soon', true)
        .order('release_date', { ascending: true });
      
      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useFeaturedMovie = () => {
  return useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_featured', true)
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as Movie | null;
    },
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movies', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Movie | null;
    },
    enabled: !!id,
  });
};

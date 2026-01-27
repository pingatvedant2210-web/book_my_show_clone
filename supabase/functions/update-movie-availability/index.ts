import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting movie availability update...');

    // Get current date
    const today = new Date().toISOString().split('T')[0];

    // Mark past showtimes as unavailable
    const { data: pastShowtimes, error: updateError } = await supabase
      .from('showtimes')
      .update({ is_available: false })
      .lt('show_date', today)
      .eq('is_available', true)
      .select();

    if (updateError) {
      console.error('Error updating past showtimes:', updateError);
      throw updateError;
    }

    console.log(`Marked ${pastShowtimes?.length || 0} past showtimes as unavailable`);

    // Mark showtimes with no available seats as unavailable
    const { data: soldOutShowtimes, error: soldOutError } = await supabase
      .from('showtimes')
      .update({ is_available: false })
      .lte('available_seats', 0)
      .eq('is_available', true)
      .select();

    if (soldOutError) {
      console.error('Error updating sold out showtimes:', soldOutError);
      throw soldOutError;
    }

    console.log(`Marked ${soldOutShowtimes?.length || 0} sold out showtimes as unavailable`);

    // Update movies that have no future showtimes to not be "now showing"
    const { data: moviesWithShowtimes } = await supabase
      .from('showtimes')
      .select('movie_id')
      .gte('show_date', today)
      .eq('is_available', true);

    const movieIdsWithShowtimes = [...new Set(moviesWithShowtimes?.map(s => s.movie_id) || [])];

    if (movieIdsWithShowtimes.length > 0) {
      // Movies with showtimes should be marked as now_showing
      await supabase
        .from('movies')
        .update({ is_now_showing: true, is_coming_soon: false })
        .in('id', movieIdsWithShowtimes);
    }

    const result = {
      success: true,
      updated_past_showtimes: pastShowtimes?.length || 0,
      updated_soldout_showtimes: soldOutShowtimes?.length || 0,
      movies_with_active_showtimes: movieIdsWithShowtimes.length,
      timestamp: new Date().toISOString(),
    };

    console.log('Movie availability update completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in update-movie-availability:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

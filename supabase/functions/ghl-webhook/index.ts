import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GHL_WEBHOOK_URL = Deno.env.get('GHL_WEBHOOK_URL');
    if (!GHL_WEBHOOK_URL) {
      throw new Error('GHL_WEBHOOK_URL is not configured');
    }

    const body = await req.json();
    const { first_name, last_name, phone, email, reservation_date, reservation_time, guests, notes } = body;

    if (!first_name || !last_name || !phone || !email || !reservation_date || !reservation_time || !guests) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name,
        last_name,
        phone,
        email,
        reservation_date,
        reservation_time,
        guests,
        notes: notes || '',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GHL webhook failed [${response.status}]: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GHL webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

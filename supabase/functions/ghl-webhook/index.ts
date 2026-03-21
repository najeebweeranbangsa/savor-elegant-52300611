import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GHL_API_BASE = 'https://services.leadconnectorhq.com';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GHL_API_KEY = Deno.env.get('GHL_API_KEY');
    if (!GHL_API_KEY) throw new Error('GHL_API_KEY is not configured');

    const GHL_LOCATION_ID = Deno.env.get('GHL_LOCATION_ID');
    if (!GHL_LOCATION_ID) throw new Error('GHL_LOCATION_ID is not configured');

    const body = await req.json();
    const { form_type } = body;

    let contactPayload: Record<string, unknown>;

    if (form_type === 'reservation') {
      const { first_name, last_name, phone, email, reservation_date, reservation_time, guests, notes } = body;
      if (!first_name || !last_name || !phone || !email || !reservation_date || !reservation_time || !guests) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      contactPayload = {
        locationId: GHL_LOCATION_ID,
        firstName: first_name,
        lastName: last_name,
        phone, email,
        tags: ['website-reservation'],
        source: '404 Sports Bar Website',
        customFields: [
          { key: 'reservation_date', field_value: reservation_date },
          { key: 'reservation_time', field_value: reservation_time },
          { key: 'guests', field_value: String(guests) },
          { key: 'notes', field_value: notes || '' },
        ],
      };
    } else if (form_type === 'catering') {
      const { full_name, phone, email, event_type, event_date, guests, details } = body;
      if (!full_name || !phone || !email || !event_type || !event_date || !guests) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const [firstName, ...rest] = full_name.split(' ');
      const lastName = rest.join(' ') || '';
      contactPayload = {
        locationId: GHL_LOCATION_ID,
        firstName, lastName,
        phone, email,
        tags: ['website-catering'],
        source: '404 Sports Bar Website',
        customFields: [
          { key: 'event_type', field_value: event_type },
          { key: 'event_date', field_value: event_date },
          { key: 'guests', field_value: String(guests) },
          { key: 'notes', field_value: details || '' },
        ],
      };
    } else if (form_type === 'careers') {
      const { full_name, phone, email, position, experience } = body;
      if (!full_name || !phone || !email || !position) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const [firstName, ...rest] = full_name.split(' ');
      const lastName = rest.join(' ') || '';
      contactPayload = {
        locationId: GHL_LOCATION_ID,
        firstName, lastName,
        phone, email,
        tags: ['website-careers'],
        source: '404 Sports Bar Website',
        customFields: [
          { key: 'position', field_value: position },
          { key: 'experience', field_value: experience || '' },
        ],
      };
    } else {
      return new Response(JSON.stringify({ error: 'Invalid form_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log('Sending to GHL Contacts API:', JSON.stringify(contactPayload));

    const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28',
      },
      body: JSON.stringify(contactPayload),
    });

    const responseText = await response.text();
    console.log(`GHL API response [${response.status}]:`, responseText);

    if (!response.ok) {
      throw new Error(`GHL API failed [${response.status}]: ${responseText}`);
    }

    return new Response(
      JSON.stringify({ success: true, ghl_response: JSON.parse(responseText) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GHL API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

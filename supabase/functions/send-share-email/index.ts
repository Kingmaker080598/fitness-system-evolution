import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

interface EmailPayload {
  recipientEmail: string;
  shareCode: string;
  expiresAt: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { recipientEmail, shareCode, expiresAt } = await req.json() as EmailPayload;

    // Get the share data
    const { data: shareData } = await supabaseClient
      .from('shared_health_data')
      .select('sender_name')
      .eq('share_code', shareCode)
      .single();

    const senderName = shareData?.sender_name || 'Someone';
    const expiryDate = new Date(expiresAt).toLocaleDateString();

    // For now, just return success without actually sending email
    // In production, you would integrate with an email service here
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Email would be sent from ${senderName} to ${recipientEmail} with share code ${shareCode} (expires ${expiryDate})`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

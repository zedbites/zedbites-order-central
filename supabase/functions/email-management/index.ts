import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Use regular supabase client (no auth required)

    switch (method) {
      case 'GET': {
        if (path === 'recipients') {
          // Get all email recipients
          const { data, error } = await supabase
            .from('email_settings')
            .select('*')
            .order('email_type', { ascending: true })
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(
            JSON.stringify(data),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        if (path === 'logs') {
          // Get email logs
          const limit = url.searchParams.get('limit') || '50';
          const { data, error } = await supabase
            .from('email_logs')
            .select('*')
            .order('sent_at', { ascending: false })
            .limit(parseInt(limit));

          if (error) throw error;

          return new Response(
            JSON.stringify(data),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        break;
      }

      case 'POST': {
        if (path === 'recipients') {
          // Add new email recipient
          let body;
          try {
            const requestText = await req.text();
            if (!requestText) {
              throw new Error('Request body is empty');
            }
            body = JSON.parse(requestText);
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return new Response(
              JSON.stringify({ error: 'Invalid JSON in request body' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const { email_type, recipient_email, recipient_name } = body;

          if (!email_type || !recipient_email) {
            return new Response(
              JSON.stringify({ error: 'email_type and recipient_email are required' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          // Check if recipient already exists for this email type
          const { data: existing } = await supabase
            .from('email_settings')
            .select('id')
            .eq('email_type', email_type)
            .eq('recipient_email', recipient_email)
            .single();

          if (existing) {
            return new Response(
              JSON.stringify({ error: 'This email is already configured for this email type' }),
              { 
                status: 409, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const { data, error } = await supabase
            .from('email_settings')
            .insert({
              email_type,
              recipient_email,
              recipient_name
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(
            JSON.stringify(data),
            { 
              status: 201, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        if (path === 'test-daily') {
          // Test daily email manually
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/daily-data-capture`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test: true, manual: true }),
          });

          const result = await response.json();
          return new Response(
            JSON.stringify(result),
            { 
              status: response.status, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        if (path === 'test-weekly') {
          // Test weekly email manually
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/weekly-business-report`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test: true, manual: true }),
          });

          const result = await response.json();
          return new Response(
            JSON.stringify(result),
            { 
              status: response.status, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        break;
      }

      case 'PUT': {
        if (path === 'recipients') {
          // Update email recipient
          let body;
          try {
            const requestText = await req.text();
            if (!requestText) {
              throw new Error('Request body is empty');
            }
            body = JSON.parse(requestText);
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return new Response(
              JSON.stringify({ error: 'Invalid JSON in request body' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const { id, ...updates } = body;

          if (!id) {
            return new Response(
              JSON.stringify({ error: 'ID is required for update' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const { data, error } = await supabase
            .from('email_settings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          return new Response(
            JSON.stringify(data),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        break;
      }

      case 'DELETE': {
        if (path === 'recipients') {
          // Delete email recipient
          let body;
          try {
            const requestText = await req.text();
            if (!requestText) {
              throw new Error('Request body is empty');
            }
            body = JSON.parse(requestText);
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return new Response(
              JSON.stringify({ error: 'Invalid JSON in request body' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const { id } = body;

          if (!id) {
            return new Response(
              JSON.stringify({ error: 'ID is required for deletion' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const { error } = await supabase
            .from('email_settings')
            .delete()
            .eq('id', id);

          if (error) throw error;

          return new Response(
            JSON.stringify({ message: 'Recipient deleted successfully' }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in email-management function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
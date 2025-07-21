import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DailyDataCapture {
  total_orders: number;
  total_revenue: number;
  inventory_alerts: number;
  active_recipes: number;
  date: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if this is a scheduled call (from cron) or requires admin access
  let requestBody = {};
  try {
    const bodyText = await req.text();
    if (bodyText) {
      requestBody = JSON.parse(bodyText);
    }
  } catch (e) {
    // Ignore JSON parse errors for empty bodies
  }

  const isScheduled = (requestBody as any)?.scheduled === true;
  const isManual = (requestBody as any)?.manual === true;
  
  if (!isScheduled && !isManual) {
    // This shouldn't happen with our current setup, but handle gracefully
    console.log('Daily email triggered without scheduled or manual flag');
  }

  try {
    console.log('Daily data capture email job started');

    // Get active recipients for daily data emails
    const { data: recipients, error: recipientsError } = await supabase
      .from('email_settings')
      .select('recipient_email, recipient_name')
      .eq('email_type', 'daily_data')
      .eq('is_active', true);

    if (recipientsError) {
      console.error('Error fetching recipients:', recipientsError);
      throw recipientsError;
    }

    if (!recipients || recipients.length === 0) {
      console.log('No active recipients found for daily data emails');
      return new Response(
        JSON.stringify({ message: 'No active recipients found' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simulate data capture (in a real app, you'd query your actual data)
    const today = new Date().toISOString().split('T')[0];
    const dailyData: DailyDataCapture = {
      total_orders: Math.floor(Math.random() * 50) + 20, // 20-70 orders
      total_revenue: Math.floor(Math.random() * 5000) + 1000, // $1000-6000
      inventory_alerts: Math.floor(Math.random() * 5), // 0-5 alerts
      active_recipes: Math.floor(Math.random() * 20) + 30, // 30-50 recipes
      date: today
    };

    console.log('Daily data captured:', dailyData);

    // Send emails to all recipients
    const emailPromises = recipients.map(async (recipient) => {
      try {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">ZedBites Daily Report</h1>
              <p style="color: #fef3c7; margin: 5px 0 0 0;">${today}</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Daily Operations Summary</h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                  <h3 style="color: #374151; margin: 0 0 10px 0;">Total Orders</h3>
                  <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">${dailyData.total_orders}</p>
                </div>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                  <h3 style="color: #374151; margin: 0 0 10px 0;">Revenue</h3>
                  <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">$${dailyData.total_revenue.toLocaleString()}</p>
                </div>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                  <h3 style="color: #374151; margin: 0 0 10px 0;">Inventory Alerts</h3>
                  <p style="font-size: 24px; font-weight: bold; color: ${dailyData.inventory_alerts > 0 ? '#dc2626' : '#059669'}; margin: 0;">${dailyData.inventory_alerts}</p>
                </div>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                  <h3 style="color: #374151; margin: 0 0 10px 0;">Active Recipes</h3>
                  <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">${dailyData.active_recipes}</p>
                </div>
              </div>
              
              ${dailyData.inventory_alerts > 0 ? `
                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ Inventory Alerts</h4>
                  <p style="color: #7f1d1d; margin: 0;">You have ${dailyData.inventory_alerts} inventory item(s) that need attention. Please check your inventory management system.</p>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">This is an automated daily report from ZedBites Order Central</p>
              </div>
            </div>
          </div>
        `;

        const emailResponse = await resend.emails.send({
          from: 'ZedBites Reports <zedbites@gmail.com>',
          to: [recipient.recipient_email],
          subject: `ZedBites Daily Report - ${today}`,
          html: emailContent,
        });

        console.log(`Email sent successfully to ${recipient.recipient_email}:`, emailResponse);

        // Log successful email
        await supabase.from('email_logs').insert({
          email_type: 'daily_data',
          recipient_email: recipient.recipient_email,
          subject: `ZedBites Daily Report - ${today}`,
          status: 'success',
          data_snapshot: dailyData
        });

        return { success: true, email: recipient.recipient_email };
      } catch (error) {
        console.error(`Failed to send email to ${recipient.recipient_email}:`, error);

        // Log failed email
        await supabase.from('email_logs').insert({
          email_type: 'daily_data',
          recipient_email: recipient.recipient_email,
          subject: `ZedBites Daily Report - ${today}`,
          status: 'failed',
          error_message: error.message,
          data_snapshot: dailyData
        });

        return { success: false, email: recipient.recipient_email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Daily email job completed: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        message: 'Daily data capture emails processed',
        successful,
        failed,
        data: dailyData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in daily-data-capture function:', error);
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
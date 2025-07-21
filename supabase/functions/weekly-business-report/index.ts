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

interface WeeklyBusinessReport {
  week_start: string;
  week_end: string;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  top_selling_items: string[];
  inventory_turnover: number;
  revenue_growth: number;
  order_growth: number;
  customer_satisfaction: number;
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
    console.log('Weekly report triggered without scheduled or manual flag');
  }

  try {
    console.log('Weekly business report job started');

    // Get active recipients for weekly reports
    const { data: recipients, error: recipientsError } = await supabase
      .from('email_settings')
      .select('recipient_email, recipient_name')
      .eq('email_type', 'weekly_report')
      .eq('is_active', true);

    if (recipientsError) {
      console.error('Error fetching recipients:', recipientsError);
      throw recipientsError;
    }

    if (!recipients || recipients.length === 0) {
      console.log('No active recipients found for weekly reports');
      return new Response(
        JSON.stringify({ message: 'No active recipients found' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calculate week dates (previous week)
    const today = new Date();
    const lastSaturday = new Date(today);
    lastSaturday.setDate(today.getDate() - (today.getDay() + 1) % 7);
    const weekStart = new Date(lastSaturday);
    weekStart.setDate(lastSaturday.getDate() - 6);

    // Simulate weekly business data (in a real app, you'd query your actual data)
    const weeklyData: WeeklyBusinessReport = {
      week_start: weekStart.toISOString().split('T')[0],
      week_end: lastSaturday.toISOString().split('T')[0],
      total_orders: Math.floor(Math.random() * 200) + 150, // 150-350 orders
      total_revenue: Math.floor(Math.random() * 25000) + 15000, // $15k-40k
      average_order_value: 0, // Will calculate below
      top_selling_items: ['Burger Special', 'Fish & Chips', 'Caesar Salad', 'Pasta Carbonara', 'Chicken Wings'],
      inventory_turnover: Math.floor(Math.random() * 30) + 70, // 70-100%
      revenue_growth: (Math.random() * 20 - 5), // -5% to +15%
      order_growth: (Math.random() * 25 - 5), // -5% to +20%
      customer_satisfaction: Math.floor(Math.random() * 20) + 80 // 80-100%
    };

    weeklyData.average_order_value = Math.round(weeklyData.total_revenue / weeklyData.total_orders);

    console.log('Weekly business data generated:', weeklyData);

    // Send emails to all recipients
    const emailPromises = recipients.map(async (recipient) => {
      try {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">ZedBites Weekly Business Report</h1>
              <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">
                Week of ${weeklyData.week_start} to ${weeklyData.week_end}
              </p>
            </div>
            
            <div style="padding: 40px; background: #ffffff;">
              <!-- Key Metrics -->
              <h2 style="color: #1f2937; margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                📊 Key Performance Metrics
              </h2>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 40px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #059669;">
                  <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Total Orders</h3>
                  <p style="font-size: 28px; font-weight: bold; color: #059669; margin: 0;">${weeklyData.total_orders}</p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #0ea5e9;">
                  <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Total Revenue</h3>
                  <p style="font-size: 28px; font-weight: bold; color: #0ea5e9; margin: 0;">$${weeklyData.total_revenue.toLocaleString()}</p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #8b5cf6;">
                  <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Avg Order Value</h3>
                  <p style="font-size: 28px; font-weight: bold; color: #8b5cf6; margin: 0;">$${weeklyData.average_order_value}</p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #f59e0b;">
                  <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Customer Satisfaction</h3>
                  <p style="font-size: 28px; font-weight: bold; color: #f59e0b; margin: 0;">${weeklyData.customer_satisfaction}%</p>
                </div>
              </div>

              <!-- Growth Analysis -->
              <h2 style="color: #1f2937; margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                📈 Growth Analysis
              </h2>
              
              <div style="background: #f9fafb; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                  <div>
                    <h4 style="color: #374151; margin: 0 0 15px 0;">Revenue Growth (vs last week)</h4>
                    <p style="font-size: 24px; font-weight: bold; color: ${weeklyData.revenue_growth >= 0 ? '#059669' : '#dc2626'}; margin: 0;">
                      ${weeklyData.revenue_growth >= 0 ? '+' : ''}${weeklyData.revenue_growth.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <h4 style="color: #374151; margin: 0 0 15px 0;">Order Growth (vs last week)</h4>
                    <p style="font-size: 24px; font-weight: bold; color: ${weeklyData.order_growth >= 0 ? '#059669' : '#dc2626'}; margin: 0;">
                      ${weeklyData.order_growth >= 0 ? '+' : ''}${weeklyData.order_growth.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <!-- Top Performers -->
              <h2 style="color: #1f2937; margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                🏆 Top Selling Items
              </h2>
              
              <div style="background: #f9fafb; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                <ol style="margin: 0; padding: 0; list-style: none;">
                  ${weeklyData.top_selling_items.map((item, index) => `
                    <li style="display: flex; align-items: center; padding: 10px 0; border-bottom: ${index < weeklyData.top_selling_items.length - 1 ? '1px solid #e5e7eb' : 'none'};">
                      <span style="background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px;">
                        ${index + 1}
                      </span>
                      <span style="color: #374151; font-weight: 500;">${item}</span>
                    </li>
                  `).join('')}
                </ol>
              </div>

              <!-- Operational Metrics -->
              <h2 style="color: #1f2937; margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                ⚙️ Operational Metrics
              </h2>
              
              <div style="background: #f9fafb; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                  <div>
                    <h4 style="color: #374151; margin: 0 0 15px 0;">Inventory Turnover</h4>
                    <p style="font-size: 20px; font-weight: bold; color: #059669; margin: 0;">${weeklyData.inventory_turnover}%</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
                      ${weeklyData.inventory_turnover >= 85 ? 'Excellent performance' : weeklyData.inventory_turnover >= 70 ? 'Good performance' : 'Needs attention'}
                    </p>
                  </div>
                  <div>
                    <h4 style="color: #374151; margin: 0 0 15px 0;">Weekly Avg Daily Orders</h4>
                    <p style="font-size: 20px; font-weight: bold; color: #0ea5e9; margin: 0;">${Math.round(weeklyData.total_orders / 7)}</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Orders per day</p>
                  </div>
                </div>
              </div>

              <!-- Action Items -->
              ${weeklyData.revenue_growth < 0 || weeklyData.order_growth < 0 || weeklyData.inventory_turnover < 70 ? `
                <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                  <h3 style="color: #92400e; margin: 0 0 15px 0;">⚠️ Areas Requiring Attention</h3>
                  <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                    ${weeklyData.revenue_growth < 0 ? '<li>Revenue declined this week - consider promotional strategies</li>' : ''}
                    ${weeklyData.order_growth < 0 ? '<li>Order volume decreased - review marketing efforts</li>' : ''}
                    ${weeklyData.inventory_turnover < 70 ? '<li>Low inventory turnover - optimize stock levels</li>' : ''}
                  </ul>
                </div>
              ` : `
                <div style="background: #d1fae5; border: 1px solid #34d399; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                  <h3 style="color: #065f46; margin: 0 0 10px 0;">✅ Excellent Performance</h3>
                  <p style="color: #065f46; margin: 0;">All key metrics are performing well this week. Keep up the great work!</p>
                </div>
              `}
              
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  This automated weekly report is generated every Saturday at midnight
                </p>
                <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
                  ZedBites Order Central - Restaurant Management System
                </p>
              </div>
            </div>
          </div>
        `;

        const emailResponse = await resend.emails.send({
          from: 'ZedBites Reports <zedbites@gmail.com>',
          to: [recipient.recipient_email],
          subject: `ZedBites Weekly Business Report - Week of ${weeklyData.week_start}`,
          html: emailContent,
        });

        console.log(`Weekly report sent successfully to ${recipient.recipient_email}:`, emailResponse);

        // Log successful email
        await supabase.from('email_logs').insert({
          email_type: 'weekly_report',
          recipient_email: recipient.recipient_email,
          subject: `ZedBites Weekly Business Report - Week of ${weeklyData.week_start}`,
          status: 'success',
          data_snapshot: weeklyData
        });

        return { success: true, email: recipient.recipient_email };
      } catch (error) {
        console.error(`Failed to send weekly report to ${recipient.recipient_email}:`, error);

        // Log failed email
        await supabase.from('email_logs').insert({
          email_type: 'weekly_report',
          recipient_email: recipient.recipient_email,
          subject: `ZedBites Weekly Business Report - Week of ${weeklyData.week_start}`,
          status: 'failed',
          error_message: error.message,
          data_snapshot: weeklyData
        });

        return { success: false, email: recipient.recipient_email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Weekly report job completed: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        message: 'Weekly business reports processed',
        successful,
        failed,
        data: weeklyData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in weekly-business-report function:', error);
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
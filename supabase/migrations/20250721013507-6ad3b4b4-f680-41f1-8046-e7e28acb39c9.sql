-- Schedule daily data capture emails to run every day at 00:00 UTC
SELECT cron.schedule(
  'daily-data-capture-emails',
  '0 0 * * *', -- Every day at midnight UTC
  $$
  SELECT
    net.http_post(
        url:='https://qoljdvksctxlkpofkljw.supabase.co/functions/v1/daily-data-capture',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGpkdmtzY3R4bGtwb2ZrbGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDUyMDYsImV4cCI6MjA2ODQyMTIwNn0.vuwo8MgjfwzlF8XyIwwHNvj62a-luB2IVNS_OYcktEc"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Schedule weekly business reports to run every Saturday at 00:00 UTC
SELECT cron.schedule(
  'weekly-business-reports',
  '0 0 * * 6', -- Every Saturday at midnight UTC (6 = Saturday)
  $$
  SELECT
    net.http_post(
        url:='https://qoljdvksctxlkpofkljw.supabase.co/functions/v1/weekly-business-report',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGpkdmtzY3R4bGtwb2ZrbGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDUyMDYsImV4cCI6MjA2ODQyMTIwNn0.vuwo8MgjfwzlF8XyIwwHNvj62a-luB2IVNS_OYcktEc"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);
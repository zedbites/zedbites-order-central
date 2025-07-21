-- Update cron jobs to use service role key for authentication
-- First, unschedule the existing cron jobs
SELECT cron.unschedule('daily-data-capture-emails');
SELECT cron.unschedule('weekly-business-reports');

-- Reschedule with service role authentication
SELECT cron.schedule(
  'daily-data-capture-emails',
  '0 0 * * *', -- Every day at midnight UTC
  $$
  SELECT
    net.http_post(
        url:='https://qoljdvksctxlkpofkljw.supabase.co/functions/v1/daily-data-capture',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGpkdmtzY3R4bGtwb2ZrbGp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg0NTIwNiwiZXhwIjoyMDY4NDIxMjA2fQ.A1VXV1WVhgTGqFJbOjdJqb6oJLNH_u8Xzm-gO6N6ggg"}'::jsonb,
        body:='{"scheduled": true, "source": "cron"}'::jsonb
    ) as request_id;
  $$
);

SELECT cron.schedule(
  'weekly-business-reports',
  '0 0 * * 6', -- Every Saturday at midnight UTC
  $$
  SELECT
    net.http_post(
        url:='https://qoljdvksctxlkpofkljw.supabase.co/functions/v1/weekly-business-report',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGpkdmtzY3R4bGtwb2ZrbGp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg0NTIwNiwiZXhwIjoyMDY4NDIxMjA2fQ.A1VXV1WVhgTGqFJbOjdJqb6oJLNH_u8Xzm-gO6N6ggg"}'::jsonb,
        body:='{"scheduled": true, "source": "cron"}'::jsonb
    ) as request_id;
  $$
);
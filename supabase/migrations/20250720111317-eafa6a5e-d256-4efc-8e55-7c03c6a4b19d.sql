-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-images', 'meal-images', true);

-- Create policies for meal images bucket
CREATE POLICY "Anyone can view meal images"
ON storage.objects FOR SELECT
USING (bucket_id = 'meal-images');

CREATE POLICY "Anyone can upload meal images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'meal-images');

CREATE POLICY "Anyone can update meal images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'meal-images');

CREATE POLICY "Anyone can delete meal images"
ON storage.objects FOR DELETE
USING (bucket_id = 'meal-images');
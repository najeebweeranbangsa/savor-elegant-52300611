-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Allow anyone to upload to resumes bucket
CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'resumes');

-- Allow anyone to read resumes
CREATE POLICY "Anyone can read resumes" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'resumes');

-- Add resume_url column to career_applications
ALTER TABLE public.career_applications ADD COLUMN resume_url text;
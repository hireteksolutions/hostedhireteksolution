-- Create storage bucket for resumes
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false);

-- RLS policies for resumes bucket
create policy "Anyone can upload resumes"
on storage.objects for insert
with check (bucket_id = 'resumes');

create policy "Users can view their own resumes"
on storage.objects for select
using (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "Employers can view resumes for their job applications"
on storage.objects for select
using (
  bucket_id = 'resumes' AND
  exists (
    select 1 from applications a
    inner join jobs j on j.id = a.job_id
    where j.employer_id = auth.uid()
    and storage.filename(name) = a.resume_url
  )
);
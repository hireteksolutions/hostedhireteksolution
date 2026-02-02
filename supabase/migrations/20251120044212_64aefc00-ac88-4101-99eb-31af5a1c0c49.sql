-- Create a trigger function to automatically assign user roles on signup
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert the role from user metadata into user_roles table
  insert into public.user_roles (user_id, role)
  values (
    new.id,
    coalesce(
      (new.raw_user_meta_data->>'role')::app_role,
      'job_seeker'::app_role
    )
  );
  return new;
end;
$$;

-- Create trigger to run the function after user creation
drop trigger if exists on_auth_user_created_role on auth.users;
create trigger on_auth_user_created_role
  after insert on auth.users
  for each row execute function public.handle_new_user_role();
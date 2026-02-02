-- Drop and recreate the trigger function to handle existing roles gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only insert if the role doesn't already exist for this user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::public.app_role,
      'job_seeker'::public.app_role
    )
  )
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Get job applications with security enhancement
CREATE OR REPLACE FUNCTION public.get_job_applications(job_id_param uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  job_owner_id uuid;
  result jsonb;
BEGIN
  -- Get authenticated user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 403, 'error', 'Authentication required');
  END IF;
  
  -- Verify job ownership
  SELECT client_id INTO job_owner_id FROM public.jobs WHERE id = job_id_param;
  IF job_owner_id IS NULL THEN
    RETURN jsonb_build_object('status', 404, 'error', 'Job not found');
  END IF;
  
  -- Check if user is job owner
  IF current_user_id <> job_owner_id THEN
    RETURN jsonb_build_object('status', 403, 'error', 'Unauthorized access');
  END IF;
  
  -- Get applications if authorized
  SELECT jsonb_build_object(
    'status', 200,
    'data', COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', ja.id,
        'craftsman_id', ja.craftsman_id,
        'job_id', ja.job_id,
        'proposal', ja.proposal,
        'budget', ja.budget,
        'status', ja.status,
        'submitted_at', ja.submitted_at,
        'craftsman_name', p.full_name,
        'craftsman_avatar', p.avatar_url,
        'craftsman_specialty', cd.specialty,
        'craftsman_rating', p.rating
      )
    ), '[]'::jsonb)
  ) INTO result
  FROM job_applications ja
  JOIN profiles p ON ja.craftsman_id = p.id
  LEFT JOIN craftsman_details cd ON ja.craftsman_id = cd.id
  WHERE ja.job_id = job_id_param
  ORDER BY 
    CASE 
      WHEN ja.status = 'accepted' THEN 1
      WHEN ja.status = 'pending' THEN 2
      ELSE 3
    END,
    ja.submitted_at DESC;
  
  RETURN result;
END;
$function$;

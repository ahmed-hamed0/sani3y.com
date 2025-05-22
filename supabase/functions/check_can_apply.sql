
-- Check if craftsman can apply to jobs
CREATE OR REPLACE FUNCTION public.check_can_apply(p_craftsman_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  free_applications_limit CONSTANT integer := 5;
  free_applications_used integer;
  is_premium boolean;
  result jsonb;
BEGIN
  -- Verify user permissions
  IF auth.uid() IS NULL OR auth.uid() <> p_craftsman_id THEN
    RETURN jsonb_build_object('error', 'Unauthorized access', 'status', 403);
  END IF;
  
  -- Check if user is premium
  SELECT EXISTS (
    SELECT 1 FROM users_subscriptions 
    WHERE user_id = p_craftsman_id 
    AND status = 'active'
    AND expires_at > NOW()
  ) INTO is_premium;
  
  -- Get used applications count if not premium
  IF NOT is_premium THEN
    SELECT COALESCE(uac.free_applications_used, 0)
    INTO free_applications_used
    FROM user_applications_count uac
    WHERE uac.user_id = p_craftsman_id;
    
    IF free_applications_used IS NULL THEN
      free_applications_used := 0;
    END IF;
  ELSE
    free_applications_used := 0;
  END IF;
  
  -- Return result
  SELECT jsonb_build_object(
    'status', 200,
    'data', jsonb_build_object(
      'can_apply', is_premium OR free_applications_used < free_applications_limit,
      'is_premium', is_premium,
      'free_applications_used', free_applications_used,
      'free_applications_limit', free_applications_limit
    )
  ) INTO result;
  
  RETURN result;
END;
$function$;

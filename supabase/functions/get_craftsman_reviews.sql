
-- Get craftsman reviews with security enhancement
CREATE OR REPLACE FUNCTION public.get_craftsman_reviews(p_craftsman_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result jsonb;
BEGIN
  -- Get reviews if authorized
  SELECT jsonb_build_object(
    'status', 200,
    'data', COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', r.id,
        'reviewer_id', r.reviewer_id,
        'reviewed_id', r.reviewed_id,
        'rating', r.rating,
        'comment', r.comment,
        'created_at', r.created_at,
        'is_public', r.is_public,
        'reviewer', jsonb_build_object(
          'name', p.full_name,
          'avatar', p.avatar_url
        )
      )
    ), '[]'::jsonb)
  ) INTO result
  FROM reviews r
  LEFT JOIN profiles p ON r.reviewer_id = p.id
  WHERE r.reviewed_id = p_craftsman_id
  AND r.is_public = true
  ORDER BY r.created_at DESC;
  
  RETURN result;
END;
$function$;

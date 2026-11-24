-- Pin the SECURITY DEFINER stats function search_path to trusted schemas.
-- This changes no data and preserves the function's existing grants and output.
CREATE OR REPLACE FUNCTION public.carteirinhas_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, public
AS $function$
  WITH base AS (
    SELECT nivel, emitida_em
      FROM public.associadas
     WHERE ativo
       AND numero !~* '(test|sonda|^0{5,})'
  )
  SELECT json_build_object(
    'total_ativas',
    (SELECT COUNT(*) FROM base),
    'por_nivel',
    COALESCE(
      (
        SELECT json_object_agg(
          COALESCE(NULLIF(TRIM(nivel), ''), '(nao informado)'),
          c
        )
        FROM (
          SELECT nivel, COUNT(*) AS c
            FROM base
           GROUP BY nivel
        ) AS s
      ),
      '{}'::json
    ),
    'por_mes',
    COALESCE(
      (
        SELECT json_object_agg(mes, c)
          FROM (
            SELECT to_char(emitida_em, 'YYYY-MM') AS mes, COUNT(*) AS c
              FROM base
             GROUP BY 1
          ) AS m
      ),
      '{}'::json
    ),
    'atualizado_em',
    now()
  );
$function$;

INSERT INTO public.notifications(email, "createdAt", "updatedAt", "notificationType", status, "userFk", "noOfRetry", content)
SELECT email,
       now() AS "createdAt",
       now() AS "updatedAt",
       'TRAIL-END' AS "notificationType",
       'NEW' AS status,
       id,
       3 AS "noOfRetry",
       jsonb_build_object('username', username, 'id', id, 'trialend', trialend) AS content
FROM public.users
WHERE trialEnd BETWEEN (now()) AND (now() + INTERVAL '7' DAY);

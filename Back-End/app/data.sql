INSERT INTO roles ("id","name","createdAt","updatedAt") VALUES(1,'Admin','2021-06-04 10:48:30.297+05:30','2021-06-04 10:48:30.297+05:30'); 
INSERT INTO menus (id,label,action,menu_fk,"roleId", "createdAt" ,"updatedAt") VALUES(1,'Home', '/template', 1, 1, '2021-06-04 10:48:30.297+05:30','2021-06-04 10:48:30.297+05:30');
INSERT INTO menus (id,label,action,menu_fk,"roleId", "createdAt" ,"updatedAt") VALUES(2,'Staff', '/staff', 1, 1, '2021-06-04 10:48:30.297+05:30','2021-06-04 10:48:30.297+05:30');
ALTER TABLE notifications ADD  noOfReminders integer  DEFAULT 0
ALTER TABLE public.users ADD COLUMN trialEnd Date;
INSERT INTO public.notifications(email, "createdAt", "updatedAt", "notificationType", status, "userFk", "noOfRetry", content)
/*insert select query */
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
ALTER TABLE public.users ADD COLUMN LoginDate Date;
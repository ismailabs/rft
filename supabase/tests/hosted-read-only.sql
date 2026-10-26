-- Prelaunch READ-ONLY probe using existing genuine Google identities/session rows.
-- SET request claims simulates database context; it is NOT signed-JWT/REST proof.
-- No credentials, financial values or identifiers are returned. No rows are written.
-- Run hosted only after the owner designates BOTH existing identities for testing.
begin read only;
set local statement_timeout = '15s';
do $$
begin
  if (select count(*) from auth.users u where exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google') and exists(select 1 from auth.mfa_factors f where f.user_id=u.id and f.status='verified') and exists(select 1 from auth.sessions s where s.user_id=u.id and (s.not_after is null or s.not_after>now()))) <> 2 then
    raise exception 'RFT_PROBE_REQUIRES_TWO_GOOGLE_USERS_WITH_VERIFIED_FACTORS_AND_SESSIONS';
  end if;
end $$;

-- A_AAL2
do $$
declare identity_id uuid; session_id uuid;
begin
  select u.id into strict identity_id from auth.users u where exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google') order by u.created_at,u.id offset 0 limit 1;
  select s.id into strict session_id from auth.sessions s where s.user_id=identity_id and (s.not_after is null or s.not_after>now()) order by s.created_at desc limit 1;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',identity_id,'session_id',session_id,'aal','aal2','role','authenticated')::text,true);
end $$;
set local role authenticated;
do $$
declare relation_name text; forbidden_count bigint; visible_count bigint;
begin
  if current_user <> 'authenticated' or current_setting('transaction_read_only') <> 'on' then raise exception 'RFT_PROBE_ROLE_OR_READ_ONLY_MISMATCH'; end if;
  if private.session_allowed() is distinct from true then raise exception 'RFT_PROBE_A_AAL2_ASSURANCE_MISMATCH'; end if;
  foreach relation_name in array array['profiles','accounts','categories','subcategories','transactions','transfers','budgets','goals'] loop
    execute format('select count(*) from public.%I where user_id <> auth.uid()',relation_name) into forbidden_count;
    if forbidden_count <> 0 then raise exception 'RFT_PROBE_A_AAL2_FOREIGN_READ_VISIBLE_%',relation_name; end if;

  end loop;
  if (select count(*) from public.profiles where user_id=auth.uid()) <> 1 then raise exception 'RFT_PROBE_A_MISSING_OWN_PROFILE'; end if;
end $$;
reset role;

-- B_AAL2
do $$
declare identity_id uuid; session_id uuid;
begin
  select u.id into strict identity_id from auth.users u where exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google') order by u.created_at,u.id offset 1 limit 1;
  select s.id into strict session_id from auth.sessions s where s.user_id=identity_id and (s.not_after is null or s.not_after>now()) order by s.created_at desc limit 1;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',identity_id,'session_id',session_id,'aal','aal2','role','authenticated')::text,true);
end $$;
set local role authenticated;
do $$
declare relation_name text; forbidden_count bigint; visible_count bigint;
begin
  if current_user <> 'authenticated' or current_setting('transaction_read_only') <> 'on' then raise exception 'RFT_PROBE_ROLE_OR_READ_ONLY_MISMATCH'; end if;
  if private.session_allowed() is distinct from true then raise exception 'RFT_PROBE_B_AAL2_ASSURANCE_MISMATCH'; end if;
  foreach relation_name in array array['profiles','accounts','categories','subcategories','transactions','transfers','budgets','goals'] loop
    execute format('select count(*) from public.%I where user_id <> auth.uid()',relation_name) into forbidden_count;
    if forbidden_count <> 0 then raise exception 'RFT_PROBE_B_AAL2_FOREIGN_READ_VISIBLE_%',relation_name; end if;

  end loop;

end $$;
reset role;

-- A_AAL1
do $$
declare identity_id uuid; session_id uuid;
begin
  select u.id into strict identity_id from auth.users u where exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google') order by u.created_at,u.id offset 0 limit 1;
  select s.id into strict session_id from auth.sessions s where s.user_id=identity_id and (s.not_after is null or s.not_after>now()) order by s.created_at desc limit 1;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',identity_id,'session_id',session_id,'aal','aal1','role','authenticated')::text,true);
end $$;
set local role authenticated;
do $$
declare relation_name text; forbidden_count bigint; visible_count bigint;
begin
  if current_user <> 'authenticated' or current_setting('transaction_read_only') <> 'on' then raise exception 'RFT_PROBE_ROLE_OR_READ_ONLY_MISMATCH'; end if;
  if private.session_allowed() is distinct from false then raise exception 'RFT_PROBE_A_AAL1_ASSURANCE_MISMATCH'; end if;
  foreach relation_name in array array['profiles','accounts','categories','subcategories','transactions','transfers','budgets','goals'] loop
    execute format('select count(*) from public.%I where user_id <> auth.uid()',relation_name) into forbidden_count;
    if forbidden_count <> 0 then raise exception 'RFT_PROBE_A_AAL1_FOREIGN_READ_VISIBLE_%',relation_name; end if;
    execute format('select count(*) from public.%I',relation_name) into visible_count;
    if visible_count <> 0 then raise exception 'RFT_PROBE_A_AAL1_UNASSURED_READ_VISIBLE_%',relation_name; end if;
  end loop;

end $$;
reset role;

-- B_AAL1
do $$
declare identity_id uuid; session_id uuid;
begin
  select u.id into strict identity_id from auth.users u where exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google') order by u.created_at,u.id offset 1 limit 1;
  select s.id into strict session_id from auth.sessions s where s.user_id=identity_id and (s.not_after is null or s.not_after>now()) order by s.created_at desc limit 1;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',identity_id,'session_id',session_id,'aal','aal1','role','authenticated')::text,true);
end $$;
set local role authenticated;
do $$
declare relation_name text; forbidden_count bigint; visible_count bigint;
begin
  if current_user <> 'authenticated' or current_setting('transaction_read_only') <> 'on' then raise exception 'RFT_PROBE_ROLE_OR_READ_ONLY_MISMATCH'; end if;
  if private.session_allowed() is distinct from false then raise exception 'RFT_PROBE_B_AAL1_ASSURANCE_MISMATCH'; end if;
  foreach relation_name in array array['profiles','accounts','categories','subcategories','transactions','transfers','budgets','goals'] loop
    execute format('select count(*) from public.%I where user_id <> auth.uid()',relation_name) into forbidden_count;
    if forbidden_count <> 0 then raise exception 'RFT_PROBE_B_AAL1_FOREIGN_READ_VISIBLE_%',relation_name; end if;
    execute format('select count(*) from public.%I',relation_name) into visible_count;
    if visible_count <> 0 then raise exception 'RFT_PROBE_B_AAL1_UNASSURED_READ_VISIBLE_%',relation_name; end if;
  end loop;

end $$;
reset role;

-- A_BAD_SESSION
do $$
declare identity_id uuid; session_id uuid;
begin
  select u.id into strict identity_id from auth.users u where exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google') order by u.created_at,u.id offset 0 limit 1;
  select s.id into strict session_id from auth.sessions s where s.user_id=identity_id and (s.not_after is null or s.not_after>now()) order by s.created_at desc limit 1;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',identity_id,'session_id',gen_random_uuid(),'aal','aal2','role','authenticated')::text,true);
end $$;
set local role authenticated;
do $$
declare relation_name text; forbidden_count bigint; visible_count bigint;
begin
  if current_user <> 'authenticated' or current_setting('transaction_read_only') <> 'on' then raise exception 'RFT_PROBE_ROLE_OR_READ_ONLY_MISMATCH'; end if;
  if private.session_allowed() is distinct from false then raise exception 'RFT_PROBE_A_BAD_SESSION_ASSURANCE_MISMATCH'; end if;
  foreach relation_name in array array['profiles','accounts','categories','subcategories','transactions','transfers','budgets','goals'] loop
    execute format('select count(*) from public.%I where user_id <> auth.uid()',relation_name) into forbidden_count;
    if forbidden_count <> 0 then raise exception 'RFT_PROBE_A_BAD_SESSION_FOREIGN_READ_VISIBLE_%',relation_name; end if;
    execute format('select count(*) from public.%I',relation_name) into visible_count;
    if visible_count <> 0 then raise exception 'RFT_PROBE_A_BAD_SESSION_UNASSURED_READ_VISIBLE_%',relation_name; end if;
  end loop;

end $$;
reset role;

rollback;
select jsonb_build_object('status','passed','mode','read-only SQL claim-context simulation, not signed REST JWTs','contexts',5,'relations',8,'persistent_data_changed',false) as verification_receipt;

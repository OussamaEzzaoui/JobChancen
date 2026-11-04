begin;

create or replace function public.consume_werkmatch_usage(
  requested_user uuid,
  requested_operation text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  budget integer;
  claimed integer;
begin
  if auth.uid() is distinct from requested_user
     and coalesce(auth.role(),'') <> 'service_role'
  then
    raise exception 'Forbidden';
  end if;

  budget := case requested_operation
    when 'search' then 20
    when 'generation' then 20
    when 'upload' then 50
    else 0
  end;

  if budget = 0 then
    return false;
  end if;

  insert into public.usage_budgets as b(
    user_id,
    operation,
    day,
    used,
    last_used_at
  )
  values(
    requested_user,
    requested_operation,
    current_date,
    1,
    now()
  )
  on conflict(user_id, operation, day)
  do update
    set used = b.used + 1,
        last_used_at = now()
  where b.used < budget
    and (
      b.operation <> 'search'
      or b.last_used_at < now() - interval '15 minutes'
    )
  returning used into claimed;

  return claimed is not null;
end
$$;

commit;
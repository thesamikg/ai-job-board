alter table public.jobs
  add column if not exists hybrid boolean default false;

alter table public.jobs
  alter column experience_level set default '2+ years';

alter table public.jobs
  alter column category set default 'AI Engineering';

update public.jobs
set category = case
  when category = 'Robotics' then 'Robotics Engineering'
  when category = 'Research' then 'AI Research'
  when category in ('Remote', 'Global') then 'AI Engineering'
  else category
end
where category in ('Robotics', 'Research', 'Remote', 'Global');

update public.jobs
set experience_level = case
  when experience_level in ('0-2', '0-2 yrs', '0-2 years') then 'Entry level (0-2 years)'
  when experience_level in ('2-5', '2-5 yrs', '2-5 years') then '2+ years'
  when experience_level in ('5+', '5+ yrs') then '5+ years'
  else experience_level
end
where experience_level in ('0-2', '0-2 yrs', '0-2 years', '2-5', '2-5 yrs', '2-5 years', '5+', '5+ yrs');

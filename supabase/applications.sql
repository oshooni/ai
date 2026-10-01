-- 수강 신청서 — 표 + 보안 규칙
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run 하면 됨.
-- 여러 번 실행해도 안전하다.
--
-- 쓰는 곳 : noshooni.com/1day (신청 폼)
-- 주의    : noshooni-members 와 같은 Supabase 프로젝트를 쓴다.
--           (kflcxhaazgdhcvpfqqic) 그쪽 supabase/schema.sql 과 한 데이터베이스다.

create table if not exists public.applications (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  course      text        not null default '',   -- 1day | class
  name        text        not null default '',
  phone       text        not null default '',
  email       text        not null default '',
  schedule    text        not null default '',   -- 고른 날짜
  job         text        not null default '',
  ai_level    text        not null default '',
  reason      text        not null default '',
  want        text        not null default '',
  note        text        not null default '',
  consent     boolean     not null default false,
  consent_at  timestamptz
);

-- ─────────────────────────────────────────────
-- RLS — 여기가 제일 중요하다.
-- 켜지 않으면 anon 키를 아는 누구나 신청자 개인정보를 통째로 읽어간다.
-- 켜두고 INSERT 정책만 만들면 "넣을 수는 있고 읽을 수는 없는" 우편함이 된다.
-- 명단은 Supabase 대시보드(service_role)에서만 본다.
-- ─────────────────────────────────────────────
alter table public.applications enable row level security;

drop policy if exists "신청서 제출만 허용" on public.applications;
create policy "신청서 제출만 허용"
  on public.applications for insert
  to anon, authenticated
  with check (consent = true);   -- 동의 안 하면 DB가 거부한다

-- SELECT / UPDATE / DELETE 정책은 일부러 만들지 않는다 = 브라우저에서 불가능.

-- ─────────────────────────────────────────────
-- 확인용 — 실행 후 아래가 전부 제대로 나와야 정상
-- ─────────────────────────────────────────────
select relname as "표 이름", relrowsecurity as "RLS 켜짐(반드시 true)"
from pg_class where relname = 'applications';

select policyname as "정책", cmd as "동작" from pg_policies
where tablename = 'applications';

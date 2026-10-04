-- 신청서가 들어오면 슬랙으로 알려준다.
-- 실제 슬랙 웹훅 주소는 저장소에 올리지 않는다 (아래는 가려둔 값).
-- 진짜 주소가 들어간 버전은 Supabase 안에만 있다 — 바꾸려면 아래 URL만 갈아끼워 다시 Run.

create extension if not exists pg_net;

create or replace function public.notify_slack_on_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://hooks.slack.com/services/XXXX/XXXX/XXXX',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('text',
      '🎉 원데이 클래스 신청이 들어왔어요' || chr(10) || chr(10) ||
      '*' || new.name || '* · ' || new.phone || chr(10) ||
      new.schedule || chr(10) ||
      'AI 경험 · ' || new.ai_level ||
      case when coalesce(new.job, '') <> '' then chr(10) || '직업 · ' || new.job else '' end ||
      case when coalesce(new.reason, '') <> '' then chr(10) || chr(10) || '신청 이유 · ' || new.reason else '' end ||
      case when coalesce(new.want, '') <> '' then chr(10) || '만들고 싶은 것 · ' || new.want else '' end ||
      case when coalesce(new.note, '') <> '' then chr(10) || '요청사항 · ' || new.note else '' end ||
      chr(10) || chr(10) || new.email || chr(10) ||
      '결제 완료 여부는 토스 주문내역에서 확인해주세요.'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_application_created on public.applications;
create trigger on_application_created
  after insert on public.applications
  for each row execute function public.notify_slack_on_application();

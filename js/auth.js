/* ============================================================
   노슈니 회원 — 구글·카카오 로그인
   브라우저가 Supabase 와 직접 주고받는 구조라 서버가 필요 없다.
   그래서 GitHub Pages 에 올라간 이 사이트에서 그대로 동작한다.

   아래 두 값은 공개돼도 되는 값이다. 브라우저가 직접 쓰는 값이라
   어차피 숨길 수 없고, 데이터는 Supabase 의 RLS 규칙이 지킨다.
   sb_secret_ 로 시작하는 키는 여기에 절대 넣지 않는다 — 그건 만능 열쇠다.
   ============================================================ */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://swxntowctoirfditbubx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_5vCDn69XLr6c8qK0StJv3Q_A5MwdIx6";

export const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// 구글·카카오 로그인 창으로 보낸다. 끝나면 /mypage/ 로 돌아온다.
// 이 주소는 Supabase 대시보드의 Redirect URLs 에도 등록돼 있어야 한다.
export function 로그인(제공자) {
  return sb.auth.signInWithOAuth({
    provider: 제공자,
    options: { redirectTo: location.origin + "/mypage/" },
  });
}

export async function 로그아웃() {
  await sb.auth.signOut();
  location.href = "/";
}

// 로그인한 회원. 안 했으면 null.
export async function 현재회원() {
  const { data } = await sb.auth.getUser();
  return data?.user ?? null;
}

// Supabase 가 돌려주는 영어 에러를 사람 말로 바꾼다.
// 못 알아본 건 원문을 그대로 보여준다 — 숨기면 원인을 못 찾는다.
const 에러사전 = [
  [/provider is not enabled|Unsupported provider/i, "이 로그인 수단이 아직 Supabase 에서 켜져 있지 않습니다."],
  [/redirect_uri|redirect to/i, "돌아올 주소가 등록돼 있지 않습니다. Supabase 의 Redirect URLs 를 확인해주세요."],
  [/rate limit|too many/i, "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요."],
  [/Failed to fetch|NetworkError/i, "Supabase 에 연결하지 못했습니다. 잠시 후 다시 시도해주세요."],
];

export function 에러문구(에러) {
  const 원문 = 에러?.message ?? String(에러);
  for (const [패턴, 한글] of 에러사전) if (패턴.test(원문)) return 한글;
  return 원문;
}

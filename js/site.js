/* ============================================================
   노슈니 사이트 공통 스크립트
   ★ GA4 측정 ID를 아래 한 줄만 바꾸면 전체 페이지에 적용됩니다.
      구글 애널리틱스 > 관리 > 데이터 스트림 > 웹 에서 G- 로 시작하는 값
   ============================================================ */
var GA_MEASUREMENT_ID = 'G-37CTEBRVP9';

(function () {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('X') !== -1) return; // 아직 미설정
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  // 외부로 나가는 링크(노션 신청폼 등) 클릭을 전환 이벤트로 기록
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="http"]');
    if (!a) return;
    if (a.hostname === location.hostname) return;
    gtag('event', 'outbound_click', {
      link_domain: a.hostname,
      link_url: a.href,
      link_text: (a.innerText || '').trim().slice(0, 60),
    });
  }, true);
})();

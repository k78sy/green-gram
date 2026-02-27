const INFINITY_SCROLL_GAP = 500;

// 스로틀 함수: delay 시간 동안 한 번만 실행되도록 제어
export const throttle = (fn, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
};
export const bindEvent = (state, window, fn) => {
  // console.log('스크롤 이벤트 (스로틀 적용됨)');
  if (state.isFinish || state.isLoading) return;

  const { scrollTop, scrollHeight, clientHeight } =
    window.document.documentElement;

  // 조건 검사: 바닥에서 500px 이내로 접근했는지 확인
  if (
    window.innerHeight + window.scrollY + INFINITY_SCROLL_GAP >=
    scrollHeight
  ) {
    console.log("데이터 가져오기 실행");
    fn();
  }
};

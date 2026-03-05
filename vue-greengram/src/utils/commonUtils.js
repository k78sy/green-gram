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
  console.log("bindEvent 발생!");
  if (state.isFinish || state.isLoading) return;

  let scrollTop, scrollHeight, clientHeight;

    if (target === window) {
        // Window 스크롤 계산
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
    } else {
        // 특정 Element 스크롤 계산
        scrollTop = target.scrollTop;
        scrollHeight = target.scrollHeight;
        clientHeight = target.clientHeight;
    }
  
  // 조건 검사: 바닥에서 500px 이내로 접근했는지 확인
  if (scrollTop + clientHeight + INFINITY_SCROLL_GAP >= scrollHeight) {        
    fn();
  }
};


export const getCurrentTimestamp = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const getDateTimeInfo = dt => {
    // dt가 없거나 유효하지 않을 경우 처리
    if (!dt) return '방금 전';
    
    const nowDt = new Date();
    const targetDt = new Date(dt);

    // 날짜 변환 실패 시 (Invalid Date) 처리
    if (isNaN(targetDt.getTime())) { return '방금 전'; }

    const nowDtSec = parseInt(nowDt.getTime() / 1000);
    const targetDtSec = parseInt(targetDt.getTime() / 1000);

    const diffSec = nowDtSec - targetDtSec;
    if(diffSec < 120) {
        return '방금 전';
    } else if(diffSec < 3600) { //분 단위 (60 * 60)
        return `${parseInt(diffSec / 60)}분 전`;
    } else if(diffSec < 86400) { //시간 단위 (60 * 60 * 24)
        return `${parseInt(diffSec / 3600)}시간 전`;
    } else if(diffSec < 2592000) { //일 단위 (60 * 60 * 24 * 30)
        return `${parseInt(diffSec / 86400)}일 전`;
    }
    return targetDt.toLocaleString();
} 
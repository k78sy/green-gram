import { ref, onMounted, onUnmounted, isRef, watch, nextTick } from 'vue';
import { throttle } from '@/utils/commonUtils';

export function useInfiniteScroll(target, callback, options = {}) {
    console.log('target: ', target);
    console.log('target === window: ', target === window);
    const { gap = 500, delay = 250 } = options;
    
    const checkScroll = () => {       

        let scrollTop, scrollHeight, clientHeight;
        
        // 대상이 window인지 특정 element인지 판별
        if (target === window) {
            scrollTop = window.scrollY || document.documentElement.scrollTop;
            scrollHeight = document.documentElement.scrollHeight;
            clientHeight = window.innerHeight;
        } else {
            const el = isRef(target) ? target.value : target;
            console.log('isRef(target): ', isRef(target));
            if (!el) return;
            scrollTop = el.scrollTop;
            scrollHeight = el.scrollHeight;
            clientHeight = el.clientHeight;
        }

        if (scrollTop + clientHeight + gap >= scrollHeight) {
            callback();
        } else if (scrollHeight <= clientHeight) { // 스크롤바가 없는 경우에도 콜백 호출 시도
            callback();
        }
    };

    const throttledScroll = throttle(checkScroll, delay);

    // 이벤트 리스너 등록 함수
    const start = () => {
        const el = target === window ? window : (isRef(target) ? target.value : target);
        el?.addEventListener('scroll', throttledScroll);
    };

    // 이벤트 리스너 제거 함수
    const stop = () => {
        const el = target === window ? window : (isRef(target) ? target.value : target);
        el?.removeEventListener('scroll', throttledScroll);
    };

    // 대상이 Ref일 경우 (모달 등), 요소가 나타날 때 리스너를 다시 붙여야 함
    if (isRef(target) && target !== window) {
        watch(target, (newEl, oldEl) => {
            oldEl?.removeEventListener('scroll', throttledScroll);
            newEl?.addEventListener('scroll', throttledScroll);
            // 새로운 엘리먼트가 마운트되면 즉시 스크롤 상태를 확인하여 초기 로딩 처리
            // 이 부분은 setFeedId에서 이미 첫 페이지를 로드하므로 제거
            // if (newEl) {
            //     nextTick(() => {
            //         throttledScroll();
            //     });
            // }
        });
    }

    onMounted(() => {
        if (target === window || (isRef(target) ? target.value : target)) {
            start();
            // 컴포넌트 마운트 시 초기 스크롤 상태 확인
            // 이 부분은 setFeedId에서 이미 첫 페이지를 로드하므로 제거
            // nextTick(() => {
            //     throttledScroll();
            // });
        }
    });

    onUnmounted(() => {
        stop();
    });

    return {        
        start,
        stop,
        check: throttledScroll // 외부에서 강제로 스크롤 상태를 확인하도록 노출
    };
}
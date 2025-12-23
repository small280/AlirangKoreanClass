if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // 자동 스크롤 복원 비활성화
}

// 1. 페이지 설정 정보
const pages = {
    'index': { url: '/contents.html', effect: true }, // 초기 화면
    'navigation': { url: '/navigation/navigation.html', effect: false },
    'page': { url: '/page/page.html', effect: false }
};

// 2. 핵심 로드 함수 (HTML 로드 + 콜백 실행)
async function fetchTo(url, targetId, callback = null) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url} 로드 실패`);
        const html = await res.text();
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = html;
            if (callback) callback();
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadPage(pageKey, addHistory = true) {
    if (!pageKey) return;

    const pureKey = pageKey.toString().split('_')[0]; 
    const page = pages[pureKey];
    if (!page) return;

    await fetchTo(page.url, 'main-contents-area', () => {
        // [추가] 페이지 콘텐츠가 바뀐 직후 스크롤을 최상단(0,0)으로 이동
        window.scrollTo(0, 0); 

        if (page.effect) initSnowEffect();
        else {
            const container = document.querySelector('.snow-container');
            if (container) container.innerHTML = '';
        }

        // 렌더링 대기 후 데이터 로드
        setTimeout(() => {
            if (pureKey === 'page' && typeof initPageContent === 'function') {
                initPageContent();
            }
        }, 50);

        // 히스토리 관리 로직 (기존과 동일)
        const currentData = sessionStorage.getItem('selectedData');
        if (addHistory) {
            history.pushState({ key: pureKey, data: currentData }, '', `#${pureKey}_${Date.now()}`);
        } else {
            history.replaceState({ key: pureKey, data: currentData }, '', window.location.hash);
        }
    });
}

window.addEventListener('popstate', (event) => {
    // 1. 데이터 복구
    if (event.state && event.state.data) {
        sessionStorage.setItem('selectedData', event.state.data);
    }
    
    // 2. [추가] 즉시 스크롤 최상단 이동
    window.scrollTo(0, 0);

    // 3. 페이지 로드
    const targetKey = (event.state && event.state.key) ? event.state.key : 'index';
    loadPage(targetKey, false);
});

// 5. 눈 내리는 효과 (최적화 버전)
function initSnowEffect() {
    const container = document.querySelector('.snow-container');
    if (!container || container.children.length > 0) return;

    for (let i = 0; i < 100; i++) {
        const snowflake = document.createElement('div'); // 반드시 const 또는 let 확인
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
        
        // 에러 지점: 아래 변수명이 위에서 선언한 snowflake와 일치하는지 확인
        snowflake.style.animationName = 'combinedFallSway'; 
        snowflake.style.animationDuration = Math.random() * 10 + 5 + 's';
        snowflake.style.opacity = Math.random();
        container.appendChild(snowflake);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. 공통 레이아웃을 모두 로드할 때까지 기다립니다.
    await Promise.all([
        fetchTo('/header.html', 'header-area'),
        fetchTo('/sidebar.html', 'sidebar-area'),
        fetchTo('/footer.html', 'footer-area') 
    ]);

    // 2. 레이아웃 로드가 끝난 후 실제 페이지 콘텐츠 로드
    const hash = window.location.hash.replace('#', '');
    const initialPage = hash.split('_')[0] || 'index';
    
    loadPage(initialPage, false); 
});

// 7. 전역 내비게이션 함수
window.goToPage = (key) => loadPage(key);

//사이드바 닫는 함수
window.closeSidebar = function() {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) menuToggle.checked = false;

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const isMobile = window.innerWidth <= 1024;
        const duration = isMobile ? 200 : 500; // CSS transition 시간과 일치시킴

        sidebar.style.pointerEvents = "none"; 
        
        if (isMobile) {
            sidebar.style.transform = "translateX(100%)";
        } else {
            sidebar.style.transform = "translateY(-100%)";
        }

        setTimeout(() => {
            // 애니메이션이 완전히 끝난 후 초기화
            sidebar.style.transform = "";
            sidebar.style.pointerEvents = "";
            console.log("사이드바 닫기 완료");
        }, duration); 
    }
};
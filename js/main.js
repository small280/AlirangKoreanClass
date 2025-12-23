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

// 3. 페이지 전환 함수 (콘텐츠 + 눈 효과 제어)
async function loadPage(pageKey) {
    const page = pages[pageKey];
    if (!page) return;

    await fetchTo(page.url, 'main-contents-area', () => {
        if (page.effect) initSnowEffect();
        else document.querySelector('.snow-container').innerHTML = ''; // 효과 제거
    });
}

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
// 6. 초기 구동
document.addEventListener("DOMContentLoaded", () => {
    fetchTo('/header.html', 'header-area');
    fetchTo('/sidebar.html', 'sidebar-area');
    // fetchTo('/footer.html', 'footer-area', updateVersion); // 푸터 로드 후 버전 실행
    loadPage('index'); // 초기 콘텐츠 로드
});

// 7. 전역 내비게이션 함수
window.goToPage = (key) => loadPage(key);
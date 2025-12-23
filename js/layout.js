// 1. 공통 파일 로드 함수 (중복 제거)
async function loadComponent(id, url, callback = null) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${url} 로드 실패`);
        
        const html = await response.text();
        const element = document.getElementById(id);
        
        if (element) {
            element.innerHTML = html;
            // 로드 완료 후 실행할 함수가 있다면 실행 (예: Footer 버전 업데이트)
            if (callback) callback();
        }
    } catch (error) {
        console.error(error);
        const element = document.getElementById(id);
        if (element) element.innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
    }
}

// 2. 깃허브 버전 동기화 + 방문 카운터 함수 통합
async function updateFooterVersion() {
    const display = document.getElementById('commit-info');

    // 1. GitHub API 데이터 가져오기 (커밋 정보)
    const repoUrl = "https://api.github.com/repos/small280/AlirangKoreanClass/commits/main";

    try {
        const response = await fetch(repoUrl);
        
        if (response.status === 403) {
            // API 제한 시 오늘 날짜 표시
            const now = new Date();
            const dateStr = `${String(now.getFullYear()).slice(-2)}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
            if (display) display.innerHTML = `최신 업데이트 (${dateStr})`;
        } else if (response.ok) {
            const data = await response.json();
            const d = new Date(data.commit.author.date);
            const yy = String(d.getFullYear()).slice(-2);
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            if (display) display.innerHTML = `${data.commit.message} (${yy}.${mm}.${dd})`;
        }
    } catch (error) {
        console.error('버전 로드 에러:', error);
        if (display) display.innerText = '버전 정보 로드 실패';
    }
}

// 3. 페이지 로드 시 실행 (기존 코드 유지)
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('header-area', '/header.html');
    loadComponent('sidebar-area', '/sidebar.html');
    // loadComponent('footer-area', '/footer.html', updateFooterVersion);
});
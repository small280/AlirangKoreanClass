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

// 2. 깃허브 버전 동기화 함수
async function updateFooterVersion() {
    const display = document.getElementById('commit-info');
    if (!display) return;

    // 계정명 smal280 인지 small280 인지 정확히 확인 후 사용하세요.
    const url = "https://api.github.com/repos/small280/AlirangKoreanClass/commits/main";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API 에러: ${response.status}`);
        
        const data = await response.json();
        const d = new Date(data.commit.author.date);
        
        // 25.12.19 형식 가공
        const yy = String(d.getFullYear()).slice(-2);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        display.innerHTML = `${data.commit.message} (${yy}.${mm}.${dd})`;
    } catch (error) {
        console.error('버전 로드 에러:', error);
        display.innerText = '버전 정보 로드 실패';
    }
}

// 3. 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('header-area', '/header.html');
    loadComponent('sidebar-area', '/sidebar.html');
    // Footer 로드 완료 후에만 버전 업데이트 실행하도록 콜백 전달
    loadComponent('footer-area', '/footer.html', updateFooterVersion);
});
document.addEventListener('DOMContentLoaded', (event) => {
    // 1. 공통 로드 함수 정의
    const loadContent = (url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('네트워크 응답 오류');
                return response.text();
            })
            .then(htmlContent => {
                const targetArea = document.getElementById('main-contents-area');
                targetArea.innerHTML = htmlContent;
                
                // 만약 로드된 페이지가 contents.html이고 눈 효과가 필요하다면 여기서 실행
                if (url === '/contents.html') {
                    initSnowEffect();
                }
            })
            .catch(error => {
                console.error('파일 로드 실패:', error);
                document.getElementById('main-contents-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
            });
    };

    // 2. 초기 실행: contents.html 불러오기
    loadContent('/contents.html');

    // 3. 눈 내리는 효과 함수 (기존 로직 유지)
    function initSnowEffect() {
        const snowContainer = document.querySelector('.snow-container');
        if (!snowContainer) return;

        const SNOWFLAKE_COUNT = 150; // 성능을 위해 150개로 최적화
        
        function createSnowflake() {
            if (!document.querySelector('.snow-container')) return; // 컨테이너가 사라지면 중단
            
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.innerHTML = '❄';
            const size = Math.random() * 10 + 5 + 'px'; 
            snowflake.style.fontSize = size;
            snowflake.style.left = Math.random() * 100 + '%';
            const duration = Math.random() * 12 + 8 + 's'; 
            
            snowflake.style.animationName = `combinedFallSway`;
            snowflake.style.animationDuration = duration;
            snowflake.style.animationTimingFunction = `linear`;
            snowflake.style.animationIterationCount = `infinite`;
        
            snowContainer.appendChild(snowflake);
        
            setTimeout(() => {
                snowflake.remove();
                createSnowflake(); 
            }, parseFloat(duration) * 1000); 
        }

        for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
            setTimeout(createSnowflake, i * 100); 
        }
    }
    // window.goToNavigation = function(event) {
    //     // 1. <a> 태그의 기본 동작(페이지 상단 이동/새로고침) 차단
    //     if (event) event.preventDefault();

    //     console.log("메뉴를 호출합니다. contents 영역을 교체합니다.");
        
    //     // 2. 공통 로드 함수를 호출하여 영역 교체
    //     // (기존에 정의한 loadContent 함수가 DOM 내에 존재해야 함)
    //     loadContent('/navigation.html');
    // };
});

async function syncLatestCommit(owner, repo) {
    // 1. URL 구조 수정: https:// 추가 및 /repos/ 경로 명시
    // 'main' 부분은 실제 사용 중인 브랜치명(main 또는 master)으로 설정하세요.
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/AlirangKoreanClass-main`; 

    try {
        const response = await fetch(url);
        
        // 응답 상태 확인
        if (!response.ok) {
            throw new Error(`HTTP 에러! 상태: ${response.status}`);
        }

        const data = await response.json();
        
        const message = data.commit.message;
        const date = new Date(data.commit.author.date).toLocaleDateString();
        const sha = data.sha.substring(0, 7);

        const displayElement = document.getElementById('commit-info');
        if (displayElement) {
            displayElement.innerHTML = `
                최신 버전: <strong>${message}</strong> (${date}) 
                <br>커밋 해시: <a href="${data.html_url}" target="_blank">${sha}</a>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        const displayElement = document.getElementById('commit-info');
        if (displayElement) {
            displayElement.innerText = '업데이트 정보를 가져올 수 없습니다. (브랜치명이나 API 제한 확인)';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 사용자 이름: smal280, 저장소 이름: AlirangKoreanClass
    syncLatestCommit('smal280', 'AlirangKoreanClass');
});
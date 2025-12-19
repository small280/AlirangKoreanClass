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


//Footer 버전 정보 업데이트 함수
async function updateFooterVersion() {
    // 주소를 절대 자르지 말고 이 전체를 한 줄에 다 넣으세요.
    const url = "api.github.com";

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`데이터 로드 실패: ${response.status}`);
        }

        const data = await response.json();
        
        // 깃허브 API는 최신 커밋 메시지를 'commit.message'에 담아줍니다.
        const message = data.commit.message; 
        const date = new Date(data.commit.author.date).toLocaleDateString();

        const display = document.getElementById('commit-info');
        if (display) {
            display.innerHTML = `버전: ${message} (${date})`;
        }
    } catch (error) {
        console.error('Error:', error);
        const display = document.getElementById('commit-info');
        if (display) {
            display.innerText = '버전 정보를 불러올 수 없습니다.';
        }
    }
}

document.addEventListener("DOMContentLoaded", updateFooterVersion);
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/AlirangKoreanClass/contents.html') //MainContents 불러오기
        .then(response => {
            // 응답을 텍스트 형태로 변환합니다.
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            return response.text();
        })
        .then(htmlContent => {
            // 가져온 HTML 텍스트를 특정 div 요소의 innerHTML로 설정합니다.
            document.getElementById('main-contents-area').innerHTML = htmlContent;

            const snowContainer = document.querySelector('.snow-container');
            const SNOWFLAKE_COUNT = 500;
                    
            function createSnowflake() {
                const snowflake = document.createElement('div');
                snowflake.classList.add('snowflake');
                snowflake.innerHTML = '&#10052;';
            
                /* 
                  현재 크기 설정 부분:
                  Math.random() * 20 + 10 
                  -> Math.random()은 0에서 1 사이의 값이므로, 
                  결과적으로 10px ~ 30px 사이의 크기가 됩니다 (10 + (0~20))
                */
                const size = Math.random() * 10 + 5 + 'px'; 
                snowflake.style.fontSize = size;

                // 예시 1: 작은 눈송이 (5px ~ 15px 사이)
                // const size = Math.random() * 10 + 5 + 'px'; 

                // 예시 2: 큰 눈송이 (20px ~ 50px 사이)
                // const size = Math.random() * 30 + 20 + 'px';

                snowflake.style.left = Math.random() * 100 + '%';
            
                // 현재 설정: 5초에서 15초 사이의 랜덤한 시간
                // const duration = Math.random() * 10 + 5 + 's'; 
            
                // 예시: 3초에서 8초 사이로 빠르게 설정
                const duration = Math.random() * 12 + 8 + 's'; 
                
                // 예시: 8초에서 20초 사이로 느리게 설정
                // const duration = Math.random() * 12 + 8 + 's'; 
                
                // 합쳐진 애니메이션 이름과 지속 시간 설정
                snowflake.style.animationName = `combinedFallSway`;
                snowflake.style.animationDuration = duration;
                snowflake.style.animationTimingFunction = `linear`; /* 선형으로 설정 */
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
        })
        .catch(error => {
            // 오류 발생 시 콘솔에 메시지를 출력합니다.
            console.error('HTML 파일을 불러오는 중 오류 발생:', error);
            document.getElementById('main-contents-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
        });
});
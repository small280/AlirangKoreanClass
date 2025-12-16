document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('pron-audio');
    const container = document.getElementById('pronunciation-area');
    
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            
            jsonData.pronunciation?.forEach(chapter => {
                
                const h1Title = document.createElement('h1');
                h1Title.textContent = chapter.chapterTitle;
                container.appendChild(h1Title);

                // 챕터별로 설정된 한 줄 개수 가져오기 (기본값 1로 설정하여 오류 방지)
                const itemsPerRow = chapter.itemsPerRow || 1;
                const itemsPerRowMobile = chapter.itemsPerRowMobile || itemsPerRow;
                
                // --- 'words' 배열을 반복 처리 ---
                chapter.words?.forEach(wordGroup => {
                    
                    // 각 'line' 그룹마다 새로운 컨테이너(줄) 생성
                    const lineContainer = document.createElement('div');
                    lineContainer.classList.add('chapter-grid-container');

                    // JSON에서 정의한 한 줄당 개수를 CSS 변수로 설정
                    lineContainer.style.setProperty('--items-per-row-desktop', itemsPerRow);
                    lineContainer.style.setProperty('--items-per-row-mobile', itemsPerRowMobile);
                    
                    // --- 'line' 배열 내부의 개별 항목 반복 처리 ---
                    wordGroup.line?.forEach(item => {
                        
                        const itemBox = document.createElement('div');
                        itemBox.classList.add('pron-item-box');
                        
                        const wordText = document.createElement('p');
                        wordText.textContent = item.category;
                        wordText.classList.add('word-text');
                        itemBox.appendChild(wordText);
                        
                        const playButton = document.createElement('button');
                        playButton.classList.add('play-audio-btn');
                        const imgIcon = document.createElement('img');
                        imgIcon.src = 'images/play_icon.png'; // 실제 경로로 수정
                        imgIcon.alt = '재생';
                        imgIcon.width = 20; 
                        playButton.appendChild(imgIcon);
                        itemBox.appendChild(playButton); 

                        playButton.addEventListener('click', function(event) {
                            audioPlayer.src = item.audio; 
                            audioPlayer.play()
                                .catch(error => console.error("오디오 재생 실패:", error));
                        });

                        lineContainer.appendChild(itemBox);
                    });
                    
                    // 완성된 한 줄을 메인 컨테이너에 추가
                    container.appendChild(lineContainer);
                });
            });

        })
        .catch(error => {
            console.error('Fetch operation error:', error);
            container.innerHTML = `<p>데이터를 불러오는 중 오류 발생: ${error.message}</p>`;
        });
});

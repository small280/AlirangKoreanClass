async function fetchAndDisplayData(filename, type) {
    
    // 1. 특정 div 요소 가져오기
    const dataArea = document.getElementById('page-contents-area');
    
    if (type === undefined || type === null) {
        console.error("오류: type 매개변수가 전달되지 않았습니다.");
        if (dataArea) {
            dataArea.innerHTML = '<p style="color: red;">데이터 타입을 알 수 없습니다.</p>';
        }
        return; // 함수 실행 중단
    }

    // 로딩 중 메시지 표시
    // if (dataArea) {
    //     dataArea.innerHTML = '';
    // }

    try {
        // 실제 API 엔드포인트나 JSON 파일 경로로 변경하세요.

        // const response = await fetch(`./data/${filename}`);
        const response = await fetch(filename);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('네트워크 응답 오류: ' + response.statusText);
        }
        
        const levelElement = document.getElementById('contents-level');
        if (levelElement && dataArea) {
            levelElement.textContent = ("LEVEL. ") + data.level;
        }

        const titleElement = document.getElementById('contents-title');
        if (titleElement && data.title) {
            titleElement.textContent = data.title; // h1 태그에 title 텍스트 삽입
        }

        const subtitleElement = document.getElementById('contents-subtitle');
        if (subtitleElement && data.subtitle) {
            subtitleElement.textContent = data.subtitle; // h2 태그에 subtitle 텍스트 삽입
        }
        
        const menuTypeElement = document.getElementById('contents-menuType');
        if (menuTypeElement && dataArea) {
            if (type === 'subMenu') {
                menuTypeElement.textContent = ("MENU");
            } else if (type === 'book') {
                menuTypeElement.textContent = ("한글교재");
            } else if (type === 'pronunciation') {
                menuTypeElement.textContent = ("발음듣기");
            }
        }
        
        if (dataArea) {
            if (type === 'subMenu') { // -------------------------- 서브메뉴 불러오기 ----------------------------------------------------
                fetch('/AlirangKoreanClass/page/subMenu.html')
                .then(response => {
                    // 응답을 텍스트 형태로 변환합니다.
                    if (!response.ok) {
                        throw new Error('네트워크 응답이 올바르지 않습니다.');
                    }
                    return response.text();
                })
                .then(htmlContent => {
                    // 가져온 HTML 텍스트를 특정 div 요소의 innerHTML로 설정합니다.
                    document.getElementById('page-contents-area').innerHTML = htmlContent; // Html 불러오기
                })
                .catch(error => {
                    // 오류 발생 시 콘솔에 메시지를 출력합니다.
                    console.error('HTML 파일을 불러오는 중 오류 발생:', error);
                    document.getElementById('page-contents-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
                });
            }
            
            else if (type === 'book') { // -------------------------- 한글교재 불러오기 ----------------------------------------------------
                fetch('/AlirangKoreanClass/page/book.html')

                .then(response => {
                    // 응답을 텍스트 형태로 변환합니다.
                    if (!response.ok) {
                        throw new Error('네트워크 응답이 올바르지 않습니다.');
                    }
                    return response.text();
                })

                .then(htmlContent => {
                    // 가져온 HTML 텍스트를 특정 div 요소의 innerHTML로 설정합니다.
                    document.getElementById('page-contents-area').innerHTML = htmlContent; // Html 불러오기
                

                    const galleryContainer = document.getElementById('content-image'); // 콘텐츠 영역

                    if (galleryContainer && data.book && Array.isArray(data.book)) {
                        // 이미지 배열을 순회하며 img 태그 생성
                        data.book.forEach(imageUrl => {
                            const imgElement = document.createElement('img');
                            imgElement.src = imageUrl;
                            imgElement.alt = "메뉴 이미지";
                            galleryContainer.appendChild(imgElement);
                        });
                    }
                })
                .catch(error => {
                    // 오류 발생 시 콘솔에 메시지를 출력합니다.
                    console.error('HTML 파일을 불러오는 중 오류 발생:', error);
                    document.getElementById('page-contents-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
                });
            }
            
            else if (type === 'pronunciation') { // -------------------------- 발음듣기 불러오기 ----------------------------------------------------
                fetch('/AlirangKoreanClass/page/pronunciation.html')

                .then(response => {
                    // 응답을 텍스트 형태로 변환합니다.
                    if (!response.ok) {
                        throw new Error('네트워크 응답이 올바르지 않습니다.');
                    }
                    return response.text();
                })

                .then(htmlContent => {
                    // 가져온 HTML 텍스트를 특정 div 요소의 innerHTML로 설정합니다.
                    document.getElementById('page-contents-area').innerHTML = htmlContent; // Html 불러오기
                                
                    // HTML이 로드된 후에야 해당 ID를 가진 요소들이 존재합니다.
                    const audioPlayer = document.getElementById('pron-audio');
                    const container = document.getElementById('pronunciation-area');
                                
                    // JSON 파일을 불러옵니다.
                    fetch(filename)
                        .then(response => response.json())
                        .then(jsonData => {

                            // --- 챕터별 항목을 담을 Flex/Grid 컨테이너 생성 (const 사용) ---
                            const chapterGridContainer = document.createElement('div');
                            chapterGridContainer.classList.add('chapter-grid-container');

                            const firstChapter = jsonData.pronunciation?.[0];
                            // let itemsPerRowMobile =z 4; // 기본값 설정

                            if (firstChapter) {
                                const itemsPerRowDesktop = firstChapter.itemsPerRow || 10;
                                itemsPerRowMobile = firstChapter.itemsPerRowMobile || 4; // 값 저장
                                const mobileEmptyAllowed = firstChapter.MobileEmpty || false;
                            
                                chapterGridContainer.style.setProperty('--items-per-row-desktop', itemsPerRowDesktop);
                                chapterGridContainer.style.setProperty('--items-per-row-mobile', itemsPerRowMobile);
                            
                                if (mobileEmptyAllowed) {
                                    chapterGridContainer.setAttribute('data-mobile-empty', 'true');
                                }
                            }

                            jsonData.pronunciation?.forEach(chapter => {
                                
                                // --- 챕터 제목 (H1) 생성 ---
                                const h1Title = document.createElement('h1');
                                h1Title.textContent = chapter.chapterTitle;
                                // 제목을 메인 컨테이너에 추가합니다.
                                container.appendChild(h1Title);    
                            
                                // const itemsPerRowDesktop = chapter.itemsPerRow || 10;
                                // const itemsPerRowMobile = chapter.itemsPerRowMobile || itemsPerRowDesktop;
                                // // const mobileEmptyAllowed = chapter.MobileEmpty || false;
                            
                                // // 데스크톱/모바일 기준을 CSS 변수로 설정
                                // chapterGridContainer.style.setProperty('--items-per-row-desktop', itemsPerRowDesktop);
                                // // chapterGridContainer.style.setProperty('--items-per-row-mobile', itemsPerRowMobile);
                                
                                // // if (mobileEmptyAllowed) {
                                // //     chapterGridContainer.setAttribute('data-mobile-empty', 'true');
                                // // }
                                
                            
                                // 챕터 내의 'words' 배열을 반복 처리합니다.
                                chapter.words?.forEach(item => {
                                    
                                    const itemBox = document.createElement('div');
                                    itemBox.classList.add('pron-item-box');
                                
                                    // --- 모바일 전용 오프셋 로직 ---
                                    // 모바일 공백이 허용되고, 짝수 줄의 첫 번째 아이템인 경우 (index는 0부터 시작)
                                    // 예시: 4개씩 나열 시 4번째 아이템 (index 3), 8번째 아이템 (index 7) 등
                                    // if (mobileEmptyAllowed && (index % itemsPerRowMobile) === (itemsPerRowMobile - 1)) {
                                    //      // 다음 아이템(index + 1)이 짝수 줄의 시작 아이템이 됩니다. 
                                    //      // 하지만 이 로직은 CSS가 Grid일 때 복잡해지므로, CSS에서 nth-child로 처리하는게 낫습니다.
                                    // }
                                
                                    const wordText = document.createElement('p');
                                    wordText.textContent = item.category; 
                                    wordText.classList.add('word-text');
                                    itemBox.appendChild(wordText);
                                
                                    const playButton = document.createElement('button');
                                    playButton.classList.add('play-audio-btn');
                                    
                                    const imgIcon = document.createElement('img');
                                    imgIcon.src = '/AlirangKoreanClass/img/icon/audio.png'; 
                                    imgIcon.alt = '재생';
                                    playButton.appendChild(imgIcon);
                                    itemBox.appendChild(playButton); 
                                
                                    playButton.addEventListener('click', function(event) {
                                        // audioPlayer가 null이 아닌지 확인하는 안전장치
                                        if (audioPlayer) { 
                                            audioPlayer.src = item.audio; 
                                            audioPlayer.play().catch(error => console.error("오디오 재생 실패:", error));
                                        }
                                    });
                                
                                    // 아이템 박스를 해당 챕터 컨테이너에 추가
                                    chapterGridContainer.appendChild(itemBox);
                                
                                });                
                            });
                            
                            container.appendChild(chapterGridContainer);
                            
                            const items = chapterGridContainer.querySelectorAll('.pron-item-box');

                            // const itemsPerRowMobile = firstChapter.itemsPerRowMobile || 4; 
                                                
                            // 모바일 empty 모드가 활성화되었을 때만 실행
                            if (chapterGridContainer.getAttribute('data-mobile-empty') === 'true') {

                                // JSON의 데스크톱 기준 총 아이템 수 (여기서는 7 또는 11)를 가져옵니다.
                                const totalItemsInSet = firstChapter.itemsPerRow || 10; 
                                                        
                                // 다음 줄바꿈이 시작될 아이템의 순서 (8, 12 등)
                                let nextBreakPoint = totalItemsInSet + 1; 
                                                        
                                // 모든 아이템을 순회하면서, breakPoint에 도달하면 클래스 추가
                                items.forEach((item, index) => {
                                    const itemOrder = index + 1; // 1부터 시작하는 순서
                                
                                    if (itemOrder === nextBreakPoint) {
                                        console.log(`Adding force-newline-mobile to item number: ${itemOrder} (Next Break at: ${nextBreakPoint + totalItemsInSet})`); 
                                        
                                        // 클래스 추가
                                        item.classList.add('force-newline-mobile');
                                        
                                        // 다음 줄바꿈 지점을 계산하여 업데이트합니다. (예: 8 -> 15, 12 -> 23)
                                        nextBreakPoint += totalItemsInSet; 
                                    }
                                    // else는 필요 없습니다.
                                });
                            }                    
                        })
                        .catch(error => {
                            console.error('Fetch operation error:', error);
                            // container가 null이 아닌지 확인하는 안전장치
                            if (container) {
                                 container.innerHTML = `<p>데이터를 불러오는 중 오류 발생: ${error.message}</p>`;
                            }
                        }); 
})
.catch(error => {
    // HTML 불러오기 실패 시 처리
    console.error('HTML 파일을 불러오는 중 오류 발생:', error);
    document.getElementById('page-contents-area').innerHTML = `<p>컨텐츠 영역을 불러오지 못했습니다: ${error.message}</p>`;
});
            }
        }
    } catch (error) {
        // 3. 오류 발생 시 특정 div에 오류 메시지 표시
        if (dataArea) {
            console.error("데이터 로드 실패:", error);
            dataArea.innerHTML = '<p style="color: red;">데이터 로드 실패: ' + error.message + '</p>';
        }
    }
}


function goToSubMenu(filename) { //서브메뉴 불러오기
    console.log("버튼이 클릭되었습니다. 비동기 함수 호출 시작.");

    const fileNameToLoad = filename;
    sessionStorage.setItem('lastFilename', fileNameToLoad);
    fetchAndDisplayData(fileNameToLoad, 'subMenu');

    const dataToStore = {
        filename: fileNameToLoad,
        type: 'subMenu'
    };
    // 객체를 JSON 문자열로 변환하여 저장
    sessionStorage.setItem('selectedData', JSON.stringify(dataToStore));
    // 다음 페이지로 이동
    window.location.href = '/AlirangKoreanClass/page/page.html';
}

function goToBook() { //한글교재 불러오기
    console.log("버튼이 클릭되었습니다. 비동기 함수 호출 시작.");

    const rememberedFilename = sessionStorage.getItem('lastFilename');

    // fetchAndDisplayData 함수를 호출하면서 원하는 파일 이름을 인자로 전달합니다.
    const dataToStore = {
        filename: rememberedFilename,
        type: 'book'
    };
    sessionStorage.setItem('selectedData', JSON.stringify(dataToStore));
    window.location.href = '/AlirangKoreanClass/page/page.html'; 
}

function goToPronunciation() { //발음듣기 불러오기
    console.log("버튼이 클릭되었습니다. 비동기 함수 호출 시작.");

    const rememberedFilename = sessionStorage.getItem('lastFilename');

    // fetchAndDisplayData 함수를 호출하면서 원하는 파일 이름을 인자로 전달합니다.
    const dataToStore = {
        filename: rememberedFilename,
        type: 'pronunciation'
    };
    sessionStorage.setItem('selectedData', JSON.stringify(dataToStore));
    window.location.href = '/AlirangKoreanClass/page/page.html'; 
}

//html 적용
document.addEventListener('DOMContentLoaded', () => {
    //const rememberedFilename = sessionStorage.getItem('lastFilename');
    if (window.location.pathname.includes('/AlirangKoreanClass/page/page.html')) {
        
        // sessionStorage에서 'selectedData' 문자열 가져오기
        const storedDataString = sessionStorage.getItem('selectedData');

        if (storedDataString) {
            try {
                const dataObject = JSON.parse(storedDataString);
                
                // filename과 type이 유효한지 확인 후 호출
                if (dataObject && dataObject.filename && dataObject.type) {
                    fetchAndDisplayData(dataObject.filename, dataObject.type);
                    
                    // 데이터를 성공적으로 넘겼다면 sessionStorage에서 제거
                    // sessionStorage.removeItem('selectedData'); 
                } else {
                    handleError('sessionStorage에 유효한 filename 또는 type이 없습니다.');
                }

            } catch (error) {
                // JSON 파싱 오류 처리
                console.error("JSON 파싱 오류:", error);
                handleError('저장된 데이터 형식에 오류가 있습니다.');
            }

        } else {
            handleError('선택된 메뉴 정보가 없습니다.');
        }
    }
});

function handleError(message) {
    console.error(message);
    const contentArea = document.getElementById('page-contents-area');
    if (contentArea) {
        contentArea.textContent = message;
    } else {
        // 오류가 났던 요소가 'content-area'였다면 이 부분에서 문제가 발생했을 것입니다.
        console.error("오류: 'page-contents-area' ID를 가진 요소를 찾을 수 없습니다!");
    }
}
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
                menuTypeElement.textContent = ("Teaching Meterials");
            } else if (type === 'pronunciation') {
                menuTypeElement.textContent = ("Listen Pronunciation");
            }
        }
        
        if (dataArea) {
            if (type === 'subMenu') { // -------------------------- 서브메뉴 불러오기 ----------------------------------------------------
                fetch('/page/subMenu.html')
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
                fetch('/page/book.html')

                .then(response => {
                    // 응답을 텍스트 형태로 변환합니다.
                    if (!response.ok) {
                        throw new Error('네트워크 응답이 올바르지 않습니다.');
                    }
                    return response.text();
                })

                .then(htmlContent => {
                    // 1. HTML 구조 주입
                    document.getElementById('page-contents-area').innerHTML = htmlContent;

                    // 2. 주요 요소 참조 (HTML이 주입된 후에 가져와야 함)
                    const galleryContainer = document.getElementById('content-image'); 

                    // 기준점이 될 부모 요소에 relative 설정 (화살표 배치용)
                    if (galleryContainer) {
                        galleryContainer.style.position = 'relative';
                        galleryContainer.innerHTML = ''; // 기존 내용 초기화
                    }
                
                    // 3. 데이터 존재 확인 및 슬라이더 생성 시작
                    if (galleryContainer && data.book && Array.isArray(data.book)) {

                        // --- 슬라이더 부모 박스 생성 ---
                        const sliderWrapper = document.createElement('div');
                        sliderWrapper.classList.add('chapter-slider-wrapper');
                    
                        // --- 화살표 버튼 생성 ---
                        const prevBtn = document.createElement('button');
                        prevBtn.innerHTML = '❮';
                        prevBtn.classList.add('slide-nav-btn', 'prev');

                        const nextBtn = document.createElement('button');
                        nextBtn.innerHTML = '❯';
                        nextBtn.classList.add('slide-nav-btn', 'next');
                    
                        // --- 숫자 네비게이션(1 | 2 | 3) 컨테이너 생성 ---
                        const pageIndicator = document.createElement('div');
                        pageIndicator.classList.add('page-numbers-nav');
                    
                        const totalPages = data.book.length;
                    
                        // 4. 이미지 배열 순회하며 슬라이드 구성
                        data.book.forEach((imageUrl, index) => {
                            // 개별 슬라이드 섹션
                            const slide = document.createElement('section');
                            slide.classList.add('chapter-slide');
                        
                            // 이미지 생성
                            const imgElement = document.createElement('img');
                            imgElement.src = imageUrl;
                            imgElement.alt = `Book Page ${index + 1}`;
                            imgElement.loading = "lazy"; // 2025년 기준 성능 최적화

                            slide.appendChild(imgElement);
                            sliderWrapper.appendChild(slide);
                        
                            // 하단 숫자 아이템 생성
                            const pageNum = document.createElement('span');
                            pageNum.classList.add('page-num-item');
                            pageNum.textContent = index + 1;

                            // 숫자 클릭 시 해당 이미지로 이동
                            pageNum.addEventListener('click', () => {
                                sliderWrapper.scrollTo({
                                    left: sliderWrapper.clientWidth * index,
                                    behavior: 'smooth'
                                });
                            });
                            pageIndicator.appendChild(pageNum);
                        
                            // 숫자 사이 구분선 추가
                            if (index < totalPages - 1) {
                                const divider = document.createElement('span');
                                divider.classList.add('page-divider');
                                divider.textContent = '|';
                                pageIndicator.appendChild(divider);
                            }
                        });
                    
                        // 5. 업데이트 함수 (번호 활성화 및 화살표 가시성 제어)
                        const updateGalleryUI = () => {
                            const scrollLeft = sliderWrapper.scrollLeft;
                            const clientWidth = sliderWrapper.clientWidth;
                            const currentIndex = Math.round(scrollLeft / clientWidth); // 0부터 시작
                            const totalPages = data.book.length;
                                                
                            // --- [핵심] 10개만 보여주는 로직 시작 ---
                            pageIndicator.innerHTML = ''; // 일단 번호 영역을 비웁니다.
                                                
                            // 보여줄 범위 계산 (현재 페이지 기준 앞뒤로 배분)
                            let start = Math.max(0, currentIndex - 4); // 현재 인덱스 기준 앞에 4개
                            let end = Math.min(totalPages - 1, start + 8); // 총 10개(start 포함)
                                                
                            // 끝 부분에서 10개가 안 채워질 경우 앞부분을 더 당김
                            if (end - start < 9) {
                                start = Math.max(0, end - 8);
                            }
                        
                            for (let i = start; i <= end; i++) {
                                const pageNum = document.createElement('span');
                                pageNum.classList.add('page-num-item');
                                pageNum.textContent = i + 1;
                                
                                if (i === currentIndex) pageNum.classList.add('active');
                            
                                pageNum.addEventListener('click', () => {
                                    sliderWrapper.scrollTo({
                                        left: clientWidth * i,
                                        behavior: 'smooth'
                                    });
                                });
                            
                                pageIndicator.appendChild(pageNum);
                            
                                // 숫자 사이 구분선 (마지막 번호 뒤에는 생략)
                                if (i < end) {
                                    const divider = document.createElement('span');
                                    divider.classList.add('page-divider');
                                    divider.textContent = '|';
                                    pageIndicator.appendChild(divider);
                                }
                            }
                            // --- 10개 로직 종료 ---
                        
                            // 화살표 숨김 제어 (기존 동일)
                            const threshold = 100;
                            const maxScroll = sliderWrapper.scrollWidth - clientWidth;
                            prevBtn.style.opacity = scrollLeft < threshold ? "0" : "1";
                            prevBtn.style.pointerEvents = scrollLeft < threshold ? "none" : "auto";
                            nextBtn.style.opacity = scrollLeft > maxScroll - threshold ? "0" : "1";
                            nextBtn.style.pointerEvents = scrollLeft > maxScroll - threshold ? "none" : "auto";
                        };
                    
                        // 6. 조립 및 이벤트 연결

                        galleryContainer.appendChild(prevBtn);
                        galleryContainer.appendChild(sliderWrapper);
                        galleryContainer.appendChild(nextBtn);
                        galleryContainer.appendChild(pageIndicator); // 숫자 네비게이션 상단(또는 하단)
                    
                        sliderWrapper.addEventListener('scroll', () => {
                            window.requestAnimationFrame(updateGalleryUI);
                        }, { passive: true });
                    
                        prevBtn.addEventListener('click', () => {
                            sliderWrapper.scrollBy({ left: -sliderWrapper.clientWidth, behavior: 'smooth' });
                        });
                    
                        nextBtn.addEventListener('click', () => {
                            sliderWrapper.scrollBy({ left: sliderWrapper.clientWidth, behavior: 'smooth' });
                        });
                    
                        // 초기 상태 실행
                        updateGalleryUI();
                        setTimeout(updateGalleryUI, 300);
                    }
                })
                .catch(error => {
                    // 오류 발생 시 콘솔에 메시지를 출력합니다.
                    console.error('HTML 파일을 불러오는 중 오류 발생:', error);
                    document.getElementById('page-contents-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
                });
            }
            
            else if (type === 'pronunciation') { // -------------------------- 발음듣기 불러오기 ----------------------------------------------------
                fetch('/page/pronunciation.html')

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

                    // [1] 슬라이더 본체를 먼저 생성 (ReferenceError 방지)
                    const sliderWrapper = document.createElement('div');
                    sliderWrapper.classList.add('chapter-slider-wrapper');

                    // 1. 화살표 버튼 생성
                    const prevBtn = document.createElement('button');
                    prevBtn.innerHTML = '&#10094;';
                    prevBtn.classList.add('slide-nav-btn', 'prev');
                            
                    const nextBtn = document.createElement('button');
                    nextBtn.innerHTML = '&#10095;';
                    nextBtn.classList.add('slide-nav-btn', 'next');

                    const pageIndicator = document.createElement('div');
                    pageIndicator.classList.add('page-numbers-nav');

                    // [3] 함수 정의 (이제 sliderWrapper를 정상적으로 참조 가능)
                    const updatePageNav = () => {
                    }
                                
                    // JSON 파일을 불러옵니다.
                    fetch(filename)
                        .then(response => response.json())
                        .then(jsonData => {
                            const container = document.getElementById('pronunciation-area');
                            const audioPlayer = document.getElementById('pron-audio');
                            container.style.position = 'relative';

                            // 1. 페이지 번호들을 담을 컨테이너 생성
                            const pageIndicator = document.createElement('div');
                            pageIndicator.classList.add('page-numbers-nav');

                            // 2. 챕터 개수만큼 번호 생성 (순회 루프 밖에서 실행)
                            const totalChapters = jsonData.pronunciation?.length || 0;

                            const updatePageNav = () => {
                                const scrollLeft = sliderWrapper.scrollLeft;
                                const clientWidth = sliderWrapper.clientWidth;
                                const currentIndex = Math.round(scrollLeft / clientWidth);
                                const maxScroll = sliderWrapper.scrollWidth - clientWidth;

                                // --- 10개 제한 로직 적용하여 번호 영역 다시 그리기 ---
                                pageIndicator.innerHTML = ''; 
                                let start = Math.max(0, currentIndex - 4);
                                let end = Math.min(totalChapters - 1, start + 8);
                                if (end - start < 8) start = Math.max(0, end - 8);

                                for (let i = start; i <= end; i++) {
                                    const pageNum = document.createElement('span');
                                    pageNum.classList.add('page-num-item');
                                    if (i === currentIndex) pageNum.classList.add('active');
                                    pageNum.textContent = i + 1;

                                    pageNum.addEventListener('click', () => {
                                        sliderWrapper.scrollTo({ left: clientWidth * i, behavior: 'smooth' });
                                    });
                                    pageIndicator.appendChild(pageNum);
                                
                                    if (i < end) {
                                        const divider = document.createElement('span');
                                        divider.classList.add('page-divider');
                                        divider.textContent = '|';
                                        pageIndicator.appendChild(divider);
                                    }
                                }
                            
                                // 화살표 숨김 로직 (100px 임계값)
                                const threshold = 100;
                                prevBtn.style.opacity = scrollLeft < threshold ? "0" : "1";
                                prevBtn.style.pointerEvents = scrollLeft < threshold ? "none" : "auto";
                                nextBtn.style.opacity = scrollLeft > maxScroll - threshold ? "0" : "1";
                                nextBtn.style.pointerEvents = scrollLeft > maxScroll - threshold ? "none" : "auto";
                            };

                            // 1. 첫 번째 챕터 데이터를 미리 가져와서 설정값 추출
                            const firstChapter = jsonData.pronunciation?.[0];
                            if (!firstChapter) return;
                        
                            // 공통 설정값 (전역에서 사용)
                            const itemsPerRowDesktop = firstChapter.itemsPerRow || 10;
                            const itemsPerRowMobile = firstChapter.itemsPerRowMobile || 4;
                            const mobileEmptyAllowed = firstChapter.MobileEmpty || false;
                        
                            // 줄바꿈 규칙용 변수
                            const totalItemsInSet = itemsPerRowDesktop; 
                            let globalItemCount = 0; 
                            let nextBreakPoint = totalItemsInSet + 1;
                            
                            

                            // 2. 챕터별 순회 시작
                            jsonData.pronunciation?.forEach(chapter => {
                                const chapterSlide = document.createElement('section');
                                chapterSlide.classList.add('chapter-slide');

                                // --- 챕터 제목 생성 ---
                                const h1Title = document.createElement('h1');
                                h1Title.textContent = chapter.chapterTitle;
                                chapterSlide.appendChild(h1Title); // 슬라이드 안에 제목 넣기
                            
                                // --- 챕터별 그리드 컨테이너 생성 (여기서 선언됨) ---
                                const chapterGridContainer = document.createElement('div');
                                chapterGridContainer.classList.add('chapter-grid-container');

                                // 컨테이너 스타일 설정
                                chapterGridContainer.style.setProperty('--items-per-row-desktop', itemsPerRowDesktop);
                                chapterGridContainer.style.setProperty('--items-per-row-mobile', itemsPerRowMobile);
                                if (mobileEmptyAllowed) {
                                    chapterGridContainer.setAttribute('data-mobile-empty', 'true');
                                }
                            
                                // --- 챕터 내 단어(words) 반복 처리 ---
                                chapter.words?.forEach(item => {
                                    globalItemCount++; // 아이템 순서 증가
                                
                                    const itemBox = document.createElement('div');
                                    itemBox.classList.add('pron-item-box');

                                    // 오디오 미사용 아이템 스타일링
                                    if (item.useAudio === false) {
                                        itemBox.classList.add('no-audio'); // CSS에서 .no-audio { background-color: #ccc; } 정의 필요
                                    }
                                
                                    // 줄바꿈 클래스 주입 로직
                                    if (mobileEmptyAllowed && globalItemCount === nextBreakPoint) {
                                        itemBox.classList.add('force-newline-mobile');
                                        nextBreakPoint += totalItemsInSet; 
                                    }
                                
                                    // 텍스트 및 버튼 생성
                                    const wordText = document.createElement('p');
                                    wordText.textContent = item.category;
                                    wordText.classList.add('word-text');
                                    itemBox.appendChild(wordText);
                                
                                    // [수정] 버튼은 일단 무조건 생성 (레이아웃 유지 목적)
                                    const playButton = document.createElement('button');
                                    playButton.classList.add('play-audio-btn');
                                    const imgIcon = document.createElement('img');
                                    imgIcon.src = '/img/icon/audio.png';
                                    playButton.appendChild(imgIcon);
                                    itemBox.appendChild(playButton);

                                    // --- [핵심 로직] useAudio 값에 따른 처리 ---
                                    if (item.useAudio === false) {
                                        // 1. 박스 배경색 변경
                                        itemBox.classList.add('no-audio');

                                        // 2. 툴팁 및 설명 추가
                                        const noticeText = "⚠ This character is unused. Audio is not supported. ⚠";
                                        playButton.title = noticeText;  // 마우스를 올리면 뜨는 툴팁 (표준 방식)
                                        imgIcon.alt = noticeText;       // 이미지 대체 텍스트

                                                                        // 클릭 시 동작 방지 (혹은 안내창 띄우기)
                                        playButton.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            alert(noticeText); // 필요 시 알림창을 띄울 수도 있습니다.
                                        });
                                    } else {
                                        // 3. 사용 가능한 경우에만 클릭 이벤트 등록
                                        playButton.addEventListener('click', () => {
                                            if (audioPlayer) {
                                                audioPlayer.src = item.audio;
                                                audioPlayer.play().catch(e => console.error(e));
                                            }
                                        });
                                    }

                                    // 현재 챕터 컨테이너에 아이템 추가 (정상 참조)
                                    chapterGridContainer.appendChild(itemBox);
                                });
                                // 완성된 챕터 컨테이너를 메인 영역에 추가
                                chapterSlide.appendChild(chapterGridContainer); // 슬라이드 안에 그리드 넣기
                                sliderWrapper.appendChild(chapterSlide);
                            });
                            // 최종 조립
                            container.appendChild(prevBtn);
                            container.appendChild(sliderWrapper);
                            container.appendChild(nextBtn);
                            container.appendChild(pageIndicator);

                            sliderWrapper.addEventListener('scroll', () => {
                                window.requestAnimationFrame(updatePageNav);
                            }, { passive: true });
                        
                            prevBtn.addEventListener('click', () => {
                                sliderWrapper.scrollBy({ left: -sliderWrapper.clientWidth, behavior: 'smooth' });
                            });
                            nextBtn.addEventListener('click', () => {
                                sliderWrapper.scrollBy({ left: sliderWrapper.clientWidth, behavior: 'smooth' });
                            });
                        
                            updatePageNav();
                            setTimeout(updatePageNav, 200);
                        })
                        .catch(error => {
                            console.error('Fetch operation error:', error);
                            const container = document.getElementById('pronunciation-area');
                            if (container) container.innerHTML = `<p>오류 발생: ${error.message}</p>`;
                        });
                })
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

// [수정] 외부(main.js)에서 명시적으로 호출할 수 있도록 async 함수로 확정
async function initPageContent() {

    window.scrollTo({ top: 0, behavior: 'smooth' }); // 부드럽게 올리고 싶을 때
    
    // console.log("페이지 데이터 로드 시작");
    const storedDataString = sessionStorage.getItem('selectedData');
    
    if (storedDataString) {
        try {
            const dataObject = JSON.parse(storedDataString);
            if (dataObject.filename && dataObject.type) {
                // 데이터 표시 함수가 완료될 때까지 대기
                await fetchAndDisplayData(dataObject.filename, dataObject.type);
            } else {
                handleError('sessionStorage에 유효한 정보가 없습니다.');
            }
        } catch (e) {
            console.error("데이터 파싱 실패:", e);
            handleError('저장된 데이터 형식에 오류가 있습니다.');
        }
    } else {
        // 직접 주소창에 /page/page.html을 치고 들어왔을 때 등 예외 처리
        handleError('선택된 메뉴 정보가 없습니다.');
    }
}

// [수정] DOMContentLoaded 리스너: SPA 환경에서는 pathname이 index.html인 경우가 많으므로 조건 완화
document.addEventListener('DOMContentLoaded', () => {
    // 1. 실제 파일 경로가 page.html이거나 
    // 2. SPA 방식으로 #page 해시를 가지고 있을 때 실행
    if (window.location.pathname.includes('/page/page.html') || window.location.hash.includes('#page')) {
        initPageContent();
    }
});

// 한글교재 불러오기
function goToBook() {
    const rememberedFilename = sessionStorage.getItem('lastFilename');
    if (!rememberedFilename) return;

    const dataToStore = { filename: rememberedFilename, type: 'book' };
    sessionStorage.setItem('selectedData', JSON.stringify(dataToStore));

    // [수정] 이미 page라면 loadPage를 다시 하지 않고 데이터만 갱신
    if (window.location.hash.includes('#page')) {
        initPageContent(); // 즉시 화면 갱신
        // 히스토리에도 'book' 상태임을 기록 (뒤로가기용)
        history.pushState({ key: 'page', data: JSON.stringify(dataToStore) }, '', `#page_${Date.now()}`);
    } else {
        loadPage('page');
    }
}

// 발음듣기 불러오기
function goToPronunciation() {
    const rememberedFilename = sessionStorage.getItem('lastFilename');
    if (!rememberedFilename) return;

    const dataToStore = { filename: rememberedFilename, type: 'pronunciation' };
    sessionStorage.setItem('selectedData', JSON.stringify(dataToStore));

    if (window.location.hash.includes('#page')) {
        initPageContent();
        history.pushState({ key: 'page', data: JSON.stringify(dataToStore) }, '', `#page_${Date.now()}`);
    } else {
        loadPage('page');
    }
}

function goToSubMenu(filename) {
    // 1. 데이터 저장 로직
    sessionStorage.setItem('selectedData', JSON.stringify({ filename: filename, type: 'subMenu' }));
    sessionStorage.setItem('lastFilename', filename);

    // [추가] 사이드바 닫기 함수 호출
    if (typeof closeSidebar === 'function') {
        closeSidebar();
    }

    // 2. SPA 로드 및 스크롤 상단 이동
    if (typeof loadPage === 'function') {
        loadPage('page');
    }
    window.scrollTo(0, 0);
}

function handleError(message) {
    console.error(message);
    // [중요] 렌더링 직후 요소를 못 찾을 수 있으므로 재시도 로직이나 null 체크 강화
    const contentArea = document.getElementById('page-contents-area');
    if (contentArea) {
        contentArea.textContent = message;
    }
}
                   fetch(filename)
                        .then(response => response.json())
                        .then(jsonData => {
                            const container = document.getElementById('pronunciation-area');
                            const audioPlayer = document.getElementById('pron-audio');
                            container.style.position = 'relative';
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
                                    
                                    const playButton = document.createElement('button');
                                    playButton.classList.add('play-audio-btn');
                                    const imgIcon = document.createElement('img');
                                    imgIcon.src = '/img/icon/audio.png';
                                    playButton.appendChild(imgIcon);
                                    itemBox.appendChild(playButton);
                                    // 오디오 재생 이벤트 바인딩
                                    playButton.addEventListener('click', () => {
                                        if (audioPlayer) {
                                            audioPlayer.src = item.audio;
                                            audioPlayer.play().catch(e => console.error(e));
                                        }
                                    });
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
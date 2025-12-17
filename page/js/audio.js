                    // JSON 파일을 불러옵니다.
                    fetch(filename)
                        .then(response => response.json())
                        .then(jsonData => {

                            // if (firstChapter) {
                            //     const itemsPerRowDesktop = firstChapter.itemsPerRow || 10;
                            //     itemsPerRowMobile = firstChapter.itemsPerRowMobile || 4; // 값 저장
                            //     const mobileEmptyAllowed = firstChapter.MobileEmpty || false;
                            
                            //     chapterGridContainer.style.setProperty('--items-per-row-desktop', itemsPerRowDesktop);
                            //     chapterGridContainer.style.setProperty('--items-per-row-mobile', itemsPerRowMobile);
                            
                            //     if (mobileEmptyAllowed) {
                            //         chapterGridContainer.setAttribute('data-mobile-empty', 'true');
                            //     }
                            // }

                            const firstChapter = jsonData.pronunciation?.[0];
                            if (!firstChapter) return;

                            const itemsPerRowDesktop = firstChapter?.itemsPerRow || 10;
                            const itemsPerRowMobile = firstChapter?.itemsPerRowMobile || 4;
                            const mobileEmptyAllowed = firstChapter?.MobileEmpty || false;
                            
                            const totalItemsInSet = itemsPerRowDesktop; 

                            // 핵심: 모든 챕터의 아이템 순서를 누적할 변수
                            let globalItemCount = 0;
                            let nextBreakPoint = totalItemsInSet + 1;

                            jsonData.pronunciation?.forEach(chapter => {
                                
                                // --- 챕터 제목 (H1) 생성 ---
                                const h1Title = document.createElement('h1');
                                h1Title.textContent = chapter.chapterTitle;
                                // 제목을 메인 컨테이너에 추가합니다.
                                container.appendChild(h1Title);
                                
                                // --- 챕터별 항목을 담을 Flex/Grid 컨테이너 생성 (const 사용) ---
                                const chapterGridContainer = document.createElement('div');
                                chapterGridContainer.classList.add('chapter-grid-container');
                            
                                // 스타일 설정
                                chapterGridContainer.style.setProperty('--items-per-row-desktop', itemsPerRowDesktop);
                                chapterGridContainer.style.setProperty('--items-per-row-mobile', itemsPerRowMobile);
                                if (mobileEmptyAllowed) {
                                    chapterGridContainer.setAttribute('data-mobile-empty', 'true');
                                }

                                // 챕터 내의 'words' 배열을 반복 처리합니다.
                                chapter.words?.forEach(item => {

                                    globalItemCount++; // 전체 아이템 순서 증가
                                    
                                    const itemBox = document.createElement('div');
                                    itemBox.classList.add('pron-item-box');

                                    // 줄바꿈 로직 적용 (전체 순번 기준)
                                    if (mobileEmptyAllowed && globalItemCount === nextBreakPoint) {
                                        itemBox.classList.add('force-newline-mobile');
                                        nextBreakPoint += totalItemsInSet; // 다음 지점 업데이트 (8 -> 15...)
                                    }
                                
                                    const wordText = document.createElement('p');
                                    wordText.textContent = item.category; 
                                    wordText.classList.add('word-text');
                                    itemBox.appendChild(wordText);
                                
                                    const playButton = document.createElement('button');
                                    playButton.classList.add('play-audio-btn');

                                    const imgIcon = document.createElement('img');
                                    imgIcon.src = '/img/icon/audio.png'; 
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
                            
                            // const items = chapterGridContainer.querySelectorAll('.pron-item-box');

                            // // 모바일 empty 모드가 활성화되었을 때만 실행
                            // if (chapterGridContainer.getAttribute('data-mobile-empty') === 'true') {

                            //     // JSON의 데스크톱 기준 총 아이템 수 (여기서는 7 또는 11)를 가져옵니다.
                            //     const totalItemsInSet = firstChapter.itemsPerRow || 10; 
                                                        
                            //     // 다음 줄바꿈이 시작될 아이템의 순서 (8, 12 등)
                            //     let nextBreakPoint = totalItemsInSet + 1; 
                                                        
                            //     // 모든 아이템을 순회하면서, breakPoint에 도달하면 클래스 추가
                            //     items.forEach((item, index) => {
                            //         const itemOrder = index + 1; // 1부터 시작하는 순서
                                
                            //         if (itemOrder === nextBreakPoint) {
                            //             console.log(`Adding force-newline-mobile to item number: ${itemOrder} (Next Break at: ${nextBreakPoint + totalItemsInSet})`); 
                                        
                            //             // 클래스 추가
                            //             item.classList.add('force-newline-mobile');
                                        
                            //             // 다음 줄바꿈 지점을 계산하여 업데이트합니다. (예: 8 -> 15, 12 -> 23)
                            //             nextBreakPoint += totalItemsInSet; 
                            //         }
                            //     });
                            // }                    
                        })
                        .catch(error => {
                            console.error('Fetch operation error:', error);
                            // container가 null이 아닌지 확인하는 안전장치
                            if (container) {
                                 container.innerHTML = `<p>데이터를 불러오는 중 오류 발생: ${error.message}</p>`;
                            }
                        });
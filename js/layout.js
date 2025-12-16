fetch('/header.html') // Header 불러오기
    .then(response => {
        // 응답을 텍스트 형태로 변환합니다.
        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return response.text();
    })
    .then(htmlContent => {
        // 가져온 HTML 텍스트를 특정 div 요소의 innerHTML로 설정합니다.
        document.getElementById('header-area').innerHTML = htmlContent;
    })
    .catch(error => {
        // 오류 발생 시 콘솔에 메시지를 출력합니다.
        console.error('HTML 파일을 불러오는 중 오류 발생:', error);
        document.getElementById('header-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
    });

fetch('/sidebar.html') // Sidebar 불러오기
    .then(response => {
        // 응답을 텍스트 형태로 변환합니다.
        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return response.text();
    })
    .then(htmlContent => {
        // 가져온 HTML 텍스트를 특정 div 요소의 innerHTML로 설정합니다.
        document.getElementById('sidebar-area').innerHTML = htmlContent;
    })
    .catch(error => {
        // 오류 발생 시 콘솔에 메시지를 출력합니다.
        console.error('HTML 파일을 불러오는 중 오류 발생:', error);
        document.getElementById('sidebar-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
    });

fetch('/footer.html') // Footer 불러오기
    .then(response => {
        // 응답을 텍스트 형태로 변환합니다.
        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return response.text();
    })
    .then(htmlContent => {
        // 가져온 HTML 텍스트를 특정 div 요소의 innerHTML로 설정합니다.
        document.getElementById('footer-area').innerHTML = htmlContent;
    })
    .catch(error => {
        // 오류 발생 시 콘솔에 메시지를 출력합니다.
        console.error('HTML 파일을 불러오는 중 오류 발생:', error);
        document.getElementById('footer-area').innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
    });
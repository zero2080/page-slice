class SwipeHandler {
    constructor() {
        this.swipeButton = document.getElementById('swipeButton');
        this.progressIndicator = document.getElementById('progressIndicator');
        this.container = document.querySelector('.image-container');
        
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.containerWidth = 0;
        this.buttonStartPosition = 0;
        this.threshold = 0.8; // 70% 임계값
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDimensions();
        
        // 리사이즈 이벤트 처리
        window.addEventListener('resize', () => {
            this.updateDimensions();
        });
    }

    updateDimensions() {
        this.containerWidth = this.container.offsetWidth;
        this.buttonStartPosition = this.containerWidth - 80; // 오른쪽 여백 20px + 버튼 너비 60px
    }

    setupEventListeners() {
        // 터치 이벤트
        this.swipeButton.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        this.swipeButton.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        this.swipeButton.addEventListener('touchend', this.handleEnd.bind(this));

        // 마우스 이벤트
        this.swipeButton.addEventListener('mousedown', this.handleStart.bind(this));
        document.addEventListener('mousemove', this.handleMove.bind(this));
        document.addEventListener('mouseup', this.handleEnd.bind(this));

        // 드래그 방지
        this.swipeButton.addEventListener('dragstart', (e) => e.preventDefault());
    }

    handleStart(e) {
        this.isDragging = true;
        this.swipeButton.classList.add('dragging');
        
        // 터치와 마우스 좌표 통합 처리
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        this.startX = clientX;
        this.currentX = clientX;
        
        // 터치 이벤트의 기본 동작 방지
        if (e.touches) {
            e.preventDefault();
        }
    }

    handleMove(e) {
        if (!this.isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        this.currentX = clientX;
        
        const deltaX = this.currentX - this.startX;
        
        // 왼쪽으로만 이동 가능하도록 제한
        if (deltaX > 0) return;
        
        // 최대 이동 거리 제한 (컨테이너 너비의 80%)
        const maxMove = this.containerWidth * 0.8;
        const moveDistance = Math.min(Math.abs(deltaX), maxMove);
        
        // 버튼 위치 업데이트
        const newPosition = Math.max(20, this.buttonStartPosition + deltaX);
        this.swipeButton.style.right = `${this.containerWidth - newPosition - 60}px`;
        
        // 진행률 계산 및 표시
        const progress = (moveDistance / maxMove) * 100;
        this.progressIndicator.style.width = `${progress}%`;
        
        // 터치 이벤트의 기본 동작 방지
        if (e.touches) {
            e.preventDefault();
        }
    }

    handleEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.swipeButton.classList.remove('dragging');
        
        const deltaX = this.currentX - this.startX;
        const moveDistance = Math.abs(deltaX);
        const maxMove = this.containerWidth * 0.8;
        const progress = moveDistance / maxMove;
        
        if (progress >= this.threshold && deltaX < 0) {
            // 70% 이상 이동 시 페이지 이동
            this.navigateToPage();
        } else {
            // 70% 미만 이동 시 원래 위치로 복귀
            this.resetPosition();
        }
    }

    navigateToPage() {
        // 성공 애니메이션
        this.swipeButton.style.transition = 'all 0.3s ease';
        this.swipeButton.style.right = `${this.containerWidth - 80}px`;
        this.progressIndicator.style.width = '100%';
        
        setTimeout(() => {
            // 또는 현재 페이지에서 이동: 
            window.location.href = 'https://blog.cami.kr/dogchat-61937?traffic_type=internal​';
            
            // this.resetPosition();
        }, 300);
    }

    resetPosition() {
        // 원래 위치로 복귀 애니메이션
        this.swipeButton.style.transition = 'all 0.3s ease';
        this.swipeButton.style.right = '20px';
        this.progressIndicator.style.width = '0%';
        
        setTimeout(() => {
            this.swipeButton.style.transition = '';
        }, 300);
    }
}

// 페이지 로드 시 스와이프 핸들러 초기화
document.addEventListener('DOMContentLoaded', () => {
    new SwipeHandler();
});
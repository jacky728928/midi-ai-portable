// ========== 通用互动功能 - 简化稳定版 ==========

// 全局变量
let currentQuizIndex = 0;
let quizDataGlobal = [];
let knowledgePointsGlobal = [];
let collectedPoints = 0;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    
    if (typeof window.quizConfig !== 'undefined') {
        quizDataGlobal = window.quizConfig.quizData || [];
        knowledgePointsGlobal = window.quizConfig.knowledgePoints || [];
        
        initQuiz();
        initKnowledgePoints();
        initCollectibleBadge();
    }
});

// 滚动入场动画
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// 知识问答
function initQuiz() {
    if (quizDataGlobal.length === 0) return;
    renderQuiz();
}

function renderQuiz() {
    const quizContainer = document.getElementById('quiz-section');
    if (!quizContainer) return;
    
    const quiz = quizDataGlobal[currentQuizIndex];
    if (!quiz) return;
    
    quizContainer.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <h2 class="quiz-title">🧠 知识问答挑战</h2>
                <p class="quiz-subtitle">第 ${currentQuizIndex + 1}/${quizDataGlobal.length} 题</p>
            </div>
            
            <div class="quiz-card">
                <p class="quiz-question">${quiz.question}</p>
                <div class="quiz-options">
                    ${quiz.options.map((option, index) => `
                        <div class="quiz-option" data-index="${index}">${option}</div>
                    `).join('')}
                </div>
                <div id="quiz-result" class="quiz-result" style="display: none;"></div>
            </div>
            
            <div class="quiz-progress">
                ${quizDataGlobal.map((_, index) => `
                    <div class="quiz-progress-dot ${index === currentQuizIndex ? 'active' : ''} ${index < currentQuizIndex ? 'completed' : ''}"></div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定选项点击
    quizContainer.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', handleQuizAnswer);
    });
}

function handleQuizAnswer(e) {
    const selectedIndex = parseInt(e.target.dataset.index);
    const quiz = quizDataGlobal[currentQuizIndex];
    const resultDiv = document.getElementById('quiz-result');
    
    // 禁用所有选项
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    // 显示对错
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, index) => {
        if (index === quiz.correctAnswer) {
            opt.classList.add('correct');
        } else if (index === selectedIndex && index !== quiz.correctAnswer) {
            opt.classList.add('wrong');
        }
    });
    
    // 显示结果
    const isCorrect = selectedIndex === quiz.correctAnswer;
    resultDiv.innerHTML = `
        <div class="quiz-result-icon">${isCorrect ? '🎉' : '💡'}</div>
        <p class="quiz-result-text">${isCorrect ? '回答正确！' : '再想想看～'}</p>
        <p class="quiz-result-explanation">${quiz.explanation}</p>
    `;
    
    if (currentQuizIndex < quizDataGlobal.length - 1) {
        resultDiv.innerHTML += `<button class="quiz-next-btn" id="next-quiz-btn">下一题 →</button>`;
    } else {
        resultDiv.innerHTML += `<button class="quiz-next-btn" id="finish-quiz-btn">完成挑战 ✓</button>`;
    }
    
    resultDiv.style.display = 'block';
    
    // 绑定按钮
    if (currentQuizIndex < quizDataGlobal.length - 1) {
        document.getElementById('next-quiz-btn').addEventListener('click', nextQuiz);
    } else {
        document.getElementById('finish-quiz-btn').addEventListener('click', finishQuiz);
    }
}

function nextQuiz() {
    currentQuizIndex++;
    renderQuiz();
}

function finishQuiz() {
    const quizContainer = document.getElementById('quiz-section');
    quizContainer.innerHTML = `
        <div class="quiz-container" style="text-align: center;">
            <div class="quiz-header">
                <h2 class="quiz-title">🏆 挑战完成！</h2>
                <p class="quiz-subtitle">太棒了！你已经完成了所有问题</p>
            </div>
            
            <div class="quiz-card">
                <div style="font-size: 5rem; margin: 1rem 0;">🎊</div>
                <p class="quiz-result-text" style="color: #2d1b69; font-size: 1.3rem;">
                    知识就是力量！继续探索其他景点吧～
                </p>
                <a href="../map.html" class="quiz-next-btn" style="display: inline-block; text-decoration: none; margin-top: 1.5rem;">
                    返回地图 ←
                </a>
            </div>
        </div>
    `;
}

// 知识点收集
function initKnowledgePoints() {
    if (knowledgePointsGlobal.length === 0) return;
    
    knowledgePointsGlobal.forEach(point => {
        const element = document.querySelector(`[data-knowledge="${point.id}"]`);
        if (element) {
            element.addEventListener('click', () => collectPoint(point));
        }
    });
}

function collectPoint(point) {
    if (point.collected) return;
    
    point.collected = true;
    collectedPoints++;
    updateCollectibleBadge();
    showCollectPopup(point);
}

function showCollectPopup(point) {
    const popup = document.createElement('div');
    popup.className = 'collect-popup';
    popup.innerHTML = `
        <div class="collect-popup-icon">✨</div>
        <div class="collect-popup-text">收集成功！</div>
        <div style="margin-top: 0.5rem; opacity: 0.9;">${point.label}</div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => popup.classList.add('show'), 10);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 500);
    }, 2000);
}

// 收集徽章
function initCollectibleBadge() {
    if (knowledgePointsGlobal.length === 0) return;
    updateCollectibleBadge();
}

function updateCollectibleBadge() {
    let badge = document.getElementById('collectible-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'collectible-badge';
        badge.className = 'collectible-badge';
        document.body.appendChild(badge);
    }
    
    badge.innerHTML = `
        <div class="collectible-count">${collectedPoints}/${knowledgePointsGlobal.length}</div>
        <div class="collectible-label">知识点</div>
    `;
}

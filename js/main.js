// 研学江西 - 主JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
    // ========== 欢迎页面交互逻辑 ==========
    const welcomeScreen = document.getElementById('welcomeScreen');
    const welcomeHint = document.getElementById('welcomeHint');
    const loadingContainer = document.getElementById('loadingContainer');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const loadingTips = document.getElementById('loadingTips');
    
    if (welcomeScreen && loadingContainer) {
        welcomeScreen.addEventListener('click', function() {
            // 隐藏点击提示
            if (welcomeHint) {
                welcomeHint.style.opacity = '0';
                welcomeHint.style.pointerEvents = 'none';
            }
            
            // 显示进度条
            loadingContainer.classList.add('active');
            
            // 开始加载进度
            startLoadingProgress();
        });
    }
    
    // 加载进度函数
    function startLoadingProgress() {
        let progress = 0;
        const tips = [
            '准备开启赣鄱文化之旅',
            '加载历史遗迹数据...',
            '整理博物馆展品信息...',
            '优化地图导航路线...',
            '准备景点详细介绍...',
            '加载完成，即将启程！'
        ];
        
        // 使用更快的更新频率，让进度更明显
        const interval = setInterval(function() {
            // 每次增加5-15%的进度
            progress += 5 + Math.random() * 10;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // 更新进度条和百分比
                if (progressFill) {
                    progressFill.style.width = '100%';
                }
                if (progressPercent) {
                    progressPercent.textContent = '100%';
                }
                if (loadingTips) {
                    loadingTips.textContent = tips[tips.length - 1];
                }
                
                // 等待1.5秒后添加淡出动画并跳转
                setTimeout(function() {
                    if (welcomeScreen) {
                        welcomeScreen.classList.add('fade-out');
                    }
                    
                    // 等待动画完成后跳转
                    setTimeout(function() {
                        window.location.href = 'map.html';
                    }, 800);
                }, 1500);
            } else {
                // 更新进度条和百分比
                if (progressFill) {
                    progressFill.style.width = progress + '%';
                }
                if (progressPercent) {
                    progressPercent.textContent = Math.floor(progress) + '%';
                }
                
                // 根据进度更新提示文字
                const tipIndex = Math.min(Math.floor(progress / 20), tips.length - 1);
                if (loadingTips) {
                    loadingTips.textContent = tips[tipIndex];
                }
            }
        }, 300); // 每300毫秒更新一次
    }

    // ========== 藏宝图地图页面交互逻辑 ==========
    const mapMarkers = document.querySelectorAll('.map-marker');
    if (mapMarkers.length > 0) {
        mapMarkers.forEach(function(marker) {
            // 确保所有标记点重置为初始状态
            marker.style.transform = '';
            marker.style.opacity = '';
            
            marker.addEventListener('click', function() {
                const locationId = this.getAttribute('data-location');
                if (locationId) {
                    window.location.href = 'locations/' + locationId + '.html';
                }
            });
        });
    }

    // ========== 地点详情页面返回功能 ==========
    const backButtons = document.querySelectorAll('.back-btn');
    if (backButtons.length > 0) {
        backButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                history.back();
            });
        });
    }
});
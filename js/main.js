// 研学江西 - 主JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
    console.log('研学江西网站已加载');

    // ========== 欢迎页面交互逻辑 ==========
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', function() {
            // 添加淡出动画
            welcomeScreen.classList.add('fade-out');

            // 等待动画完成后跳转
            setTimeout(function() {
                window.location.href = 'map.html';
            }, 800);
        });
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
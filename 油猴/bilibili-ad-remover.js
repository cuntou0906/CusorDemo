// ==UserScript==
// @name         B站播放列表广告移除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除B站视频播放页面右侧播放列表上方的广告
// @author       You
// @match        *://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义要移除的广告选择器
    const AD_SELECTORS = [
        '.video-card-ad-small',  // 播放列表上方的广告卡片
        '.ad-report',           // 广告报告容器
        '.slide-ad',            // 滑动广告
        '.video-page-special-card-small', // 特殊广告卡片
        '.video-page-game-card-small',    // 游戏广告卡片
        '.video-page-special-card'        // 其他特殊广告
    ];

    // 移除广告的函数
    function removeAds() {
        AD_SELECTORS.forEach(selector => {
            const adElements = document.querySelectorAll(selector);
            adElements.forEach(element => {
                element.remove();
            });
        });
    }

    // 创建观察器来监视DOM变化
    const observer = new MutationObserver(() => {
        removeAds();
    });

    // 开始观察
    function startObserving() {
        const targetNode = document.querySelector('.video-page-card-small');
        if (targetNode) {
            observer.observe(targetNode.parentNode, {
                childList: true,
                subtree: true
            });
            removeAds(); // 立即执行一次清理
        } else {
            // 如果目标元素还没加载，等待后重试
            setTimeout(startObserving, 1000);
        }
    }

    // 页面加载完成后启动观察器
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }

    // 在页面卸载时断开观察器
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})(); 
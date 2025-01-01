// ==UserScript==
// @name         Live2D左下角模型
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页左下角添加可切换的Live2D模型
// @author       You
// @match        *://*/*
// @exclude      *://cuntou0906.github.io/*
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @require      https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #waifu {
            position: fixed !important;
            left: -4px !important;
            bottom: -4px !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            transform: scale(0.5) !important;
            transform-origin: bottom left !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        #waifu-tool {
            z-index: 2147483647 !important;
            transform: scale(1.6) !important;
            right: auto !important;
            left: 0 !important;
            padding: 10px !important;
        }
        #waifu-tool span {
            margin: 0 8px !important;
        }
        #waifu-message, #waifu-tip {
            font-size: 40px !important;
            width: 300px !important;
            min-height: 100px !important;
            padding: 12px 16px !important;
            line-height: 1.5 !important;
            color: #000000 !important;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8) !important;
            background-color: rgba(255,255,255,0.9) !important;
            border: 2px solid #000000 !important;
            border-radius: 10px !important;
            box-shadow: 0 3px 15px rgba(0,0,0,0.2) !important;
        }
        #waifu-message p, #waifu-tip p {
            font-size: 40px !important;
            color: #000000 !important;
            font-weight: bold !important;
        }
        #live2d {
            z-index: 2147483647 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // 配置Live2D
    window.live2d_settings = {
        modelId: 6,                  // 默认使用黑猫模型
        modelTexturesId: 0,          // 默认材质
        modelStorage: true,          // 记住上次选择的模型
        waifuSize: '75x100',        // 模型大小
        waifuTipsSize: '0x0',       // 设置提示框尺寸为0
        waifuFontSize: '0px',       // 设置提示框字体为0
        waifuToolFont: '24px',      // 工具栏字体
        waifuToolLine: '48px',      // 工具栏行高
        waifuToolTop: '0px',        // 工具栏顶部边距
        waifuMinWidth: '0px',       // 面页小于指定宽度隐藏看板娘
        waifuEdgeSide: 'left:0',    // 左侧定位
        waifuDraggable: 'disable',  // 禁用拖拽
        showToolMenu: true,         // 显示工具栏
        canCloseLive2d: true,       // 显示关闭按钮
        canSwitchModel: true,       // 开启模型切换
        canSwitchTextures: true,    // 开启材质切换
        canSwitchHitokoto: false,   // 关闭一言切换
        showHitokoto: false,        // 关闭一言显示
        showWelcomeMessage: false,  // 关闭欢迎消息
        showF12Message: false,      // 关闭F12调试消息
        showCopyMessage: false,     // 关闭复制消息
        showMessage: false,         // 关闭所有消息
    };

    // 可用模型列表
    const models = [
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-hijiki@latest/assets/hijiki.model.json',      // 黑猫
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-tororo@latest/assets/tororo.model.json',      // 白猫
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-shizuku@latest/assets/shizuku.model.json',    // 萌娘
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu@latest/assets/koharu.model.json',      // 小可爱
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-haruto@latest/assets/haruto.model.json',      // 男孩子
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-miku@latest/assets/miku.model.json',          // 初音
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-z16@latest/assets/z16.model.json',            // 制服少女
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-chitose@latest/assets/chitose.model.json',    // 智乃
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-epsilon2_1@latest/assets/Epsilon2.1.model.json', // 艾普西龙
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-gf@latest/assets/Gantzert_Felixander.model.json', // 菲利克斯
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-haru/01@latest/assets/haru01.model.json',     // 春日
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-haru/02@latest/assets/haru02.model.json',     // 春日校服
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-hibiki@latest/assets/hibiki.model.json',      // 响
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-izumi@latest/assets/izumi.model.json',        // 泉
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-mico@latest/assets/mico.model.json',          // 小帽子
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-nico@latest/assets/nico.model.json',          // 妮可
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-nietzsche@latest/assets/nietzsche.model.json', // 尼采
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-nipsilon@latest/assets/nipsilon.model.json',  // 尼普西龙
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-nito@latest/assets/nito.model.json',          // 妮托
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-tsumiki@latest/assets/tsumiki.model.json',    // 弹妹
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-unitychan@latest/assets/unitychan.model.json', // Unity娘
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@latest/assets/wanko.model.json',        // 小狗
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-z16@latest/assets/z16.model.json',            // 制服
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-hibiki@latest/assets/hibiki.model.json',      // 响
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu@latest/assets/koharu.model.json'       // 小春
    ];

    // 确保在页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLive2D);
    } else {
        initLive2D();
    }

    function initLive2D() {
        setTimeout(() => {
            if (typeof loadlive2d === 'function') {
                loadlive2d('live2d', models[0]);
            }
        }, 1000);
    }
})(); 
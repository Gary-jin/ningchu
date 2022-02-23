/**
 *  Shopro全局配置文件
 */
// http://www.fuwushe.vip  备用
export const BASE_URL = 'http://www.ncjk666.com' //后台根域名 https://demo.shopro.top
export const API_URL = `${BASE_URL}/addons/shopro/` //后台接口域名
export const IMG_URL = 'http://www.ncjk666.com' //全局网络图片地址变量，css背景图片地址变量在uni.scss
export const MAP_KEY = 'a8d0364146b75c1fca716609e8309ee7'; //高德地图开发者Web服务key,逆坐标解析
export const HAS_LIVE = false //后台是否开通直播权限,根据情况在manifest.json中，开启注释相应组件的引入，pages.json中打开直播

import Vue from 'vue'
import App from './App'

import apiRequest from './common/request.js' // 请求js
Vue.prototype.$http = apiRequest // 请求

Vue.config.productionTip = false

//引入websocket文件
import wsRequest from './common/socket.js'
//开启websocket
let websocket = new wsRequest("ws://45.158.35.6:2348",5000)
//挂载到全局
Vue.prototype.$socket = websocket

import uView from "./uview-ui";
Vue.use(uView);

App.mpType = 'app'

// let main = plus.android.runtimeMainActivity();
// //为了防止快速点按返回键导致程序退出重写quit方法改为隐藏至后台  
// plus.runtime.quit = function() {
// 	main.moveTaskToBack(false);
// };
// //重写toast方法如果内容为 ‘再次返回退出应用’ 就隐藏应用，其他正常toast 
// plus.nativeUI.toast = (function(str) {
// 	if (str =='再次返回退出应用') {
// 		plus.runtime.quit();
// 	} else {
// 		uni.showToast({
// 			title: '再次返回退出应用',
// 			icon: 'none'
// 		})
// 	}
// });

const app = new Vue({
    ...App
})
app.$mount()

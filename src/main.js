import Vue from 'vue'
import App from './App'
import mixin from './common/mixin'
import {router,RouterMount} from './router.js'  //路径换成自己的
Vue.use(router)

var { postRequest } = require("md5/http.js");

Vue.mixin(mixin)

// require('./common/page-extend.js');

Vue.config.productionTip = false
Vue.prototype.$postRequest = postRequest


App.mpType = 'app'

const app = new Vue({
  ...App
})


//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app,router,'#app')
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif

console.log(process.env);
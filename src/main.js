import Vue from 'vue'
import App from './App'
import mixin from './common/mixin'

var { postRequest } = require("md5/http.js");

Vue.mixin(mixin)

// require('./common/page-extend.js');

Vue.config.productionTip = false
Vue.prototype.$postRequest = postRequest


App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

console.log(process.env);
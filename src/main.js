import Vue from 'vue'
import App from './App'
import mixin from './common/mixin'

Vue.mixin(mixin)

require('./common/page-extend.js');

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

console.log(process.env);
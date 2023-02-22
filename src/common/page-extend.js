import Vue from 'vue'

/**
 * 在methods的方法重写继承需要写到Vue.config.optionMergeStrategies.methods
 */
const mixin = {
  data() {
    return {
      ///默认参数
      _options: {}
    }
  },
  onLoad(options) {
    console.log("onLoad");
    this._options = options
  },
  onUnload(){
    
  },
  methods: {
    onTLoad(options) {
    },
  }
}

Vue.mixin(mixin)

let orginMethods = Vue.config.optionMergeStrategies.methods;
Vue.config.optionMergeStrategies.methods = function (toVal, fromVal) {
  // 返回合并后的值
  if (!!toVal && !!fromVal) {
    if (!!toVal.onTLoad && !!fromVal.onTLoad) {
      const orginonTLoad = fromVal.onTLoad;
      fromVal.onTLoad = function (options) {
      
        ///调用最基础的onTLoad
        toVal.onTLoad.call(this,options)
        ///调用子的onTLoad
        orginonTLoad.call(this, options)
      }
    }
  }

  const finalVal = orginMethods(toVal, fromVal)
  return finalVal

}


require('./page-refresh-paging.js');

/*
保证最后顺序在onload调用onTLoad
*/
let orginOnLoad = Vue.config.optionMergeStrategies.onLoad;
let lastOnLoad = function (options) {
  console.log("保证最后顺序在onload调用onTLoad");
  this.$nextTick(
    ()=>{
      if (!this.$refs.paging) {
       
          this.onTLoad(options)
      }
    }
  )
 
};

Vue.config.optionMergeStrategies.onLoad = function (toVal, fromVal) {

  ///不重复添加lastOnLoad,不然会导致重复调用lastOnLoad
  if (Array.isArray(toVal) && toVal.indexOf(lastOnLoad) == -1) {
    toVal.push(lastOnLoad)
  }
  const finalVal = orginOnLoad(toVal, fromVal)

  return finalVal
}



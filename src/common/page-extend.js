import Vue from 'vue'

/**
 * 在methods的方法重写继承需要写到Vue.config.optionMergeStrategies.methods
 */
const mixin = {
  data() {
    return {
      ///默认参数
      _options: {},
      ///子组件页面配置
      componentPagePro: {
        isLoad: false,
        ///主页面的解析的参数
        options: {},
        ///页面是否显示
        isShow: false
      }
    }
  },

  onLoad(options) {
    console.log("onLoad");
    this.componentPagePro.options = this._options = options
  },
  onShow() {
    this.$nextTick(
      () => {
        this.componentPagePro.isShow = true
        this.componentPagePro.isLoad = true
      }
    )

  },
  onHide() {
    this.$nextTick(
      () => {
        this.componentPagePro.isShow = false
      }
    )
  },
  methods: {
    onTLoad(options) {


    },
    queryList(pageNo, pageSize) {
      if (pageNo == 1) {
        this.onTLoad(this._options)
      }
    },
    refresh(firstLoad=true) {
      if (!firstLoad && !this.componentPagePro.isLoad) return
      if (!!this.$refs.paging) {
        this.$refs.paging.reload()
      } else {
        this.onTLoad(this._options)
      }
    }
    
  }
}

let orginMethods = Vue.config.optionMergeStrategies.methods;
Vue.config.optionMergeStrategies.methods = function (toVal, fromVal) {
  // 返回合并后的值
  if (!!toVal && !!fromVal && !toVal.isComponent) {
    if (!!toVal.onTLoad && !!fromVal.onTLoad) {
      const orginonTLoad = fromVal.onTLoad;
      // console.log(toVal,fromVal);
      fromVal.onTLoad = function (options) {

        ///调用最基础的onTLoad
        toVal.onTLoad.call(this, options)
        ///调用子的onTLoad
        orginonTLoad.call(this, options)
      }
    }

    if (!!toVal.queryList && !!fromVal.queryList) {
      const orginonqueryList = fromVal.queryList;

      fromVal.queryList = function (pageNo, pageSize) {
        ///调用最基础的queryList
        toVal.queryList.call(this, pageNo, pageSize);
        ///调用子的queryList
        orginonqueryList.call(this, pageNo, pageSize)
      }
    }
  }

  const finalVal = orginMethods(toVal, fromVal)
  return finalVal

}


/*
保证最后顺序在onload调用onTLoad
*/
let orginOnLoad = Vue.config.optionMergeStrategies.onLoad;
let lastOnLoad = function (options) {
  console.log("保证最后顺序在onload调用onTLoad");
  this.$nextTick(
    () => {
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

export default mixin
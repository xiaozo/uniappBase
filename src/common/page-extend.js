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
  methods: {
    onTLoad(options) {
    },
    queryList(pageNo, pageSize) {
      if (pageNo == 1) {
          this.onTLoad(this._options)
          if (!!this.$refs.paging && !this.$refs.paging.LoadingMoreEnabled) {
              ///如果是下拉刷新 且不需要加载更多分页，就延迟收起刷新按钮
              setTimeout(() => {
                  // this.$refs.paging.endRefresh();
                  this.$refs.paging.endRefresh();
                }, 600);
          }
      }
  },
  }
}

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

    if (!!toVal.queryList && !!fromVal.queryList && !fromVal.nomerge && !toVal.nomerge) {
      const orginonqueryList = fromVal.queryList;
      
      fromVal.queryList = function (pageNo,pageSize) {
        ///调用最基础的queryList
        toVal.queryList.call(this,pageNo,pageSize);
        ///调用子的queryList
        orginonqueryList.call(this, pageNo,pageSize)
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

export default mixin



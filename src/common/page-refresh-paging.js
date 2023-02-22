import Vue from 'vue'

const mixin = {
    data() {
        return {

        }
    },
    methods: {
        queryList(pageNo, pageSize) {
            if (pageNo == 1) {
              console.log(pageNo);
                this.onTLoad(this._options)
                if (!!this.$refs.paging && !this.$refs.paging.LoadingMoreEnabled) {
                    ///如果是下拉刷新 且不需要加载更多分页，就延迟收起刷新按钮
                    setTimeout(() => {
                        // this.$refs.paging.endRefresh();
                        this.$refs.paging.endRefresh();
                      }, 1000);
                }
            }
        },
    }
}

Vue.mixin(mixin)

let orginMethods = Vue.config.optionMergeStrategies.methods;
Vue.config.optionMergeStrategies.methods = function (toVal, fromVal) {
  // 返回合并后的值
  if (!!toVal && !!fromVal) {
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
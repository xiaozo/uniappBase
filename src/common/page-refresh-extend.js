import Vue from 'vue'

const mixin = {
  data() {
    return {
      ///默认参数
      pageList: [],
      params: {
        
      },
      nomore: false,
      loadmore: false,
      refreshing: false,
      refreshflag: false,
      tiptxt: "正在加载中……"
    }
  },
  onLoad(args) {
  
    if (!!this._openPaging()) {
      ///只有开启分页功能才设置分页参数
      this.setData({
        ['params.page_number']: 1,
        ['params.page_size']: this._defaultPageSize(),
      })
    }
   

  },
  onPullDownRefresh() {
     ///如果有onPullDownRefreshHandle这个方法就调用没有就调用onMyLoad
     if (!!this.onPullDownRefreshHandle) {
      this.onPullDownRefreshHandle.call(this)
    } else {
      if (!!this.onTLoad) this.onTLoad.call(this, this._options)
    }

    this.setData({
      refreshing: true
    })

    setTimeout(() => {
      uni.stopPullDownRefresh();
      this.setData({
        refreshing: false
      })
    }, 1500)

  },
  onReachBottom() {
    console.log("onReachBottom");

    if (this._noenabledloadmore || this.refreshflag || this.nomore) return

    this.setData({
      refreshflag: true,
      loadmore: true,
    })

    pageNet.call(this)
  },
  methods: {
    ///是否开启分页
    _openPaging() {
      return this.getPageNet != undefined
    },
    ///默认的分页size
    _defaultPageSize() {
      return 20
    }
  }
}


Vue.mixin(mixin)

let pageNet = function () {
  var obj = this.getPageNet && this.getPageNet.call(this, this.params);
  if (!obj) {
    ///不需要加载更多分页数据
    this._noenabledloadmore = true;
    if (!this.nomore) this.setData({ nomore: true })
    return
  }

  ///调用分页数据
  this._noenabledloadmore = false;
  obj.then(data => {
   
    let changeData = {};
    let datas = this.params.page_number == 1 ? [] : this.pageList;
    let len = datas.length + data.rows.length;
    if (data.rows.length) {
      // if (datas.length == 0) {
      //   datas.push(...data.rows)
      //   changeData['pageList'] = datas;
      // } else {
      //   let i = datas.length;
      //   data.rows.forEach(item => {
      //     changeData[`pageList[${i++}]`] = item;
      //   })
      // }

      datas.push(...data.rows)
      changeData['pageList'] = datas;
    }

    changeData['refreshflag'] = false;
    if (!data.rows.length && this.params.page_number == 1) {
      changeData['tiptxt'] = '暂无数据'
    }
    changeData.loadmore = false;

    if (len >= data.total) {
      changeData['nomore'] = true;
    }

    changeData['params.page_number'] = this.params.page_number + 1

    this.setData(changeData);
   
  }).catch(err => {
    console.log(err);
    this.setData({
      refreshflag: false,
      tiptxt: '暂无数据',
      loadmore: false
    })
  })
}

let orginMethods = Vue.config.optionMergeStrategies.methods;
Vue.config.optionMergeStrategies.methods = function (toVal, fromVal) {

  // 返回合并后的值
  if (!!toVal && !!fromVal) {
    if (!!toVal.onTLoad && !!fromVal.onTLoad) {
      const orginonTLoad = fromVal.onTLoad;
      fromVal.onTLoad = function (options) {

        let changeVal = {nomore: false};
        
        if (!!this._openPaging()) {
          changeVal['params.page_number'] = 1;
        }

        this.setData(changeVal)
       

        orginonTLoad.call(this, options)

        pageNet.call(this)
      }
    }
  }


  const finalVal = orginMethods(toVal, fromVal)
  return finalVal

}


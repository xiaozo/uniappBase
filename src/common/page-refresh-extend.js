import Vue from 'vue'

const mixin = {
  data() {
    return {
      ///默认参数
      pageList: [],
      params: {
        page_number: 1,
        page_size: 20
      },
      nomore: false,
      loadmore: false,
      refreshing: false,
      refreshflag: false,
      tiptxt: "正在加载中……"
    }
  },
  onLoad(args) {
    console.log("refresh-onLoad");
    this.setData({
      params: {
        page_number: 1,
        page_size: this._defaultPageSize()
      }
    })

  },
  onPullDownRefresh() {

  },
  methods: {
    ///默认的分页size
    _defaultPageSize() {
      return 20
    }
  }
}


Vue.mixin(mixin)

let pageNet = function (config) {

  var obj = config.getPageNet && config.getPageNet.call(this, this.params);
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
      if (datas.length == 0) {
        datas.push(...rows)
        changeData['pageList'] = datas;
      } else {
        let i = datas.length;
        data.rows.forEach(item => {
          changeData[`pageList[${i++}]`] = item;
        })
      }
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
        orginonTLoad.call(this, options)

      }
    }
  }


  const finalVal = orginMethods(toVal, fromVal)
  return finalVal

}


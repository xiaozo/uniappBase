<!-- 基于z-paging封装个性化分页组件演示，可减少大量重复代码\
https://z-paging.zxlee.cn/start/migration-to-vue3.html -->
<template>
  <!-- 这边统一设置z-paging，在页面中使用时就不用重复写 -->
  <!-- 如果要在这里设置极简写法，这里的ref不能设置为paging，设置为其他名即可，因为极简写法会修改/调用第一个包含了ref="paging"的付view中的list和query -->
  <!-- 极简写法在下方设置autowire-list-name="xxx" autowire-query-name="xxx"即可，与minimalism-demo.vue中的一致，并且不用再从这个组件转发到页面，只要遵循上一行的规则即可 -->
  <z-paging
    ref="paging"
    v-model="list"
    auto-show-back-to-top
    refresher-threshold="160rpx"
    @query="myqueryList"
    :useVirtualList="useVirtualList"
    :useInnerList="useInnerList"
    :cellKeyName="cellKeyName"
    :innerListStyle="innerListStyle"
    :preloadPage="preloadPage"
    :cellHeightMode="cellHeightMode"
    :virtualScrollFps="virtualScrollFps"
    :loading-more-enabled="loadingMoreEnabled"
    :hide-empty-view="!ShowEmptyView"
    :auto-show-system-loading="autoShowSystemLoading"
    :auto-hide-loading-after-first-loaded="autoHideLoadingAfterFirstLoaded"
    :fixed="fixed"
    :show-empty-view-reload="showEmptyViewReload"
    :auto="auto"
  >
    <!-- 这里插入一个view到z-paging中，并且这个view会被z-paging标记为top固定在顶部 -->

    <template #top>
      <!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="top"了 -->
      <slot name="top" />
    </template>

    <!-- 这里插入一个view到z-paging中，并且这个view会被z-paging标记为bottom固定在顶部 -->
    <template #bottom>
      <!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="bottom"了 -->
      <slot name="bottom" />
    </template>

    <template #loading>
      <!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="loading"了 -->
      <!-- <slot name="loading" /> -->
      <view class="loading">
        <image class="img" src="/static/loading.png" />
        <view class="text">海风吹啊吹</view>
      </view>
    </template>

    <!-- 这个是插入虚拟列表/内置列表的cell -->
    <template #cell="{ item, index }">
      <slot name="cell" :item="item" :index="index" />
    </template>

    <!-- 这里接收页面传进来的普通slot，如列表数据等 -->
    <slot v-if="LoadDataSuccess" />
  </z-paging>
</template>

<script>
export default {
  name: "my-paging",
  data() {
    return {
      list: [],
      ShowEmptyView: false,
      LoadDataSuccess: false, ///是否数据载入成功，如果为false则根据情况显示空视图
      LoadingMoreEnabled: false,
    };
  },
  props: {
    autoHideLoadingAfterFirstLoaded: {
      type: Boolean,
      default: true,
    },
    autoShowSystemLoading: {
      type: Boolean,
      default: false,
    },
    //用于接收父组件v-model所绑定的list的值
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    ///是否加载更多
    loadingMoreEnabled: {
      type: Boolean,
      default: false,
    },
    ///是否加载数据成功
    loadDataSuccess: {
      type: Boolean,
      default: true,
    },
    //是否显示空数据图重新加载按钮(无数据时)/
    showEmptyViewReload: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    auto: {
      type: Boolean,
      default: true,
    },
    //是否隐藏空页面
    hideEmptyView: {
      type: Boolean,
      default: false,
    },
    //是否使用虚拟列表，默认为否
    useVirtualList: {
      type: Boolean,
      default: false,
    },
    //是否在z-paging内部循环渲染列表(内置列表)，默认为否。若use-virtual-list为true，则此项恒为true
    useInnerList: {
      type: Boolean,
      default: false,
    },
    //内置列表cell的key名称，仅nvue有效，在nvue中开启use-inner-list时必须填此项
    cellKeyName: {
      type: String,
      default: "",
    },
    //innerList样式
    innerListStyle: {
      type: Object,
      default: function () {
        return {};
      },
    },
    //预加载的列表可视范围(列表高度)页数，默认为7，即预加载当前页及上下各7页的cell。此数值越大，则虚拟列表中加载的dom越多，内存消耗越大(会维持在一个稳定值)，但增加预加载页面数量可缓解快速滚动短暂白屏问题
    preloadPage: {
      type: [Number, String],
      default: 7,
    },
    //虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算。可选值【dynamic】，即代表高度是动态非固定的，【dynamic】性能低于【fixed】。
    cellHeightMode: {
      type: String,
      default: "fixed",
    },
    //虚拟列表scroll取样帧率，默认为60，过高可能出现卡顿等问题
    virtualScrollFps: {
      type: [Number, String],
      default: 60,
    },
  },
  mounted() {
    ///处理网络错误
    this.netErrorHandle = function (data) {
      let { page, err } = data;

      if (!!page.$refs?.paging && page.$refs?.paging == this) {
        ///是当前页面才调用error
        this.error(err);
      }
    }.bind(this);
    uni.$on("net-error", this.netErrorHandle);

    ///处理网络成功
    this.netSuccessHandle = function (data) {
      let { page } = data;
      if (!!page.$refs?.paging && page.$refs?.paging == this) {
        ///是当前页面才调用success
        this.success();
      }
    }.bind(this);
    uni.$on("net-success", this.netSuccessHandle);

    this.LoadingMoreEnabled = this.loadingMoreEnabled;
    this.LoadDataSuccess = this.loadDataSuccess;
  },
  destroyed() {
    uni.$off("net-error", this.netErrorHandle);
    uni.$off("net-success", this.netSuccessHandle);
  },
  watch: {
    //监听页面v-mode传过来的值，同时传给z-paging
    value(newVal) {
      this.list = newVal;
    },
    //监听z-paging给当前组件的值，同时传给页面
    list(newVal) {
      //通过emit input修改页面中v-model绑定的值
      this.$emit("input", newVal);
    },
    loadingMoreEnabled(newVal) {
      this.LoadingMoreEnabled = newVal;
    },
    loadDataSuccess(newVal) {
      this.LoadDataSuccess = newVal;
    },
    LoadDataSuccess(newVal) {},
  },
  methods: {
    ///展示空视图
    isShowEmptyView(showEmptyView) {
      this.ShowEmptyView = !this.hideEmptyView ? showEmptyView : false;
    },
    ///结束上拉刷新
    endRefresh() {
      this.$refs.paging.endRefresh();
    },
    //监听z-paging的@query事件，通过emit传递给页面
    myqueryList(pageNo, pageSize) {
      this.$emit("query", pageNo, pageSize);
    },
    //接收页面传递过来的reload事件，传给z-paging
    reload(data) {
      // this.setAutoShowSystemLoading(false)
      this.$refs.paging.reload(data);
    },
    //接收页面传递过来的complete事件，传给z-paging
    complete(data) {
      this.isShowEmptyView(Array.isArray(data));
      this.$refs.paging.complete(data);
    },
    ///请求错误处理
    error(err) {
      if (this.$refs?.paging.pageNo == 1) {
        this.LoadDataSuccess = this.hideEmptyView;
        this.isShowEmptyView(true);
        this.$refs.paging.complete();
      }
    },
    ///请求成功处理
    success() {
      if (this.$refs?.paging.pageNo == 1 && !this.LoadDataSuccess) {
        this.LoadDataSuccess = true;
        this.isShowEmptyView(false);
      }
    },
    /*
			//如果是使用页面滚动，则需要添加以下两行，注意页面那边要引入mixins，与使用页面滚动示例写法相同。
			//接收页面传递过来的updatePageScrollTop事件，传给z-paging
			updatePageScrollTop(data){
				this.$refs.paging.updatePageScrollTop(data);
			},
			//接收页面传递过来的doLoadMore事件，传给z-paging
			doLoadMore(){
				this.$refs.paging.doLoadMore();
			}
			*/
  },
};
</script>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
.loading {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .img {
    animation-name: rotate;
    animation-duration: 2s; /* 动画开始快，结束慢 */
    animation-timing-function: ease-in-out; /* 缓动函数 */
    animation-iteration-count: infinite; /* 无限循环 */
    background-color: transparent;

    height: 90rpx;
    width: 90rpx;
  }
  .text {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #999;
    text-align: center;
  }
}
</style>

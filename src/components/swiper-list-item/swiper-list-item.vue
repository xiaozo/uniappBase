<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
  <view class="content">
    <!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
    <!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
    <my-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :fixed="false"
      :auto="false"
      :loadingMoreEnabled="true"
    >
      <!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
      <view
        class="item"
        v-for="(item, index) in dataList"
        :key="index"
        @click="itemClick(item)"
      >
        <view class="item-title">{{ item.book_name }}</view>
        <view class="item-detail">{{ item.phone_img_url }}</view>
        <view class="item-line"></view>
      </view>
    </my-paging>
  </view>
</template>

<script>
import mixin from "@/common/component-page-extend.js";

export default {
  mixins: [],
  data() {
    return {
      //v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
      dataList: [],
      firstLoaded: false,
    };
  },
  props: {
    //当前组件的index，也就是当前组件是swiper中的第几个
    tabIndex: {
      type: Number,
      default: function () {
        return 0;
      },
    },
    //当前swiper切换到第几个index
    currentIndex: {
      type: Number,
      default: function () {
        return 0;
      },
    },
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        if (newVal === this.tabIndex) {
          //懒加载，当滑动到当前的item时，才去加载
          if (!this.firstLoaded) {
            setTimeout(() => {
              this.$refs.paging.reload();
            }, 100);
            this.firstLoaded = true;
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    onComponentPageShow() {
    },
    onTLoad(options) {},
    queryList(pageNo, pageSize) {
      console.log("queryList");
      //组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
      //这里的pageNo和pageSize会自动计算好，直接传给服务器即可
      //模拟请求服务器获取分页数据，请替换成自己的网络请求
      let params = {
        book_type: 2,
      };
      params.page_size = pageSize;
      params.page_number = pageNo;

      this.$postRequest({
        path: "bookWxapp/getBookList",
        data: params,
      }).then((res) => {
        console.log(res);
        this.$refs.paging.complete(res.rows);
      });
    },
    itemClick(item) {
      console.log(this);
    },
    isComponent() {},
  },
};
</script>

<style>
/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
.content {
  height: 100%;
}

.item {
  position: relative;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rpx 30rpx;
}

.item-detail {
  padding: 5rpx 15rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: white;
  background-color: #007aff;
}

.item-line {
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  height: 1px;
  width: 100%;
  background-color: #eeeeee;
}
</style>

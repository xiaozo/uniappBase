<template>
  <view class="content">
    <my-paging
      ref="paging"
      v-model="list"
      @query="queryList"
      :loadingMoreEnabled="true"
    >
      <view slot="top">
        <uni-nav-bar
          :fixed="true"
          dark
          shadow
          background-color="#007AFF"
          status-bar
          title="自定义导航栏"
        />
      </view>

      <view class="tip">
        {{ tip }}
      </view>
      <button @click="chooseImage">相册</button>
      <image
        @click="preImage"
        :src="imgShow"
        mode="aspectFit"
        class="img"
      ></image>
      <button @click="pz">登录</button>
      <button @click="zb">坐标</button>
      <button @click="qq">请求</button>
      <button @click="calendar">日历</button>
      <button @click="switch1">switch1</button>
      <view
        v-for="(item, index) in list"
        :key="index"
        style="margin-top: 30rpx"
      >
        {{ item.phone_img_url }}
      </view>
    </my-paging>
  </view>
</template>

<script>
function t(target) {
  var _this = target;
  uni.chooseImage({
    count: 1, //默认9
    sizeType: ["original"], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ["camera"], //从相册选择、摄像头
    success: function (res) {
      _this.imgShow = res.tempFilePaths[0];
      t(target);
    },
  });
}

import mixin from '@/common/page-extend.js'

export default {
  mixins:[mixin],
  components: {},
  data() {
    return {
      imgShow: "",
      tip: "",
      list: [],
    };
  },
  methods: {
    queryList(pageNo, pageSize) {
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

    onTLoad(options) {
      console.log("index-onTLoad");
      console.log(this==this.$mp);
    },
    switch1() {
      uni.navigateTo({
        url: "/pages/switch/index?id=1&name=uniapp",
      });
    },
    calendar() {
      uni.navigateTo({
        url: "/pages/calendar/index?id=1&name=uniapp",
      });
    },
    async qq() {
      var that = this;
      this.$postRequest({
        path: "bookWxapp/getBookList",
        data: { book_type: 1, page_number: 1, page_size: 3 },
      })
        .then((res) => {
          console.log(res);
          that.tip = JSON.stringify(res.data);
        })
        .catch((error) => {});
    },
    zb() {
      uni.getLocation({
        success: function (res) {
          console.log("当前位置的经度：" + res.longitude);
          console.log("当前位置的纬度：" + res.latitude);
        },
        fail: function (error) {
          console.log(error);
        },
      });
    },
    pz() {
      var that = this;
      uni.login({
        success: function (loginRes) {
          console.log(loginRes);
          uni.request({
            url: "http://193.168.251.233:8086/login", //仅为示例，并非真实接口地址。
            data: {
              authCode: loginRes.code,
            },
            success: (res) => {
              that.tip = JSON.stringify(res.data);
            },
            fail: (error) => {
              that.tip = JSON.stringify(error);
            },
          });
        },
      });
    },
    chooseImage() {
      t(this);
    },
    preImage() {
      uni.previewImage({
        urls: [this.imgShow],
      });
    },
    decryptPhoneNumber(res) {
      console.log(res);
    },
  },
};
</script>

<style>
.container {
  /* padding: 20rpx; */
  font-size: 14rpx;
  line-height: 24rpx;
}

.img {
  width: 100rpx;
  height: 100rpx;
  background-color: red;
}
.tip {
  font-size: 30rpx;
  margin-bottom: 20rpx;
}
</style>

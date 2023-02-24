<template>
  <view class="content">
    <uni-nav-bar
      :fixed="true"
      color="black"
      dark
      background-color="transparent"
      status-bar
      title="课程"
      :border="false"
    />
    <my-paging ref="paging" :autoShowSystemLoading="false">
      <view class="course-warp">
        <view class="course-name-item">
          <view>
            <view class="course-name"> 少儿编程课-Scratch3 </view>
            <view class="course-name-classroom course-label">
              金港公园授课中心210教室（A501）
            </view>
          </view>
          <image
            style="width: 152rpx; height: 152rpx"
            mode="scaleToFill"
            src="/static/rollCall.png"
          />
        </view>
        <view class="course-card-item course-time">
          <view>
            <view class="course-time-label"> 16:30 </view>
            <view style="display: flex; align-items: center">
              <view class="course-label">上课时间</view>
              <image
                style="width: 72rpx; height: 36rpx; margin-left: 10rpx"
                mode="scaleToFill"
                src="/static/timeout.png"
              />
            </view>
          </view>
          <view>
            <view class="period"> 1.5学时 </view>
            <view class="course-label" style="height: 36rpx"> </view>
          </view>
          <view>
            <view class="course-time-label"> 16:30 </view>
            <view class="course-label"> 下课时间 </view>
          </view>
        </view>
      </view>
    </my-paging>
  </view>
</template>

<script>
import mixin from "@/common/page-extend.js";

export default {
  mixins: [mixin],
  data() {
    return {
      date: "",
      items: [
        {
          title: "Lesson1",
          description: "描述信息",
          type: 1,
        },
        {
          title: "U5-U6考试",
          description: "描述信息",
          type: 2,
        },
        {
          title: "步骤三",
          description: "描述信息",
          type: 3,
        },
      ],
      courseStatus: "startBtn",
      status: 0,
    };
  },
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
};
</script>

<style scoped>
.course-warp {
  background: linear-gradient(0deg, #ffffff 1%, #d4f2de 98%);
}

.course-name-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 40rpx;
  padding-right: 34rpx;
}

.course-name {
  font-size: 44rpx;
  font-weight: 600;
  text-align: left;
  color: #171717;
  line-height: 60rpx;
}

.course-name-classroom {
  margin-top: 16rpx;
}

.course-label {
  font-size: 24rpx;
  font-weight: 400;
  color: #a4a4a4;
}

.course-card-item {
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0px 4rpx 20rpx 0px rgba(213, 242, 223, 0.49);
}

.course-time {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24rpx 30rpx;
  height: 178rpx;
}

.course-time-label {
  font-size: 44rpx;
  font-weight: 600;
  color: #171717;
  line-height: 62rpx;
  margin-bottom: 6rpx;
}

.period {
  font-size: 24rpx;
  font-weight: 400;
  text-align: left;
  color: #64cd8a;
  line-height: 34rpx;
  padding-bottom: 8rpx;
  width: 200rpx;
  border-bottom: 2rpx solid #dddddd;
  text-align: center;
  margin-left: 6rpx;
  margin-right: 46rpx;
  transform: translateY(-50%);
}

.course-status-btn {
  cursor: pointer;
}

.course-status-btn:active {
  filter: brightness(0.92);
}

/* 步骤条 样式的修改*/
.ziji-class .ant-steps-item-error-icon-default {
  background: #a5a7b4;
}

.ziji-class .ant-steps-item-non-active-icon-default {
  background: #a5a7b4;
}

.ant-steps-item-vertical {
  padding-bottom: 30rpx;
}

.ant-steps-item-vertical::after {
  background: #d9dade;
  height: 100%;
  top: 33rpx;
}

.ant-steps-item-active-icon-default,
.ant-steps-item-non-active-icon-default {
  opacity: 0;
}

.ant-steps-item-indicator-icon {
  width: 31rpx;
}

.ant-steps-item-title {
  position: relative;
}

.ant-steps-item-title::before {
  content: "";
  width: 12rpx;
  height: 12rpx;
  background: #a5a7b4;
  border-radius: 50%;
  position: absolute;
  top: calc(50% - 6rpx);
  left: -37rpx;
}
</style>
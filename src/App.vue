<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    uni.getSystemInfo({
      success: function (e) {
        let barHeight = 0;
        // #ifndef MP
        if (e.platform == "android") {
          barHeight = e.statusBarHeight + 50;
        } else {
          barHeight = e.statusBarHeight + 45;
        }
        // #endif

        // #ifdef MP-WEIXIN
        let custom = wx.getMenuButtonBoundingClientRect();
        barHeight = custom.bottom + custom.top - e.statusBarHeight;
        // #endif

        // #ifdef MP-ALIPAY
        barHeight = e.statusBarHeight + e.titleBarHeight;
        // #endif

        console.log("barHeight:", barHeight);
        // 本地缓存
        uni.setStorageSync("bar_height", barHeight); // 状态栏加导航栏的高度
        uni.setStorageSync("screen_width", e.screenWidth); // 屏幕宽度
      },
    });
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */
/* .uni-nav-bar-text {
  font-size: 20px !important;
} */
</style>

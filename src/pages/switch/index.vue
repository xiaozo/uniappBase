<template>
  <z-paging-swiper>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
		<template #top>
			<z-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" />
		</template>
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
		<swiper class="swiper" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish"
    		 <!-- #ifdef MP-ALIPAY -->
		 	:disable-touch='true'
		 <!-- #endif -->
    >
			<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
				<!-- 这里的swiper-list-item为demo中为演示用定义的组件，列表及分页代码在swiper-list-item组件内 -->
				<!-- 请注意，swiper-list-item非z-paging内置组件，在自己的项目中必须自己创建，若未创建则会报组件不存在的错误 -->
        <myswiper-item-container @change="tabsChange" :tabIndex="index" :currentIndex="current" :indexs="tabList.length - 1">
					<swiper-list-item :tabIndex="index" :currentIndex="current" :pagePro="componentPagePro"></swiper-list-item>
				</myswiper-item-container>
			
      </swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
import mixin from "@/common/page-extend.js";

export default {
  mixins: [mixin],
  components: {},
  props: {},
  data() {
    return {
      tabList: ['测试11','测试112'],
      current: 0,
    }
  },
  computed: {},
  methods: {
     onTLoad(options) {
    },
			//tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.current = e.detail.current;
				this.$refs.tabs.unlockDx();
			}
		},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {
    
  },
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style scoped>
.swiper {
		height: 100%;
	}
</style>
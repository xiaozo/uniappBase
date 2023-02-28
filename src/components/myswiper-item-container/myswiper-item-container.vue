<template>
	<view class="content"
	<!-- #ifdef MP-ALIPAY -->
		@touchstart="start"  @touchend="end"
	<!-- #endif -->
	>
		<slot />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			//当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: function(){
					return 0
				}
			},
				//总共的列表个数-1
				indexs: {
					type: Number,
					default: function(){
						return 0
					}
				},
				///手势的速率达到才能滑动
				velocity: {
					type: Number,
					default: function(){
						return 200
					}
				},
		},
		methods:{
			start(e){
				this.touchstartObj = {
					x:e.changedTouches[0].clientX,
					y:e.changedTouches[0].clientY,
					timeStamp:e.timeStamp
				}
				
			    console.log("start:",this.touchstartObj);
			  },
			end(e){
				if (!!this.touchstartObj) {
					let {y,x,timeStamp} = this.touchstartObj
					let diffime = (e.timeStamp - timeStamp) / 1000
					let diffX = e.changedTouches[0].clientX - x
					let diffY = e.changedTouches[0].clientY - y
					  console.log(diffY,diffX);
					  if (Math.abs(diffY) < Math.abs(diffX) && Math.abs(diffX / diffime)>= this.velocity) {
					  	//移动 diffX / diffime > 0 向左 反之向右
						let vars = diffX / diffime > 0 ? -1 : 1
						let index = this.currentIndex + vars;
						index = Math.min(Math.max(0,index),this.indexs) 
						 this.$emit("change", index);
					  }
				}
				this.move = null
			  	
			    },
		}
	}
</script>

<style scoped>
.content {
  height: 100%;
}
</style>
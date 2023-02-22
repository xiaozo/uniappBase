<template>
<view class="content">
  <my-paging  ref="paging" @query="queryList">
  <view class="calendar">
    <!-- 日历头部 -->
    <view class="calendar-week">
      <view class="view">一</view>
      <view class="view">二</view>
      <view class="view">三</view>
      <view class="view">四</view>
      <view class="view">五</view>
      <view class="view">六</view>
      <view class="view">日</view>
    </view>
    <!-- 日历主体 -->
    <swiper
      @change="swiperChange"
      class="swiper"
      :style="{ height: swiperHeight }"
      :circular="true"
      :current="swiperCurrent"
      :duration="swiperDuration"
    >
      <swiper-item
        v-for="(listItem, listIndex) in [dateList0, dateList1, dateList2]"
        :key="listIndex"
      >
        <view class="calendar-main" :style="{ height: swiperHeight }">
          <view
            v-for="(item,index) in listItem"
            :key="index"
            class="day"
            :class="
              item.year === nowDay.year &&
              item.month === nowDay.month &&
              item.day === nowDay.day &&
              (item.day !== selectDay.day || oldCurrent !== listIndex)
                ? 'opactiy'
                : ''
            "
          >
            <view
              class="bg"
              :class="[
                item.year === nowDay.year &&
                item.month === nowDay.month &&
                item.day === nowDay.day
                  ? 'now'
                  : '',
                item.year === selectDay.year && item.month === selectDay.month
                  ? item.day === selectDay.day && oldCurrent === listIndex
                    ? 'select'
                    : ''
                  : 'other-month',
              ]"
              :day="item.day" :year="item.year" :month="item.month"
              @tap.native.stop="selectChange(item.year,item.month,item.day)"
            >
              {{
                item.year === nowDay.year &&
                item.month === nowDay.month &&
                item.day === nowDay.day
                  ? "今"
                  : item.day
              }}</view
            >
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view
      v-if="showShrink"
      @tap.native.stop="openChange"
      class="flex list-open"
    >
      <view class="icon" :class="open ? 'fold' : 'unfold'"> </view>
    </view>
  </view>
</my-paging>
</view>

  
</template>

<script>
export default {
  name: "calendar",
  components: {},
  props: {},
  data() {
    return {
      goNow: true,
      spotMap: {},
      defaultTime: "",
      title: "",
      defaultOpen: false,
      showShrink: true,
      selectDay: {}, //选中时间
      nowDay: {}, //现在时间
      open: false,
      swiperCurrent: 1, //选中时间
      oldCurrent: 1, //之前选中时间
      dateList0: [], //0位置的日历数组
      dateList1: [], //1位置的日历数组
      dateList2: [], //2位置的日历数组
      swiperDuration: 500,
      swiperHeight: "686rpx",
      backChange: false, //跳过change切换
    };
  },
  computed: {},
  methods: {
      
    onTLoad() {
    
        let params = {
        book_type:2
      };
      params.page_size = 1
      params.page_number = 10

      this.$postRequest({
        path: "bookWxapp/getBookList",
        data: params,
      })
        .then((res) => {
          console.log(res);
        
        })
    },
    swiperChange(e) {
      console.log(e);
      // 日历滑动时触发的方法
      if (this.backChange) {
        this.setData({
          backChange: false,
        });
        return;
      }
      //计算第三个索引
      let rest = 3 - e.detail.current - this.oldCurrent;
      let dif = e.detail.current - this.oldCurrent;
      let date;
      if (dif === -2 || (dif > 0 && dif !== 2)) {
        //向右划的情况，日期增加
        if (this.open) {
          date = new Date(this.selectDay.year, this.selectDay.month);
          this.setMonth(date.getFullYear(), date.getMonth() + 1, undefined);
          this.getIndexList({
            setYear: this.selectDay.year,
            setMonth: this.selectDay.month,
            dateIndex: rest,
          });
        } else {
          date = new Date(
            this.selectDay.year,
            this.selectDay.month - 1,
            this.selectDay.day + 7
          );
          this.setMonth(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
          );
          this.getIndexList({
            setYear: this.selectDay.year,
            setMonth: this.selectDay.month - 1,
            setDay: this.selectDay.day + 7,
            dateIndex: rest,
          });
        }
      } else {
        //向左划的情况，日期减少
        if (this.open) {
          date = new Date(this.selectDay.year, this.selectDay.month - 2);
          this.setMonth(date.getFullYear(), date.getMonth() + 1, undefined);
          this.getIndexList({
            setYear: this.selectDay.year,
            setMonth: this.selectDay.month - 2,
            dateIndex: rest,
          });
        } else {
          date = new Date(
            this.selectDay.year,
            this.selectDay.month - 1,
            this.selectDay.day - 7
          );
          this.setMonth(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
          );
          this.getIndexList({
            setYear: this.selectDay.year,
            setMonth: this.selectDay.month - 1,
            setDay: this.selectDay.day - 7,
            dateIndex: rest,
          });
        }
      }
      this.setData({
        oldCurrent: e.detail.current,
      });

      this.setSwiperHeight(e.detail.current);
    },
    setSwiperHeight(index) {
      // 根据指定位置数组的大小计算长度

      this.swiperHeight = this.open ? "686rpx" : "136rpx";
    },
    //更新指定的索引和月份的列表
    getIndexList({ setYear, setMonth, setDay = void 0, dateIndex }) {
      let appointMonth;
      if (setDay) appointMonth = new Date(setYear, setMonth, setDay);
      else appointMonth = new Date(setYear, setMonth);
      let listName = `dateList${dateIndex}`;
      this.setData({
        [listName]: this.dateInit({
          setYear: appointMonth.getFullYear(),
          setMonth: appointMonth.getMonth() + 1,
          setDay: appointMonth.getDate(),
          hasBack: true,
        }),
      });
    },
    //设置月份
    setMonth(setYear, setMonth, setDay) {
      const day = Math.min(
        new Date(setYear, setMonth, 0).getDate(),
        this.selectDay.day
      );
      if (
        this.selectDay.year !== setYear ||
        this.selectDay.month !== setMonth
      ) {
        const data = {
          selectDay: {
            year: setYear,
            month: setMonth,
            day: setDay ? setDay : day,
          },
        };
        if (!setDay) {
          data.open = true;
        }
        this.setData(data, () => {
          
        });
      } else {
        const data = {
          selectDay: {
            year: setYear,
            month: setMonth,
            day: setDay ? setDay : day,
          },
        };
        this.setData(data, () => {
          
        });
      }
    },
    //展开收起
    openChange() {
     
      this.open = !this.open;
      // 更新数据
      const selectDate = new Date(
        this.selectDay.year,
        this.selectDay.month - 1,
        this.selectDay.day
      );
      if (this.oldCurrent === 0) {
        this.updateList(selectDate, -1, 2);
        this.updateList(selectDate, 0, 0);
        this.updateList(selectDate, 1, 1);
      } else if (this.oldCurrent === 1) {
        this.updateList(selectDate, -1, 0);
        this.updateList(selectDate, 0, 1);
        this.updateList(selectDate, 1, 2);
      } else if (this.oldCurrent === 2) {
        this.updateList(selectDate, -1, 1);
        this.updateList(selectDate, 0, 2);
        this.updateList(selectDate, 1, 0);
      }
      this.setSwiperHeight(this.oldCurrent);
    },
    // 回到今天
    switchNowDate() {
      const now = new Date();
      const selectDate = new Date(
        this.selectDay.year,
        this.selectDay.month - 1,
        this.selectDay.day
      );
      let dateDiff =
        (selectDate.getFullYear() - now.getFullYear()) * 12 +
        (selectDate.getMonth() - now.getMonth());
      let diff = dateDiff === 0 ? 0 : dateDiff > 0 ? -1 : 1;
      const diffSum = (x) => (3 + (x % 3)) % 3;
      if (this.oldCurrent === 0) {
        this.updateList(now, -1, diffSum(2 + diff));
        this.updateList(now, 0, diffSum(0 + diff));
        this.updateList(now, 1, diffSum(1 + diff));
      } else if (this.oldCurrent === 1) {
        this.updateList(now, -1, diffSum(0 + diff));
        this.updateList(now, 0, diffSum(1 + diff));
        this.updateList(now, 1, diffSum(2 + diff));
      } else if (this.oldCurrent === 2) {
        this.updateList(now, -1, diffSum(1 + diff));
        this.updateList(now, 0, diffSum(2 + diff));
        this.updateList(now, 1, diffSum(0 + diff));
      }
      this.setData({
        swiperCurrent: diffSum(this.oldCurrent + diff),
        oldCurrent: diffSum(this.oldCurrent + diff),
        backChange: dateDiff !== 0,
      });
      this.setData(
        {
          selectDay: {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
          },
        },
        () => {
          this.triggerEvent("selectDay", this.selectDay);
        }
      );
      this.setSwiperHeight(this.oldCurrent);
    },
    //日历主体的渲染方法
    dateInit(
      { setYear, setMonth, setDay = this.selectDay.day, hasBack = false } = {
        setYear: this.selectDay.year,
        setMonth: this.selectDay.month,
        setDay: this.selectDay.day,
        hasBack: false,
      }
    ) {
      let dateList = []; //需要遍历的日历数组数据
      let now = new Date(setYear, setMonth - 1); //当前月份的1号
      let startWeek = now.getDay(); //目标月1号对应的星期
      let resetStartWeek = startWeek == 0 ? 6 : startWeek - 1; //重新定义星期将星期天替换为6其余-1
      let dayNum = new Date(setYear, setMonth, 0).getDate(); //当前月有多少天
      //let forNum = Math.ceil((resetStartWeek + dayNum) / 7) * 7 //当前月跨越的周数
      let forNum = 42;
      let selectDay = setDay ? setDay : this.selectDay.day;

      if (this.open) {
        //展开状态，需要渲染完整的月份
        for (let i = 0; i < forNum; i++) {
          const now2 = new Date(now);
          now2.setDate(i - resetStartWeek + 1);
          let obj = {};
          obj = {
            day: now2.getDate(),
            month: now2.getMonth() + 1,
            year: now2.getFullYear(),
          };
          dateList[i] = obj;
        }
      } else {
        //非展开状态，只需要渲染当前周
        for (let i = 0; i < 7; i++) {
          const now2 = new Date(now);
          //当前周的7天
          now2.setDate(
            Math.ceil((selectDay + (startWeek - 1)) / 7) * 7 -
              6 -
              (startWeek - 1) +
              i
          );
          let obj = {};
          obj = {
            day: now2.getDate(),
            month: now2.getMonth() + 1,
            year: now2.getFullYear(),
          };
          dateList[i] = obj;
        }
      }
      if (hasBack) {
        return dateList;
      }
      this.setData({
        dateList1: dateList,
      });
    },
    //一天被点击时
    selectChange(year,month,day) {
      const selectDay = {
        year: year,
        month: month,
        day: day,
      };
      console.log(this.selectDay,selectDay);
      if (
        this.open &&
        (this.selectDay.year !== year || this.selectDay.month !== month)
      ) {
        if (
          year * 12 + month >
          this.selectDay.year * 12 + this.selectDay.month
        ) {
          // 下个月
          if (this.oldCurrent == 2)
            this.setData({
              swiperCurrent: 0,
            });
          else
            this.setData({
              swiperCurrent: this.oldCurrent + 1,
            });
        } else {
          // 点击上个月
          if (this.oldCurrent == 0)
            this.setData({
              swiperCurrent: 2,
            });
          else
            this.setData({
              swiperCurrent: this.oldCurrent - 1,
            });
        }
        this.setData({
          ["selectDay.day"]: day,
        });
      } else if (this.selectDay.day !== day) {
        this.setData({
          selectDay: selectDay,
        });
      }

    
    },
    updateList(date, offset, index) {
      if (this.open) {
        //打开状态
        const setDate = new Date(
          date.getFullYear(),
          date.getMonth() + offset * 1
        ); //取得当前日期的上个月日期
        this.getIndexList({
          setYear: setDate.getFullYear(),
          setMonth: setDate.getMonth(),
          dateIndex: index,
        });
      } else {
        const setDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + offset * 7
        ); //取得当前日期的七天后的日期
        this.getIndexList({
          setYear: setDate.getFullYear(),
          setMonth: setDate.getMonth(),
          setDay: setDate.getDate(),
          dateIndex: index,
        });
      }
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    let now = this.defaultTime ? new Date(this.defaultTime) : new Date();
    let selectDay = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.setData({
      nowDay: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      },
    });

    this.setMonth(selectDay.year, selectDay.month, selectDay.day);
    this.updateList(now, -1, 0);
    this.updateList(now, 0, 1);
    this.updateList(now, 1, 2);

    this.setSwiperHeight(1);
  },
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
.icon {
  width: 80rpx;
  height: 4rpx;
  background: #979797;
  border-radius: 4rpx;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.swiper {
  transition: height 0.3s;
}

.header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.today {
  width: 88rpx;
  height: 42rpx;
  background: #f3f4f4;
  border-radius: 22rpx;
  font-size: 24rpx;
  line-height: 42rpx;
  color: #868d8d;
  text-align: center;
  margin-right: 6rpx;
}

.today:active {
  background: #dfdfdf;
  color: #5f6464;
}

.direction-column {
  flex-direction: column;
}

.flex1 {
  flex: 1;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.align-start {
  align-items: flex-start;
}

.align-end {
  align-items: flex-end;
}

.align-stretch {
  align-items: stretch;
}

.calendar {
  padding-top: 40rpx;
  box-shadow: 0px 4rpx 20rpx 0px rgba(40, 62, 90, 0.11);
  background: #fff;
}

.calendar .title {
  padding: 10rpx 16rpx 10rpx 20rpx;
  line-height: 60rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1c2525;
  line-height: 44px;
  letter-spacing: 1px;
}

.calendar .title .year-month {
  margin-right: 20rpx;
}

.calendar .title .icon {
  padding: 0 16rpx;
  font-size: 32rpx;
  color: #999;
}

.calendar .title .open {
  background-color: #f6f6f6;
  color: #999;
  font-size: 22rpx;
  line-height: 36rpx;
  border-radius: 18rpx;
  padding: 0 14rpx;
}

.list-open {
  position: relative;
  justify-content: center;
  height: 20rpx;
}

.fold {
  transform: rotate(0deg);
}

.unfold {
  transform: rotate(180deg);
}

.calendar .calendar-week {
  line-height: 40rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #a5a7b3;
  font-weight: 500;
  box-sizing: border-box;
}

.calendar .calendar-week .view {
  width: calc(100% / 7);
  display: inline-block;
  text-align: center;
}
.calendar .calendar-week .view:last-child {
  margin-right: 0;
}
.calendar .calendar-main {
  padding: 36rpx 20rpx 0rpx;
  transition: height 0.3s;
  overflow: hidden;
  box-sizing: border-box;
}

.calendar .calendar-main .day {
  position: relative;
  width: calc(100% / 7);
  display: inline-block;
  text-align: center;
}
.calendar .calendar-main .day .bg {
  font-family: DIN Alternate;
  line-height: 46rpx;
  font-size: 36rpx;
  color: #1f1f1f;
  width: 70rpx;
  height: 70rpx;
  font-weight: 700;
  line-height: 70rpx;
  margin: 0 auto;
  margin-bottom: 40rpx;
}

.calendar .calendar-main .day .now,
.calendar .calendar-main .day .select {
  border-radius: 50%;
  text-align: center;
  color: #fff;
  font-weight: 500;
  /* font-size: 28rpx; */
  background: #ff7b33;
}
.calendar .calendar-main .day .select {
  font-size: 36rpx;
}

.calendar .calendar-main .day .spot::after {
  position: absolute;
  content: "休";
  color: #22b65e;
  right: 18rpx;
  top: -10rpx;
  font-size: 18rpx;
}

.calendar .calendar-main .day .deep-spot::after {
  position: absolute;
  content: "";
  display: block;
  width: 10rpx;
  height: 10rpx;
  bottom: 22rpx;
  background: #bdbfc9;
  border-radius: 50%;
  left: 0;
  right: 0;
  margin: auto;
}

.calendar .calendar-main .day .other-month {
  color: #bdbfc9;
}

.header-wrap .month {
  font-size: 28rpx;
  color: #929797;
  line-height: 40rpx;
}
.opactiy .bg {
  background: #ffb288 !important;
}
</style>
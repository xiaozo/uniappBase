import Vue from 'vue'

/**
 * 在methods的方法重写继承需要写到Vue.config.optionMergeStrategies.methods
 */
const mixin = {
    props: {
        pagePro: {
            type: Object,
            default: function () {
                return {
                    options: {},
                    isShow: false
                }
            },
        },
    },

    data() {
        return {
            ///默认参数
            _options: {},
        }
    },
    created() {
        this._options = this.pagePro.options;
        this.$nextTick(
            () => {
                if (!this.$refs.paging) {

                    this.onTLoad(this._options)
                }
            }
        )
    },
    watch: {
        'pagePro.isShow'(newVal) {
            if (!!newVal) {
                if (!!this.onComponentPageShow) this.onComponentPageShow()
            } else {
                if (!!this.onComponentPageHide) this.onComponentPageHide()
            }
        }
    },
    methods: {
        onTLoad(options) {
            console.log("component-base-onTLoad");
        },
        queryList(pageNo, pageSize) {
            if (pageNo == 1) {
                this.onTLoad(this._options)
                if (!!this.$refs.paging && !this.$refs.paging.LoadingMoreEnabled) {
                    ///如果是下拉刷新 且不需要加载更多分页，就延迟收起刷新按钮
                    setTimeout(() => {
                        this.$refs.paging.endRefresh();
                    }, 600);
                }
            }
        },
    }
}

export default mixin
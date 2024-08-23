import Vue from 'vue'

/**
 * 组件的页面
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
            }
        },
        refresh(firstLoad=true) {
            if (!firstLoad && !this.componentPagePro.isLoad) return
            if (!!this.$refs.paging) {
              this.$refs.paging.reload()
            } else {
              this.onTLoad(this._options)
            }
          }
    }
}

export default mixin
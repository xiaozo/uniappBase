export default {
    data() {
        return {
          ///默认参数
        
        }
    },
    methods: {
     
      setData(data,finish) {
      // 方法放在for循环之外，否则每次循环都会赋值一次
      // 放在外面后内部无法访问key键，作为参数传入
      const deepSet = function (o, arr, k, n) {
        if (n < arr.length - 1) {
          // 如果还没到最后一项且当前项不是一个对象，需要赋值为一个对象，否则会报错
          if (typeof o[arr[n]] !== "object") o[arr[n]] = {};
          return deepSet(o[arr[n]], arr, k, ++n);
        }
        o[arr[n]] = data[k];
      };
      for (let k in data) {
        if (k.indexOf(".") > -1) {
          const ka = k.split(".");
          deepSet(this, ka, k, 0);
        } else {
          this[k] = data[k];
        }
      }
      
      if (!!finish) this.$nextTick(finish())
      
    },
    }
}

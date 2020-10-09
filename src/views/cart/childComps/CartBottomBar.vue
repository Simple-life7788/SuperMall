<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
                    :isChecked="isSelectAll"
                    @click.native="checkAll"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcuClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "../../../components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {CheckButton},
    computed: {
      ...mapGetters({
        cartList: 'cartList'
      }),
      totalPrice() {
        return this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
        /*有时候计算位数较多会导致计算金额挤出内容区无法显示*/
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        //效率较低需要遍历完所有元素
        //1.return !(this.cartList.filter(item => !item.checked).length)
        //无数据时候会默认选中，需要进行判断
        if (this.cartList.length === 0) return false
        //2.return !(this.cartList.find(item => !item.checked))
        for (let item of this.cartList) {
          if (!item.checked) {
            return false
          }
        }
        return true
      }
    },
    methods: {
      checkAll() {
        if (this.isSelectAll) {
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
        //此方法不行，在遍历过程中，两个值之间互相存在影响 无法达到期望的效果
        // this.cartList.forEach(item =>item.checked = !this.isSelectAll)

        // if (this.isSelectAll) {
        //   for (let item of this.cartList) {
        //     item.checked = false
        //   }
        // } else {
        //   for (let item of this.cartList) {
        //     item.checked = true
        //   }
        // }


      },
      calcuClick() {
        let flag = false
        for (let item of this.cartList) {
          if (item.checked) {
            flag = true
          }
        }
        if (!flag) {
          this.$toast.show('请选择要购买的商品')
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    position: relative;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    font-size: 14px;
  }

  .check-content {
    margin-left: 15px;
    display: flex;
    align-items: center;
    width: 80px;
  }

  .check-button {
    margin-right: 7px;
    width: 18px;
    height: 18px;
    line-height: 18px;
  }

  .price {
    flex: 1;
  }

  .calculate {
    color: #fff;
    background-color: red;
    width: 90px;
    margin-left: 120px;
    text-align: center;
  }
</style>
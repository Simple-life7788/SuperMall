<template>
  <div class="table-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>

    <!--<img src="../../assets/img/tabbar/home.svg" alt="">
    <div>首页</div>-->
  </div>
</template>

<script>
  export default {
    name: "Tabbaritem",
    props: {
      path:String,
      activeColor: {
        type:String,
        default:'red'
      }
    },
    data() {
      return {
        //isActive: true
      }
    },
    computed: {
      isActive () {
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle() {
        return this.isActive ? {color:this.activeColor} : {}
      }
    },
    methods: {
      itemClick() {
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .table-bar-item {
    flex: 1;
    text-align: center;
    /*开发一般高度就是49*/
    height: 49px;
    font-size: 14px;
  }
  .table-bar-item img {
    width: 24px;
    height: 24px;
    /*去除图片下方的3px的空白*/
    vertical-align: middle;
    margin-bottom: 2px;
  }

</style>

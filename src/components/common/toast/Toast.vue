<template>
  <div class="toast" v-show="isShow">
    {{message}}
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props: {
      // message: {
      //   type:String,
      //   default:''
      // },
      // show: {
      //   type:Boolean,
      //   default: false
      // }
    },
    data() {
      return {
        message:'',
        isShow:false
      }
    },
    methods: {
      show(message = '默认信息',duration = 2000) {
        this.isShow = true
        this.message = message
        setTimeout(() => {
          this.isShow = false
          this.message = ''
        },duration)
      }

    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    padding: 8px 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    color: #eee;
    background-color: rgba(0,0,0,.5);
    z-index: 999;
  }
</style>
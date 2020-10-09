<template>
  <!-- ref明确拿到某一个组件或者元素 / children -->
  <!-- 根元素div多了之后导致页面无法拖动 具体原因未知
        已知为bs的问题-->
  <div ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BetterScroll from 'better-scroll'

  export default {
    name: "scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // document.querySelector() 通过这个拿到的元素不确定
      /*1.创建scroll对象*/
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      /*2.监听滚动位置*/
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          //console.log(position)
          //发送监听事件
          this.$emit('scroll', position)
        })
      }
      //3.监听滚scroll到底部事件
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }


    },
    methods: {
      /*500 表示返回时间*/
      //此部分函数采用了封装思想
      scrollTo(x, y, time = 500) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      // finishPullUp() {
      //   //当写成finishPullUp：{}  时候 不能再花括号里面写this
      //   this.scroll.finishPullUp()
      // }
      refresh() {
        /*由于组件挂载顺序有时候会导致一些位置错误
        * 当组件未加载完成不执行相应操作*/
        this.scroll && this.scroll.refresh()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      getScrollY() {
        /*有值取出 无值 为0*/
        return this.scroll ? this.scroll.y : 0
      }
    }
  }

</script>

<style scoped>

</style>
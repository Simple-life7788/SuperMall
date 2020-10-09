<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">爸爸的购物街</div>
    </nav-bar>
    <tab-control
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control1"
                 v-show="isTabFixed"></tab-control>
    <scroll
            class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommondview :recommends="recommends"></recommondview>
      <feature></feature>
      <tab-control
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!--原生组件能够监听点击事件，组件不能直接监听点击需要加native修饰符-->
    <back-top @click.native="backClick" v-show="isShowBack"></back-top>
  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import Recommondview from "./childComps/Recommondview";
  import Feature from "./childComps/Feature";
  import NavBar from "../../components/common/navbar/NavBar";
  import TabControl from "../../components/content/tabControl/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import scroll from "../../components/common/scroll/scroll";
  import BackTop from "../../components/content/backtop/BackTop";
  import {getHomeMultidata} from "../../network/home";
  import {getHomeGoods} from "../../network/home";
  import {debounce} from "../../common/utils";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      Recommondview,
      Feature,
      NavBar,
      GoodsList,
      scroll,
      BackTop,
      TabControl
    },
    data() {
      return {
        //result:null
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBack: true,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('destroyed')
    },
    activated() {
      /*  参数 x y 时间*/
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      /*1.请求多个数据*/
      this.getHomeMultidata()
      /*2.请求商品数据*/
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {
      /*在created中监听 有概率会拿不到需要的监听数据*/
      //3.上拉加载 监听item中的图片加载完成
      /*此时的const是一个局部变量 但是他不会被注销
      * 因为下面引用了他 形成了一个闭包作用域*/
      const refresh = debounce(this.$refs.scroll.refresh,200)
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })
    },
    methods: {
      /**
       * 事件监听相关的方法*/
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        /*解决tabControl 有两个组件显示 不同步的问题*/
        /**
         * 程序的世界不存在魔法，如果是一样的代码一定是一样的结果
         * 如果不一样的结果那么代码必然有不同
         * 此次错了一个字母 导致下面打印没有检测出来
         * 确定具体部位之后仔细看每个单词 有时候有的单词拼写错误没有提示
         * */
        this.$refs.tabControl1.currentIndex = index
        // console.log( this.$refs.tabControl1.currntIndex+ '1')
        this.$refs.tabControl2.currentIndex = index
        // console.log( this.$refs.tabControl2.curentIndex+ '2')
      },
      contentScroll(position) {
        /*1.判断是否显示返回按钮*/
        //position.y > 1000
        this.isShowBack = (-position.y) > 1000
        /*2.判断是否进行吸顶 position：fixed
        * */
        this.isTabFixed = (-position.y ) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        //3.吸顶距离判断
        //组件具有$el  可以拿去组件的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },

      /**
       * 网络请求相关方法
       * */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          //this.result = res;
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
          //console.log(res)
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          //console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },
    }
  }
</script>

<style scoped>
  /*scoped  作用域 限定于此组件内 */
  #home {
    /*padding内容会占据掉视口的一部分*/
    /*padding-top: 44px;*/
    position: relative;
    /*view pointer height 视口*/
    height: 100vh;
  }

  .home-nav {
    background-color: var(--color-tint);
    /*为了使导航栏不滚动 原生js实现*/
    /*通过BS实现局部滚动之后可以让nav回到标准流之中而不会随内容滚动而滚动*/
    /*color: white;*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 2;*/
  }

  .tab-control1 {
    /*这里决定了导航栏的位置*/
    position: relative;
    z-index: 1;
  }

  /*方法1*/
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*方法2*/
  /*.content {*/
  /*!*存在问题*!*/
  /*  !* home padding 占用了部分空间padding内容会占据掉视口的一部分*!*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>

<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--属性采用-- 进行分割，不使用驼峰命名-->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import {GoodsInfo, getDetail, Shop, GoodsParam, getRecommends} from "../../network/detail";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import Scroll from "../../components/common/scroll/scroll";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "../../components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import BackTop from "../../components/content/backtop/BackTop";
  import {mapActions} from 'vuex'
  // import Toast from "../../components/common/toast/Toast";

  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        currentIndex: null,
        isShowBackTop: false,
        // message:'',
        // show:false
      }
    },
    created() {
      /*1.保存请求的数据id*/
      this.iid = this.$route.params.iid
      /*2.根据iid请求详情数据*/
      getDetail(this.iid).then(res => {
        /*1.获取顶部轮播图片*/
        const data = res.result
        this.topImages = res.result.itemInfo.topImages
        /*2.获取商品信息*/
        this.goods = new GoodsInfo(data.itemInfo, data.columns, data.shopInfo.services)
        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)
        //4.保存商品详情数据
        this.detailInfo = data.detailInfo
        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        /*6.取出评论信息*/
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
          // console.log( this.commentInfo )
        }

        //值不对，原因是this.$refs.params.$el还没有渲染
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        // console.log(this.themeTopYs)


        // this.$nextTick(() => {
        //   /*
        //   * 此次值不对的原因是图片没有计算在内
        //   * 根据最新的数据，对应de DOM已经渲染完了
        //   * 但是里面的图片依然没有加载出来 目前获取到的图片没有计算在内
        //   * 一般offsetTop值不对都是因为图片问题*/
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        //   console.log(this.themeTopYs)
        // })

      })
      /*3.请求评论数据*/
      getRecommends().then(res => {
        this.recommends = res.data.list
      })
    },
    mounted() {

    },
    updated() {
      //也是由于图片加载问题 偏移量计算错误
      // this.themeTopYs = []
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      // console.log(this.themeTopYs)
    },
    methods: {
      ...mapActions({
        addCart:'addCart'
      }),
      imageLoad() {
        this.$refs.scroll.refresh()
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        //console.log(this.themeTopYs)
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      },
      contentScroll(position) {
        //获取滚动位置
        const positionY = -position.y
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          /*当currentIndex等于i的时候不再执行if内语句  不同的时候才执行语句*/
          //1.普通方法
          // if ((this.currentIndex !== i) && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY <= this.themeTopYs[i+1]) ||
          //     (i === length -1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = i
          // }
          //2.高级方法
          //positionY 数组中多增加了一个数值 用内存来换取性能上的优化 空间换取时间
          if ((this.currentIndex !== i) &&
              (positionY >= this.themeTopYs[i] && positionY <= this.themeTopYs[i + 1])) {
            this.$refs.nav.currentIndex = i
          }

          //3.是否显示回到顶部
          this.isShowBackTop = (-position.y) > 1000
        }
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      addToCart() {
        /*1.获取购物车需要展示的商品信息*/
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        /*2.将商品添加到购物车*/
        /*payload 位置传入的是一个变量 不是一个字符串*/
        /*此处的方法由actions 映射而来*/
        this.addCart(product).then(res => {

          this.$toast.show(res,2000)

          // this.show = true
          // this.message = res
          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)
        })

        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res)
        // })

      }
    },
    components: {
      // Toast,
      BackTop,
      DetailBottomBar,
      GoodsList,
      DetailCommentInfo,
      DetailParamInfo,
      DetailGoodsInfo,
      DetailShopInfo,
      Scroll,
      DetailBaseInfo,
      DetailNavBar,
      DetailSwiper
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 5;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>
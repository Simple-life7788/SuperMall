<template>
    <swiper class="detail-swiper1">
      <!--不加key属性 npm有警告-->
      <swiper-item v-for="item in topImages" :key="item">
        <img :src="item" alt="" height="600">
      </swiper-item>
    </swiper>
</template>

<script>
  import {Swiper,SwiperItem} from '../../../components/common/swiper'
  export default {
    name: "DetailSwiper",
    components: {
     SwiperItem,
     Swiper
    },
    props: {
      topImages: {
        type:Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
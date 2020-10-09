<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">爸爸的购物车({{cartLength}})</div>
    </nav-bar>
    <!--商品列表-->
    <cart-list></cart-list>
    <!--底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  import {mapGetters} from 'vuex'
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  export default {
    name: "Cart",
    components: {
      CartBottomBar,
      CartList,
      NavBar
    },
    computed: {
      /* //语法一
        ...mapGetters([
            'cartList',
            'cartLength'
        ])
        //语法二 可以更改名称*/
      /*mapGetters 可以将getters里面的方法解构到计算属性里面来*/
      ...mapGetters({
        cartLength: 'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
    overflow: hidden;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 500;
  }
</style>

export default {
  /*需要传入参数state*/
  cartLength(state) {
    return state.cartList.length;
  },
  cartList(state) {
    return state.cartList
  }
}
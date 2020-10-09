export default {
  addCart(context, payload) {
    /*在vuex中如果做完某种操作之后希望别的地方监听到就要用到Promise函数
    * 进行状态的传递*/
    return new Promise((resolve, reject) => {
      /* 查找之前的数组中是否有该商品*/
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      //2.判断商品是否已经添加过
      if (oldProduct) {
        //oldProduct.count += 1
        context.commit('addCounter',oldProduct)
        resolve('当前商品数量+1')
      } else {
        /*初始的时候，数组中没有数据，如果添加count属性要直接添加到product
        * 中  后面再取出product作为oldProduct与新添加的数据进行比较决定是
        * 新加入count 还是oldProduct 中的count 加一 */
        payload.count = 1
        //state.cartList.push(payload)
        context.commit('addToCart',payload)
        resolve('添加新商品成功')
      }
    })
  }
}
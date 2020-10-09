import Vue from "vue";
import Vuex from 'vuex'
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
const state = {
  cartList: []
}
//1.安装插件
Vue.use(Vuex)
//2.创建Store对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
    /*, {iid: "1m70y5k"}*/
  /*mutations 唯一的目的就是修改state中的状态
  * 在其中的每个方法应该尽可能完成的事情应该是单一的
  * 一个方法只做一件事情 方便在vue插件中跟踪状态
  * */
    /*mutations 参数为state 和 payload
    * actions参数为 context和payload*/
})
export default store
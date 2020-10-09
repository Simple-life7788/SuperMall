import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import toast from "./components/common/toast";
import Fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false
/*默认情况下$bus是没有值得 需要给他的原型赋值一个Vue实例*/
Vue.use(toast)
/*使用懒加载插件*/
Vue.use(VueLazyLoad, {
  /*占位图*/
  loading: require('./assets/img/home/alt-image.png')
})
Vue.prototype.$bus = new Vue()
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

/*1.解决移动端300ms延迟*/
Fastclick.attach(document.body)
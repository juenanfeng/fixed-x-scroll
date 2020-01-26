import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
//自定义滚动条
import ScrollBar from './directives/scrollbar'
//对应的css
import "perfect-scrollbar/css/perfect-scrollbar.css";

Vue.config.productionTip = false

Vue.directive('fixed-scroll', ScrollBar)

new Vue({
  render: h => h(App),
}).$mount('#app')